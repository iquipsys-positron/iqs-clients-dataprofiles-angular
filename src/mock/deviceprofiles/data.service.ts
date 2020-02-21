import { Observable, of, throwError } from 'rxjs';

import * as utils from '../utility';
import { DataProfile } from '../../app/dataprofiles';
import { BaseDeviceProfile, DeviceProfile } from '../../app/deviceprofiles';

export class IqsDeviceprofilesDataServiceMock {

    private org_id: string;
    private error: any;

    public init(payload: {
        org_id: string,
        error: any
    }) {
        this.org_id = payload.org_id;
        this.error = payload.error;
    }

    public readBaseDeviceProfiles(): Observable<BaseDeviceProfile[]> {
        return of(utils.deviceprofiles.getBaseDeviceProfiles());
    }

    public readDeviceProfiles(): Observable<DeviceProfile[]> {
        return of(utils.deviceprofiles.findByOrganizationId(this.org_id));
    }

    public createDeviceProfile(data: DeviceProfile): Observable<DeviceProfile> {
        return of(utils.deviceprofiles.create(data));
    }

    public updateDeviceProfile(id: string, data: DeviceProfile): Observable<DeviceProfile> {
        return of(utils.deviceprofiles.update(id, data));
    }

    public deleteDeviceProfile(id: string): Observable<DeviceProfile> {
        return of(utils.deviceprofiles.delete(id));
    }

    public throwError(): Observable<DataProfile> {
        return throwError(this.error);
    }
}
