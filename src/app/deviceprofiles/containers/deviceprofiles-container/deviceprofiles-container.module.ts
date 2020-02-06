import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { IqsAskDialogComponent, IqsAskDialogModule } from 'iqs-libs-clientshell2-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipEmptyStateModule } from 'pip-webui2-controls';
import { PipMenuLayoutModule, PipScrollableModule, PipDocumentLayoutModule, PipMediaModule } from 'pip-webui2-layouts';

import { IqsDeviceprofilesContainerComponent } from './deviceprofiles-container.component';
import { IqsDeviceprofilesComponentsModule } from '../../components/components.module';
import { IqsDeviceprofilesSelectBaseDialogComponent } from '../../components/select-base-dialog/select-base-dialog.component';

@NgModule({
    declarations: [IqsDeviceprofilesContainerComponent],
    entryComponents: [IqsAskDialogComponent, IqsDeviceprofilesSelectBaseDialogComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        TranslateModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        // pip-webui2
        PipDocumentLayoutModule,
        PipEmptyStateModule,
        PipMediaModule,
        PipMenuLayoutModule,
        PipScrollableModule,
        // iqs-clients2
        IqsAskDialogModule,
        IqsDeviceprofilesComponentsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IqsDeviceprofilesContainerModule { }
