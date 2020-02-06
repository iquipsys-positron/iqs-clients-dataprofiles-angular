import { NgModule } from '@angular/core';

import { IqsDeviceprofilesContainerModule } from './deviceprofiles-container/deviceprofiles-container.module';

const CONTAINERS = [IqsDeviceprofilesContainerModule];

@NgModule({
    imports: CONTAINERS
})
export class IqsDeviceprofilesContainersModule { }
