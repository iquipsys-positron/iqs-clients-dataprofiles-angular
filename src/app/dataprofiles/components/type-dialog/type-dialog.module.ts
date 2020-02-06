import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { IqsDataprofilesTypeDialogComponent } from './type-dialog.component';

@NgModule({
    declarations: [IqsDataprofilesTypeDialogComponent],
    exports: [IqsDataprofilesTypeDialogComponent],
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
export class IqsDataprofilesTypeDialogModule { }
