import { createFeatureSelector, createSelector } from '@ngrx/store';

import { BaseDeviceProfile, DeviceProfile, DeviceprofilesViewState } from '../models';

export interface DeviceprofilesState {
    base: BaseDeviceProfile[];
    profiles: DeviceProfile[];
    selectedIndex: number;
    state: DeviceprofilesViewState;
    isSingle: boolean;
    loading: boolean;
    error: any;
}

export const getDeviceprofilesStoreState = createFeatureSelector<DeviceprofilesState>('deviceprofiles');

export const getDeviceprofilesBase = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.base);
export const getDeviceprofilesData = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.profiles);
export const getDeviceprofilesSelectedIndex = createSelector(getDeviceprofilesStoreState,
    (state: DeviceprofilesState) => state.selectedIndex
);
export const getDeviceprofilesSelectedProfile = createSelector(getDeviceprofilesStoreState,
    (state: DeviceprofilesState) => {
        if (!state.profiles || !state.profiles.length || state.selectedIndex === null
            || state.selectedIndex < 0 || state.selectedIndex > state.profiles.length - 1) { return null; }
        return state.profiles[state.selectedIndex];
    }
);
export const getDeviceprofilesState = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.state);
export const getDeviceprofilesIsSingle = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.isSingle);
export const getDeviceprofilesLoading = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.loading);
export const getDeviceprofilesError = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.error);
