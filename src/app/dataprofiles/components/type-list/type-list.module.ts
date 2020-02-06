import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PipPictureModule } from 'pip-webui2-pictures';

import { IqsDataprofilesTypeListComponent } from './type-list.component';

@NgModule({
    declarations: [IqsDataprofilesTypeListComponent],
    exports: [IqsDataprofilesTypeListComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        // pip-webui2
        PipPictureModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IqsDataprofilesTypeListModule { }
