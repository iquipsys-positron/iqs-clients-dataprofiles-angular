import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { IqsDeviceprofilesParamsListComponent } from './params-list.component';
import { MatIconModule, MatButtonModule, MatListModule } from '@angular/material';

@NgModule({
    declarations: [IqsDeviceprofilesParamsListComponent],
    exports: [IqsDeviceprofilesParamsListComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        TranslateModule
    ]
})
export class IqsDeviceprofilesParamsListModule { }
