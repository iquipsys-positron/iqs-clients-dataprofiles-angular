import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material';
import { IqsAskDialogData, IqsAskDialogComponent } from 'iqs-libs-clientshell2-angular';
import { TranslateModule } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';

import { IqsDeviceprofilesDetailsComponent } from './deviceprofiles-details.component';
import { IqsDeviceprofilesDetailsModule } from './deviceprofiles-details.module';
import { IqsDeviceprofilesParamDialogData, IqsDeviceprofilesParamDialogComponent } from '../param-dialog/param-dialog.component';
import { DeviceProfile, DeviceprofilesViewState, DeviceProfileParamsListType, BaseDeviceProfile } from '../../models';
import { IqsDeviceprofilesHelpService, IqsDeviceprofilesService } from '../../services';
import { IqsDataprofilesService, IqsDataprofilesTranslateService } from '../../../dataprofiles/services';
import { IqsDataprofilesServiceMock, IqsDeviceprofilesServiceMock, utils } from '../../../../mock';

describe('[Deviceprofiles] components/deviceprofiles-details', () => {

    const org_id = '00000000000000000000000000000000';
    const defaultAccessConfig = {
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
    let component: IqsDeviceprofilesDetailsComponent;
    let fixture: ComponentFixture<IqsDeviceprofilesDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),

                IqsDeviceprofilesDetailsModule
            ],
            providers: [
                IqsDataprofilesTranslateService,
                IqsDeviceprofilesHelpService,
                {
                    provide: IqsDataprofilesService,
                    useClass: IqsDataprofilesServiceMock
                },
                {
                    provide: IqsDeviceprofilesService,
                    useClass: IqsDeviceprofilesServiceMock
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const dataprofilesService: IqsDataprofilesServiceMock = TestBed.get(IqsDataprofilesService);
        const deviceprofilesService: IqsDeviceprofilesServiceMock = TestBed.get(IqsDeviceprofilesService);
        dataprofilesService.init({ org_id });
        deviceprofilesService.init({ org_id });
        fixture = TestBed.createComponent(IqsDeviceprofilesDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should react on changes', async () => {
        const formDisableSpy = spyOn(component.form, 'disable');
        component.loading = true;
        component.ngOnChanges({
            loading: new SimpleChange(null, true, true)
        });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(formDisableSpy).toBeTruthy();

        const formEnableSpy = spyOn(component.form, 'enable');
        component.loading = false;
        component.ngOnChanges({
            loading: new SimpleChange(null, false, true)
        });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(formEnableSpy).toHaveBeenCalled();
        expect(component.form.get('base_profile_id').disabled).toBeTruthy();

        component.state = DeviceprofilesViewState.View;
        component.ngOnChanges({
            state: new SimpleChange(null, DeviceprofilesViewState.View, true)
        });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.accessConfig).toEqual(defaultAccessConfig);

        const updateAccessConfigSpy = spyOn(component, 'updateAccessConfig');
        component.state = DeviceprofilesViewState.Create;
        component.ngOnChanges({
            state: new SimpleChange(null, DeviceprofilesViewState.Create, true)
        });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(updateAccessConfigSpy).toHaveBeenCalled();
    });

    it('should set profile', async () => {
        const deviceprofile: DeviceProfile = cloneDeep(utils.deviceprofiles.findByOrganizationId(org_id)[0]);
        component.profile = deviceprofile;
        fixture.detectChanges();
        await fixture.whenStable();
        component.profile = deviceprofile;
        expect(component.deviceprofile).toEqual(deviceprofile);
        const anotherProfile: DeviceProfile = {
            id: '1',
            name: null,
            base_profile_id: null,
            gateways: [],
            org_id: org_id
        };
        component.profile = anotherProfile;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.deviceprofile).toEqual(anotherProfile);
    });

    it('should call empty state actions', () => {
        const onParamAddSpy = spyOn(component, 'onParamAdd');
        component.emptyStateParamsActions[0].action();
        expect(onParamAddSpy).toHaveBeenCalledWith(DeviceProfileParamsListType.Parameter);
        component.emptyStateConfigsActions[0].action();
        expect(onParamAddSpy).toHaveBeenCalledWith(DeviceProfileParamsListType.Config);
        component.emptyStateEventsActions[0].action();
        expect(onParamAddSpy).toHaveBeenCalledWith(DeviceProfileParamsListType.Event);
        component.emptyStateCommandsActions[0].action();
        expect(onParamAddSpy).toHaveBeenCalledWith(DeviceProfileParamsListType.Command);
    });

    it('should update access config', async () => {
        const deviceprofile: DeviceProfile = cloneDeep(utils.deviceprofiles.findByOrganizationId(org_id)[0]);
        const baseProfile: BaseDeviceProfile = utils.deviceprofiles.getBaseDeviceProfiles()
            .find(bdp => bdp.id === deviceprofile.base_profile_id);
        const updateAccessConfigSpy = spyOn(component, 'updateAccessConfig').and.callThrough();
        component.profile = deviceprofile;
        component.state = DeviceprofilesViewState.Edit;
        component.ngOnChanges({
            state: new SimpleChange(null, DeviceprofilesViewState.Edit, true)
        });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(updateAccessConfigSpy).toHaveBeenCalled();
        expect(component.accessConfig).toEqual({
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
        });
        component.form.get('base_profile_id').setValue('bad_id');
        component.updateAccessConfig();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.accessConfig).toEqual(defaultAccessConfig);
    });

    it('should get subtitle', async () => {
        expect(component.subtitle).toEqual('');
        const deviceprofile: DeviceProfile = {
            id: '1',
            name: 'test',
            base_profile_id: 'custom',
            org_id: org_id,
            gateways: ['mqtt', 'lora']
        };
        component.profile = deviceprofile;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.subtitle)
            .toEqual('DEVICEPROFILES_BASED_ON, DEVICEPROFILES_GATEWAY_THROUGH DEVICEPROFILES_GATEWAY_MQTT,DEVICEPROFILES_GATEWAY_LORA');
    });

    it('should retrieve errors', () => {
        component.form.get('name').setErrors({ required: true });
        component.form.get('name').markAsTouched();
        expect(component.hasError('name', 'required')).toBeTruthy();
    });

    it('should cancel changes', async () => {
        const deviceprofile: DeviceProfile = cloneDeep(utils.deviceprofiles.findByOrganizationId(org_id)[0]);
        component.profile = deviceprofile;
        fixture.detectChanges();
        await fixture.whenStable();
        component.deviceprofile.name = 'test';
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.deviceprofile.name).toEqual('test');
        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.deviceprofile).toEqual(deviceprofile);
    });

    it('should change tabs', async () => {
        component.onTabChange(2);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.tabIndex).toEqual(2);
    });

    it('should emit events', async () => {
        const editSpy = spyOn(component.edit, 'emit');
        const resetSpy = spyOn(component.reset, 'emit');
        const deleteSpy = spyOn(component.delete, 'emit');
        const cancelSpy = spyOn(component.cancel, 'emit');
        component.profile = { id: '4', name: 'test', base_profile_id: 'custom', org_id: org_id };
        fixture.detectChanges();
        await fixture.whenStable();
        component.onEdit();
        expect(editSpy).toHaveBeenCalled();
        component.onReset();
        expect(resetSpy).toHaveBeenCalled();
        component.onDelete();
        expect(deleteSpy).toHaveBeenCalledWith('4');
        component.onCancel();
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('should call Param add dialog', async () => {
        const data = <IqsDeviceprofilesParamDialogData>{
            type: null,
            renameable: true,
            configurable: true
        };
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const joc = jasmine.objectContaining;
        const deviceprofile: DeviceProfile = cloneDeep(utils.deviceprofiles.findByOrganizationId(org_id)[0]);
        delete deviceprofile.commands;
        component.profile = deviceprofile;
        fixture.detectChanges();
        await fixture.whenStable();
        data.type = DeviceProfileParamsListType.Command;
        component.onParamAdd(data.type);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesParamDialogComponent, joc({ data: joc(data) }));
        let dialog: MatDialogRef<IqsDeviceprofilesParamDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({ ...deviceprofile, commands: [{ id: 100}] });

        data.type = DeviceProfileParamsListType.Event;
        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamAdd(data.type);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesParamDialogComponent, joc({ data: joc(data) }));
        dialog = dialogSpy.calls.mostRecent().returnValue;
        const setExistErrorSpy = spyOn(dialog.componentInstance, 'setExistError');
        dialog.componentInstance.form.get('id').setValue(deviceprofile.events[0].id);
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeFalsy();
        expect(setExistErrorSpy).toHaveBeenCalled();
        dialog.componentInstance.form.get('id').setValue(100);
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeTruthy();
        expect(setExistErrorSpy).toHaveBeenCalledTimes(1);
        expect(component.deviceprofile).toEqual({ ...deviceprofile, events: [...deviceprofile.events, { id: 100 }] });

        data.type = DeviceProfileParamsListType.Parameter;
        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamAdd(data.type);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesParamDialogComponent, joc({ data: joc(data) }));
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({ ...deviceprofile, params: [...deviceprofile.params, { id: 100 }] });

        data.type = DeviceProfileParamsListType.Config;
        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamAdd(data.type);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesParamDialogComponent, joc({ data: joc(data) }));
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({ ...deviceprofile, config: [...deviceprofile.config, { id: 100 }] });
    });

    it('should call Param edit dialog', async () => {
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const joc = jasmine.objectContaining;
        const deviceprofile: DeviceProfile = cloneDeep(utils.deviceprofiles.findByOrganizationId(org_id)[0]);
        deviceprofile.base_profile_id = 'custom';
        deviceprofile.commands.push({ id: 100 });
        deviceprofile.config.push({ id: 100 });
        deviceprofile.events.push({ id: 100 });
        deviceprofile.params.push({ id: 100 });

        component.state = DeviceprofilesViewState.Edit;
        component.profile = deviceprofile;
        component.updateAccessConfig();
        fixture.detectChanges();
        await fixture.whenStable();
        const data = <IqsDeviceprofilesParamDialogData>{
            type: DeviceProfileParamsListType.Command,
            param: deviceprofile.commands.find(c => c.id === 100),
            readonly: false,
            renameable: true,
            configurable: true
        };
        component.onParamEdit(-1, data.type);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).not.toHaveBeenCalled();
        component.onParamEdit(100, data.type);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesParamDialogComponent, joc({ data: joc(data) }));
        let dialog: MatDialogRef<IqsDeviceprofilesParamDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        dialog.componentInstance.form.get('name').setValue('test command');
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({
            ...deviceprofile, commands: [
                ...deviceprofile.commands.slice(0, deviceprofile.commands.length - 1),
                { ...deviceprofile.commands[deviceprofile.commands.length - 1], name: 'test command' },
            ]
        });

        data.type = DeviceProfileParamsListType.Event;
        data.param = deviceprofile.events.find(e => e.id === 100);
        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamEdit(100, data.type);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesParamDialogComponent, joc({ data: joc(data) }));
        dialog = dialogSpy.calls.mostRecent().returnValue;
        const setExistErrorSpy = spyOn(dialog.componentInstance, 'setExistError');
        const dialogCloseSpy = spyOn(dialog, 'close').and.callThrough();
        dialog.componentInstance.form.get('id').setValue(deviceprofile.events.find(e => e.id !== 100).id);
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeFalsy();
        expect(setExistErrorSpy).toHaveBeenCalled();
        expect(dialogCloseSpy).not.toHaveBeenCalled();
        dialog.componentInstance.form.get('id').setValue(100);
        dialog.componentInstance.form.get('name').setValue('test event');
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeTruthy();
        expect(setExistErrorSpy).toHaveBeenCalledTimes(1);
        expect(dialogCloseSpy).toHaveBeenCalled();
        expect(component.deviceprofile).toEqual({
            ...deviceprofile, events: [
                ...deviceprofile.events.slice(0, deviceprofile.events.length - 1),
                { ...deviceprofile.events[deviceprofile.events.length - 1], name: 'test event' },
            ]
        });

        data.type = DeviceProfileParamsListType.Parameter;
        data.param = deviceprofile.params.find(e => e.id === 100);
        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamEdit(100, data.type);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesParamDialogComponent, joc({ data: joc(data) }));
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.componentInstance.form.get('name').setValue('test param');
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({
            ...deviceprofile, params: [
                ...deviceprofile.params.slice(0, deviceprofile.params.length - 1),
                { ...deviceprofile.params[deviceprofile.params.length - 1], name: 'test param' },
            ]
        });

        data.type = DeviceProfileParamsListType.Config;
        data.param = deviceprofile.config.find(e => e.id === 100);
        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamEdit(100, data.type);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesParamDialogComponent, joc({ data: joc(data) }));
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.componentInstance.form.get('name').setValue('test config');
        dialog.componentInstance.onTryAdd();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({
            ...deviceprofile, config: [
                ...deviceprofile.config.slice(0, deviceprofile.config.length - 1),
                { ...deviceprofile.config[deviceprofile.config.length - 1], name: 'test config' },
            ]
        });
    });

    it('should call Param delete dialog', async () => {
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const joc = jasmine.objectContaining;
        const deviceprofile: DeviceProfile = cloneDeep(utils.deviceprofiles.findByOrganizationId(org_id)[0]);
        deviceprofile.base_profile_id = 'custom';
        deviceprofile.commands.push({ id: 100 });
        deviceprofile.config.push({ id: 100 });
        deviceprofile.events.push({ id: 100 });
        deviceprofile.params.push({ id: 100 });
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

        data.title = 'DEVICEPROFILES_RESET_COMMAND_TITLE';
        data.content = ['DEVICEPROFILES_RESET_COMMAND_CONTENT'];
        component.profile = deviceprofile;
        component.updateAccessConfig();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamRemove(-1, DeviceProfileParamsListType.Command);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).not.toHaveBeenCalled();
        component.onParamRemove(100, DeviceProfileParamsListType.Command);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, { data });
        let dialog: MatDialogRef<IqsAskDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        dialog.close();
        expect(component.paramsChanged).toBeFalsy();
        component.onParamRemove(100, DeviceProfileParamsListType.Command);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, { data });
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.close(true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({
            ...deviceprofile, commands: deviceprofile.commands.filter(c => c.id !== 100)
        });

        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamRemove(100, DeviceProfileParamsListType.Event);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, { data });
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.close();
        expect(component.paramsChanged).toBeFalsy();
        component.onParamRemove(100, DeviceProfileParamsListType.Event);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, { data });
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.close(true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({
            ...deviceprofile, events: deviceprofile.events.filter(c => c.id !== 100)
        });

        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamRemove(100, DeviceProfileParamsListType.Config);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, { data });
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.close();
        expect(component.paramsChanged).toBeFalsy();
        component.onParamRemove(100, DeviceProfileParamsListType.Config);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, { data });
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.close(true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({
            ...deviceprofile, config: deviceprofile.config.filter(c => c.id !== 100)
        });

        component.cancelChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        component.onParamRemove(100, DeviceProfileParamsListType.Parameter);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, { data });
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.close();
        expect(component.paramsChanged).toBeFalsy();
        component.onParamRemove(100, DeviceProfileParamsListType.Parameter);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, { data });
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.close(true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.paramsChanged).toBeTruthy();
        expect(component.deviceprofile).toEqual({
            ...deviceprofile, params: deviceprofile.params.filter(c => c.id !== 100)
        });
    });

    it('should emit save event', () => {
        const saveSpy = spyOn(component.save, 'emit');
        component.onSave();
        expect(saveSpy).not.toHaveBeenCalled();
        expect(component.form.get('name').getError('required')).toBeTruthy();
        const deviceprofile: DeviceProfile = {
            id: '1',
            name: 'test',
            base_profile_id: 'custom',
            org_id: org_id,
            gateways: ['mqtt', 'lora']
        };
        component.profile = deviceprofile;
        component.accessConfig['gateways']['multi'] = true;
        component.onSave();
        expect(saveSpy).toHaveBeenCalledWith({
            id: deviceprofile.id,
            profile: deviceprofile
        });
        deviceprofile.gateways = ['mqtt'];
        component.profile = deviceprofile;
        component.accessConfig['gateways']['multi'] = false;
        component.onSave();
        expect(saveSpy).toHaveBeenCalledWith({
            id: deviceprofile.id,
            profile: deviceprofile
        });
        deviceprofile.gateways = [];
        component.profile = deviceprofile;
        component.accessConfig['gateways']['multi'] = false;
        component.onSave();
        expect(saveSpy).toHaveBeenCalledWith({
            id: deviceprofile.id,
            profile: deviceprofile
        });
    });
});
