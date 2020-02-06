import { Injectable } from '@angular/core';
import { IqsOrganizationsService } from 'iqs-libs-clientshell2-angular';
import { Store } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { Observable, combineLatest } from 'rxjs';
import { filter, distinctUntilKeyChanged, take, map, distinctUntilChanged } from 'rxjs/operators';

import { BaseDeviceProfile, DeviceprofilesViewState, DeviceProfile } from '../models';
import {
    DeviceprofilesInitAction,
    DeviceprofilesCreateAction,
    DeviceprofilesUpdateAction,
    DeviceprofilesDeleteAction,
    DeviceprofilesChangeStateAction,
    DeviceprofilesSelectAction,
    DeviceprofilesChangeSingleAction,
    DeviceprofilesState,
    getDeviceprofilesBase,
    getDeviceprofilesSelectedIndex,
    getDeviceprofilesSelectedProfile,
    getDeviceprofilesError,
    getDeviceprofilesLoading,
    getDeviceprofilesState,
    getDeviceprofilesIsSingle,
    getDeviceprofilesData
} from '../store';
import { IqsDataprofilesService } from '../../dataprofiles';

@Injectable()
export class IqsDeviceprofilesService {

    static dpUpdateSub = null;

    constructor(
        private dataprofilesService: IqsDataprofilesService,
        private store: Store<DeviceprofilesState>,
        private organizationsService: IqsOrganizationsService
    ) { }

    public init(): void {
        if (IqsDeviceprofilesService.dpUpdateSub) { return; }
        this.organizationsService.init();
        this.dataprofilesService.init();
        IqsDeviceprofilesService.dpUpdateSub = combineLatest(
            this.organizationsService.current$.pipe(
                filter(organization => organization !== null),
                distinctUntilKeyChanged('id')
            ),
            this.dataprofilesService.dataprofiles$.pipe(
                filter(dp => dp !== null)
            )
        ).subscribe(() => {
            this.store.dispatch(new DeviceprofilesInitAction());
        });
    }

    public get deviceprofiles$(): Observable<DeviceProfile[]> {
        return this.store.select(getDeviceprofilesData).pipe(
            // rxjs can't compare deep, so this is some kind of verification our object is changed
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        );
    }

    public get baseDeviceprofiles$(): Observable<BaseDeviceProfile[]> {
        return this.store.select(getDeviceprofilesBase).pipe(
            // rxjs can't compare deep, so this is some kind of verification our object is changed
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        );
    }

    public get selectedIndex$(): Observable<number> {
        return this.store.select(getDeviceprofilesSelectedIndex);
    }

    public get selectedProfile$(): Observable<DeviceProfile> {
        return this.store.select(getDeviceprofilesSelectedProfile);
    }

    public get state$(): Observable<DeviceprofilesViewState> {
        return this.store.select(getDeviceprofilesState);
    }

    public get isSingle$(): Observable<boolean> {
        return this.store.select(getDeviceprofilesIsSingle);
    }

    public get loading$(): Observable<boolean> {
        return this.store.select(getDeviceprofilesLoading);
    }

    public get error$(): Observable<any> {
        return this.store.select(getDeviceprofilesError);
    }

    public selectbyIndex(idx: number) {
        this.deviceprofiles$.pipe(filter(dp => dp !== null && dp.length > 0), take(1)).subscribe(profiles => {
            if (idx >= 0 && idx < profiles.length) {
                this.store.dispatch(new DeviceprofilesSelectAction({ idx, id: profiles[idx].id }));
                this.changeState(DeviceprofilesViewState.View);
            }
        });
    }

    public selectById(id: string) {
        this.deviceprofiles$.pipe(filter(dp => dp !== null && dp.length > 0), take(1)).subscribe(profiles => {
            const idx = findIndex(profiles, ['id', id]);
            if (idx >= 0) {
                this.store.dispatch(new DeviceprofilesSelectAction({ idx, id: profiles[idx].id }));
                this.changeState(DeviceprofilesViewState.View);
            }
        });
    }

    public changeState(state: DeviceprofilesViewState) {
        this.store.dispatch(new DeviceprofilesChangeStateAction({ state }));
    }

    public changeSingle(isSingle: boolean) {
        this.store.dispatch(new DeviceprofilesChangeSingleAction({ single: isSingle }));
    }

    public getBaseProfileById(id: string): BaseDeviceProfile {
        let res: BaseDeviceProfile = null;
        this.baseDeviceprofiles$.pipe(take(1)).subscribe(profiles => {
            res = profiles && profiles.length ? profiles.find(p => p.id === id) || null : null;
        });
        return res;
    }

    public create(data: DeviceProfile) {
        this.store.dispatch(new DeviceprofilesCreateAction({ profile: data }));
    }

    public update(id: string, data: DeviceProfile) {
        this.store.dispatch(new DeviceprofilesUpdateAction({ id, profile: data }));
    }

    public delete(id: string) {
        this.store.dispatch(new DeviceprofilesDeleteAction({ id }));
    }

    public reset(id?: string) {
        combineLatest(
            this.baseDeviceprofiles$,
            this.deviceprofiles$,
            this.selectedIndex$
        ).pipe(take(1)).subscribe(([baseProfiles, profiles, idx]) => {
            let profile: DeviceProfile;
            let base: BaseDeviceProfile;
            if (id) {
                profile = cloneDeep(find(profiles, ['id', id]));
            } else {
                profile = cloneDeep(profiles[idx]);
            }
            if (profile) {
                base = find(baseProfiles, ['id', profile.base_profile_id]);
                profile.commands = base.commands;
                profile.config = base.config;
                profile.events = base.events;
                profile.params = base.params;
                profile.gateways = base.gateways;
                this.update(profile.id, profile);
            }
        });
    }
}
