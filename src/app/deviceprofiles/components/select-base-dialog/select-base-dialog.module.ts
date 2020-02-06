import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatButtonModule, MatIconModule, MatListModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipSelectedModule } from 'pip-webui2-behaviors';

import { IqsDeviceprofilesSelectBaseDialogComponent } from './select-base-dialog.component';

@NgModule({
    declarations: [IqsDeviceprofilesSelectBaseDialogComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        TranslateModule,
        // pip-webui2
        PipSelectedModule
    ]
})
export class IqsDeviceprofilesSelectBaseDialogModule { }
