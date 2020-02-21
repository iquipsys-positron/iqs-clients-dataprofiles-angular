// tslint:disable:max-line-length
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import { TranslateModule } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';

import { IqsDataprofilesStateListComponent } from './state-list.component';
import { IqsDataprofilesStateListModule } from './state-list.module';
import { DataprofileListItem, SensorStateAlgorithm, DataProfile } from '../../models';
import { IqsDataprofilesTranslateService } from '../../services';
import { utils } from '../../../../mock';

describe('[Dataprofiles] components/state-list', () => {

    const org_id = '00000000000000000000000000000000';
    let component: IqsDataprofilesStateListComponent;
    let fixture: ComponentFixture<IqsDataprofilesStateListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),

                IqsDataprofilesStateListModule
            ],
            providers: [IqsDataprofilesTranslateService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqsDataprofilesStateListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        resetToCurrentDefault();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update on changes', () => {
        const dataprofiles: DataProfile = cloneDeep(utils.dataprofiles.findByOrganizationId(org_id));
        dataprofiles.state_types.push(...[
            {
                'id': 5,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'param_id': 4,
                'value_min': 50,
                'value_max': 60
            },
            {
                'id': 6,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'param_id': 6,
                'value_max': 60
            },
            {
                'id': 7,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'param_id': 88,
                'value_max': 60
            },
            {
                'id': 8,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'event_id': 1
            },
            {
                'id': 9,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'event_id': 100
            },
            {
                'id': 10,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'command_id': 1
            },
            {
                'id': 11,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'command_id': 100
            },
            {
                'id': 12,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'on_event_id': 1
            },
            {
                'id': 13,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'on_event_id': 100
            },
            {
                'id': 14,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'off_event_id': 1
            },
            {
                'id': 15,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Custom,
                'off_event_id': 100
            },
            {
                'id': 16,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization
            }
        ]);
        const expectedResult: DataprofileListItem[] = [
            { id: 1, title: '1. Powered', subtitle: 'duration. activation_by_parameter "Powered"', fontIcon: 'webui-time' },
            { id: 2, title: '2. Freezed', subtitle: 'duration. activation_by_parameter "Freezed"', fontIcon: 'webui-time' },
            { id: 3, title: '3. Immobile', subtitle: 'utilization. activation_by_parameter "Immobile"', fontIcon: 'iqt-speedometer' },
            { id: 4, title: '4. Loaded', subtitle: 'utilization. activation_by_parameter "Load level" from kg', fontIcon: 'iqt-speedometer' },
            { id: 5, title: '5. Loaded', subtitle: 'utilization. activation_by_parameter "Freezed" from to', fontIcon: 'iqt-speedometer' },
            { id: 6, title: '6. Loaded', subtitle: 'utilization. activation_by_parameter "Load level" to kg', fontIcon: 'iqt-speedometer' },
            { id: 7, title: '7. Loaded', subtitle: 'utilization. activation_by_parameter #88 to', fontIcon: 'iqt-speedometer' },
            { id: 8, title: '8. Loaded', subtitle: 'utilization. activation_by_event "Button1 short pressed"', fontIcon: 'iqt-speedometer' },
            { id: 9, title: '9. Loaded', subtitle: 'utilization. activation_by_event #100', fontIcon: 'iqt-speedometer' },
            { id: 10, title: '10. Loaded', subtitle: 'utilization. activation_by_command "sound_signal"', fontIcon: 'iqt-speedometer' },
            { id: 11, title: '11. Loaded', subtitle: 'utilization. activation_by_command #100', fontIcon: 'iqt-speedometer' },
            { id: 12, title: '12. Loaded', subtitle: 'utilization. activation_by_on_event "Button1 short pressed"', fontIcon: 'iqt-speedometer' },
            { id: 13, title: '13. Loaded', subtitle: 'utilization. activation_by_on_event #100', fontIcon: 'iqt-speedometer' },
            { id: 14, title: '14. Loaded', subtitle: 'utilization. activation_by_off_event "Button1 short pressed"', fontIcon: 'iqt-speedometer' },
            { id: 15, title: '15. Loaded', subtitle: 'custom. activation_by_off_event #100', fontIcon: 'webui-question' },
            { id: 16, title: '16. Loaded', subtitle: 'utilization', fontIcon: 'iqt-speedometer' },
        ];
        component.commands = dataprofiles.command_types;
        component.events = dataprofiles.event_types;
        component.parameters = dataprofiles.param_types;
        component.states = dataprofiles.state_types;
        component.ngOnChanges({
            commands: new SimpleChange(undefined, dataprofiles.command_types, true)
        });
        component.ngOnChanges({
            event: new SimpleChange(undefined, dataprofiles.event_types, true)
        });
        component.ngOnChanges({
            parameters: new SimpleChange(undefined, dataprofiles.param_types, true)
        });
        component.ngOnChanges({
            states: new SimpleChange(undefined, dataprofiles.state_types, true)
        });
        expect(JSON.stringify(component.params)).toEqual(JSON.stringify(expectedResult));
    });

    it('should track', () => {
        expect(component.trackById(null)).toEqual(null);
        expect(component.trackById(<any>{ id: 5 })).toEqual(5);
    });

    it('should emit clicks', () => {
        const stateClickSpy = spyOn(component.stateClick, 'emit');
        const removeClickSpy = spyOn(component.removeClick, 'emit');
        const event = new MouseEvent('click');
        const eventSropPropaginationSpy = spyOn(event, 'stopPropagation');
        component.loading = true;
        component.onStateClick(0);
        component.onRemoveClick(event, 0);
        expect(stateClickSpy).not.toHaveBeenCalled();
        expect(removeClickSpy).not.toHaveBeenCalled();
        component.loading = false;
        component.onStateClick(99);
        component.onRemoveClick(event, 99);
        expect(stateClickSpy).toHaveBeenCalledTimes(1);
        expect(removeClickSpy).not.toHaveBeenCalled();
        component.onStateClick(null);
        component.onRemoveClick(event, null);
        expect(stateClickSpy).toHaveBeenCalledTimes(1);
        expect(removeClickSpy).not.toHaveBeenCalled();
        component.onStateClick(Number.MAX_SAFE_INTEGER);
        component.onRemoveClick(event, Number.MAX_SAFE_INTEGER);
        expect(stateClickSpy).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
        expect(eventSropPropaginationSpy).toHaveBeenCalled();
        expect(removeClickSpy).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
    });
});
