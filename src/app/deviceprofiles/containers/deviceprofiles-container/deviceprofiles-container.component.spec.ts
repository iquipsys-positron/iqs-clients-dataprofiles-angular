import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IqsAskDialogData, IqsAskDialogComponent } from 'iqs-libs-clientshell2-angular';
import { TranslateModule } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';
import { PipSidenavModule, PipMediaModule, PipMediaService, MediaMainChange, PipSidenavService } from 'pip-webui2-layouts';
import { PipNavService } from 'pip-webui2-nav';
import { BehaviorSubject } from 'rxjs';

import { IqsDeviceprofilesContainerComponent } from './deviceprofiles-container.component';
import { IqsDeviceprofilesContainerModule } from './deviceprofiles-container.module';
import { DeviceprofilesViewState, DeviceProfile } from '../../models';
import { IqsDeviceprofilesService } from '../../services';
import { IqsDeviceprofilesServiceMock, IqsDataprofilesServiceMock } from '../../../../mock';
import { IqsDataprofilesService } from '../../../dataprofiles';
import {
    IqsDeviceprofilesSelectBaseDialogData,
    IqsDeviceprofilesSelectBaseDialogComponent
} from '../../components/select-base-dialog/select-base-dialog.component';

describe('[Deviceprofiles] containers/deviceprofiles-container', () => {

    const org_id = '00000000000000000000000000000000';
    let component: IqsDeviceprofilesContainerComponent;
    let fixture: ComponentFixture<IqsDeviceprofilesContainerComponent>;
    let deviceprofilesService: IqsDeviceprofilesServiceMock;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                RouterTestingModule,
                TranslateModule.forRoot(),

                PipMediaModule.forRoot(),
                PipSidenavModule.forRoot(),

                IqsDeviceprofilesContainerModule
            ],
            providers: [
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
        deviceprofilesService = TestBed.get(IqsDeviceprofilesService);
        deviceprofilesService.init({ org_id });
        fixture = TestBed.createComponent(IqsDeviceprofilesContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate if selected profile changed', fakeAsync(() => {
        const location: Location = TestBed.get(Location);
        deviceprofilesService.selectedIndex = 1;
        tick(10);
        expect(location.path()).toBe('/?single=' + (deviceprofilesService.isSingle ? 'true' : 'false') +
            '&profile_id=' + deviceprofilesService.selectedProfile.id + '&state=' + deviceprofilesService.state);
    }));

    it('should init', async () => {
        const media: PipMediaService = TestBed.get(PipMediaService);
        spyOn(media, 'isMainActive').and.callFake(val => {
            if (val === 'xs') {
                return true;
            }
            return media.isMainActive(val);
        });
        const changeSingleSpy = spyOn(deviceprofilesService, 'changeSingle').and.callThrough();
        const subsUndubscribeSpy = spyOn((<any>component).subs, 'unsubscribe');
        component.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(changeSingleSpy).toHaveBeenCalledWith(false);
        component.ngOnDestroy();
        expect(subsUndubscribeSpy).toHaveBeenCalled();
    });

    it('should change icon with single and nav with state', async () => {
        const media: PipMediaService = TestBed.get(PipMediaService);
        const nav: PipNavService = TestBed.get(PipNavService);
        const sidenav: PipSidenavService = TestBed.get(PipSidenavService);
        const changeSingleSpy = spyOn(deviceprofilesService, 'changeSingle').and.callThrough();
        const restoreIconSpy = spyOn(<any>component, 'restoreIcon').and.callThrough();
        const showBackIconSpy = spyOn(<any>component, 'showBackIcon').and.callThrough();
        const showIconSpy = spyOn(nav, 'showNavIcon').and.callThrough();
        const cancelSpy = spyOn(component, 'cancel');
        const openCancelDialogSpy = spyOn(component, 'openCancelDialog');
        const showBreadcrumbSpy = spyOn(nav, 'showBreadcrumb').and.callThrough();
        const toggleOpenedSpy = spyOn(sidenav, 'toggleOpened');
        spyOn(media, 'isMainActive').and.callFake(val => {
            if (val === 'xs') {
                return true;
            }
            return media.isMainActive(val);
        });
        component.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();
        deviceprofilesService.isSingle = true;
        expect(showBackIconSpy).toHaveBeenCalled();
        expect(showIconSpy).toHaveBeenCalled();

        showIconSpy.calls.mostRecent().args[0].action();
        expect(cancelSpy).toHaveBeenCalled();
        deviceprofilesService.state = DeviceprofilesViewState.Edit;
        showIconSpy.calls.mostRecent().args[0].action();
        expect(openCancelDialogSpy).toHaveBeenCalled();
        deviceprofilesService.isSingle = false;
        expect(restoreIconSpy).toHaveBeenCalled();
        showIconSpy.calls.mostRecent().args[0].action();
        expect(toggleOpenedSpy).toHaveBeenCalled();
        deviceprofilesService.state = DeviceprofilesViewState.Edit;
        expect(showBreadcrumbSpy).toHaveBeenCalledWith({
            items: [{ title: 'DEVICEPROFILES_TITLE' }]
        });
        changeSingleSpy.calls.reset();
        deviceprofilesService.state = DeviceprofilesViewState.Create;
        expect(showBreadcrumbSpy).toHaveBeenCalledWith({
            items: [{ title: 'DEVICEPROFILES_TITLE_CREATE' }]
        });
        expect(changeSingleSpy).toHaveBeenCalledWith(true);
        deviceprofilesService.state = DeviceprofilesViewState.Error;
        expect(showBreadcrumbSpy).toHaveBeenCalledWith({
            items: [{ title: 'DEVICEPROFILES_TITLE' }]
        });
    });

    it('should change single on media changes', async () => {
        const media: PipMediaService = TestBed.get(PipMediaService);
        const changeSingleSpy = spyOn(deviceprofilesService, 'changeSingle').and.callThrough();
        const restoreIconSpy = spyOn(<any>component, 'restoreIcon');
        const showBackIconSpy = spyOn(<any>component, 'showBackIcon').and.callThrough();
        const mediaMock$ = new BehaviorSubject<MediaMainChange>({ aliases: [] });
        spyOn(media, 'asObservableMain').and.returnValue(mediaMock$.asObservable());
        component.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();
        deviceprofilesService.isSingle = true;
        expect(showBackIconSpy).toHaveBeenCalled();
        fixture.detectChanges();
        await fixture.whenStable();
        restoreIconSpy.calls.reset();
        mediaMock$.next({ aliases: ['md', 'lg'] });
        expect(restoreIconSpy).toHaveBeenCalled();
        expect(changeSingleSpy).toHaveBeenCalledWith(false);
        deviceprofilesService.isSingle = false;
        deviceprofilesService.state = DeviceprofilesViewState.Edit;
        mediaMock$.next({ aliases: ['xs'] });
        expect(changeSingleSpy).toHaveBeenCalledWith(true);
        deviceprofilesService.state = DeviceprofilesViewState.Empty;
        mediaMock$.next({ aliases: ['xs'] });
        expect(changeSingleSpy).toHaveBeenCalledWith(false);
    });

    it('should init add', async () => {
        const dialog: MatDialog = TestBed.get(MatDialog);
        const joc = jasmine.objectContaining;
        const dialogSpy = spyOn(dialog, 'open').and.callThrough();
        const changeStateSpy = spyOn(deviceprofilesService, 'changeState');
        const data: IqsDeviceprofilesSelectBaseDialogData = {
            profiles$: deviceprofilesService.baseDeviceprofiles$
        };
        component.initAdd();
        expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesSelectBaseDialogComponent, joc({ data: joc(data) }));
        let ref: MatDialogRef<IqsDeviceprofilesSelectBaseDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        ref.close();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(changeStateSpy).not.toHaveBeenCalled();
        const keys = ['commands', 'config', 'events', 'gateways', 'params'];
        for (const bp of deviceprofilesService.baseDeviceprofiles) {
            component.initAdd();
            expect(dialogSpy).toHaveBeenCalledWith(IqsDeviceprofilesSelectBaseDialogComponent, joc({ data: joc(data) }));
            ref = dialogSpy.calls.mostRecent().returnValue;
            ref.close(bp);
            fixture.detectChanges();
            await fixture.whenRenderingDone();
            const expectedNewDeviceProfile = new DeviceProfile();
            expectedNewDeviceProfile.base_profile_id = bp.id;
            for (const key of keys) {
                expectedNewDeviceProfile[key] = cloneDeep(bp[key]);
            }
            expect(changeStateSpy).toHaveBeenCalledWith(DeviceprofilesViewState.Create);
            expect(component.newDeviceProfile).toEqual(expectedNewDeviceProfile);
        }
    });

    it('should select', async () => {
        const media: PipMediaService = TestBed.get(PipMediaService);
        const dialog: MatDialog = TestBed.get(MatDialog);
        const joc = jasmine.objectContaining;
        const dialogSpy = spyOn(dialog, 'open').and.callThrough();
        const selectByIndexSpy = spyOn(deviceprofilesService, 'selectbyIndex');
        const changeSingleSpy = spyOn(deviceprofilesService, 'changeSingle').and.callThrough();
        const showBackIconSpy = spyOn(<any>component, 'showBackIcon').and.callThrough();
        spyOn(media, 'isMainActive').and.callFake(val => {
            if (val === 'xs') {
                return false;
            }
            if (val === 'sm') {
                return true;
            }
            return media.isMainActive(val);
        });
        component.select(5);
        expect(changeSingleSpy).toHaveBeenCalledWith(true);
        expect(showBackIconSpy).toHaveBeenCalled();
        expect(selectByIndexSpy).toHaveBeenCalledWith(5);
        const data = <IqsAskDialogData>{
            title: 'DEVICEPROFILES_CANCEL_DIALOG_TITLE',
            content: [
                'DEVICEPROFILES_CANCEL_DIALOG_CONTENT'
            ],
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
        const selectSpy = spyOn(component, 'select');
        component.openSelectDialog(4);
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data: joc(data) }));
        let ref: MatDialogRef<IqsAskDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        ref.close();
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(selectSpy).not.toHaveBeenCalled();
        component.openSelectDialog(4);
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data: joc(data) }));
        ref = dialogSpy.calls.mostRecent().returnValue;
        ref.close(true);
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(selectSpy).toHaveBeenCalledWith(4);
        selectSpy.calls.reset();
        const openSelectDialogSpy = spyOn(component, 'openSelectDialog');
        deviceprofilesService.state = DeviceprofilesViewState.Edit;
        component.onSelect(3);
        expect(openSelectDialogSpy).toHaveBeenCalledWith(3);
        deviceprofilesService.state = DeviceprofilesViewState.View;
        component.onSelect(3);
        expect(openSelectDialogSpy).toHaveBeenCalledTimes(1);
        expect(selectSpy).toHaveBeenCalledWith(3);
    });

    it('should change state on edit', () => {
        const changeStateSpy = spyOn(deviceprofilesService, 'changeState');
        component.onEdit();
        expect(changeStateSpy).toHaveBeenCalledWith(DeviceprofilesViewState.Edit);
    });

    it('should call reset', async () => {
        const dialog: MatDialog = TestBed.get(MatDialog);
        const dialogSpy = spyOn(dialog, 'open').and.callThrough();
        const joc = jasmine.objectContaining;
        const resetSpy = spyOn(deviceprofilesService, 'reset');
        const data = <IqsAskDialogData>{
            title: 'DEVICEPROFILES_RESET_DIALOG_TITLE',
            content: [
                'DEVICEPROFILES_RESET_DIALOG_CONTENT'
            ],
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
        component.onReset();
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data: joc(data) }));
        let ref: MatDialogRef<IqsAskDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        ref.close();
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(resetSpy).not.toHaveBeenCalled();
        component.onReset();
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data: joc(data) }));
        ref = dialogSpy.calls.mostRecent().returnValue;
        ref.close(true);
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(resetSpy).toHaveBeenCalled();
    });

    it('should call delete', async () => {
        const dialog: MatDialog = TestBed.get(MatDialog);
        const dialogSpy = spyOn(dialog, 'open').and.callThrough();
        const joc = jasmine.objectContaining;
        const deleteSpy = spyOn(deviceprofilesService, 'delete');
        const data = <IqsAskDialogData>{
            title: 'DEVICEPROFILES_DELETE_DIALOG_TITLE',
            content: [
                'DEVICEPROFILES_DELETE_DIALOG_CONTENT'
            ],
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
        component.onDelete(deviceprofilesService.deviceprofiles[0].id);
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data: joc(data) }));
        let ref: MatDialogRef<IqsAskDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        ref.close();
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(deleteSpy).not.toHaveBeenCalled();
        component.onDelete(deviceprofilesService.deviceprofiles[0].id);
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data: joc(data) }));
        ref = dialogSpy.calls.mostRecent().returnValue;
        ref.close(true);
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(deleteSpy).toHaveBeenCalled();
    });

    it('should call save', () => {
        const createSpy = spyOn(deviceprofilesService, 'create').and.callFake(() => { deviceprofilesService.loading = true; });
        const updateSpy = spyOn(deviceprofilesService, 'update').and.callFake(() => { deviceprofilesService.loading = true; });
        const changeStateSpy = spyOn(deviceprofilesService, 'changeState');
        component.onSave({ id: 'some id', profile: { id: '', name: 'test', org_id: org_id, base_profile_id: 'custom' } });
        expect(updateSpy).toHaveBeenCalled();
        expect(changeStateSpy).not.toHaveBeenCalled();
        deviceprofilesService.loading = false;
        expect(changeStateSpy).toHaveBeenCalled();

        changeStateSpy.calls.reset();
        component.onSave({ id: undefined, profile: { id: '', name: 'test', org_id: org_id, base_profile_id: 'custom' } });
        expect(createSpy).toHaveBeenCalled();
        expect(changeStateSpy).not.toHaveBeenCalled();
        deviceprofilesService.loading = false;
        expect(changeStateSpy).toHaveBeenCalled();
    });

    it('should cancel', async () => {
        const media: PipMediaService = TestBed.get(PipMediaService);
        const dialog: MatDialog = TestBed.get(MatDialog);
        const joc = jasmine.objectContaining;
        const dialogSpy = spyOn(dialog, 'open').and.callThrough();
        const changeSingleSpy = spyOn(deviceprofilesService, 'changeSingle').and.callThrough();
        const changeStateSpy = spyOn(deviceprofilesService, 'changeState').and.callThrough();
        spyOn(media, 'isMainActive').and.callFake(val => {
            if (val === 'xs') {
                return false;
            }
            if (val === 'sm') {
                return true;
            }
            return media.isMainActive(val);
        });
        await fixture.whenRenderingDone();
        const deviceprofilesDetailsSpy = spyOn(component.deviceprofilesDetails, 'cancelChanges');
        component.cancel();
        expect(changeSingleSpy).toHaveBeenCalledWith(false);
        expect(deviceprofilesDetailsSpy).toHaveBeenCalled();
        expect(changeStateSpy).toHaveBeenCalledWith(DeviceprofilesViewState.View);
        const cancelSpy = spyOn(component, 'cancel');
        const data = <IqsAskDialogData>{
            title: 'DEVICEPROFILES_CANCEL_DIALOG_TITLE',
                content: [
                    'DEVICEPROFILES_CANCEL_DIALOG_CONTENT'
                ],
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
        component.openCancelDialog();
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data: joc(data) }));
        let ref: MatDialogRef<IqsAskDialogComponent> = dialogSpy.calls.mostRecent().returnValue;
        ref.close();
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(cancelSpy).not.toHaveBeenCalled();
        component.openCancelDialog();
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(dialogSpy).toHaveBeenCalledWith(IqsAskDialogComponent, joc({ data: joc(data) }));
        ref = dialogSpy.calls.mostRecent().returnValue;
        ref.close(true);
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        expect(cancelSpy).toHaveBeenCalled();
        cancelSpy.calls.reset();
        const openCancelDialogSpy = spyOn(component, 'openCancelDialog');
        deviceprofilesService.state = DeviceprofilesViewState.Edit;
        component.onCancel();
        expect(openCancelDialogSpy).toHaveBeenCalled();
        deviceprofilesService.state = DeviceprofilesViewState.View;
        component.onCancel();
        expect(openCancelDialogSpy).toHaveBeenCalledTimes(1);
        expect(cancelSpy).toHaveBeenCalled();
    });

});

describe('[Deviceprofiles] containers/deviceprofiles-container', () => {

    const org_id = '00000000000000000000000000000000';
    let component: IqsDeviceprofilesContainerComponent;
    let fixture: ComponentFixture<IqsDeviceprofilesContainerComponent>;
    let deviceprofilesService: IqsDeviceprofilesServiceMock;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                RouterTestingModule,
                TranslateModule.forRoot(),

                PipMediaModule.forRoot(),
                PipSidenavModule.forRoot(),

                IqsDeviceprofilesContainerModule
            ],
            providers: [
                {
                    provide: IqsDataprofilesService,
                    useClass: IqsDataprofilesServiceMock
                },
                {
                    provide: IqsDeviceprofilesService,
                    useClass: IqsDeviceprofilesServiceMock
                },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { queryParams: { state: 'edit' } } }
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        deviceprofilesService = TestBed.get(IqsDeviceprofilesService);
        deviceprofilesService.init({ org_id });
        fixture = TestBed.createComponent(IqsDeviceprofilesContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should init with custom state', async () => {
        const media: PipMediaService = TestBed.get(PipMediaService);
        const isMainActiveSpy = spyOn(media, 'isMainActive').and.callFake(val => {
            if (val === 'xs') {
                return true;
            }
            return media.isMainActive(val);
        });
        const changeSingleSpy = spyOn(deviceprofilesService, 'changeSingle');
        component.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(changeSingleSpy).toHaveBeenCalledWith(true);
    });
});
