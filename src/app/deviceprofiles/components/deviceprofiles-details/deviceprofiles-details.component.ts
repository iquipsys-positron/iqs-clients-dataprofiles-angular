import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { IqsAskDialogComponent, IqsAskDialogData } from 'iqs-libs-clientshell2-angular';
import { TranslateService } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import maxBy from 'lodash/maxBy';
import sortBy from 'lodash/sortBy';
import { take, map } from 'rxjs/operators';

import { deviceprofilesDetailsTranslations } from './deviceprofiles-details.strings';
import { IqsDeviceprofilesParamDialogComponent, IqsDeviceprofilesParamDialogData } from '../param-dialog/param-dialog.component';
import {
    DeviceProfile,
    DeviceprofilesViewState,
    DeviceProfileParamsListType,
    ActuatorCommand,
    ConfigParameter,
    SensorEvent,
    SensorParameter
} from '../../models';
import { IqsDeviceprofilesHelpService, IqsDeviceprofilesService } from '../../services';
import { IqsDataprofilesService } from './../../../dataprofiles/services';
import { EmptyStateAction } from 'pip-webui2-controls';

interface ListItemConfig {
    modify: boolean;
    config: boolean;
    rename: boolean;
}

interface GatewayConfig {
    modify: boolean;
    multi: boolean;
}

interface AccessConfig {
    [prop: string]: ListItemConfig | GatewayConfig;
}

@Component({
    selector: 'iqs-deviceprofiles-details',
    templateUrl: './deviceprofiles-details.component.html',
    styleUrls: ['./deviceprofiles-details.component.scss']
})
export class IqsDeviceprofilesDetailsComponent implements OnInit, OnChanges {

    private _defaultAccessConfig: AccessConfig = {
        [DeviceProfileParamsListType.Parameter]: {
            modify: false,
            config: false,
            rename: false,
        },
        [DeviceProfileParamsListType.Event]: {
            modify: false,
            config: false,
            rename: false,
        },
        [DeviceProfileParamsListType.Command]: {
            modify: false,
            config: false,
            rename: false,
        },
        [DeviceProfileParamsListType.Config]: {
            modify: false,
            config: false,
            rename: false,
        },
        'gateways': {
            modify: false,
            multi: false,
        }
    };
    private _savedDeviceprofile: DeviceProfile;

    public DeviceProfileParamsListType = DeviceProfileParamsListType;
    public accessConfig: AccessConfig = this._defaultAccessConfig;
    public deviceprofile: DeviceProfile;
    public form: FormGroup;
    public baseProfileOptions: { id: string, name: string }[];
    public gatewayOptions: { value: string, name: string }[] = [
        { value: 'rest', name: 'REST' },
        { value: 'mqtt', name: 'MQTT' },
        { value: 'lora', name: 'LoRa' },
        { value: 'teltonika', name: 'Teltonika' },
    ];
    public tabIndex = 0;
    public paramsChanged = false;
    public emptyStateParamsActions: EmptyStateAction[];
    public emptyStateEventsActions: EmptyStateAction[];
    public emptyStateCommandsActions: EmptyStateAction[];
    public emptyStateConfigsActions: EmptyStateAction[];

    @Input() loading: boolean;
    @Input() set profile(val: DeviceProfile) {
        if (isEqual(val, this._savedDeviceprofile)) { return; }
        this.setProfile(val);
    }
    @Input() state: DeviceprofilesViewState;

    @Output() edit = new EventEmitter();
    @Output() reset = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() save = new EventEmitter();
    @Output() cancel = new EventEmitter();

    constructor(
        public deviceprofilesHelp: IqsDeviceprofilesHelpService,
        private dataprofiles: IqsDataprofilesService,
        private deviceprofiles: IqsDeviceprofilesService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private translate: TranslateService
    ) {
        this.translate.setTranslation('en', deviceprofilesDetailsTranslations.en, true);
        this.translate.setTranslation('ru', deviceprofilesDetailsTranslations.ru, true);

        const gateways: any = {};
        for (const gw of this.gatewayOptions) { gateways[gw.value] = [false]; }
        this.form = this.fb.group({
            name: ['', Validators.required],
            base_profile_id: ['', Validators.required],
            gateway: [null],
            gateways: this.fb.group(gateways)
        });
        this.form.get('base_profile_id').disable();

        this.emptyStateParamsActions = [
            {
                title: this.translate.instant('DEVICEPROFILES_ACTION_PARAMS_ADD'),
                action: () => { this.onParamAdd(DeviceProfileParamsListType.Parameter); }
            }
        ];
        this.emptyStateEventsActions = [
            {
                title: this.translate.instant('DEVICEPROFILES_ACTION_EVENTS_ADD'),
                action: () => { this.onParamAdd(DeviceProfileParamsListType.Event); }
            }
        ];
        this.emptyStateCommandsActions = [
            {
                title: this.translate.instant('DEVICEPROFILES_ACTION_COMMANDS_ADD'),
                action: () => { this.onParamAdd(DeviceProfileParamsListType.Command); }
            }
        ];
        this.emptyStateConfigsActions = [
            {
                title: this.translate.instant('DEVICEPROFILES_ACTION_CONFIGS_ADD'),
                action: () => { this.onParamAdd(DeviceProfileParamsListType.Config); }
            }
        ];
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.state) {
            if (this.state !== DeviceprofilesViewState.Create && this.state !== DeviceprofilesViewState.Edit) {
                this.accessConfig = this._defaultAccessConfig;
            } else {
                this.updateAccessConfig();
            }
        }
        if (changes.loading) {
            if (this.loading) {
                this.form.disable();
            } else {
                this.form.enable();
                this.form.get('base_profile_id').disable();
            }
        }
    }

    private setProfile(val: DeviceProfile) {
        this.deviceprofile = cloneDeep(val);
        this._savedDeviceprofile = cloneDeep(this.deviceprofile);
        this.paramsChanged = false;
        if (this.deviceprofile) {
            const gateways: any = {};
            for (const gw of this.gatewayOptions) {
                gateways[gw.value] = this.deviceprofile.gateways && this.deviceprofile.gateways.includes(gw.value) ? true : false;
            }
            this.form.setValue({
                name: this.deviceprofile.name || '',
                base_profile_id: this.deviceprofile.base_profile_id || '',
                gateway: this.deviceprofile.gateways && this.deviceprofile.gateways.length > 0 ? this.deviceprofile.gateways[0] : null,
                gateways
            });
            this.form.markAsUntouched();
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    public updateAccessConfig() {
        const baseProfile = this.deviceprofiles.getBaseProfileById(this.form.get('base_profile_id').value);
        this.deviceprofiles.baseDeviceprofiles$.pipe(take(1)).subscribe(profiles => {
            this.baseProfileOptions = [];
            for (const profile of profiles) {
                this.baseProfileOptions.push({
                    id: profile.id,
                    name: profile.name
                });
            }
        });
        if (baseProfile) {
            this.accessConfig = {
                [DeviceProfileParamsListType.Parameter]: {
                    modify: baseProfile.modify_params,
                    config: baseProfile.config_params,
                    rename: baseProfile.rename_params
                },
                [DeviceProfileParamsListType.Event]: {
                    modify: baseProfile.modify_events,
                    config: baseProfile.config_events,
                    rename: baseProfile.rename_events
                },
                [DeviceProfileParamsListType.Command]: {
                    modify: baseProfile.modify_commands,
                    config: baseProfile.config_commands,
                    rename: baseProfile.rename_commands
                },
                [DeviceProfileParamsListType.Config]: {
                    modify: baseProfile.modify_config,
                    config: baseProfile.config_config,
                    rename: baseProfile.rename_config
                },
                'gateways': {
                    modify: baseProfile.modify_gateways,
                    multi: baseProfile.multi_gateways,
                }
            };
        } else {
            this.accessConfig = this._defaultAccessConfig;
        }
    }

    public get subtitle(): string {
        if (!this.deviceprofile) { return ''; }
        const parts = [];
        parts.push(this.translate.instant('DEVICEPROFILES_BASED_ON', { name: this.deviceprofile.base_profile_id }));
        const gws = [];
        for (const gw of this.deviceprofile.gateways) { gws.push(this.translate.instant('DEVICEPROFILES_GATEWAY_' + gw.toUpperCase())); }
        if (gws.length) { parts.push(this.translate.instant('DEVICEPROFILES_GATEWAY_THROUGH') + ' ' + gws.join(',')); }
        return parts.join(', ');
    }

    public hasError(field: string, error: string) {
        return this.form.get(field).getError(error) && this.form.get(field).touched;
    }

    public cancelChanges() {
        this.setProfile(this._savedDeviceprofile);
    }

    public onTabChange(index: number) {
        this.tabIndex = index;
    }

    public onEdit() {
        this.edit.emit();
    }

    public onReset() {
        this.reset.emit();
    }

    public onDelete() {
        this.delete.emit(this.deviceprofile.id);
    }

    public onParamAdd(type: DeviceProfileParamsListType) {
        const data = <IqsDeviceprofilesParamDialogData>{
            type,
            renameable: true,
            configurable: true
        };
        switch (type) {
            case DeviceProfileParamsListType.Command:
                data.params$ = this.dataprofiles.dataprofiles$.pipe(map(dp => dp.command_types));
                break;
            case DeviceProfileParamsListType.Event:
                data.params$ = this.dataprofiles.dataprofiles$.pipe(map(dp => dp.event_types));
                break;
            case DeviceProfileParamsListType.Parameter:
                data.params$ = this.dataprofiles.dataprofiles$.pipe(map(dp => dp.param_types));
                break;

        }
        const dialog = this.dialog.open(IqsDeviceprofilesParamDialogComponent, { data, minWidth: '433px' });
        dialog.componentInstance.form.get('id').setValue(
            Math.max(99, this.deviceprofile[type] && this.deviceprofile[type].length ? maxBy(this.deviceprofile[type], 'id').id : 0) + 1
        );
        const sub = dialog.componentInstance.tryAdd.subscribe(
            (param: ActuatorCommand | ConfigParameter | SensorEvent | SensorParameter) => {
                let found;
                if (!this.deviceprofile.hasOwnProperty(type)) { this.deviceprofile[type] = []; }
                found = find(this.deviceprofile[type], ['id', param.id]);
                if (found) {
                    dialog.componentInstance.setExistError();
                } else {
                    dialog.close();
                    this.paramsChanged = true;
                    this.deviceprofile[type] = sortBy([...this.deviceprofile[type], param], ['id']);
                    sub.unsubscribe();
                }
            });
    }

    public onParamEdit(param_id: number, type: DeviceProfileParamsListType) {
        const idx = (<any[]>this.deviceprofile[type]).findIndex(p => p.id === param_id);
        if (idx < 0) { return; }
        const data = <IqsDeviceprofilesParamDialogData>{
            param: this.deviceprofile[type][idx],
            type,
            readonly: this.state === DeviceprofilesViewState.View || param_id < 100,
            renameable: (<ListItemConfig>this.accessConfig[type]).rename,
            configurable: (<ListItemConfig>this.accessConfig[type]).config,
        };
        switch (type) {
            case DeviceProfileParamsListType.Command:
                data.params$ = this.dataprofiles.dataprofiles$.pipe(map(dp => dp.command_types));
                break;
            case DeviceProfileParamsListType.Event:
                data.params$ = this.dataprofiles.dataprofiles$.pipe(map(dp => dp.event_types));
                break;
            case DeviceProfileParamsListType.Parameter:
                data.params$ = this.dataprofiles.dataprofiles$.pipe(map(dp => dp.param_types));
                break;
        }
        const dialog = this.dialog.open(IqsDeviceprofilesParamDialogComponent, { data, minWidth: '433px' });
        const sub = dialog.componentInstance.tryAdd.subscribe(
            (param: ActuatorCommand | ConfigParameter | SensorEvent | SensorParameter) => {
                let found;
                if (data.param.id !== param.id) {
                    found = find(this.deviceprofile[type], ['id', param.id]);
                    if (found) {
                        dialog.componentInstance.setExistError();
                        return;
                    }
                }
                dialog.close();
                this.paramsChanged = true;
                this.deviceprofile[type][idx] = param;
                this.deviceprofile[type] = sortBy(cloneDeep(this.deviceprofile[type]), ['id']);
                sub.unsubscribe();

            });
    }

    public onParamRemove(param_id: number, type: DeviceProfileParamsListType) {
        const data = <IqsAskDialogData>{
            title: '',
            content: [],
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
        };
        const idx = (<any[]>this.deviceprofile[type]).findIndex(p => p.id === param_id);
        if (idx < 0) { return; }
        switch (type) {
            case DeviceProfileParamsListType.Command:
                data.title = 'DEVICEPROFILES_RESET_COMMAND_TITLE';
                data.content = [this.translate.instant('DEVICEPROFILES_RESET_COMMAND_CONTENT',
                    {
                        name: (<any>this.deviceprofile[type][idx]).name
                    })];
                break;
            case DeviceProfileParamsListType.Event:
                data.title = 'DEVICEPROFILES_RESET_EVENT_TITLE';
                data.content = [this.translate.instant('DEVICEPROFILES_RESET_EVENT_CONTENT',
                    {
                        name: (<any>this.deviceprofile[type][idx]).name
                    })];
                break;
            case DeviceProfileParamsListType.Parameter:
                data.title = 'DEVICEPROFILES_RESET_PARAMETER_TITLE';
                data.content = [this.translate.instant('DEVICEPROFILES_RESET_PARAMETER_CONTENT',
                    {
                        name: (<any>this.deviceprofile[type][idx]).name
                    })];
                break;
            case DeviceProfileParamsListType.Config:
                data.title = 'DEVICEPROFILES_RESET_CONFIGS_TITLE';
                data.content = [this.translate.instant('DEVICEPROFILES_RESET_CONFIGS_CONTENT',
                    {
                        name: (<any>this.deviceprofile[type][idx]).name
                    })];
                break;
        }
        this.dialog.open(IqsAskDialogComponent, { data }).afterClosed().subscribe(res => {
            if (res) {
                this.paramsChanged = true;
                this.deviceprofile[type].splice(idx, 1);
                this.deviceprofile[type] = cloneDeep(this.deviceprofile[type]);
            }
        });
    }

    public onSave() {
        if (this.form.invalid) { this.markFormGroupTouched(this.form); return; }
        const formValues = this.form.getRawValue();
        if ((<GatewayConfig>this.accessConfig.gateways).multi) {
            formValues['gateways'] = Object.keys(formValues['gateways']).filter(key => formValues['gateways'][key]);
        } else {
            formValues['gateways'] = formValues['gateway'] ? [formValues['gateway']] : [];
        }
        delete formValues['gateway'];
        Object.assign(this.deviceprofile, formValues);
        this.save.emit({ id: this._savedDeviceprofile.id, profile: this.deviceprofile });
    }

    public onCancel() {
        this.cancel.emit();
    }

}
