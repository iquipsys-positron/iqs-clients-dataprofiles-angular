import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IqsDeviceprofilesHelpService } from './deviceprofiles.help.service';
import { DeviceProfile, BaseDeviceProfile } from '../models';

describe('[Deviceprofiles] services/deviceprofiles.help', () => {

    let service: IqsDeviceprofilesHelpService;

    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            TranslateModule.forRoot()
        ],
        providers: [
            IqsDeviceprofilesHelpService
        ]
    }));

    beforeEach(() => {
        service = TestBed.get(IqsDeviceprofilesHelpService);
    });

    it('should return right icon', () => {
        expect(service.getDeviceProfileIcon(<DeviceProfile>{ base_profile_id: 'smartphone' })).toEqual('iqt-tracker');
        expect(service.getDeviceProfileIcon(<DeviceProfile>{})).toEqual('iqt-tracker-1');
    });

    it('should return right subtitle', () => {
        expect(service.getDeviceProfileSubtitle(<BaseDeviceProfile>{ id: 'custom', gateways: [] })).toEqual('DEVICEPROFILES_GATEWAY_ANY');
        expect(service.getDeviceProfileSubtitle(<DeviceProfile>{})).toEqual('DEVICEPROFILES_GATEWAY_THROUGH');
        expect(service.getDeviceProfileSubtitle(<DeviceProfile>{ gateways: ['lora', 'mqtt'] }))
            .toEqual('DEVICEPROFILES_GATEWAY_THROUGH DEVICEPROFILES_GATEWAY_LORA, DEVICEPROFILES_GATEWAY_MQTT');
    });

});
