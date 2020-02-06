import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BaseDeviceProfile, DeviceProfile } from '../models';

@Injectable({
    providedIn: 'root'
})
export class IqsDeviceprofilesHelpService {

    constructor(
        private translate: TranslateService
    ) { }

    public getDeviceProfileIcon(profile: DeviceProfile) {
        switch (profile.base_profile_id) {
            case 'smartphone':
                return 'iqt-tracker';
            default:
                return 'iqt-tracker-1';
        }
    }

    public getDeviceProfileSubtitle(profile: DeviceProfile | BaseDeviceProfile): string {
        if (profile.id === 'custom' && profile.gateways && profile.gateways.length === 0) {
            return this.translate.instant('DEVICEPROFILES_GATEWAY_ANY');
        }
        const gws = [];
        if (profile.gateways) {
            for (const gw of profile.gateways) { gws.push(this.translate.instant('DEVICEPROFILES_GATEWAY_' + gw.toUpperCase())); }
        }
        return this.translate.instant('DEVICEPROFILES_GATEWAY_THROUGH') + (gws.length ? (' ' + gws.join(', ')) : '');
    }
}
