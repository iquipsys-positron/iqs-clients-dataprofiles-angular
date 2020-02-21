// tslint:disable:max-line-length
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';

import { IqsDataprofilesTypeDialogComponent, IqsDataprofilesTypeDialogData } from './type-dialog.component';
import { IqsDataprofilesTypeDialogModule } from './type-dialog.module';
import {
    DataProfile,
    TypeDialogType,
    ActuatorCommandType,
    SensorEventType,
    SensorEventAlgorithm,
    SensorParameterType,
    SensorParameterAlgorithm,
} from '../../models';
import { IqsDataprofilesTranslateService } from '../../services';
import { utils } from '../../../../mock';

describe('[Dataprofiles] components/type-dialog', () => {

    const org_id = '00000000000000000000000000000000';
    let component: IqsDataprofilesTypeDialogComponent;
    let fixture: ComponentFixture<IqsDataprofilesTypeDialogComponent>;
    let dataprofiles: DataProfile;

    beforeEach(async(() => {
        dataprofiles = cloneDeep(utils.dataprofiles.findByOrganizationId(org_id));
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                TranslateModule.forRoot(),

                IqsDataprofilesTypeDialogModule
            ],
            providers: [
                IqsDataprofilesTranslateService,
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}
                }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(IqsDataprofilesTypeDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create and disable form', async(() => {
        const command = dataprofiles.command_types.find(c => c.id < 100);
        const event = dataprofiles.event_types.find(e => e.id < 100);
        const param = dataprofiles.param_types.find(p => p.id < 100);
        const datas: IqsDataprofilesTypeDialogData[] = [
            { param: command, type: TypeDialogType.Command, readonly: true },
            { param: event, type: TypeDialogType.Event, readonly: true },
            { param: param, type: TypeDialogType.Parameter, readonly: true },
        ];
        const formDisableSpy = spyOn(component.form, 'disable');
        const formSetValueSpy = spyOn(component.form, 'setValue');
        const formMarkAsUntouchedSpy = spyOn(component.form, 'markAsUntouched');
        expect(component).toBeTruthy();
        for (const d of datas) {
            formDisableSpy.calls.reset();
            formSetValueSpy.calls.reset();
            formMarkAsUntouchedSpy.calls.reset();
            (<any>component).data = d;
            component.ngOnInit();
            expect(formDisableSpy).toHaveBeenCalled();
            expect(component.readonly).toBeTruthy();
            expect(component.dialogTitle).toMatch(/TYPE_DIALOG_TITLE_.*_VIEW/);
            expect(formSetValueSpy).toHaveBeenCalledWith({
                id: d.param.id,
                name: d.param.name,
                algorithm: d.param.algorithm,
                value_type: d.param.value_type || '',
                value_unit: d.param.value_unit || '',
                min_value: d.param.hasOwnProperty('min_value') ? d.param.min_value : null,
                max_value: d.param.hasOwnProperty('max_value') ? d.param.max_value : null,
            });
            expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        }
    }));

    it('should create and doesn\'t disable form', async(() => {
        const command: ActuatorCommandType = {
            id: 101,
            name: 'test command'
        };
        const event: SensorEventType = {
            id: 101,
            name: 'test event',
            algorithm: SensorEventAlgorithm.Count
        };
        const param: SensorParameterType = {
            id: 101,
            name: 'test parameter',
            algorithm: SensorParameterAlgorithm.Count
        };
        const datas: IqsDataprofilesTypeDialogData[] = [
            { param: command, type: TypeDialogType.Command },
            { param: event, type: TypeDialogType.Event },
            { param: param, type: TypeDialogType.Parameter },
        ];
        expect(component).toBeTruthy();
        const formDisableSpy = spyOn(component.form, 'disable');
        const formSetValueSpy = spyOn(component.form, 'setValue');
        const formMarkAsUntouchedSpy = spyOn(component.form, 'markAsUntouched');
        for (const d of datas) {
            formDisableSpy.calls.reset();
            formSetValueSpy.calls.reset();
            formMarkAsUntouchedSpy.calls.reset();
            (<any>component).data = d;
            component.ngOnInit();
            expect(formDisableSpy).not.toHaveBeenCalled();
            expect(component.readonly).toBeFalsy();
            expect(component.dialogTitle).toMatch(/TYPE_DIALOG_TITLE_.*_EDIT/);
            expect(formSetValueSpy).toHaveBeenCalledWith({
                id: d.param.id,
                name: d.param.name,
                algorithm: d.param.algorithm,
                value_type: d.param.value_type || '',
                value_unit: d.param.value_unit || '',
                min_value: d.param.hasOwnProperty('min_value') ? d.param.min_value : null,
                max_value: d.param.hasOwnProperty('max_value') ? d.param.max_value : null,
            });
            expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
        }
    }));
});

describe('[Dataprofiles] components/type-dialog', () => {

    const org_id = '00000000000000000000000000000000';
    let component: IqsDataprofilesTypeDialogComponent;
    let fixture: ComponentFixture<IqsDataprofilesTypeDialogComponent>;
    let dataprofiles: DataProfile;

    beforeEach(async(() => {
        dataprofiles = cloneDeep(utils.dataprofiles.findByOrganizationId(org_id));
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                TranslateModule.forRoot(),

                IqsDataprofilesTypeDialogModule
            ],
            providers: [
                IqsDataprofilesTranslateService,
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}
                }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(IqsDataprofilesTypeDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create and set new form', async(() => {
        const datas: IqsDataprofilesTypeDialogData[] = [
            { param: null, type: TypeDialogType.Command },
            { param: null, type: TypeDialogType.Event },
            { param: null, type: TypeDialogType.Parameter },
        ];
        expect(component).toBeTruthy();
        const formDisableSpy = spyOn(component.form, 'disable');
        const formSetValueSpy = spyOn(component.form, 'setValue');
        const formMarkAsUntouchedSpy = spyOn(component.form, 'markAsUntouched');
        for (const d of datas) {
            formDisableSpy.calls.reset();
            formSetValueSpy.calls.reset();
            formMarkAsUntouchedSpy.calls.reset();
            (<any>component).data = d;
            component.ngOnInit();
            expect(formDisableSpy).not.toHaveBeenCalled();
            expect(component.readonly).toBeFalsy();
            expect(component.dialogTitle).toMatch(/TYPE_DIALOG_TITLE_.*_ADD/);
            expect(formSetValueSpy).not.toHaveBeenCalled();
            expect(formMarkAsUntouchedSpy).not.toHaveBeenCalled();
        }
    }));

    it('should hanlde code errors', () => {
        const idCtrl = component.form.get('id');
        const minCtrl = component.form.get('min_value');
        const maxCtrl = component.form.get('max_value');
        const minMaxTests: { min: number, max: number, error: boolean }[] = [
            { min: 0, max: 5, error: false },
            { min: 2, max: 2, error: false },
            { min: 3, max: 2, error: true },
            { min: 2, max: 8, error: false },
        ];
        for (const c of minMaxTests) {
            minCtrl.setValue(c.min);
            maxCtrl.setValue(c.max);
            expect(minCtrl.getError('range')).toBe(c.error ? true : null);
            expect(maxCtrl.getError('range')).toBe(c.error ? true : null);
        }
    });

    it('should handle input errors', async(() => {
        const idCtrl = component.form.get('id');
        const nameCtrl = component.form.get('name');
        const algCtrl = component.form.get('algorithm');
        idCtrl.setValue(null);
        expect(idCtrl.getError('required')).toBeTruthy();
        idCtrl.setValue(90);
        expect(idCtrl.getError('required')).toBeFalsy();
        expect(idCtrl.getError('min')).toBeTruthy();
        component.setExistError();
        component.setExistError();
        expect(idCtrl.getError('exist')).toBeTruthy();
        idCtrl.setValue(1000);
        expect(idCtrl.getError('exist')).toBeFalsy();
        nameCtrl.setValue(null);
        expect(nameCtrl.getError('required')).toBeTruthy();
        nameCtrl.setValue('test');
        expect(nameCtrl.getError('required')).toBeFalsy();
        algCtrl.setValue(null);
        algCtrl.markAsTouched();
        expect(component.hasError('algorithm', 'required')).toBeTruthy();
        algCtrl.setValue('test');
        expect(component.hasError('algorithm', 'required')).toBeFalsy();
    }));

    it('should emit add/save click', () => {
        const tryAddSpy = spyOn(component.tryAdd, 'emit');
        component.onTryAdd();
        expect(tryAddSpy).toHaveBeenCalledTimes(1);
        const addButton: HTMLButtonElement = (<HTMLElement>fixture.nativeElement).querySelector('[mat-dialog-actions] button:nth-of-type(2)');
        addButton.disabled = false;
        addButton.click();
        expect(tryAddSpy).toHaveBeenCalledTimes(2);
    });
});
