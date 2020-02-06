import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    IqsShellService,
    SHELL_CONFIG,
    defaultShellConfig,
    IqsAskDialogComponent,
    EntityState
} from 'iqs-libs-clientshell2-angular';
import { MatDialogRef } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';
import { take } from 'rxjs/operators';

import { IqsDataprofilesContainerComponent } from './dataprofiles-container.component';
import { IqsDataprofilesContainerModule } from './dataprofiles-container.module';
import { DataProfile, TypeDialogType, SensorStateAlgorithm, SensorStateType } from '../../models';
import { IqsDataprofilesService, IqsDataprofilesTranslateService } from '../../services';
import { IqsDataprofilesTypeDialogComponent } from '../../components/type-dialog/type-dialog.component';
import { IqsDataprofilesStateDialogComponent } from '../../components/state-dialog/state-dialog.component';
import { IqsDataprofilesServiceMock, resetToCurrentDefault } from '../../../../mock';

describe('[Dataprofiles] containers/dataprofiles-container', () => {

    const organization_id = '00000000000000000000000000000000';
    let component: IqsDataprofilesContainerComponent;
    let fixture: ComponentFixture<IqsDataprofilesContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                NoopAnimationsModule,
                TranslateModule.forRoot(),

                IqsDataprofilesContainerModule
            ],
            providers: [
                IqsDataprofilesTranslateService,
                {
                    provide: IqsDataprofilesService,
                    useClass: IqsDataprofilesServiceMock
                },
                IqsShellService,
                {
                    provide: SHELL_CONFIG,
                    useValue: defaultShellConfig
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqsDataprofilesContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const dataprofilesService: IqsDataprofilesServiceMock = TestBed.get(IqsDataprofilesService);
        dataprofilesService.init({ organization_id });
        spyOn(component, 'ngOnInit');
        resetToCurrentDefault();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update dataprofiles', () => {
        const dataprofilesService: IqsDataprofilesServiceMock = TestBed.get(IqsDataprofilesService);
        const savedDataprofiles = cloneDeep(dataprofilesService.dataprofiles);
        savedDataprofiles.param_types = sortBy(savedDataprofiles.param_types, ['id']);
        savedDataprofiles.command_types = sortBy(savedDataprofiles.command_types, ['id']);
        savedDataprofiles.event_types = sortBy(savedDataprofiles.event_types, ['id']);
        savedDataprofiles.state_types = sortBy(savedDataprofiles.state_types, ['id']);
        expect(component.dataprofiles).toEqual(savedDataprofiles);
        const emptyDataprofile = Object.assign(new DataProfile(), {
            command_types: [],
            event_types: [],
            param_types: [],
            state_types: []
        });
        dataprofilesService.dataprofiles = null;
        fixture.detectChanges();
        expect(component.dataprofiles).toEqual(emptyDataprofile);
    });

    it('should update loading state', () => {
        const dataprofilesService: IqsDataprofilesServiceMock = TestBed.get(IqsDataprofilesService);
        const getState = () => {
            let state: EntityState;
            component.state$.pipe(take(1)).subscribe(s => state = s);
            return state;
        };
        dataprofilesService.state = EntityState.Progress;
        expect(getState()).toEqual(EntityState.Progress);
        component.loading$.next(true);
        expect(getState()).toEqual(EntityState.Data);
        dataprofilesService.state = EntityState.Data;
        expect(getState()).toEqual(EntityState.Data);
        expect(component.loading$.getValue()).toBeFalsy();
    });

    it('empty state actions should call dialogs', () => {
        const onTypeAddSpy = spyOn(component, 'onTypeAdd');
        const onStateAddSpy = spyOn(component, 'onStateAdd');
        component.emptyStateCommandsActions[0].action();
        expect(onTypeAddSpy).toHaveBeenCalledWith(TypeDialogType.Command);
        component.emptyStateEventsActions[0].action();
        expect(onTypeAddSpy).toHaveBeenCalledWith(TypeDialogType.Event);
        component.emptyStateParamsActions[0].action();
        expect(onTypeAddSpy).toHaveBeenCalledWith(TypeDialogType.Parameter);
        component.emptyStateStatesActions[0].action();
        expect(onStateAddSpy).toHaveBeenCalled();
    });

    it('should change tab and unsubscribe on destroy', () => {
        component.onTabChange(0);
        expect(component.tabIndex).toEqual(0);
        component.onTabChange(100);
        expect(component.tabIndex).toEqual(100);
        const subsUnsubscribeSpy = spyOn((<any>component).subs, 'unsubscribe');
        component.ngOnDestroy();
        expect(subsUnsubscribeSpy).toHaveBeenCalled();
    });

    it('should call Type add dialog', async () => {
        const types = Object.values(TypeDialogType);
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const savedDataprofiles = cloneDeep(component.dataprofiles);
        await fixture.whenStable();
        for (const type of types) {
            component.onTypeAdd(type);
            expect(dialogSpy).toHaveBeenCalledWith(IqsDataprofilesTypeDialogComponent, jasmine.objectContaining({ data: { type } }));
            const dialog: MatDialogRef<IqsDataprofilesTypeDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
            const setExistsErrorSpy = spyOn(dialog.componentInstance, 'setExistError');
            const dialogCloseSpy = spyOn(dialog, 'close').and.callThrough();
            dialog.componentInstance.form.get('id').setValue(1);
            dialog.componentInstance.onTryAdd();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(setExistsErrorSpy).toHaveBeenCalledTimes(1);
            dialog.componentInstance.form.get('id').setValue(100);
            dialog.componentInstance.onTryAdd();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(setExistsErrorSpy).toHaveBeenCalledTimes(1);
            expect(dialogCloseSpy).toHaveBeenCalled();
            expect(component.dataprofiles[type]).toEqual(sortBy([...savedDataprofiles[type], { id: 100 }], ['id']));
        }
    });

    it('should call Type edit dialog', async () => {
        const types = Object.values(TypeDialogType);
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const savedDataprofiles = cloneDeep(component.dataprofiles);
        await fixture.whenStable();
        for (const type of types) {
            const customParams = component.dataprofiles[type].filter(p => p.id >= 100);
            const defaultParams = cloneDeep(component.dataprofiles[type].filter(p => p.id < 100));
            const param = customParams.length ? customParams[0] : defaultParams.splice(0, 1)[0];
            const anotherParam = defaultParams.length > 0 ? defaultParams[0] : null;
            const idx = findIndex(savedDataprofiles[type], ['id', param.id]);
            const data: any = { type, param };
            if (param.id < 100) { data.readonly = true; }
            component.onTypeEdit(param.id, type);
            fixture.detectChanges();
            await fixture.whenStable();
            expect(dialogSpy).toHaveBeenCalledWith(IqsDataprofilesTypeDialogComponent, jasmine.objectContaining({ data }));
            const dialog: MatDialogRef<IqsDataprofilesTypeDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
            const setExistsErrorSpy = spyOn(dialog.componentInstance, 'setExistError');
            const dialogCloseSpy = spyOn(dialog, 'close').and.callThrough();
            if (anotherParam) {
                dialog.componentInstance.form.get('id').setValue(anotherParam.id);
                dialog.componentInstance.onTryAdd();
                fixture.detectChanges();
                await fixture.whenStable();
                expect(setExistsErrorSpy).toHaveBeenCalledTimes(1);
                expect(dialogCloseSpy).not.toHaveBeenCalled();
                setExistsErrorSpy.calls.reset();
            }
            dialog.componentInstance.form.get('id').setValue(type !== TypeDialogType.Event ? param.id * 100 : param.id);
            dialog.componentInstance.onTryAdd();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(dialogCloseSpy).toHaveBeenCalled();
            savedDataprofiles[type][idx] = {
                ...savedDataprofiles[type][idx],
                id: type !== TypeDialogType.Event ? param.id * 100 : param.id
            };
            savedDataprofiles[type] = sortBy(savedDataprofiles[type], ['id']);
            expect(component.dataprofiles[type]).toEqual(savedDataprofiles[type]);
        }
    });

    it('should call Type remove dialog', async () => {
        const joc = jasmine.objectContaining;
        const types = Object.values(TypeDialogType);
        const titles = {
            command_types: 'DATAPROFILES_RESET_COMMAND_TITLE',
            event_types: 'DATAPROFILES_RESET_EVENT_TITLE',
            param_types: 'DATAPROFILES_RESET_PARAMETER_TITLE',
        };
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const savedDataprofiles = cloneDeep(component.dataprofiles);
        await fixture.whenStable();
        for (const type of types) {
            const customParams = component.dataprofiles[type].filter(p => p.id >= 100);
            const defaultParams = cloneDeep(component.dataprofiles[type].filter(p => p.id < 100));
            const param = customParams.length ? customParams[0] : defaultParams.splice(0, 1)[0];
            const idx = findIndex(savedDataprofiles[type], ['id', param.id]);
            const data: any = joc({ title: titles[type] });
            component.onTypeRemove(param.id, type);
            expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data }));
            let dialog: MatDialogRef<IqsAskDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
            dialog.close(false);
            expect(component.dataprofiles[type]).toEqual(savedDataprofiles[type]);
            component.onTypeRemove(param.id, type);
            dialog = dialogSpy.calls.mostRecent().returnValue;
            dialog.close(true);
            fixture.detectChanges();
            await fixture.whenStable();
            savedDataprofiles[type].splice(idx, 1);
            expect(component.dataprofiles[type]).toEqual(savedDataprofiles[type]);
        }
    });

    it('should call State add dialog', () => {
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const savedDataprofiles = cloneDeep(component.dataprofiles);
        component.onStateAdd();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDataprofilesStateDialogComponent, jasmine.objectContaining({
            data: {
                parameters: savedDataprofiles.param_types,
                events: savedDataprofiles.event_types,
                commands: savedDataprofiles.command_types
            }
        }));
        const dialog: MatDialogRef<IqsDataprofilesStateDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        const setExistsErrorSpy = spyOn(dialog.componentInstance, 'setExistError');
        const dialogCloseSpy = spyOn(dialog, 'close').and.callThrough();
        dialog.componentInstance.form.get('id').setValue(1);
        dialog.componentInstance.onTryAdd();
        expect(setExistsErrorSpy).toHaveBeenCalledTimes(1);
        dialog.componentInstance.form.get('id').setValue(100);
        dialog.componentInstance.onTryAdd();
        expect(setExistsErrorSpy).toHaveBeenCalledTimes(1);
        expect(dialogCloseSpy).toHaveBeenCalled();
        expect(component.dataprofiles.state_types).toEqual(sortBy([...savedDataprofiles.state_types, { id: 100 }], ['id']));
    });

    it('should call State edit dialog', () => {
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const savedDataprofiles = cloneDeep(component.dataprofiles);
        const customStates = component.dataprofiles.state_types.filter(s => s.id >= 100);
        const defaultStates = cloneDeep(component.dataprofiles.state_types.filter(s => s.id < 100));
        const state = customStates.length ? customStates[0] : defaultStates.splice(0, 1)[0];
        const anotherState = defaultStates.length > 0 ? defaultStates[0] : null;
        let idx = findIndex(savedDataprofiles.state_types, ['id', state.id]);
        const data: any = {
            parameters: savedDataprofiles.param_types,
            events: savedDataprofiles.event_types,
            commands: savedDataprofiles.command_types,
            state
        };
        if (state.id < 100) { data.readonly = true; }
        component.onStateEdit(state.id);
        expect(dialogSpy).toHaveBeenCalledWith(IqsDataprofilesStateDialogComponent, jasmine.objectContaining({ data }));
        let dialog: MatDialogRef<IqsDataprofilesStateDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        let setExistsErrorSpy = spyOn(dialog.componentInstance, 'setExistError');
        let dialogCloseSpy = spyOn(dialog, 'close').and.callThrough();
        if (anotherState) {
            dialog.componentInstance.form.get('id').setValue(anotherState.id);
            dialog.componentInstance.onTryAdd();
            expect(setExistsErrorSpy).toHaveBeenCalledTimes(1);
            expect(dialogCloseSpy).not.toHaveBeenCalled();
            setExistsErrorSpy.calls.reset();
        }
        dialog.componentInstance.form.get('id').setValue(state.id);
        dialog.componentInstance.onTryAdd();
        expect(dialogCloseSpy).toHaveBeenCalled();
        savedDataprofiles.state_types[idx] = { id: state.id };
        savedDataprofiles.state_types = sortBy(savedDataprofiles.state_types, ['id']);
        expect(component.dataprofiles.state_types).toEqual(savedDataprofiles.state_types);

        const oneMoreState: SensorStateType = { id: 101, name: 'test', algorithm: SensorStateAlgorithm.Custom };
        component.dataprofiles.state_types.push(oneMoreState);
        savedDataprofiles.state_types.push(oneMoreState);
        idx = findIndex(savedDataprofiles.state_types, ['id', oneMoreState.id]);
        data.state = oneMoreState;
        delete data.readonly;
        component.onStateEdit(oneMoreState.id);
        expect(dialogSpy).toHaveBeenCalledWith(IqsDataprofilesStateDialogComponent, jasmine.objectContaining({ data }));
        dialog = dialogSpy.calls.mostRecent().returnValue;
        setExistsErrorSpy = spyOn(dialog.componentInstance, 'setExistError');
        dialogCloseSpy = spyOn(dialog, 'close').and.callThrough();
        dialog.componentInstance.form.get('id').setValue(102);
        dialog.componentInstance.onTryAdd();
        expect(dialogCloseSpy).toHaveBeenCalled();
        savedDataprofiles.state_types[idx] = { id: 102 };
        savedDataprofiles.state_types = sortBy(savedDataprofiles.state_types, ['id']);
        expect(component.dataprofiles.state_types).toEqual(savedDataprofiles.state_types);
    });

    it('should call State remove dialog', async () => {
        const joc = jasmine.objectContaining;
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const savedDataprofiles = cloneDeep(component.dataprofiles);
        const state = component.dataprofiles.state_types[0];
        const idx = findIndex(savedDataprofiles.state_types, ['id', state.id]);
        const data: any = joc({ title: 'DATAPROFILES_RESET_STATE_TITLE' });
        component.onStateRemove(state.id);
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data }));
        let dialog: MatDialogRef<IqsAskDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        dialog.close(false);
        expect(component.dataprofiles.state_types).toEqual(savedDataprofiles.state_types);
        component.onStateRemove(state.id);
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.close(true);
        fixture.detectChanges();
        await fixture.whenStable();
        savedDataprofiles.state_types.splice(idx, 1);
        expect(component.dataprofiles.state_types).toEqual(savedDataprofiles.state_types);
    });

    it('should save', () => {
        const dataprofilesService: IqsDataprofilesServiceMock = TestBed.get(IqsDataprofilesService);
        const dataprofilesServiceUpdateSpy = spyOn(dataprofilesService, 'update');
        component.onSave();
        expect(component.loading$.getValue()).toBeTruthy();
        expect(dataprofilesServiceUpdateSpy).toHaveBeenCalled();
    });

    it('should reset', async () => {
        const emptyDataprofiles: DataProfile = {
            id: organization_id
        };
        const dialogSpy = spyOn((<any>component).dialog, 'open').and.callThrough();
        const savedDataprofiles = cloneDeep(component.dataprofiles);
        component.dataprofiles = emptyDataprofiles;
        fixture.detectChanges();
        await fixture.whenStable();
        component.onReset();
        expect(dialogSpy).toHaveBeenCalled();
        let dialog: MatDialogRef<IqsAskDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        dialog.close(false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.dataprofiles).toEqual(emptyDataprofiles);
        component.onReset();
        expect(dialogSpy).toHaveBeenCalledTimes(2);
        dialog = dialogSpy.calls.mostRecent().returnValue;
        dialog.close(true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.dataprofiles).toEqual(savedDataprofiles);
    });
});
