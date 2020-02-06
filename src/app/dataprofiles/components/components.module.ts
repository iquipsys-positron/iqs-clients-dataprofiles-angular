import { NgModule } from '@angular/core';

import { IqsDataprofilesStateDialogModule } from './state-dialog/state-dialog.module';
import { IqsDataprofilesStateListModule } from './state-list/state-list.module';
import { IqsDataprofilesTypeDialogModule } from './type-dialog/type-dialog.module';
import { IqsDataprofilesTypeListModule } from './type-list/type-list.module';

const COMPONENTS = [
    IqsDataprofilesStateDialogModule,
    IqsDataprofilesStateListModule,
    IqsDataprofilesTypeDialogModule,
    IqsDataprofilesTypeListModule,
];

@NgModule({
    imports: COMPONENTS,
    exports: COMPONENTS,
})
export class IqsDataprofilesComponentsModule { }
