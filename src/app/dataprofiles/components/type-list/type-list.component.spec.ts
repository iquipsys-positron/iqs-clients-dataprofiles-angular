// tslint:disable:max-line-length
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import { TranslateModule } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';

import { IqsDataprofilesTypeListComponent } from './type-list.component';
import { IqsDataprofilesTypeListModule } from './type-list.module';
import { DataprofileListItem, DataProfile, SensorParameterAlgorithm } from '../../models';
import { IqsDataprofilesTranslateService } from '../../services';
import { utils } from '../../../../mock';

describe('[Dataprofiles] components/type-list', () => {

    const org_id = '00000000000000000000000000000000';
    let component: IqsDataprofilesTypeListComponent;
    let fixture: ComponentFixture<IqsDataprofilesTypeListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),

                IqsDataprofilesTypeListModule
            ],
            providers: [IqsDataprofilesTranslateService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqsDataprofilesTypeListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        resetToCurrentDefault();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update on changes', () => {
        const dataprofiles: DataProfile = cloneDeep(utils.dataprofiles.findByOrganizationId(org_id));
        dataprofiles.param_types.push(...[
            {
                id: 8,
                name: 'Test',
                algorithm: SensorParameterAlgorithm.Count,
                max_value: 50
            },
            {
                id: 9,
                name: 'Test',
                algorithm: SensorParameterAlgorithm.Duration
            }
        ]);
        const expectedCommands: DataprofileListItem[] = [
            { 'id': 1, 'title': '1. sound_signal', 'subtitle': 'sound_signal. int gt and lt', 'fontIcon': 'webui-bell-ring' }
        ];
        const expectedEvents: DataprofileListItem[] = [
            { 'id': 1, 'title': '1. Button1 short pressed', 'subtitle': 'custom. bool', 'fontIcon': 'webui-question' },
            { 'id': 2, 'title': '2. Button1 long pressed', 'subtitle': 'custom. bool', 'fontIcon': 'webui-question' },
            { 'id': 3, 'title': '3. Button2 short pressed', 'subtitle': 'custom. bool', 'fontIcon': 'webui-question' },
            { 'id': 4, 'title': '4. Button2 long pressed', 'subtitle': 'custom. bool', 'fontIcon': 'webui-question' },
            { 'id': 5, 'title': '5. Button3 pressed', 'subtitle': 'custom. bool', 'fontIcon': 'webui-question' },
            { 'id': 6, 'title': '6. Button4 pressed', 'subtitle': 'custom. bool', 'fontIcon': 'webui-question' }
        ];
        const expectedParams: DataprofileListItem[] = [
            { 'id': 109, 'title': '109. Presure', 'subtitle': 'presure gt', 'fontIcon': 'iqt-engine' },
            { 'id': 1, 'title': '1. Travel distance (km)', 'subtitle': 'count. float', 'fontIcon': 'webui-pie-circle' },
            { 'id': 2, 'title': '2. Travel speed (km/h)', 'subtitle': 'statistics. float', 'fontIcon': 'webui-bars' },
            { 'id': 3, 'title': '3. Powered', 'subtitle': 'custom. bool', 'fontIcon': 'webui-question' },
            { 'id': 4, 'title': '4. Freezed', 'subtitle': 'custom. bool', 'fontIcon': 'webui-question' },
            { 'id': 5, 'title': '5. Immobile', 'subtitle': 'custom. bool', 'fontIcon': 'webui-question' },
            { 'id': 6, 'title': '6. Load level (kg)', 'subtitle': 'transport. float gt', 'fontIcon': 'iqt-truck-fast' },
            { 'id': 7, 'title': '7. Gas level (l)', 'subtitle': 'consumption. float gt', 'fontIcon': 'iqt-speedometer' },
            { 'id': 8, 'title': '8. Test', 'subtitle': 'count lt', 'fontIcon': 'webui-pie-circle' },
            { 'id': 9, 'title': '9. Test', 'subtitle': 'duration', 'fontIcon': 'webui-clock-back' },
        ];
        component.ngOnChanges({
            parameters: new SimpleChange(undefined, dataprofiles.command_types, true)
        });
        expect(JSON.stringify(component.params)).toBeFalsy();
        component.parameters = dataprofiles.command_types;
        component.ngOnChanges({
            parameters: new SimpleChange(undefined, dataprofiles.command_types, true)
        });
        expect(JSON.stringify(component.params)).toEqual(JSON.stringify(expectedCommands));
        component.parameters = dataprofiles.event_types;
        component.ngOnChanges({
            parameters: new SimpleChange(undefined, dataprofiles.event_types, true)
        });
        expect(JSON.stringify(component.params)).toEqual(JSON.stringify(expectedEvents));
        component.parameters = dataprofiles.param_types;
        component.ngOnChanges({
            parameters: new SimpleChange(undefined, dataprofiles.param_types, true)
        });
        expect(JSON.stringify(component.params)).toEqual(JSON.stringify(expectedParams));
    });

    it('should track', () => {
        expect(component.trackById(null)).toEqual(null);
        expect(component.trackById(<any>{ id: 5 })).toEqual(5);
    });

    it('should emit clicks', () => {
        const paramClickSpy = spyOn(component.paramClick, 'emit');
        const removeClickSpy = spyOn(component.removeClick, 'emit');
        const event = new MouseEvent('click');
        const eventSropPropaginationSpy = spyOn(event, 'stopPropagation');
        component.loading = true;
        component.onParamClick(0);
        component.onRemoveClick(event, 0);
        expect(paramClickSpy).not.toHaveBeenCalled();
        expect(removeClickSpy).not.toHaveBeenCalled();
        component.loading = false;
        component.onParamClick(99);
        component.onRemoveClick(event, 99);
        expect(paramClickSpy).toHaveBeenCalledTimes(1);
        expect(removeClickSpy).not.toHaveBeenCalled();
        component.onParamClick(null);
        component.onRemoveClick(event, null);
        expect(paramClickSpy).toHaveBeenCalledTimes(1);
        expect(removeClickSpy).not.toHaveBeenCalled();
        component.onParamClick(Number.MAX_SAFE_INTEGER);
        component.onRemoveClick(event, Number.MAX_SAFE_INTEGER);
        expect(paramClickSpy).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
        expect(eventSropPropaginationSpy).toHaveBeenCalled();
        expect(removeClickSpy).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
    });
});
