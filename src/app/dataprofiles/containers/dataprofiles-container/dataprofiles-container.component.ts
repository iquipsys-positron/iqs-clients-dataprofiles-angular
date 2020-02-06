import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EntityState, IqsShellService, IqsAskDialogComponent, IqsAskDialogData } from 'iqs-libs-clientshell2-angular';
import { TranslateService } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';
import { EmptyStateAction } from 'pip-webui2-controls';
import { PipNavService } from 'pip-webui2-nav';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, withLatestFrom, distinctUntilChanged, skipWhile } from 'rxjs/operators';

import { dataprofilesContainerTranslations } from './dataprofiles-container.strings';
import { IqsDataprofilesStateDialogData, IqsDataprofilesStateDialogComponent } from '../../components/state-dialog/state-dialog.component';
import { IqsDataprofilesTypeDialogData, IqsDataprofilesTypeDialogComponent } from '../../components/type-dialog/type-dialog.component';
import { IqsDataprofilesService, IqsDataprofilesTranslateService } from '../../services';
import {
    ActuatorCommandType,
    DataProfile,
    SensorEventType,
    SensorParameterType,
    TypeDialogType,
    SensorStateType
} from '../../models';

@Component({
    selector: 'iqs-dataprofiles-container',
    templateUrl: './dataprofiles-container.component.html',
    styleUrls: ['./dataprofiles-container.component.scss']
})
export class IqsDataprofilesContainerComponent implements OnInit, OnDestroy {

    private savedDataprofiles: DataProfile;
    private subs: Subscription;

    public tabIndex = 0;
    public dataprofiles: DataProfile;
    public loading$: BehaviorSubject<boolean>;
    public state$: Observable<EntityState>;
    public TypeDialogType = TypeDialogType;

    public emptyStateParamsActions: EmptyStateAction[];
    public emptyStateEventsActions: EmptyStateAction[];
    public emptyStateCommandsActions: EmptyStateAction[];
    public emptyStateStatesActions: EmptyStateAction[];

    constructor(
        private dataprofilesService: IqsDataprofilesService,
        private dialog: MatDialog,
        private navService: PipNavService,
        private shellService: IqsShellService,
        private translate: TranslateService,
        private dpTranslate: IqsDataprofilesTranslateService
    ) {
        this.translate.setTranslation('en', dataprofilesContainerTranslations.en, true);
        this.translate.setTranslation('ru', dataprofilesContainerTranslations.ru, true);

        this.navService.showTitle('DATAPROFILES_TITLE');
        this.subs = new Subscription();

        this.subs.add(this.dataprofilesService.dataprofiles$.pipe(
            // rxjs can't compare deep, so this is some kind of verification our object is changed
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        ).subscribe(dp => {
            if (dp === null) {
                dp = new DataProfile();
            }
            if (!Array.isArray(dp.command_types)) { dp.command_types = []; }
            if (!Array.isArray(dp.event_types)) { dp.event_types = []; }
            if (!Array.isArray(dp.param_types)) { dp.param_types = []; }
            if (!Array.isArray(dp.state_types)) { dp.state_types = []; }
            this.savedDataprofiles = cloneDeep(dp);
            this.savedDataprofiles.param_types = sortBy(this.savedDataprofiles.param_types, ['id']);
            this.savedDataprofiles.command_types = sortBy(this.savedDataprofiles.command_types, ['id']);
            this.savedDataprofiles.event_types = sortBy(this.savedDataprofiles.event_types, ['id']);
            this.savedDataprofiles.state_types = sortBy(this.savedDataprofiles.state_types, ['id']);
            this.dataprofiles = cloneDeep(this.savedDataprofiles);
        }));
        this.loading$ = new BehaviorSubject(false);
        this.state$ = this.dataprofilesService.state$.pipe(
            skipWhile(state => state === EntityState.Empty),
            withLatestFrom(this.loading$),
            map(([state, loading]: [EntityState, boolean]) => {
                if (loading && state !== EntityState.Progress) { this.loading$.next(false); }
                return loading ? EntityState.Data : state;
            })
        );

        this.shellService.setShadows({ top: false });
        this.emptyStateParamsActions = [
            { title: this.translate.instant('DATAPROFILES_ACTION_PARAMS_ADD'), action: () => { this.onTypeAdd(TypeDialogType.Parameter); } }
        ];
        this.emptyStateEventsActions = [
            { title: this.translate.instant('DATAPROFILES_ACTION_EVENTS_ADD'), action: () => { this.onTypeAdd(TypeDialogType.Event); } }
        ];
        this.emptyStateCommandsActions = [
            { title: this.translate.instant('DATAPROFILES_ACTION_COMMANDS_ADD'), action: () => { this.onTypeAdd(TypeDialogType.Command); } }
        ];
        this.emptyStateStatesActions = [
            { title: this.translate.instant('DATAPROFILES_ACTION_STATES_ADD'), action: () => { this.onStateAdd(); } }
        ];
    }

    ngOnInit() {
        this.dataprofilesService.init();
    }

    ngOnDestroy() { this.subs.unsubscribe(); }

    public onTabChange(index: number) {
        this.tabIndex = index;
    }

    public onTypeAdd(type: TypeDialogType) {
        const data = <IqsDataprofilesTypeDialogData>{};
        data.type = type;
        const dialog = this.dialog.open(IqsDataprofilesTypeDialogComponent, { data, minWidth: '433px' });
        const sub = dialog.componentInstance.tryAdd.subscribe((param: ActuatorCommandType
            | SensorEventType | SensorParameterType) => {
            let found;
            found = find(this.dataprofiles[type], ['id', param.id]);
            if (found) {
                dialog.componentInstance.setExistError();
            } else {
                dialog.close();
                this.dataprofiles[type] = sortBy([...(<any[]>this.dataprofiles[type]), param], ['id']);
                sub.unsubscribe();
            }
        });
    }

    public onTypeEdit(param_id: number, type: TypeDialogType) {
        const data = <IqsDataprofilesTypeDialogData>{};
        const idx = findIndex(this.dataprofiles[type], ['id', param_id]);
        data.type = type;
        data.param = this.dataprofiles[type][idx];
        if (param_id < 100) { data.readonly = true; }
        const dialog = this.dialog.open(IqsDataprofilesTypeDialogComponent, { data, minWidth: '433px' });
        const sub = dialog.componentInstance.tryAdd.subscribe((param: ActuatorCommandType
            | SensorEventType | SensorParameterType) => {
            if (data.param.id !== param.id) {
                let found;
                found = find(this.dataprofiles[type], ['id', param.id]);
                if (found) {
                    dialog.componentInstance.setExistError();
                    return;
                }
            }
            dialog.close();
            this.dataprofiles[type][idx] = param;
            this.dataprofiles[type] = sortBy(cloneDeep(this.dataprofiles[type]), ['id']);
            sub.unsubscribe();
        });
    }

    public onTypeRemove(param_id: number, type: TypeDialogType) {
        const data = <IqsAskDialogData>{
            title: '',
            content: [],
            actions: {
                no: {
                    text: 'DATAPROFILES_RESET_DIALOG_NO',
                    returnValue: false
                },
                yes: {
                    text: 'DATAPROFILES_RESET_DIALOG_YES',
                    returnValue: true,
                    color: 'warn'
                }
            },
            initFocusActionKey: 'no'
        };
        const idx = findIndex(this.dataprofiles[type], ['id', param_id]);
        switch (type) {
            case TypeDialogType.Command:
                data.title = 'DATAPROFILES_RESET_COMMAND_TITLE';
                data.content = [this.translate.instant('DATAPROFILES_RESET_COMMAND_CONTENT',
                    {
                        name: this.dpTranslate.getTranslation('param', (<any>this.dataprofiles[type][idx]).name)
                    })];
                break;
            case TypeDialogType.Event:
                data.title = 'DATAPROFILES_RESET_EVENT_TITLE';
                data.content = [this.translate.instant('DATAPROFILES_RESET_EVENT_CONTENT',
                    {
                        name: this.dpTranslate.getTranslation('param', (<any>this.dataprofiles[type][idx]).name)
                    })];
                break;
            case TypeDialogType.Parameter:
                data.title = 'DATAPROFILES_RESET_PARAMETER_TITLE';
                data.content = [this.translate.instant('DATAPROFILES_RESET_PARAMETER_CONTENT',
                    {
                        name: this.dpTranslate.getTranslation('param', (<any>this.dataprofiles[type][idx]).name)
                    })];
                break;
        }
        this.dialog.open(IqsAskDialogComponent, { data }).afterClosed().subscribe(res => {
            if (res) {
                this.dataprofiles[type].splice(idx, 1);
                this.dataprofiles[type] = cloneDeep(this.dataprofiles[type]);
            }
        });
    }

    public onStateAdd() {
        const data = <IqsDataprofilesStateDialogData>{
            parameters: this.dataprofiles.param_types,
            events: this.dataprofiles.event_types,
            commands: this.dataprofiles.command_types
        };
        const dialog = this.dialog.open(IqsDataprofilesStateDialogComponent, { data, minWidth: '433px' });
        const sub = dialog.componentInstance.tryAdd.subscribe((param: SensorStateType) => {
            let found;
            found = find(this.dataprofiles.state_types, ['id', param.id]);
            if (found) {
                dialog.componentInstance.setExistError();
            } else {
                dialog.close();
                this.dataprofiles.state_types = sortBy([...this.dataprofiles.state_types, param], ['id']);
                sub.unsubscribe();
            }
        });
    }

    public onStateEdit(state_id: number) {
        const data = <IqsDataprofilesStateDialogData>{
            parameters: this.dataprofiles.param_types,
            events: this.dataprofiles.event_types,
            commands: this.dataprofiles.command_types
        };
        const idx = findIndex(this.dataprofiles.state_types, ['id', state_id]);
        data.state = this.dataprofiles.state_types[idx];
        if (state_id < 100) { data.readonly = true; }
        const dialog = this.dialog.open(IqsDataprofilesStateDialogComponent, { data, minWidth: '433px' });
        const sub = dialog.componentInstance.tryAdd.subscribe((state: SensorStateType) => {
            if (data.state.id !== state.id) {
                let found;
                found = find(this.dataprofiles.state_types, ['id', state.id]);
                if (found) {
                    dialog.componentInstance.setExistError();
                    return;
                }
            }
            dialog.close();
            this.dataprofiles.state_types[idx] = state;
            this.dataprofiles.state_types = sortBy(cloneDeep(this.dataprofiles.state_types), ['id']);
            sub.unsubscribe();
        });
    }

    public onStateRemove(state_id: number) {
        const idx = findIndex(this.dataprofiles.state_types, ['id', state_id]);
        this.dialog.open(IqsAskDialogComponent, {
            data: <IqsAskDialogData>{
                title: 'DATAPROFILES_RESET_STATE_TITLE',
                content: [
                    this.translate.instant('DATAPROFILES_RESET_STATE_CONTENT',
                        {
                            name: this.dpTranslate.getTranslation('param', (<any>this.dataprofiles.state_types[idx]).name)
                        })
                ],
                actions: {
                    no: {
                        text: 'DATAPROFILES_RESET_DIALOG_NO',
                        returnValue: false
                    },
                    yes: {
                        text: 'DATAPROFILES_RESET_DIALOG_YES',
                        returnValue: true,
                        color: 'warn'
                    }
                },
                initFocusActionKey: 'no'
            }
        }).afterClosed().subscribe(res => {
            if (res) {
                this.dataprofiles.state_types.splice(idx, 1);
                this.dataprofiles.state_types = cloneDeep(this.dataprofiles.state_types);
            }
        });
    }

    public onSave() {
        this.loading$.next(true);
        this.dataprofilesService.update(this.dataprofiles);
    }

    public onReset() {
        this.dialog.open(IqsAskDialogComponent, {
            data: <IqsAskDialogData>{
                title: 'DATAPROFILES_RESET_DIALOG_TITLE',
                content: [
                    'DATAPROFILES_RESET_DIALOG_CONTENT'
                ],
                actions: {
                    no: {
                        text: 'DATAPROFILES_RESET_DIALOG_NO',
                        returnValue: false
                    },
                    yes: {
                        text: 'DATAPROFILES_RESET_DIALOG_YES',
                        returnValue: true,
                        color: 'warn'
                    }
                },
                initFocusActionKey: 'no'
            }
        }).afterClosed().subscribe(res => {
            if (res) {
                this.dataprofiles = cloneDeep(this.savedDataprofiles);
            }
        });
    }
}
