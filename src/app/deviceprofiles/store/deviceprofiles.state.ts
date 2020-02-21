import { createFeatureSelector, createSelector } from '@ngrx/store';

import { BaseDeviceProfile, DeviceProfile, DeviceprofilesViewState } from '../models';

export interface DeviceprofilesState {
    base: BaseDeviceProfile[];
    profiles: DeviceProfile[];
    selectedId: string;
    state: DeviceprofilesViewState;
    isSingle: boolean;
    loading: boolean;
    error: any;
}

export const getDeviceprofilesStoreState = createFeatureSelector<DeviceprofilesState>('deviceprofiles');

export const getDeviceprofilesBase = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.base);
export const getDeviceprofilesData = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.profiles);
export const getDeviceprofilesSelectedId = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.selectedId);
export const getDeviceprofilesSelectedIndex = createSelector(getDeviceprofilesStoreState,
    (state: DeviceprofilesState) => {
        if (!state || !state.profiles || !state.selectedId) { return -1; }
        return state.profiles.findIndex(p => p.id === state.selectedId);
    }
);
export const getDeviceprofilesSelectedProfile = createSelector(getDeviceprofilesStoreState, getDeviceprofilesSelectedIndex,
    (state: DeviceprofilesState, idx: number) => {
        if (!state.profiles || !state.profiles.length || idx < 0 || idx > state.profiles.length - 1) { return null; }
        return state.profiles[idx];
    }
);
export const getDeviceprofilesState = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.state);
export const getDeviceprofilesIsSingle = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.isSingle);
export const getDeviceprofilesLoading = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.loading);
export const getDeviceprofilesError = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.error);
