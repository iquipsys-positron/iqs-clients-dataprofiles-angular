import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { IqsDeviceprofilesSelectBaseDialogComponent, IqsDeviceprofilesSelectBaseDialogData } from './select-base-dialog.component';
import { IqsDeviceprofilesSelectBaseDialogModule } from './select-base-dialog.module';
import { IqsDeviceprofilesHelpService } from '../../services/deviceprofiles.help.service';
import { BaseDeviceProfile } from '../../models';
import { utils } from '../../../../mock';

@Component({
    template: ''
})
class NoopComponent { }

@NgModule({
    entryComponents: [IqsDeviceprofilesSelectBaseDialogComponent],
    imports: [
        IqsDeviceprofilesSelectBaseDialogModule
    ]
})
class DialogTestModule { }

describe('[Deviceprofiles] components/select-base-dialog', () => {

    let baseProfiles$: BehaviorSubject<BaseDeviceProfile[]>;

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
                IqsDeviceprofilesHelpService,
                {
                    provide: OverlayContainer, useFactory: () => {
                        overlayContainerElement = document.createElement('div');
                        return { getContainerElement: () => overlayContainerElement };
                    }
                }
            ]
        });
        baseProfiles$ = new BehaviorSubject<BaseDeviceProfile[]>([]);
        dialog = TestBed.get(MatDialog);
        noop = TestBed.createComponent(NoopComponent);
    }));

    it('should create', () => {
        expect(dialog).toBeTruthy();
    });

    it('should open dialog and set base profile at start', () => {
        const baseProfiles = utils.deviceprofiles.getBaseDeviceProfiles();
        const ref = dialog.open(IqsDeviceprofilesSelectBaseDialogComponent, {
            data: <IqsDeviceprofilesSelectBaseDialogData>{
                profiles$: baseProfiles$.asObservable()
            }
        });
        expect(ref.componentInstance.profile).toBeFalsy();
        baseProfiles$.next(baseProfiles);
        expect(ref.componentInstance.profile).toEqual(baseProfiles[0]);
    });

    it('should change base profile', () => {
        const baseProfiles = utils.deviceprofiles.getBaseDeviceProfiles();
        noop.detectChanges();
        baseProfiles$.next(baseProfiles);
        const ref = dialog.open(IqsDeviceprofilesSelectBaseDialogComponent, {
            data: <IqsDeviceprofilesSelectBaseDialogData>{
                profiles$: baseProfiles$.asObservable()
            }
        });
        expect(ref.componentInstance.profile).toEqual(baseProfiles[0]);
        noop.detectChanges();
        const selectProfileSpy = spyOn(ref.componentInstance, 'selectProfile').and.callThrough();
        const matListItemSecond: HTMLButtonElement = overlayContainerElement.querySelector('mat-list-item:nth-of-type(2)');
        matListItemSecond.click();
        noop.detectChanges();
        expect(selectProfileSpy).toHaveBeenCalled();
        expect(ref.componentInstance.profile).toEqual(baseProfiles[1]);
    });
});
