import { NgModule } from '@angular/core';

import { IqsDeviceprofilesDetailsModule } from './deviceprofiles-details/deviceprofiles-details.module';
import { IqsDeviceprofilesListModule } from './deviceprofiles-list/deviceprofiles-list.module';
import { IqsDeviceprofilesParamDialogModule } from './param-dialog/param-dialog.module';
import { IqsDeviceprofilesParamsListModule } from './params-list/params-list.module';
import { IqsDeviceprofilesSelectBaseDialogModule } from './select-base-dialog/select-base-dialog.module';

const COMPONENTS = [
    IqsDeviceprofilesDetailsModule,
    IqsDeviceprofilesListModule,
    IqsDeviceprofilesParamDialogModule,
    IqsDeviceprofilesParamsListModule,
    IqsDeviceprofilesSelectBaseDialogModule
];

@NgModule({
    imports: COMPONENTS,
    exports: COMPONENTS
})
export class IqsDeviceprofilesComponentsModule { }
