import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { IqsDeviceprofilesListComponent } from './deviceprofiles-list.component';
import { IqsDeviceprofilesListModule } from './deviceprofiles-list.module';
import { IqsDeviceprofilesService, IqsDeviceprofilesHelpService } from '../../services';
import { IqsDeviceprofilesServiceMock } from '../../../../mock';
import { DeviceprofilesViewState } from '../../models';

describe('[Deviceprofiles] components/deviceprofiles-list', () => {

    const organization_id = '00000000000000000000000000000000';
    let component: IqsDeviceprofilesListComponent;
    let fixture: ComponentFixture<IqsDeviceprofilesListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),

                IqsDeviceprofilesListModule
            ],
            providers: [
                IqsDeviceprofilesHelpService,
                {
                    provide: IqsDeviceprofilesService,
                    useClass: IqsDeviceprofilesServiceMock
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const deviceprofilesService: IqsDeviceprofilesServiceMock = TestBed.get(IqsDeviceprofilesService);
        deviceprofilesService.init({ organization_id });
        fixture = TestBed.createComponent(IqsDeviceprofilesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change state', async () => {
        const deviceprofilesService: IqsDeviceprofilesServiceMock = TestBed.get(IqsDeviceprofilesService);
        deviceprofilesService.state = DeviceprofilesViewState.Create;
        fixture.detectChanges();
        await fixture.whenStable();
        component = fixture.componentInstance;
        let si, ds;
        component.selectedIndex$.pipe(take(1)).subscribe(idx => si = idx);
        expect(si).toEqual(0);
        component.disableSelected$.pipe(take(1)).subscribe(d => ds = d);
        expect(ds).toBeTruthy();
    });

    it('should track', () => {
        expect(component.trackById(null)).toEqual(null);
        expect(component.trackById(<any>{ id: '5' })).toEqual('5');
    });

    it('should select', () => {
        const selectSpy = spyOn(component.select, 'emit');
        component.onSelect(undefined);
        expect(selectSpy).not.toHaveBeenCalled();
        component.onSelect({});
        expect(selectSpy).not.toHaveBeenCalled();
        component.onSelect({ index: '5' });
        expect(selectSpy).toHaveBeenCalledWith('5');
    });

});
