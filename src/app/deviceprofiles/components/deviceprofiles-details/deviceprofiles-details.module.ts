import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatDialogModule,
    MatProgressBarModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { IqsAskDialogModule, IqsAskDialogComponent } from 'iqs-libs-clientshell2-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipActionListModule } from 'pip-webui2-buttons';
import { PipEmptyStateModule } from 'pip-webui2-controls';
import { PipDocumentLayoutModule, PipMediaModule } from 'pip-webui2-layouts';

import { IqsDeviceprofilesDetailsComponent } from './deviceprofiles-details.component';
import { IqsDeviceprofilesParamDialogComponent } from '../param-dialog/param-dialog.component';
import { IqsDeviceprofilesParamDialogModule } from '../param-dialog/param-dialog.module';
import { IqsDeviceprofilesParamsListModule } from '../params-list/params-list.module';

@NgModule({
    declarations: [IqsDeviceprofilesDetailsComponent],
    exports: [IqsDeviceprofilesDetailsComponent],
    entryComponents: [IqsAskDialogComponent, IqsDeviceprofilesParamDialogComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTabsModule,
        ReactiveFormsModule,
        TranslateModule,
        // pip-webui2
        PipActionListModule,
        PipDocumentLayoutModule,
        PipEmptyStateModule,
        PipMediaModule,
        // iqs-clients2
        IqsAskDialogModule,
        IqsDeviceprofilesParamDialogModule,
        IqsDeviceprofilesParamsListModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IqsDeviceprofilesDetailsModule { }
