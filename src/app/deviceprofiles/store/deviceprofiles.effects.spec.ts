import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { IqsDeviceprofilesEffects } from './deviceprofiles.effects';
import * as fromDeviceprofilesActions from './deviceprofiles.actions';
import { DeviceprofilesViewState } from '../models';
import { IqsDeviceprofilesDataService } from '../services';
import { utils, IqsDeviceprofilesDataServiceMock } from '../../../mock';

describe('[Deviceprofiles] store/effects', () => {

    const org_id = '00000000000000000000000000000000';
    const error = 'custom error';
    let effects: IqsDeviceprofilesEffects;
    let actions: Observable<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                IqsDeviceprofilesEffects,
                provideMockActions(() => actions),
                {
                    provide: IqsDeviceprofilesDataService,
                    useClass: IqsDeviceprofilesDataServiceMock
                },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { queryParams: {} } }
                }
            ],
        });

        effects = TestBed.get(IqsDeviceprofilesEffects);
        resetToCurrentDefault();
        const ds: IqsDeviceprofilesDataServiceMock = TestBed.get(IqsDeviceprofilesDataService);
        ds.init({ org_id, error });
    });

    it('deviceprofiles$', () => {
        const expectedBaseDeviceprofiles = utils.deviceprofiles.getBaseDeviceProfiles();
        const expectedDeviceprofiles = utils.deviceprofiles.findByOrganizationId(org_id);
        const ds: IqsDeviceprofilesDataServiceMock = TestBed.get(IqsDeviceprofilesDataService);
        const action = new fromDeviceprofilesActions.DeviceprofilesInitAction();
        const completion = new fromDeviceprofilesActions.DeviceprofilesSuccessAction({
            base: expectedBaseDeviceprofiles,
            profiles: expectedDeviceprofiles
        });

        actions = hot('--a|', { a: action });
        let expected = cold('--b|', { b: completion });

        expect(effects.deviceprofiles$).toBeObservable(expected);
        spyOn(ds, 'readDeviceProfiles').and.callFake(ds.throwError);
        const completion_fail = new fromDeviceprofilesActions.DeviceprofilesFailureAction({ error });

        actions = hot('--a|', { a: action });
        expected = cold('-----b|', { b: completion_fail });
        expect(effects.deviceprofiles$).toBeObservable(expected);
    });

    it('deviceprofilesSuccess$', () => {
        // without query params
        const expectedBaseDeviceprofiles = utils.deviceprofiles.getBaseDeviceProfiles();
        const expectedDeviceprofiles = utils.deviceprofiles.findByOrganizationId(org_id);
        let action = new fromDeviceprofilesActions.DeviceprofilesSuccessAction({
            base: expectedBaseDeviceprofiles,
            profiles: expectedDeviceprofiles
        });
        const completion_select = new fromDeviceprofilesActions.DeviceprofilesSelectAction({
            idx: 0,
            id: expectedDeviceprofiles[0].id
        });
        let completion_state = new fromDeviceprofilesActions.DeviceprofilesChangeStateAction({
            state: DeviceprofilesViewState.View
        });

        actions = hot('-a', { a: action });
        let expected = cold('-(bc)', { b: completion_select, c: completion_state });

        expect(effects.deviceprofilesSuccess$).toBeObservable(expected);

        // without profiles
        action = new fromDeviceprofilesActions.DeviceprofilesSuccessAction({
            base: expectedBaseDeviceprofiles,
            profiles: []
        });
        completion_state = new fromDeviceprofilesActions.DeviceprofilesChangeStateAction({
            state: DeviceprofilesViewState.Empty
        });

        actions = hot('-a', { a: action });
        expected = cold('--c', { c: completion_state });

        expect(effects.deviceprofilesSuccess$).toBeObservable(expected);
    });

    it('deviceprofilesFailure$', () => {
        const action = new fromDeviceprofilesActions.DeviceprofilesFailureAction({ error: 'error' });
        const completion = new fromDeviceprofilesActions.DeviceprofilesChangeStateAction({ state: DeviceprofilesViewState.Error });

        actions = hot('--a|', { a: action });
        const expected = cold('--b|', { b: completion });

        expect(effects.deviceprofilesFailure$).toBeObservable(expected);
    });

    it('deviceprofileCreate$', () => {
        const profile = utils.deviceprofiles.findByOrganizationId(org_id)[0];
        const ds: IqsDeviceprofilesDataServiceMock = TestBed.get(IqsDeviceprofilesDataService);
        const action = new fromDeviceprofilesActions.DeviceprofilesCreateAction({ profile });
        const completion = new fromDeviceprofilesActions.DeviceprofilesCreateSuccessAction({ profile });

        actions = hot('--a|', { a: action });
        let expected = cold('--b|', { b: completion });

        expect(effects.deviceprofileCreate$).toBeObservable(expected);
        spyOn(ds, 'createDeviceProfile').and.callFake(ds.throwError);
        const completion_fail = new fromDeviceprofilesActions.DeviceprofilesCreateFailureAction({ error });

        actions = hot('--a|', { a: action });
        expected = cold('-----b|', { b: completion_fail });
        expect(effects.deviceprofileCreate$).toBeObservable(expected);
    });

    it('deviceprofileUpdate$', () => {
        const profile = utils.deviceprofiles.findByOrganizationId(org_id)[0];
        const ds: IqsDeviceprofilesDataServiceMock = TestBed.get(IqsDeviceprofilesDataService);
        const action = new fromDeviceprofilesActions.DeviceprofilesUpdateAction({ id: profile.id, profile });
        const completion = new fromDeviceprofilesActions.DeviceprofilesUpdateSuccessAction({ id: profile.id, profile });

        actions = hot('--a|', { a: action });
        let expected = cold('--b|', { b: completion });

        expect(effects.deviceprofileUpdate$).toBeObservable(expected);
        spyOn(ds, 'updateDeviceProfile').and.callFake(ds.throwError);
        const completion_fail = new fromDeviceprofilesActions.DeviceprofilesUpdateFailureAction({ error });

        actions = hot('--a|', { a: action });
        expected = cold('-----b|', { b: completion_fail });
        expect(effects.deviceprofileUpdate$).toBeObservable(expected);
    });

    it('deviceprofileDelete$', () => {
        const profile = utils.deviceprofiles.findByOrganizationId(org_id)[0];
        const ds: IqsDeviceprofilesDataServiceMock = TestBed.get(IqsDeviceprofilesDataService);
        const action = new fromDeviceprofilesActions.DeviceprofilesDeleteAction({ id: profile.id });
        const completion = new fromDeviceprofilesActions.DeviceprofilesDeleteSuccessAction({ id: profile.id });

        actions = hot('--a|', { a: action });
        let expected = cold('--b|', { b: completion });

        expect(effects.deviceprofileDelete$).toBeObservable(expected);
        spyOn(ds, 'deleteDeviceProfile').and.callFake(ds.throwError);
        const completion_fail = new fromDeviceprofilesActions.DeviceprofilesDeleteFailureAction({ error });

        actions = hot('--a|', { a: action });
        expected = cold('-----b|', { b: completion_fail });
        expect(effects.deviceprofileDelete$).toBeObservable(expected);
    });

});

describe('[Deviceprofiles] store/effects', () => {

    const org_id = '00000000000000000000000000000000';
    const error = 'custom error';
    let effects: IqsDeviceprofilesEffects;
    let actions: Observable<any>;

    it('deviceprofilesSuccess$ with query params', () => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                IqsDeviceprofilesEffects,
                provideMockActions(() => actions),
                {
                    provide: IqsDeviceprofilesDataService,
                    useClass: IqsDeviceprofilesDataServiceMock
                },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { queryParams: { state: 'edit', profile_id: '00000000000000000000000000000001' } } }
                }
            ],
        });

        effects = TestBed.get(IqsDeviceprofilesEffects);
        resetToCurrentDefault();
        const ds: IqsDeviceprofilesDataServiceMock = TestBed.get(IqsDeviceprofilesDataService);
        ds.init({ org_id, error });
        // with query params
        const expectedBaseDeviceprofiles = utils.deviceprofiles.getBaseDeviceProfiles();
        const expectedDeviceprofiles = utils.deviceprofiles.findByOrganizationId(org_id);
        const action = new fromDeviceprofilesActions.DeviceprofilesSuccessAction({
            base: expectedBaseDeviceprofiles,
            profiles: expectedDeviceprofiles
        });
        const completion_select = new fromDeviceprofilesActions.DeviceprofilesSelectAction({
            idx: 1,
            id: expectedDeviceprofiles[1].id
        });
        const completion_state = new fromDeviceprofilesActions.DeviceprofilesChangeStateAction({
            state: DeviceprofilesViewState.Edit
        });

        actions = hot('-a', { a: action });
        const expected = cold('-(bc)', { b: completion_select, c: completion_state });

        expect(effects.deviceprofilesSuccess$).toBeObservable(expected);
    });
});
