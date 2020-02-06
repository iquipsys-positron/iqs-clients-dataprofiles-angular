import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { IqsAskDialogComponent, IqsAskDialogData } from 'iqs-libs-clientshell2-angular';
import { TranslateService } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';
import { PipMediaService, MediaMainChange, PipSidenavService } from 'pip-webui2-layouts';
import { PipNavService } from 'pip-webui2-nav';
import { Subscription, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, take, debounceTime } from 'rxjs/operators';

import { deviceprofilesContainerTranslations } from './deviceprofiles-container.strings';
import { IqsDeviceprofilesDetailsComponent } from '../../components/deviceprofiles-details/deviceprofiles-details.component';
import {
    IqsDeviceprofilesSelectBaseDialogComponent,
    IqsDeviceprofilesSelectBaseDialogData
} from '../../components/select-base-dialog/select-base-dialog.component';
import { DeviceprofilesViewState, DeviceProfile, BaseDeviceProfile } from '../../models';
import { IqsDeviceprofilesService } from '../../services/deviceprofiles.service';

@Component({
    selector: 'iqs-deviceprofiles-container',
    templateUrl: './deviceprofiles-container.component.html',
    styleUrls: ['./deviceprofiles-container.component.scss']
})
export class IqsDeviceprofilesContainerComponent implements OnInit, OnDestroy {

    private subs: Subscription;
    private _isBackIcon: boolean;
    private _isSingle: boolean;
    private _viewState: DeviceprofilesViewState;

    public isSingle$: Observable<boolean>;
    public newDeviceProfile: DeviceProfile;
    public loading$: Observable<boolean>;
    public profiles$: Observable<DeviceProfile[]>;
    public selectedProfile$: Observable<DeviceProfile>;
    public viewState$: Observable<DeviceprofilesViewState>;

    @ViewChild('deviceprofilesDetails') deviceprofilesDetails: IqsDeviceprofilesDetailsComponent;

    constructor(
        private activatedRoute: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private deviceprofilesService: IqsDeviceprofilesService,
        private dialog: MatDialog,
        private navService: PipNavService,
        private ngZone: NgZone,
        private router: Router,
        private sidenav: PipSidenavService,
        private translate: TranslateService,
        public media: PipMediaService
    ) {
        this.translate.setTranslation('en', deviceprofilesContainerTranslations.en, true);
        this.translate.setTranslation('ru', deviceprofilesContainerTranslations.ru, true);

        this.subs = new Subscription();
        this.navService.showTitle('DEVICEPROFILES_TITLE');
        this.loading$ = this.deviceprofilesService.loading$;
        this.viewState$ = this.deviceprofilesService.state$;
        this.profiles$ = this.deviceprofilesService.deviceprofiles$;
        this.selectedProfile$ = this.deviceprofilesService.selectedProfile$;
        this.isSingle$ = this.deviceprofilesService.isSingle$;
        this.subs.add(combineLatest(
            this.deviceprofilesService.selectedProfile$.pipe(filter(p => !!p)),
            this.deviceprofilesService.isSingle$,
            this.deviceprofilesService.state$
        ).pipe(
            debounceTime(10)
        ).subscribe(([profile, isSingle, state]) => {
            this.ngZone.run(() => this.router.navigate([], {
                queryParams: { single: isSingle, profile_id: profile.id, state },
                queryParamsHandling: 'merge'
            }));
        }));
    }

    ngOnInit() {
        this.deviceprofilesService.init();

        const isMobile = this.media.isMainActive('xs') || this.media.isMainActive('sm');
        const state = this.activatedRoute.snapshot.queryParams['state'];

        const isSingle = !isMobile ? this.activatedRoute.snapshot.queryParams['single'] === 'true' : false;
        this.deviceprofilesService.changeSingle(isSingle);
        this.subs.add(this.isSingle$.subscribe(single => {
            this._isSingle = single;
            this.changeIconWithSingle();
        }));
        this.subs.add(this.viewState$.subscribe(s => {
            this._viewState = s;
            this.changeNavWithState();
        }));
        if (isMobile && state === DeviceprofilesViewState.Edit) {
            this.deviceprofilesService.changeSingle(true);
        }
        this.subs.add(this.media.asObservableMain().subscribe((change: MediaMainChange) => {
            if (!(change.aliases.includes('xs') || change.aliases.includes('sm'))) {
                this.deviceprofilesService.changeSingle(false);
                if (this._isBackIcon) { this.restoreIcon(); }
            }

            if ((change.aliases.includes('xs') || change.aliases.includes('sm'))
                && (this._viewState === DeviceprofilesViewState.Create || this._viewState === DeviceprofilesViewState.Edit)
                && !this._isSingle) {
                this.deviceprofilesService.changeSingle(true);
            }

            if (this._viewState === DeviceprofilesViewState.Empty) {
                this.deviceprofilesService.changeSingle(false);
            }
            this.cd.detectChanges();
        }));
    }

    ngOnDestroy() { this.subs.unsubscribe(); }

    private restoreIcon() {
        this._isBackIcon = false;
        this.navService.showNavIcon({
            icon: 'menu',
            action: () => {
                this.sidenav.toggleOpened();
            }
        });
    }

    private showBackIcon() {
        this._isBackIcon = true;
        this.navService.showNavIcon({
            icon: 'arrow_back',
            action: () => {
                if (this._viewState === DeviceprofilesViewState.Edit || this._viewState === DeviceprofilesViewState.Create) {
                    this.openCancelDialog();
                } else {
                    this.cancel();
                }
            }
        });
    }

    private changeIconWithSingle() {
        if (!this._isSingle && this._isBackIcon) {
            this.restoreIcon();
        }
        if (this._isSingle && !this._isBackIcon) {
            this.showBackIcon();
        }
    }

    private changeNavWithState() {
        const isMobile = this.media.isMainActive('xs') || this.media.isMainActive('sm');
        let title: string;
        switch (this._viewState) {
            case DeviceprofilesViewState.View:
                title = 'DEVICEPROFILES_TITLE';
                break;
            case DeviceprofilesViewState.Edit:
                title = !this._isSingle ? 'DEVICEPROFILES_TITLE' : 'DEVICEPROFILES_TITLE_UPDATE';
                break;
            case DeviceprofilesViewState.Create:
                if (isMobile && !this._isSingle) {
                    this.deviceprofilesService.changeSingle(true);
                }
                title = 'DEVICEPROFILES_TITLE_CREATE';
                break;
            default:
                title = 'DEVICEPROFILES_TITLE';
        }
        this.navService.showBreadcrumb({
            items: [
                { title: title }
            ]
        });
    }

    public initAdd() {
        const data: IqsDeviceprofilesSelectBaseDialogData = {
            profiles$: this.deviceprofilesService.baseDeviceprofiles$
        };
        this.dialog.open(IqsDeviceprofilesSelectBaseDialogComponent, { data, minWidth: '433px' })
            .afterClosed().subscribe((res: BaseDeviceProfile) => {
                if (res) {
                    this.newDeviceProfile = new DeviceProfile();
                    this.newDeviceProfile.base_profile_id = res.id;
                    const keys = ['commands', 'config', 'events', 'gateways', 'params'];
                    for (const key of keys) {
                        this.newDeviceProfile[key] = cloneDeep(res[key]);
                    }
                    this.deviceprofilesService.changeState(DeviceprofilesViewState.Create);
                }
            });
    }

    public onSelect(index: number) {
        if (this._viewState === DeviceprofilesViewState.Edit || this._viewState === DeviceprofilesViewState.Create) {
            this.openSelectDialog(index);
        } else {
            this.select(index);
        }
    }

    public openSelectDialog(index: number) {
        this.dialog.open(IqsAskDialogComponent, {
            data: <IqsAskDialogData>{
                title: 'DEVICEPROFILES_CANCEL_DIALOG_TITLE',
                content: [
                    'DEVICEPROFILES_CANCEL_DIALOG_CONTENT'
                ],
                actions: {
                    no: {
                        text: 'DEVICEPROFILES_DIALOG_NO',
                        returnValue: false
                    },
                    yes: {
                        text: 'DEVICEPROFILES_DIALOG_YES',
                        returnValue: true,
                        color: 'warn'
                    }
                },
                initFocusActionKey: 'no'
            }
        }).afterClosed().subscribe(res => {
            if (res) { this.select(index); }
        });
    }

    public select(index: number) {
        if (this.media.isMainActive('xs') || this.media.isMainActive('sm')) {
            this.deviceprofilesService.changeSingle(true);
            this.showBackIcon();
        }
        this.deviceprofilesService.selectbyIndex(index);
    }

    public onEdit() {
        this.deviceprofilesService.changeState(DeviceprofilesViewState.Edit);
    }

    public onReset() {
        this.dialog.open(IqsAskDialogComponent, {
            data: <IqsAskDialogData>{
                title: 'DEVICEPROFILES_RESET_DIALOG_TITLE',
                content: [
                    'DEVICEPROFILES_RESET_DIALOG_CONTENT'
                ],
                actions: {
                    no: {
                        text: 'DEVICEPROFILES_DIALOG_NO',
                        returnValue: false
                    },
                    yes: {
                        text: 'DEVICEPROFILES_DIALOG_YES',
                        returnValue: true,
                        color: 'warn'
                    }
                },
                initFocusActionKey: 'no'
            }
        }).afterClosed().subscribe(res => {
            if (res) { this.deviceprofilesService.reset(); }
        });
    }

    public onDelete(profile_id: string) {
        this.dialog.open(IqsAskDialogComponent, {
            data: <IqsAskDialogData>{
                title: 'DEVICEPROFILES_DELETE_DIALOG_TITLE',
                content: [
                    'DEVICEPROFILES_DELETE_DIALOG_CONTENT'
                ],
                actions: {
                    no: {
                        text: 'DEVICEPROFILES_DIALOG_NO',
                        returnValue: false
                    },
                    yes: {
                        text: 'DEVICEPROFILES_DIALOG_YES',
                        returnValue: true,
                        color: 'warn'
                    }
                },
                initFocusActionKey: 'no'
            }
        }).afterClosed().subscribe(res => {
            if (res) { this.deviceprofilesService.delete(profile_id); }
        });
    }

    public onSave(payload: {
        id: string,
        profile: DeviceProfile
    }) {
        if (payload.id) {
            this.deviceprofilesService.update(payload.id, payload.profile);
        } else {
            this.deviceprofilesService.create(payload.profile);
        }
        this.loading$.pipe(filter(state => !state), take(1)).subscribe(() => {
            this.deviceprofilesService.changeState(DeviceprofilesViewState.View);
        });
    }

    public onCancel() {
        if (this._viewState === DeviceprofilesViewState.Edit || this._viewState === DeviceprofilesViewState.Create) {
            this.openCancelDialog();
        } else {
            this.cancel();
        }
    }

    public openCancelDialog() {
        this.dialog.open(IqsAskDialogComponent, {
            data: <IqsAskDialogData>{
                title: 'DEVICEPROFILES_CANCEL_DIALOG_TITLE',
                content: [
                    'DEVICEPROFILES_CANCEL_DIALOG_CONTENT'
                ],
                actions: {
                    no: {
                        text: 'DEVICEPROFILES_DIALOG_NO',
                        returnValue: false
                    },
                    yes: {
                        text: 'DEVICEPROFILES_DIALOG_YES',
                        returnValue: true,
                        color: 'warn'
                    }
                },
                initFocusActionKey: 'no'
            }
        }).afterClosed().subscribe(res => {
            if (res) { this.cancel(); }
        });
    }

    public cancel() {
        this.deviceprofilesService.changeSingle(false);
        if (this.deviceprofilesDetails) {
            this.deviceprofilesDetails.cancelChanges();
        }
        this.deviceprofilesService.changeState(DeviceprofilesViewState.View);
    }

}
