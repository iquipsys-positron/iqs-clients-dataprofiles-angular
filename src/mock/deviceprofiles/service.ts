import { Injectable } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import * as utils from '../utility';
import { DeviceProfile, DeviceprofilesViewState, BaseDeviceProfile } from '../../app/deviceprofiles/models';

@Injectable()
export class IqsDeviceprofilesServiceMock {

    private _baseDeviceprofiles$: BehaviorSubject<BaseDeviceProfile[]>;
    private _deviceprofiles$: BehaviorSubject<DeviceProfile[]>;
    private _isSingle$: BehaviorSubject<boolean>;
    private _loading$: BehaviorSubject<boolean>;
    private _selectedIndex$: BehaviorSubject<number>;
    private _state$: BehaviorSubject<DeviceprofilesViewState>;
    private _error$: BehaviorSubject<any>;
    private organization_id: string;

    constructor() {
        this._baseDeviceprofiles$ = new BehaviorSubject([]);
        this._deviceprofiles$ = new BehaviorSubject([]);
        this._isSingle$ = new BehaviorSubject(false);
        this._loading$ = new BehaviorSubject(false);
        this._selectedIndex$ = new BehaviorSubject(null);
        this._state$ = new BehaviorSubject(DeviceprofilesViewState.View);
        this._error$ = new BehaviorSubject(null);
    }

    public init(payload?: {
        organization_id: string
    }): void {
        this.organization_id = payload && payload.organization_id || '00000000000000000000000000000000';
        this._baseDeviceprofiles$.next(utils.deviceprofiles.getBaseDeviceProfiles());
        this._deviceprofiles$.next(utils.deviceprofiles.findByOrganizationId(this.organization_id));
        this.state = DeviceprofilesViewState.View;
    }

    public get baseDeviceprofiles$(): Observable<BaseDeviceProfile[]> {
        return this._baseDeviceprofiles$.asObservable();
    }

    public get baseDeviceprofiles(): BaseDeviceProfile[] {
        return this._baseDeviceprofiles$.getValue();
    }

    public set baseDeviceprofiles(val: BaseDeviceProfile[]) {
        this._baseDeviceprofiles$.next(val);
    }

    public get deviceprofiles$(): Observable<DeviceProfile[]> {
        return this._deviceprofiles$.asObservable();
    }

    public get deviceprofiles(): DeviceProfile[] {
        return this._deviceprofiles$.getValue();
    }

    public set deviceprofiles(val: DeviceProfile[]) {
        this._deviceprofiles$.next(val);
    }

    public get isSingle$(): Observable<boolean> {
        return this._isSingle$.asObservable();
    }

    public get isSingle(): boolean {
        return this._isSingle$.getValue();
    }

    public set isSingle(val: boolean) {
        this._isSingle$.next(val);
    }

    public get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    public get loading(): boolean {
        return this._loading$.getValue();
    }

    public set loading(val: boolean) {
        this._loading$.next(val);
    }

    public get selectedIndex$(): Observable<number> {
        return this._selectedIndex$.asObservable();
    }

    public get selectedIndex(): number {
        return this._selectedIndex$.getValue();
    }

    public set selectedIndex(val: number) {
        this._selectedIndex$.next(val);
    }

    public get selectedProfile$(): Observable<DeviceProfile> {
        return this.selectedIndex$.pipe(
            map(idx => idx && idx >= 0 && idx < this.deviceprofiles.length ? this.deviceprofiles[idx] : null)
        );
    }

    public get selectedProfile(): DeviceProfile {
        if (this.selectedIndex >= 0 && this.selectedIndex < this.deviceprofiles.length) {
            return this.deviceprofiles[this.selectedIndex];
        } else {
            return null;
        }
    }

    public get state$(): Observable<DeviceprofilesViewState> {
        return this._state$.asObservable();
    }

    public get state(): DeviceprofilesViewState {
        return this._state$.getValue();
    }

    public set state(val: DeviceprofilesViewState) {
        this._state$.next(val);
    }

    public get error$(): Observable<any> {
        return this._error$.asObservable();
    }

    public get error(): any {
        return this._error$.getValue();
    }

    public set error(val: any) {
        this._error$.next(val);
    }

    public changeState(state: DeviceprofilesViewState) {
        this.state = state;
    }

    public changeSingle(isSingle: boolean) {
        this.isSingle = isSingle;
    }

    public selectbyIndex(idx: number) {
        if (idx >= 0 && idx < this.deviceprofiles.length) {
            this.selectedIndex = idx;
            this.changeState(DeviceprofilesViewState.View);
        }
    }

    public selectById(id: string) {
        const idx = findIndex(this.deviceprofiles, ['id', id]);
        if (idx >= 0) {
            this.selectedIndex = idx;
            this.changeState(DeviceprofilesViewState.View);
        }
    }

    public getBaseProfileById(id: string): BaseDeviceProfile {
        return this.baseDeviceprofiles.find(bdp => bdp.id === id);
    }

    public create(data: DeviceProfile) {
        const profiles = cloneDeep(this.deviceprofiles);
        profiles.push(data);
        this.deviceprofiles = profiles;
    }

    public update(id: string, data: DeviceProfile) {
        const profiles: DeviceProfile[] = cloneDeep(this.deviceprofiles);
        const idx = profiles.findIndex(p => p.id === id);
        if (idx >= 0) {
            profiles[idx] = data;
        }
        this.deviceprofiles = profiles;
    }

    public delete(id: string) {
        const profiles: DeviceProfile[] = cloneDeep(this.deviceprofiles);
        const idx = profiles.findIndex(p => p.id === id);
        if (idx >= 0) {
            profiles.splice(idx, 1);
        }
        this.deviceprofiles = profiles;
    }

    public reset(id?: string) {
        let profile: DeviceProfile;
        let base: BaseDeviceProfile;
        if (id) {
            profile = cloneDeep(find(this.deviceprofiles, ['id', id]));
        } else {
            profile = cloneDeep(this.deviceprofiles[this.selectedIndex]);
        }
        if (profile) {
            base = find(this.baseDeviceprofiles, ['id', profile.base_profile_id]);
            profile.commands = base.commands;
            profile.config = base.config;
            profile.events = base.events;
            profile.params = base.params;
            profile.gateways = base.gateways;
            this.update(profile.id, profile);
        }
    }
}
