import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatInputModule, MatSelectModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { IqsDeviceprofilesParamDialogComponent } from './param-dialog.component';

@NgModule({
    declarations: [IqsDeviceprofilesParamDialogComponent],
    exports: [IqsDeviceprofilesParamDialogComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class IqsDeviceprofilesParamDialogModule { }
