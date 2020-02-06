import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { IqsDataprofilesStateDialogComponent } from './state-dialog.component';

@NgModule({
    declarations: [IqsDataprofilesStateDialogComponent],
    exports: [IqsDataprofilesStateDialogComponent],
    imports: [
        // Angular and vendors
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
export class IqsDataprofilesStateDialogModule { }
