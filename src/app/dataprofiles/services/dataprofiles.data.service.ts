import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IqsSessionConfigService, CommonDataService, IqsOrganizationsService } from 'iqs-libs-clientshell2-angular';
import { Observable } from 'rxjs';

import { DataProfile } from '../models';

@Injectable({
    providedIn: 'root'
})
export class IqsDataprofilesDataService extends CommonDataService {

    private RESOURCE = '/api/v1/organizations/:org_id/data_profiles';

    constructor(
        private sessionConfig: IqsSessionConfigService,
        private organizationsService: IqsOrganizationsService,
        private http: HttpClient,
    ) { super(); }

    public readDataprofiles(): Observable<DataProfile> {
        const params = {
            org_id: this.organizationsService.current && this.organizationsService.current.id
        };

        return this.http.get<DataProfile>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params));
    }

    public updateDataprofiles(data: DataProfile): Observable<DataProfile> {
        const params = {
            org_id: this.organizationsService.current && this.organizationsService.current.id
        };
        if (!data.id) { data.id = params.org_id; }

        return this.http.post<DataProfile>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params), data);
    }
}
