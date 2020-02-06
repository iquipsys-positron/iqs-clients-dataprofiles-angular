// tslint:disable:max-line-length
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';

import { IqsDataprofilesStateDialogComponent, IqsDataprofilesStateDialogData } from './state-dialog.component';
import { IqsDataprofilesStateDialogModule } from './state-dialog.module';
import { DataProfile, SensorStateType, SensorStateAlgorithm } from '../../models';
import { IqsDataprofilesTranslateService } from '../../services';
import { utils } from '../../../../mock';

describe('[Dataprofiles] components/state-dialog', () => {

    const organization_id = '00000000000000000000000000000000';
    let component: IqsDataprofilesStateDialogComponent;
    let fixture: ComponentFixture<IqsDataprofilesStateDialogComponent>;
    let dataprofiles: DataProfile;

    beforeEach(async(() => {
        dataprofiles = cloneDeep(utils.dataprofiles.findByOrganizationId(organization_id));
    }));

    it('should create and disable form', async(() => {
        const state = dataprofiles.state_types.find(s => s.id < 100);
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),

                IqsDataprofilesStateDialogModule
            ],
            providers: [
                IqsDataprofilesTranslateService,
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: <IqsDataprofilesStateDialogData>{
                        commands: dataprofiles.command_types,
                        events: dataprofiles.event_types,
                        parameters: dataprofiles.param_types,
                        state: state,
                        readonly: true
                    }
                }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(IqsDataprofilesStateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
        const formDisableSpy = spyOn(component.form, 'disable');
        const formSetValueSpy = spyOn(component.form, 'setValue');
        const formMarkAsUntouchedSpy = spyOn(component.form, 'markAsUntouched');
        component.ngOnInit();
        expect(formDisableSpy).toHaveBeenCalled();
        expect(component.readonly).toBeTruthy();
        expect(component.dialogTitle).toEqual('STATE_DIALOG_TITLE_VIEW');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: state.id,
            name: state.name,
            algorithm: state.algorithm,
            param_id: state.param_id || null,
            command_id: state.command_id || null,
            event_id: state.event_id || null,
            on_event_id: state.on_event_id || null,
            off_event_id: state.off_event_id || null,
            value_min: state.hasOwnProperty('value_min') ? state.value_min : null,
            value_max: state.hasOwnProperty('value_max') ? state.value_max : null,
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
    }));

    it('should create and doesn\'t disable form', async(() => {
        const state = <SensorStateType>{
            id: 101,
            name: 'Test state',
            algorithm: SensorStateAlgorithm.Custom,
            value_min: 0,
            value_max: 100
        };
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),

                IqsDataprofilesStateDialogModule
            ],
            providers: [
                IqsDataprofilesTranslateService,
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: <IqsDataprofilesStateDialogData>{
                        commands: dataprofiles.command_types,
                        events: dataprofiles.event_types,
                        parameters: dataprofiles.param_types,
                        state: state
                    }
                }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(IqsDataprofilesStateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
        const formDisableSpy = spyOn(component.form, 'disable');
        const formSetValueSpy = spyOn(component.form, 'setValue');
        const formMarkAsUntouchedSpy = spyOn(component.form, 'markAsUntouched');
        component.ngOnInit();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(component.readonly).toBeFalsy();
        expect(component.dialogTitle).toEqual('STATE_DIALOG_TITLE_EDIT');
        expect(formSetValueSpy).toHaveBeenCalledWith({
            id: state.id,
            name: state.name,
            algorithm: state.algorithm,
            param_id: state.param_id || null,
            command_id: state.command_id || null,
            event_id: state.event_id || null,
            on_event_id: state.on_event_id || null,
            off_event_id: state.off_event_id || null,
            value_min: state.hasOwnProperty('value_min') ? state.value_min : null,
            value_max: state.hasOwnProperty('value_max') ? state.value_max : null,
        });
        expect(formMarkAsUntouchedSpy).toHaveBeenCalled();
    }));
});

describe('[Dataprofiles] components/state-dialog', () => {

    const organization_id = '00000000000000000000000000000000';
    let component: IqsDataprofilesStateDialogComponent;
    let fixture: ComponentFixture<IqsDataprofilesStateDialogComponent>;
    let dataprofiles: DataProfile;

    beforeEach(async(() => {
        dataprofiles = cloneDeep(utils.dataprofiles.findByOrganizationId(organization_id));
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),

                IqsDataprofilesStateDialogModule
            ],
            providers: [
                IqsDataprofilesTranslateService,
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: <IqsDataprofilesStateDialogData>{
                        commands: dataprofiles.command_types,
                        events: dataprofiles.event_types,
                        parameters: dataprofiles.param_types
                    }
                }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(IqsDataprofilesStateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create and set new form', async(() => {
        expect(component).toBeTruthy();
        const formDisableSpy = spyOn(component.form, 'disable');
        const formSetValueSpy = spyOn(component.form, 'setValue');
        const formMarkAsUntouchedSpy = spyOn(component.form, 'markAsUntouched');
        component.ngOnInit();
        expect(formDisableSpy).not.toHaveBeenCalled();
        expect(component.readonly).toBeFalsy();
        expect(component.dialogTitle).toEqual('STATE_DIALOG_TITLE_ADD');
        expect(formSetValueSpy).not.toHaveBeenCalled();
        expect(formMarkAsUntouchedSpy).not.toHaveBeenCalled();
    }));

    it('should hanlde code errors', () => {
        const idCtrl = component.form.get('id');
        const minCtrl = component.form.get('value_min');
        const maxCtrl = component.form.get('value_max');
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
