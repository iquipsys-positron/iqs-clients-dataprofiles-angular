import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';

import { IqsDeviceprofilesParamsListComponent } from './params-list.component';
import { IqsDeviceprofilesParamsListModule } from './params-list.module';
import { IqsDataprofilesTranslateService, IqsDataprofilesService, DataprofileListItem } from '../../../dataprofiles';
import { utils, IqsDataprofilesServiceMock } from '../../../../mock';
import { DeviceProfileParamsListType, DeviceProfile, ActuatorCommand, SensorEvent, SensorParameter, ConfigParameter } from '../../models';

describe('[Deviceprofiles] components/params-list', () => {

    const organization_id = '00000000000000000000000000000000';
    let component: IqsDeviceprofilesParamsListComponent;
    let fixture: ComponentFixture<IqsDeviceprofilesParamsListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),

                IqsDeviceprofilesParamsListModule
            ],
            providers: [
                IqsDataprofilesTranslateService,
                {
                    provide: IqsDataprofilesService,
                    useClass: IqsDataprofilesServiceMock
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const dataprofilesService: IqsDataprofilesServiceMock = TestBed.get(IqsDataprofilesService);
        dataprofilesService.init({ organization_id });
        fixture = TestBed.createComponent(IqsDeviceprofilesParamsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should react for changes', async () => {
        const deviceprofile: DeviceProfile = cloneDeep(utils.deviceprofiles.findByOrganizationId(organization_id)[0]);
        const testCases = [
            {
                type: DeviceProfileParamsListType.Command,
                params: <ActuatorCommand[]>[
                    { id: 1, type: 1, min_value: 0, max_value: 4 },
                    { type: 1, min_value: 0 },
                    { name: 'test command', type: 1, max_value: 4 },
                    { id: 2, type: 1000, scale: 2 },
                    { id: 3, type: 1000, offset: 3 },
                    { id: 4, type: 1000, scale: 2, offset: 3 },
                ],
                expected: [
                    Object.assign(new DataprofileListItem(),
                        { id: 1, title: '1', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES0 - 4' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: undefined, title: '+', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES> 0' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: undefined, title: '+. test command', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES< 4' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 2, title: '2', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES(*) * 2' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 3, title: '3', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES* + 3' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 4, title: '4', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES(*) * 2 + 3' }
                    )
                ]
            },
            {
                type: DeviceProfileParamsListType.Event,
                params: <SensorEvent[]>[
                    { id: 1, type: 1, min_value: 0, max_value: 4 },
                    { type: 1, min_value: 0 },
                    { name: 'test event', type: 1, max_value: 4 },
                    { id: 2, type: 1000, scale: 2 },
                    { id: 3, type: 1000, offset: 3 },
                    { id: 4, type: 1000, scale: 2, offset: 3 },
                ],
                expected: [
                    Object.assign(new DataprofileListItem(),
                        { id: 1, title: '1', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES0 - 4' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: undefined, title: '+', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES> 0' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: undefined, title: '+. test event', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES< 4' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 2, title: '2', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES(*) * 2' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 3, title: '3', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES* + 3' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 4, title: '4', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES(*) * 2 + 3' }
                    )
                ]
            },
            {
                type: DeviceProfileParamsListType.Parameter,
                params: <SensorParameter[]>[
                    { id: 1, type: 1, min_value: 0, max_value: 4 },
                    { type: 1, min_value: 0 },
                    { name: 'test event', type: 1, max_value: 4 },
                    { id: 2, type: 1000, scale: 2 },
                    { id: 3, type: 1000, offset: 3 },
                    { id: 4, type: 1000, scale: 2, offset: 3 },
                ],
                expected: [
                    Object.assign(new DataprofileListItem(),
                        { id: 1, title: '1', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES0 - 4' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: undefined, title: '+', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES> 0' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: undefined, title: '+. test event', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES< 4' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 2, title: '2', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES(*) * 2' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 3, title: '3', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES* + 3' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 4, title: '4', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES(*) * 2 + 3' }
                    )
                ]
            },
            {
                type: DeviceProfileParamsListType.Config,
                params: <ConfigParameter[]>[
                    { id: 1, type: 1, min_value: 0, max_value: 4 },
                    { type: 1, min_value: 0 },
                    { name: 'test event', type: 1, max_value: 4 },
                    { id: 2, type: 1000, scale: 2 },
                    { id: 3, type: 1000, offset: 3 },
                    { id: 4, type: 1000, scale: 2, offset: 3 },
                ],
                expected: [
                    Object.assign(new DataprofileListItem(),
                        { id: 1, title: '1', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES0 - 4' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: undefined, title: '+', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES> 0' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: undefined, title: '+. test event', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES< 4' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 2, title: '2', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES(*) * 2' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 3, title: '3', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES* + 3' }
                    ),
                    Object.assign(new DataprofileListItem(),
                        { id: 4, title: '4', subtitle: 'DEVICEPROFILES_DISPLAYED_ON. DEVICEPROFILES_VALUES(*) * 2 + 3' }
                    )
                ]
            },
        ];
        for (const c of testCases) {
            component.type = c.type;
            component.ngOnChanges({
                type: new SimpleChange(null, c.type, true)
            });
            fixture.detectChanges();
            await fixture.whenStable();
            component = fixture.componentInstance;
            component.parameters = c.params;
            component.ngOnChanges({
                parameters: new SimpleChange(null, c.params, true)
            });
            fixture.detectChanges();
            await fixture.whenStable();
            component = fixture.componentInstance;
            expect(component.params).toEqual(c.expected);
        }
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
