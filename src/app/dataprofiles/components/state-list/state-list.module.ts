import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PipPictureModule } from 'pip-webui2-pictures';

import { IqsDataprofilesStateListComponent } from './state-list.component';

@NgModule({
    declarations: [IqsDataprofilesStateListComponent],
    exports: [IqsDataprofilesStateListComponent],
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
export class IqsDataprofilesStateListModule { }
