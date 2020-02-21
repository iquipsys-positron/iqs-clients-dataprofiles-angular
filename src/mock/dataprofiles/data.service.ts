import { Observable, of, throwError } from 'rxjs';

import * as utils from '../utility';
import { DataProfile } from '../../app/dataprofiles';

export class IqsDataprofilesDataServiceMock {

    private org_id: string;
    private error: any;

    public init(payload: {
        org_id: string,
        error: any
    }) {
        this.org_id = payload.org_id;
        this.error = payload.error;
    }

    public readDataprofiles(): Observable<DataProfile> {
        return of(utils.dataprofiles.findByOrganizationId(this.org_id));
    }

    public updateDataprofiles(data: DataProfile): Observable<DataProfile> {
        return of(utils.dataprofiles.updateByOrganizationId(this.org_id, data));
    }

    public throwError(): Observable<DataProfile> {
        return throwError(this.error);
    }
}
