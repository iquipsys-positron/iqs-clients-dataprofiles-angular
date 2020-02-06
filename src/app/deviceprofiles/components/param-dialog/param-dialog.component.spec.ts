import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { IqsDeviceprofilesParamDialogComponent, IqsDeviceprofilesParamDialogData } from './param-dialog.component';
import { IqsDeviceprofilesParamDialogModule } from './param-dialog.module';
import { DeviceProfileParamsListType, ActuatorCommand, SensorEvent, SensorParameter, ConfigParameter } from '../../models';
import { IqsDataprofilesTranslateService } from '../../../dataprofiles';

@Component({
    template: ''
})
class NoopComponent { }

@NgModule({
    entryComponents: [IqsDeviceprofilesParamDialogComponent],
    imports: [
        IqsDeviceprofilesParamDialogModule
    ]
})
class DialogTestModule { }

describe('[Deviceprofiles] components/param-dialog', () => {

    let dialog: MatDialog;
    let overlayContainerElement: HTMLElement;
    let noop: ComponentFixture<NoopComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NoopComponent],
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),

                DialogTestModule
            ],
            providers: [
                IqsDataprofilesTranslateService,
                {
                    provide: OverlayContainer, useFactory: () => {
                        overlayContainerElement = document.createElement('div');
                        return { getContainerElement: () => overlayContainerElement };
                    }
                }
            ]
        });
        dialog = TestBed.get(MatDialog);
        noop = TestBed.createComponent(NoopComponent);
    }));

    it('should create', () => {
        expect(dialog).toBeTruthy();
    });

    it('should open dialog for Command', async () => {
        // [type: Command, readonly, !renameable, !configurable, !param]
        let ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Command,
                readonly: true
            }
        });
        let formDisableSpy = spyOn(ref.componentInstance.form, 'disable');
        noop.detectChanges();
        expect(formDisableSpy).toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeTruthy();
        let refForm = ref.componentInstance.form;
        expect(refForm.get('name').disabled).toBeTruthy();
        expect(refForm.get('min_value').disabled).toBeTruthy();
        expect(refForm.get('max_value').disabled).toBeTruthy();
        expect(refForm.get('scale').disabled).toBeTruthy();
        expect(refForm.get('offset').disabled).toBeTruthy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_COMMAND_VIEW');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_ADD');
        ref.close();

        // [type: Command, !readonly, !renameable, !configurable, !param]
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Command
            }
        });
        formDisableSpy = spyOn(ref.componentInstance.form, 'disable');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        refForm = ref.componentInstance.form;
        expect(refForm.get('name').disabled).toBeTruthy();
        expect(refForm.get('min_value').disabled).toBeTruthy();
        expect(refForm.get('max_value').disabled).toBeTruthy();
        expect(refForm.get('scale').disabled).toBeTruthy();
        expect(refForm.get('offset').disabled).toBeTruthy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_COMMAND_ADD');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_ADD');
        ref.close();

        // [type: Command, !readonly, renameable, configurable, param]
        const param: ActuatorCommand = {
            id: 0,
            name: null,
            type: 1
        };
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Command,
                param,
                renameable: true,
                configurable: true
            }
        });
        refForm = ref.componentInstance.form;
        formDisableSpy = spyOn(refForm, 'disable');
        let formSetValueSpy = spyOn(refForm, 'setValue');
        let formMarkAsUntouchedSpy = spyOn(refForm, 'markAsUntouched');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        expect(refForm.get('name').disabled).toBeFalsy();
        expect(refForm.get('min_value').disabled).toBeFalsy();
        expect(refForm.get('max_value').disabled).toBeFalsy();
        expect(refForm.get('scale').disabled).toBeFalsy();
        expect(refForm.get('offset').disabled).toBeFalsy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_COMMAND_EDIT');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_SAVE');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: param.id,
            name: '',
            type: param.type,
            min_value: null,
            max_value: null,
            offset: null,
            scale: null
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        ref.close();

        // [type: Command, !readonly, renameable, configurable, param] (another param)
        Object.assign(param, <Partial<ActuatorCommand>>{
            name: 'a',
            min_value: 0,
            max_value: 1,
            offset: 1,
            scale: 2
        });
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Command,
                param,
                renameable: true,
                configurable: true
            }
        });
        refForm = ref.componentInstance.form;
        formDisableSpy = spyOn(refForm, 'disable');
        formSetValueSpy = spyOn(refForm, 'setValue');
        formMarkAsUntouchedSpy = spyOn(refForm, 'markAsUntouched');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        expect(refForm.get('name').disabled).toBeFalsy();
        expect(refForm.get('min_value').disabled).toBeFalsy();
        expect(refForm.get('max_value').disabled).toBeFalsy();
        expect(refForm.get('scale').disabled).toBeFalsy();
        expect(refForm.get('offset').disabled).toBeFalsy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_COMMAND_EDIT');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_SAVE');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: param.id,
            name: param.name,
            type: param.type,
            min_value: param.min_value,
            max_value: param.max_value,
            offset: param.offset,
            scale: param.scale
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        ref.close();
    });

    it('should open dialog for Event', async () => {
        // [type: Event, readonly, !renameable, !configurable, !param]
        let ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Event,
                readonly: true
            }
        });
        let formDisableSpy = spyOn(ref.componentInstance.form, 'disable');
        noop.detectChanges();
        expect(formDisableSpy).toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeTruthy();
        let refForm = ref.componentInstance.form;
        expect(refForm.get('name').disabled).toBeTruthy();
        expect(refForm.get('min_value').disabled).toBeTruthy();
        expect(refForm.get('max_value').disabled).toBeTruthy();
        expect(refForm.get('scale').disabled).toBeTruthy();
        expect(refForm.get('offset').disabled).toBeTruthy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_EVENT_VIEW');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_ADD');
        ref.close();

        // [type: Event, !readonly, !renameable, !configurable, !param]
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Event
            }
        });
        formDisableSpy = spyOn(ref.componentInstance.form, 'disable');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        refForm = ref.componentInstance.form;
        expect(refForm.get('name').disabled).toBeTruthy();
        expect(refForm.get('min_value').disabled).toBeTruthy();
        expect(refForm.get('max_value').disabled).toBeTruthy();
        expect(refForm.get('scale').disabled).toBeTruthy();
        expect(refForm.get('offset').disabled).toBeTruthy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_EVENT_ADD');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_ADD');
        ref.close();

        // [type: Event, !readonly, renameable, configurable, param]
        const param: SensorEvent = {
            id: 0,
            name: null,
            type: 1
        };
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Event,
                param,
                renameable: true,
                configurable: true
            }
        });
        refForm = ref.componentInstance.form;
        formDisableSpy = spyOn(refForm, 'disable');
        let formSetValueSpy = spyOn(refForm, 'setValue');
        let formMarkAsUntouchedSpy = spyOn(refForm, 'markAsUntouched');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        expect(refForm.get('name').disabled).toBeFalsy();
        expect(refForm.get('min_value').disabled).toBeFalsy();
        expect(refForm.get('max_value').disabled).toBeFalsy();
        expect(refForm.get('scale').disabled).toBeFalsy();
        expect(refForm.get('offset').disabled).toBeFalsy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_EVENT_EDIT');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_SAVE');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: param.id,
            name: '',
            type: param.type,
            min_value: null,
            max_value: null,
            offset: null,
            scale: null
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        ref.close();

        // [type: Event, !readonly, renameable, configurable, param] (another param)
        Object.assign(param, <Partial<SensorEvent>>{
            name: 'a',
            min_value: 0,
            max_value: 1,
            offset: 1,
            scale: 2
        });
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Event,
                param,
                renameable: true,
                configurable: true
            }
        });
        refForm = ref.componentInstance.form;
        formDisableSpy = spyOn(refForm, 'disable');
        formSetValueSpy = spyOn(refForm, 'setValue');
        formMarkAsUntouchedSpy = spyOn(refForm, 'markAsUntouched');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        expect(refForm.get('name').disabled).toBeFalsy();
        expect(refForm.get('min_value').disabled).toBeFalsy();
        expect(refForm.get('max_value').disabled).toBeFalsy();
        expect(refForm.get('scale').disabled).toBeFalsy();
        expect(refForm.get('offset').disabled).toBeFalsy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_EVENT_EDIT');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_SAVE');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: param.id,
            name: param.name,
            type: param.type,
            min_value: param.min_value,
            max_value: param.max_value,
            offset: param.offset,
            scale: param.scale
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        ref.close();
    });

    it('should open dialog for Parameter', async () => {
        // [type: Parameter, readonly, !renameable, !configurable, !param]
        let ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Parameter,
                readonly: true
            }
        });
        let formDisableSpy = spyOn(ref.componentInstance.form, 'disable');
        noop.detectChanges();
        expect(formDisableSpy).toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeTruthy();
        let refForm = ref.componentInstance.form;
        expect(refForm.get('name').disabled).toBeTruthy();
        expect(refForm.get('min_value').disabled).toBeTruthy();
        expect(refForm.get('max_value').disabled).toBeTruthy();
        expect(refForm.get('scale').disabled).toBeTruthy();
        expect(refForm.get('offset').disabled).toBeTruthy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_PARAMETER_VIEW');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_ADD');
        ref.close();

        // [type: Parameter, !readonly, !renameable, !configurable, !param]
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Parameter
            }
        });
        formDisableSpy = spyOn(ref.componentInstance.form, 'disable');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        refForm = ref.componentInstance.form;
        expect(refForm.get('name').disabled).toBeTruthy();
        expect(refForm.get('min_value').disabled).toBeTruthy();
        expect(refForm.get('max_value').disabled).toBeTruthy();
        expect(refForm.get('scale').disabled).toBeTruthy();
        expect(refForm.get('offset').disabled).toBeTruthy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_PARAMETER_ADD');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_ADD');
        ref.close();

        // [type: Parameter, !readonly, renameable, configurable, param]
        const param: SensorParameter = {
            id: 0,
            name: null,
            type: 1
        };
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Parameter,
                param,
                renameable: true,
                configurable: true
            }
        });
        refForm = ref.componentInstance.form;
        formDisableSpy = spyOn(refForm, 'disable');
        let formSetValueSpy = spyOn(refForm, 'setValue');
        let formMarkAsUntouchedSpy = spyOn(refForm, 'markAsUntouched');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        expect(refForm.get('name').disabled).toBeFalsy();
        expect(refForm.get('min_value').disabled).toBeFalsy();
        expect(refForm.get('max_value').disabled).toBeFalsy();
        expect(refForm.get('scale').disabled).toBeFalsy();
        expect(refForm.get('offset').disabled).toBeFalsy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_PARAMETER_EDIT');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_SAVE');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: param.id,
            name: '',
            type: param.type,
            min_value: null,
            max_value: null,
            offset: null,
            scale: null
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        ref.close();

        // [type: Parameter, !readonly, renameable, configurable, param] (another param)
        Object.assign(param, <Partial<SensorParameter>>{
            name: 'a',
            min_value: 0,
            max_value: 1,
            offset: 1,
            scale: 2
        });
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Parameter,
                param,
                renameable: true,
                configurable: true
            }
        });
        refForm = ref.componentInstance.form;
        formDisableSpy = spyOn(refForm, 'disable');
        formSetValueSpy = spyOn(refForm, 'setValue');
        formMarkAsUntouchedSpy = spyOn(refForm, 'markAsUntouched');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        expect(refForm.get('name').disabled).toBeFalsy();
        expect(refForm.get('min_value').disabled).toBeFalsy();
        expect(refForm.get('max_value').disabled).toBeFalsy();
        expect(refForm.get('scale').disabled).toBeFalsy();
        expect(refForm.get('offset').disabled).toBeFalsy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_PARAMETER_EDIT');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_SAVE');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: param.id,
            name: param.name,
            type: param.type,
            min_value: param.min_value,
            max_value: param.max_value,
            offset: param.offset,
            scale: param.scale
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        ref.close();
    });

    it('should open dialog for Config', async () => {
        // [type: Config, readonly, !renameable, !configurable, !param]
        let ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Config,
                readonly: true
            }
        });
        let formDisableSpy = spyOn(ref.componentInstance.form, 'disable');
        noop.detectChanges();
        expect(formDisableSpy).toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeTruthy();
        let refForm = ref.componentInstance.form;
        expect(refForm.get('name').disabled).toBeTruthy();
        expect(refForm.get('min_value').disabled).toBeTruthy();
        expect(refForm.get('max_value').disabled).toBeTruthy();
        expect(refForm.get('scale').disabled).toBeTruthy();
        expect(refForm.get('offset').disabled).toBeTruthy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_CONFIG_VIEW');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_ADD');
        expect(ref.componentInstance.noScaleAndOffset).toBeTruthy();
        ref.close();

        // [type: Config, !readonly, !renameable, !configurable, !param]
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Config
            }
        });
        formDisableSpy = spyOn(ref.componentInstance.form, 'disable');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        refForm = ref.componentInstance.form;
        expect(refForm.get('name').disabled).toBeTruthy();
        expect(refForm.get('min_value').disabled).toBeTruthy();
        expect(refForm.get('max_value').disabled).toBeTruthy();
        expect(refForm.get('scale').disabled).toBeTruthy();
        expect(refForm.get('offset').disabled).toBeTruthy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_CONFIG_ADD');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_ADD');
        ref.close();

        // [type: Config, !readonly, renameable, configurable, param]
        const param: ConfigParameter = {
            id: 0,
            name: null,
            type: 1
        };
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Config,
                param,
                renameable: true,
                configurable: true
            }
        });
        refForm = ref.componentInstance.form;
        formDisableSpy = spyOn(refForm, 'disable');
        let formSetValueSpy = spyOn(refForm, 'setValue');
        let formMarkAsUntouchedSpy = spyOn(refForm, 'markAsUntouched');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        expect(refForm.get('name').disabled).toBeFalsy();
        expect(refForm.get('min_value').disabled).toBeFalsy();
        expect(refForm.get('max_value').disabled).toBeFalsy();
        expect(refForm.get('scale').disabled).toBeFalsy();
        expect(refForm.get('offset').disabled).toBeFalsy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_CONFIG_EDIT');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_SAVE');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: param.id,
            name: '',
            type: param.type,
            min_value: null,
            max_value: null,
            offset: null,
            scale: null
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        ref.close();

        // [type: Config, !readonly, renameable, configurable, param] (another param)
        Object.assign(param, <Partial<ConfigParameter>>{
            name: 'a',
            min_value: 0,
            max_value: 1
        });
        ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Config,
                param,
                renameable: true,
                configurable: true
            }
        });
        refForm = ref.componentInstance.form;
        formDisableSpy = spyOn(refForm, 'disable');
        formSetValueSpy = spyOn(refForm, 'setValue');
        formMarkAsUntouchedSpy = spyOn(refForm, 'markAsUntouched');
        noop.detectChanges();
        await noop.whenStable();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(ref.componentInstance.readonly).toBeFalsy();
        expect(refForm.get('name').disabled).toBeFalsy();
        expect(refForm.get('min_value').disabled).toBeFalsy();
        expect(refForm.get('max_value').disabled).toBeFalsy();
        expect(refForm.get('scale').disabled).toBeFalsy();
        expect(refForm.get('offset').disabled).toBeFalsy();
        expect(ref.componentInstance.dialogTitle).toEqual('PARAM_DIALOG_TITLE_CONFIG_EDIT');
        expect(ref.componentInstance.actionButtonText).toEqual('PARAM_DIALOG_ACTION_SAVE');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: param.id,
            name: param.name,
            type: param.type,
            min_value: param.min_value,
            max_value: param.max_value,
            offset: null,
            scale: null
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        ref.close();
    });

    it('shold set min & max errors and retrieve other ones', async () => {
        const param: ConfigParameter = {
            id: 0,
            name: null,
            type: 1
        };
        const ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Config,
                param,
                renameable: true,
                configurable: true
            }
        });
        noop.detectChanges();
        await noop.whenStable();
        const refForm = ref.componentInstance.form;
        refForm.get('min_value').setValue(5);
        refForm.get('max_value').setValue(4);
        expect(refForm.get('min_value').getError('range')).toBeTruthy();
        expect(refForm.get('max_value').getError('range')).toBeTruthy();
        expect(ref.componentInstance.hasError('min_value', 'range')).toBeFalsy();
        refForm.get('min_value').markAsTouched();
        expect(ref.componentInstance.hasError('min_value', 'range')).toBeTruthy();
        ref.close();
    });

    it('should set and reset exists error', async () => {
        const param: ConfigParameter = {
            id: 0,
            name: null,
            type: 1
        };
        const ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Config,
                param,
                renameable: true,
                configurable: true
            }
        });
        noop.detectChanges();
        await noop.whenStable();
        const refForm = ref.componentInstance.form;
        ref.componentInstance.setExistError();
        expect(refForm.get('id').getError('exist')).toBeTruthy();
        refForm.get('id').setValue(10);
        expect(refForm.get('id').getError('exist')).toBeFalsy();
        ref.close();
    });

    it('should call tryAdd', async () => {
        const param: ConfigParameter = {
            id: 0,
            name: null,
            type: 1
        };
        const ref = dialog.open(IqsDeviceprofilesParamDialogComponent, {
            data: <IqsDeviceprofilesParamDialogData>{
                type: DeviceProfileParamsListType.Config,
                param,
                renameable: true,
                configurable: true
            }
        });
        noop.detectChanges();
        await noop.whenStable();
        const tryAddSpy = spyOn(ref.componentInstance.tryAdd, 'emit');
        ref.componentInstance.onTryAdd();
        expect(tryAddSpy).toHaveBeenCalledWith({
            id: 0,
            type: 1
        });
        ref.close();
    });

});
