import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState } from 'iqs-libs-clientshell2-angular';

import { DataProfile } from '../models/index';

export interface DataprofilesState {
    dataprofiles: DataProfile;
    state: EntityState;
    error: any;
}

export const getDataprofilesStoreState = createFeatureSelector<DataprofilesState>('dataprofiles');

export const getDataprofilesData = createSelector(getDataprofilesStoreState, (state: DataprofilesState) => state.dataprofiles);
export const getDataprofilesState = createSelector(getDataprofilesStoreState, (state: DataprofilesState) => state.state);
export const getDataprofilesError = createSelector(getDataprofilesStoreState, (state: DataprofilesState) => state.error);
