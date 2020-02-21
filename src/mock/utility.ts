import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

import { DataProfile } from '../app/dataprofiles';
import { DeviceProfile, BaseDeviceProfile } from '../app/deviceprofiles';
import {
    dataprofiles as storedDataprofiles,
    baseDeviceprofiles as storedBaseDeviceProfiles,
    deviceprofiles as storedDeviceprofiles
} from './storage';

let lastDeviceprofileId = storedDeviceprofiles.length ? Number(storedDeviceprofiles[storedDeviceprofiles.length - 1].id) : 0;

export const dataprofiles = {
    findByOrganizationId: (org_id: string): DataProfile => {
        return find(storedDataprofiles, ['id', org_id]);
    },
    updateByOrganizationId: (org_id: string, data: DataProfile): DataProfile => {
        let idx = findIndex(storedDataprofiles, ['id', org_id]);
        if (idx < 0) {
            storedDataprofiles.push(data);
            idx = storedDataprofiles.length - 1;
        } else {
            storedDataprofiles[idx] = data;
        }
        localStorage.setItem('mockDataprofiles', JSON.stringify(storedDataprofiles));
        return storedDataprofiles[idx];
    }
};

export const deviceprofiles = {
    findByOrganizationId: (org_id: string): DeviceProfile[] => {
        return storedDeviceprofiles.filter(dp => dp.org_id === org_id);
    },
    getBaseDeviceProfiles: (): BaseDeviceProfile[] => {
        return storedBaseDeviceProfiles;
    },
    findById: (org_id: string, id: string): DeviceProfile => {
        return deviceprofiles.findByOrganizationId(org_id).find(it => it.id === id);
    },
    create: (data: DeviceProfile): DeviceProfile => {
        lastDeviceprofileId++;
        data.id = lastDeviceprofileId.toString().padStart(32, '0');
        storedDeviceprofiles.push(data);
        localStorage.setItem('mockDeviceprofiles', JSON.stringify(storedDeviceprofiles));
        return data;
    },
    update: (id: string, data: DeviceProfile): DeviceProfile => {
        const idx = storedDeviceprofiles.findIndex(dp => dp.id === id);
        if (idx < 0) { return null; }
        storedDeviceprofiles[idx] = data;
        localStorage.setItem('mockDeviceprofiles', JSON.stringify(storedDeviceprofiles));
        return data;
    },
    delete: (id: string): DeviceProfile => {
        const idx = storedDeviceprofiles.findIndex(dp => dp.id === id);
        if (idx < 0) { return null; }
        const ret = storedDeviceprofiles.splice(idx, 1)[0];
        localStorage.setItem('mockDeviceprofiles', JSON.stringify(storedDeviceprofiles));
        return ret;
    }
};
