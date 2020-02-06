import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import cloneDeep from 'lodash/cloneDeep';
import sample from 'lodash/sample';

import * as fromDeviceprofilesActions from './deviceprofiles.actions';
import { deviceprofilesInitialState, deviceprofilesReducer } from './deviceprofiles.reducer';
import { DeviceprofilesViewState, DeviceProfile, BaseDeviceProfile } from '../models/index';
import { utils } from '../../../mock';

describe('[Deviceprofiles] store/reducer', () => {

    let baseDeviceprofiles: BaseDeviceProfile[];
    let deviceprofiles: DeviceProfile[];

    beforeEach(() => {
        resetToCurrentDefault();
        baseDeviceprofiles = cloneDeep(utils.deviceprofiles.getBaseDeviceProfiles());
        deviceprofiles = cloneDeep(utils.deviceprofiles.findByOrganizationId('00000000000000000000000000000000'));
    });

    it('should have initial state', () => {
        expect(deviceprofilesReducer(undefined, { type: null })).toEqual(deviceprofilesInitialState);
        expect(deviceprofilesReducer(deviceprofilesInitialState, { type: null })).toEqual(deviceprofilesInitialState);
    });

    it('should reduce deviceprofiles states', () => {
        const joc = jasmine.objectContaining;
        expect(deviceprofilesReducer({
            ...deviceprofilesInitialState,
            error: 'error',
            state: DeviceprofilesViewState.Error,
            loading: true
        }, new fromDeviceprofilesActions.DeviceprofilesInitAction()))
            .toEqual(joc({ error: null, state: DeviceprofilesViewState.Progress, loading: false }));
        expect(deviceprofilesReducer({
            ...deviceprofilesInitialState,
            error: 'error',
            loading: true
        },
            new fromDeviceprofilesActions.DeviceprofilesSuccessAction({ base: baseDeviceprofiles, profiles: deviceprofiles })))
            .toEqual(joc({ base: baseDeviceprofiles, profiles: deviceprofiles, error: null, loading: false }));
        expect(deviceprofilesReducer(deviceprofilesInitialState,
            new fromDeviceprofilesActions.DeviceprofilesFailureAction({ error: 'error' })))
            .toEqual(joc({ error: 'error', loading: false }));
    });

    it('should reduce change and select states', () => {
        const joc = jasmine.objectContaining;
        expect(deviceprofilesReducer(deviceprofilesInitialState,
            new fromDeviceprofilesActions.DeviceprofilesChangeSingleAction({ single: true })))
            .toEqual(joc({ isSingle: true }));
        expect(deviceprofilesReducer(deviceprofilesInitialState,
            new fromDeviceprofilesActions.DeviceprofilesSelectAction({ id: '', idx: 11 })))
            .toEqual(joc({ selectedIndex: 11 }));
        expect(deviceprofilesReducer(deviceprofilesInitialState,
            new fromDeviceprofilesActions.DeviceprofilesChangeStateAction({ state: DeviceprofilesViewState.Progress })))
            .toEqual(joc({ state: DeviceprofilesViewState.Progress }));
    });

    it('should reduce create deviceprofiles', () => {
        const joc = jasmine.objectContaining;
        const dp = cloneDeep(sample(deviceprofiles));
        delete dp.id;
        expect(deviceprofilesReducer({
            ...deviceprofilesInitialState,
            error: 'error'
        }, new fromDeviceprofilesActions.DeviceprofilesCreateAction({ profile: dp })))
            .toEqual(joc({ loading: true, error: null }));
        expect(deviceprofilesReducer({
            ...deviceprofilesInitialState,
            loading: true,
            error: 'error'
        }, new fromDeviceprofilesActions.DeviceprofilesCreateSuccessAction({ profile: dp })))
            .toEqual(joc({ profiles: [dp], loading: false, error: null }));
        expect(deviceprofilesReducer({
            ...deviceprofilesInitialState,
            loading: true
        }, new fromDeviceprofilesActions.DeviceprofilesCreateFailureAction({ error: 'error' })))
            .toEqual(joc({ error: 'error', loading: false }));
    });

    it('should reduce update deviceprofiles', () => {
        const joc = jasmine.objectContaining;
        const dp: DeviceProfile = cloneDeep(sample(deviceprofiles));
        const state = {
            ...deviceprofilesInitialState,
            profiles: deviceprofiles
        };
        dp.name = 'test';
        const idx = deviceprofiles.findIndex(d => d.id === dp.id);
        const updatedDeviceprofiles = cloneDeep(deviceprofiles);
        updatedDeviceprofiles[idx] = dp;
        expect(deviceprofilesReducer({
            ...state,
            loading: false,
            error: 'error'
        }, new fromDeviceprofilesActions.DeviceprofilesUpdateAction({ id: dp.id, profile: dp })))
            .toEqual(joc({ loading: true, error: null }));
        expect(deviceprofilesReducer({
            ...state,
            loading: true,
            error: 'error'
        }, new fromDeviceprofilesActions.DeviceprofilesUpdateSuccessAction({ id: dp.id, profile: dp })))
            .toEqual(joc({ profiles: updatedDeviceprofiles, loading: false, error: null }));
        expect(deviceprofilesReducer({
            ...state,
            loading: true
        }, new fromDeviceprofilesActions.DeviceprofilesUpdateFailureAction({ error: 'error' })))
            .toEqual(joc({ error: 'error', loading: false }));
    });

    it('should reduce delete deviceprofiles', () => {
        const joc = jasmine.objectContaining;
        const dp1: DeviceProfile = cloneDeep(deviceprofiles[0]);
        const dp2: DeviceProfile = cloneDeep(deviceprofiles[1]);
        const state = {
            ...deviceprofilesInitialState,
            profiles: deviceprofiles
        };
        expect(deviceprofilesReducer({
            ...state,
            loading: false,
            error: 'error'
        }, new fromDeviceprofilesActions.DeviceprofilesDeleteAction({ id: dp1.id })))
            .toEqual(joc({ loading: true, error: null }));
        // delete last
        expect(deviceprofilesReducer({
            ...deviceprofilesInitialState,
            profiles: [dp1],
            loading: true,
            error: 'error',
            state: DeviceprofilesViewState.Edit
        }, new fromDeviceprofilesActions.DeviceprofilesDeleteSuccessAction({ id: dp1.id })))
            .toEqual(joc({ profiles: [], loading: false, error: null, state: DeviceprofilesViewState.Empty }));
        // delete not found
        expect(deviceprofilesReducer({
            ...state,
            loading: true,
            error: 'error',
            state: DeviceprofilesViewState.Edit
        }, new fromDeviceprofilesActions.DeviceprofilesDeleteSuccessAction({ id: 'bad id' })))
            .toEqual(joc({ profiles: deviceprofiles, loading: false, error: null, state: DeviceprofilesViewState.View }));
        // delete normally from idx = 1
        expect(deviceprofilesReducer({
            ...state,
            loading: true,
            error: 'error',
            state: DeviceprofilesViewState.Edit,
            selectedIndex: 1
        }, new fromDeviceprofilesActions.DeviceprofilesDeleteSuccessAction({ id: dp2.id })))
            .toEqual(joc({
                profiles: deviceprofiles.filter(dp => dp.id !== dp2.id),
                loading: false,
                error: null,
                state: DeviceprofilesViewState.View,
                selectedIndex: 0
            }));
        // delete normally from idx = 0
        expect(deviceprofilesReducer({
            ...state,
            loading: true,
            error: 'error',
            state: DeviceprofilesViewState.Edit,
            selectedIndex: 0
        }, new fromDeviceprofilesActions.DeviceprofilesDeleteSuccessAction({ id: dp1.id })))
            .toEqual(joc({
                profiles: deviceprofiles.filter(dp => dp.id !== dp1.id),
                loading: false,
                error: null,
                state: DeviceprofilesViewState.View,
                selectedIndex: 0
            }));
        expect(deviceprofilesReducer({
            ...deviceprofilesInitialState,
            loading: true
        }, new fromDeviceprofilesActions.DeviceprofilesDeleteFailureAction({ error: 'error' })))
            .toEqual(joc({ error: 'error', loading: false }));
    });

});
