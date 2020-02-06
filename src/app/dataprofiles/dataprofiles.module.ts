import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { IqsDataprofilesComponentsModule } from './components/components.module';
import { IqsDataprofilesContainersModule } from './containers/containers.module';
import { IqsDataprofilesDataService, IqsDataprofilesService, IqsDataprofilesTranslateService } from './services';
import { dataprofilesReducer, IqsDataprofilesEffects } from './store';
import { IqsDataprofilesRoutingModule } from './dataprofiles-routing.module';

@NgModule({
    imports: [
        // Angular and vendors
        StoreModule.forFeature('dataprofiles', dataprofilesReducer),
        EffectsModule.forFeature([IqsDataprofilesEffects]),
        // iqs-clients2
        IqsDataprofilesRoutingModule,
        IqsDataprofilesComponentsModule,
        IqsDataprofilesContainersModule
    ],
    providers: [
        IqsDataprofilesDataService,
        IqsDataprofilesService,
        IqsDataprofilesTranslateService
    ]
})
export class IqsDataprofilesModule { }
