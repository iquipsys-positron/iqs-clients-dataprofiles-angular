import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
    dataprofilesReducer,
    IqsDataprofilesEffects,
    IqsDataprofilesDataService,
    IqsDataprofilesService,
    IqsDataprofilesTranslateService
} from '../dataprofiles';
import { IqsDeviceprofilesComponentsModule } from './components/components.module';
import { IqsDeviceprofilesContainersModule } from './containers/containers.module';
import { IqsDeviceprofilesRoutingModule } from './deviceprofiles-routing.module';
import { IqsDeviceprofilesDataService, IqsDeviceprofilesHelpService, IqsDeviceprofilesService } from './services';
import { deviceprofilesReducer, IqsDeviceprofilesEffects } from './store';

@NgModule({
    imports: [
        // Angular and vendors
        StoreModule.forFeature('dataprofiles', dataprofilesReducer),
        StoreModule.forFeature('deviceprofiles', deviceprofilesReducer),
        EffectsModule.forFeature([IqsDataprofilesEffects]),
        EffectsModule.forFeature([IqsDeviceprofilesEffects]),
        // iqs-clients2
        IqsDeviceprofilesComponentsModule,
        IqsDeviceprofilesContainersModule,
        IqsDeviceprofilesRoutingModule
    ],
    providers: [
        IqsDataprofilesDataService,
        IqsDataprofilesService,
        IqsDataprofilesTranslateService,

        IqsDeviceprofilesHelpService,
        IqsDeviceprofilesDataService,
        IqsDeviceprofilesService
    ]
})
export class IqsDeviceprofilesModule { }
