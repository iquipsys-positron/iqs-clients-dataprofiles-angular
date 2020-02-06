import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipSelectedModule } from 'pip-webui2-behaviors';

import { IqsDeviceprofilesListComponent } from './deviceprofiles-list.component';

@NgModule({
    declarations: [IqsDeviceprofilesListComponent],
    exports: [IqsDeviceprofilesListComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        MatIconModule,
        MatListModule,
        TranslateModule,
        // pip-webui2
        PipSelectedModule
    ]
})
export class IqsDeviceprofilesListModule { }
