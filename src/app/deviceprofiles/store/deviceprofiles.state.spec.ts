import {
    DeviceprofilesState,
    getDeviceprofilesBase,
    getDeviceprofilesData,
    getDeviceprofilesSelectedIndex,
    getDeviceprofilesSelectedProfile,
    getDeviceprofilesState,
    getDeviceprofilesIsSingle,
    getDeviceprofilesLoading,
    getDeviceprofilesError,
} from './deviceprofiles.state';
import { DeviceprofilesViewState } from '../models/index';
import { utils } from '../../../mock';

const createDeviceprofilesState = ({
    base = [],
    profiles = [],
    selectedIndex = 0,
    state = DeviceprofilesViewState.Empty,
    isSingle = false,
    loading = false,
    error = 'error',
} = {}): DeviceprofilesState => ({
    base,
    profiles,
    selectedIndex,
    state,
    isSingle,
    loading,
    error,
});

describe('[Deviceprofiles] store/state', () => {

    it('getDeviceprofilesBase', () => {
        const state = createDeviceprofilesState({ base: utils.deviceprofiles.getBaseDeviceProfiles() });
        expect(getDeviceprofilesBase.projector(state)).toEqual(state.base);
    });

    it('getDeviceprofilesData', () => {
        const state = createDeviceprofilesState({ profiles: utils.deviceprofiles.findByOrganizationId('00000000000000000000000000000000') });
        expect(getDeviceprofilesData.projector(state)).toEqual(state.profiles);
    });

    it('getDeviceprofilesSelectedIndex', () => {
        const state = createDeviceprofilesState({ selectedIndex: 3 });
        expect(getDeviceprofilesSelectedIndex.projector(state)).toEqual(state.selectedIndex);
    });

    it('getDeviceprofilesSelectedProfile', () => {
        const state = createDeviceprofilesState({
            profiles: utils.deviceprofiles.findByOrganizationId('00000000000000000000000000000000'),
            selectedIndex: 1
        });
        expect(getDeviceprofilesSelectedProfile.projector(state)).toEqual(state.profiles[state.selectedIndex]);
        const state2 = createDeviceprofilesState({
            profiles: [],
            selectedIndex: 1
        });
        expect(getDeviceprofilesSelectedProfile.projector(state2)).toEqual(null);
        const state3 = createDeviceprofilesState({
            profiles: null,
            selectedIndex: 1
        });
        expect(getDeviceprofilesSelectedProfile.projector(state3)).toEqual(null);
        const state4 = createDeviceprofilesState({
            profiles: null,
            selectedIndex: null
        });
        expect(getDeviceprofilesSelectedProfile.projector(state4)).toEqual(null);
        const state5 = createDeviceprofilesState({
            profiles: null,
            selectedIndex: -1
        });
        expect(getDeviceprofilesSelectedProfile.projector(state5)).toEqual(null);
        const state6 = createDeviceprofilesState({
            profiles: [{}, {}],
            selectedIndex: 2
        });
        expect(getDeviceprofilesSelectedProfile.projector(state6)).toEqual(null);
    });

    it('getDeviceprofilesState', () => {
        const state = createDeviceprofilesState({ state: DeviceprofilesViewState.Error });
        expect(getDeviceprofilesState.projector(state)).toEqual(state.state);
    });

    it('getDeviceprofilesIsSingle', () => {
        const state = createDeviceprofilesState();
        expect(getDeviceprofilesIsSingle.projector(state)).toEqual(state.isSingle);
    });

    it('getDeviceprofilesLoading', () => {
        const state = createDeviceprofilesState();
        expect(getDeviceprofilesLoading.projector(state)).toEqual(state.loading);
    });

    it('getDeviceprofilesError', () => {
        const state = createDeviceprofilesState();
        expect(getDeviceprofilesError.projector(state)).toEqual(state.error);
    });

});
