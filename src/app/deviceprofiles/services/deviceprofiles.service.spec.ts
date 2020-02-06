import { TestBed } from '@angular/core/testing';
import { IqsOrganizationsService } from 'iqs-libs-clientshell2-angular';
import { MockOrganizationsService } from 'iqs-libs-clientshell2-angular/mock';
import { Store, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import cloneDeep from 'lodash/cloneDeep';
import random from 'lodash/random';
import { filter, map } from 'rxjs/operators';

import { IqsDeviceprofilesService } from './deviceprofiles.service';
import {
    DeviceprofilesInitAction,
    DeviceprofilesCreateAction,
    DeviceprofilesUpdateAction,
    DeviceprofilesDeleteAction,
    DeviceprofilesChangeStateAction,
    DeviceprofilesSelectAction,
    DeviceprofilesChangeSingleAction,
    DeviceprofilesState,
    deviceprofilesInitialState
} from '../store/index';
import { utils, IqsDataprofilesServiceMock } from '../../../mock';
import { IqsDataprofilesService } from '../../dataprofiles';
import { DeviceProfile, BaseDeviceProfile, DeviceprofilesViewState } from '../models';

describe('[Deviceprofiles] services/deviceprofiles', () => {

    const organization_id = '00000000000000000000000000000000';
    let service: IqsDeviceprofilesService;
    let store: MockStore<DeviceprofilesState>;

    beforeEach(() => TestBed.configureTestingModule({
        imports: [],
        providers: [
            IqsDeviceprofilesService,
            {
                provide: IqsOrganizationsService,
                useClass: MockOrganizationsService
            },
            {
                provide: IqsDataprofilesService,
                useClass: IqsDataprofilesServiceMock
            },
            provideMockStore()
        ]
    }));

    beforeEach(() => {
        service = TestBed.get(IqsDeviceprofilesService);
        store = TestBed.get(Store);
        spyOn(store, 'select').and.callFake((selector: MemoizedSelector<DeviceprofilesState, any>) => {
            return store.pipe(
                filter(s => !!s),
                map(s => selector.projector(s))
            );
        });
    });

    it('should init', () => {
        const organizationsSerivce: MockOrganizationsService = TestBed.get(IqsOrganizationsService);
        const dataprofilesService: IqsDataprofilesServiceMock = TestBed.get(IqsDataprofilesService);
        const dispatchSpy = spyOn(store, 'dispatch');
        service.init();
        dataprofilesService.init({ organization_id });
        expect(IqsDeviceprofilesService.dpUpdateSub).toBeTruthy();
        expect(dispatchSpy).toHaveBeenCalledWith(new DeviceprofilesInitAction());
        const organizationsServiceInitSpy = spyOn(organizationsSerivce, 'init');
        service.init();
        expect(organizationsServiceInitSpy).not.toHaveBeenCalled();
    });

    it('should return deviceprofiles$', () => {
        const deviceprofiles = cloneDeep(utils.deviceprofiles.findByOrganizationId(organization_id));
        store.setState({
            ...deviceprofilesInitialState,
            profiles: deviceprofiles
        });
        let profiles: DeviceProfile[];
        service.deviceprofiles$.subscribe(p => profiles = p);
        expect(profiles).toEqual(deviceprofiles);
        store.setState({
            ...deviceprofilesInitialState,
            profiles: [deviceprofiles[0]]
        });
        expect(profiles).toEqual([deviceprofiles[0]]);
    });

    it('should return baseDeviceprofiles$', () => {
        const baseDeviceprofiles = cloneDeep(utils.deviceprofiles.getBaseDeviceProfiles());
        store.setState({
            ...deviceprofilesInitialState,
            base: baseDeviceprofiles
        });
        let profiles: BaseDeviceProfile[];
        service.baseDeviceprofiles$.subscribe(p => profiles = p);
        expect(profiles).toEqual(baseDeviceprofiles);
        store.setState({
            ...deviceprofilesInitialState,
            base: [baseDeviceprofiles[0]]
        });
        expect(profiles).toEqual([baseDeviceprofiles[0]]);
    });

    it('should return selectedIndex$ and selectedProfile$', () => {
        const deviceprofiles: DeviceProfile[] = cloneDeep(utils.deviceprofiles.findByOrganizationId(organization_id));
        store.setState({
            ...deviceprofilesInitialState,
            profiles: deviceprofiles
        });
        let idx: number;
        let profile: DeviceProfile;
        service.selectedIndex$.subscribe(i => idx = i);
        service.selectedProfile$.subscribe(p => profile = p);
        expect(idx).toBeFalsy();
        expect(profile).toBeFalsy();
        store.setState({
            ...deviceprofilesInitialState,
            profiles: deviceprofiles,
            selectedIndex: 0
        });
        expect(idx).toEqual(0);
        expect(profile).toEqual(deviceprofiles[0]);
        const ridx = random(deviceprofiles.length - 1);
        store.setState({
            ...deviceprofilesInitialState,
            profiles: deviceprofiles,
            selectedIndex: ridx
        });
        expect(idx).toEqual(ridx);
        expect(profile).toEqual(deviceprofiles[ridx]);
        store.setState({
            ...deviceprofilesInitialState,
            profiles: deviceprofiles,
            selectedIndex: -1
        });
        expect(idx).toEqual(-1);
        expect(profile).toEqual(null);
    });

    it('should return state$', () => {
        store.setState({
            ...deviceprofilesInitialState,
            state: DeviceprofilesViewState.View
        });
        let state: DeviceprofilesViewState;
        service.state$.subscribe(s => state = s);
        expect(state).toEqual(DeviceprofilesViewState.View);
        store.setState({
            ...deviceprofilesInitialState,
            state: DeviceprofilesViewState.Edit
        });
        expect(state).toEqual(DeviceprofilesViewState.Edit);
    });

    it('should return isSingle$, loading$ and error$', () => {
        store.setState({
            ...deviceprofilesInitialState,
            isSingle: false,
            loading: false,
            error: null
        });
        let isSingle: boolean;
        let loading: boolean;
        let error: any;
        service.isSingle$.subscribe(iss => isSingle = iss);
        service.loading$.subscribe(l => loading = l);
        service.error$.subscribe(e => error = e);
        expect(isSingle).toBeFalsy();
        expect(loading).toBeFalsy();
        expect(error).toBeFalsy();
        store.setState({
            ...deviceprofilesInitialState,
            isSingle: true,
            loading: true,
            error: 'error'
        });
        expect(isSingle).toBeTruthy();
        expect(loading).toBeTruthy();
        expect(error).toEqual('error');
    });

    it('should select deviceprofiles', () => {
        const deviceprofiles: DeviceProfile[] = cloneDeep(utils.deviceprofiles.findByOrganizationId(organization_id));
        store.setState({
            ...deviceprofilesInitialState,
            profiles: deviceprofiles
        });
        const dispatchSpy = spyOn(store, 'dispatch');
        const changeStateSpy = spyOn(service, 'changeState');
        service.selectbyIndex(-1);
        expect(dispatchSpy).not.toHaveBeenCalled();
        expect(changeStateSpy).not.toHaveBeenCalled();
        service.selectbyIndex(0);
        expect(dispatchSpy).toHaveBeenCalledWith(new DeviceprofilesSelectAction({ idx: 0, id: deviceprofiles[0].id }));
        expect(changeStateSpy).toHaveBeenCalledWith(DeviceprofilesViewState.View);
        dispatchSpy.calls.reset();
        changeStateSpy.calls.reset();
        service.selectById('bad id');
        expect(dispatchSpy).not.toHaveBeenCalled();
        expect(changeStateSpy).not.toHaveBeenCalled();
        service.selectById(deviceprofiles[0].id);
        expect(dispatchSpy).toHaveBeenCalledWith(new DeviceprofilesSelectAction({ idx: 0, id: deviceprofiles[0].id }));
        expect(changeStateSpy).toHaveBeenCalledWith(DeviceprofilesViewState.View);
    });

    it('should change state and isSingle', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        service.changeState(DeviceprofilesViewState.Progress);
        expect(dispatchSpy).toHaveBeenCalledWith(new DeviceprofilesChangeStateAction({ state: DeviceprofilesViewState.Progress }));
        service.changeSingle(true);
        expect(dispatchSpy).toHaveBeenCalledWith(new DeviceprofilesChangeSingleAction({ single: true }));
    });

    it('should return base profile by id', () => {
        const baseDeviceprofiles: BaseDeviceProfile[] = cloneDeep(utils.deviceprofiles.getBaseDeviceProfiles());
        const customBaseProfile = baseDeviceprofiles.find(dp => dp.id === 'custom');
        store.setState(deviceprofilesInitialState);
        expect(service.getBaseProfileById('custom')).toBeFalsy();
        store.setState({
            ...deviceprofilesInitialState,
            base: baseDeviceprofiles
        });
        expect(service.getBaseProfileById('bad id')).toBeFalsy();
        expect(service.getBaseProfileById('custom')).toEqual(customBaseProfile);
    });

    it('should call create/update/delete actions', () => {
        const deviceprofile: DeviceProfile = cloneDeep(utils.deviceprofiles.findByOrganizationId(organization_id)[0]);
        const dispatchSpy = spyOn(store, 'dispatch');
        service.create(deviceprofile);
        expect(dispatchSpy).toHaveBeenCalledWith(new DeviceprofilesCreateAction({ profile: deviceprofile }));
        service.update(deviceprofile.id, deviceprofile);
        expect(dispatchSpy).toHaveBeenCalledWith(new DeviceprofilesUpdateAction({ id: deviceprofile.id, profile: deviceprofile }));
        service.delete(deviceprofile.id);
        expect(dispatchSpy).toHaveBeenCalledWith(new DeviceprofilesDeleteAction({ id: deviceprofile.id }));
    });

    it('should reset deviceprofile', () => {
        const deviceprofiles: DeviceProfile[] = cloneDeep(utils.deviceprofiles.findByOrganizationId(organization_id));
        const baseDeviceprofiles: BaseDeviceProfile[] = cloneDeep(utils.deviceprofiles.getBaseDeviceProfiles());
        const ridx = random(deviceprofiles.length - 1);
        const rBase = baseDeviceprofiles.find(bdp => bdp.id === deviceprofiles[ridx].base_profile_id);
        const updatedProfile = cloneDeep(deviceprofiles[ridx]);
        Object.assign(updatedProfile, {
            commands: rBase.commands,
            config: rBase.config,
            events: rBase.events,
            params: rBase.params,
            gateways: rBase.gateways
        });
        const updateSpy = spyOn(service, 'update');
        store.setState({
            ...deviceprofilesInitialState,
            profiles: deviceprofiles,
            base: baseDeviceprofiles,
            selectedIndex: ridx
        });
        service.reset('bad id');
        expect(updateSpy).not.toHaveBeenCalled();
        service.reset(deviceprofiles[ridx].id);
        expect(updateSpy).toHaveBeenCalledWith(updatedProfile.id, updatedProfile);
        service.reset();
        expect(updateSpy).toHaveBeenCalledWith(updatedProfile.id, updatedProfile);
    });

});
