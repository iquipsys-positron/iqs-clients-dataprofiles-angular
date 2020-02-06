import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatToolbarModule, MatProgressBarModule, MatTabsModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { IqsAskDialogComponent, IqsAskDialogModule } from 'iqs-libs-clientshell2-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipActionListModule } from 'pip-webui2-buttons';
import { PipEmptyStateModule } from 'pip-webui2-controls';
import { PipDocumentLayoutModule, PipShadowModule, PipMediaModule } from 'pip-webui2-layouts';

import { IqsDataprofilesContainerComponent } from './dataprofiles-container.component';
import { IqsDataprofilesComponentsModule } from '../../components/components.module';
import { IqsDataprofilesStateDialogComponent } from '../../components/state-dialog/state-dialog.component';
import { IqsDataprofilesTypeDialogComponent } from '../../components/type-dialog/type-dialog.component';

@NgModule({
    declarations: [IqsDataprofilesContainerComponent],
    entryComponents: [IqsAskDialogComponent, IqsDataprofilesStateDialogComponent, IqsDataprofilesTypeDialogComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatProgressBarModule,
        MatTabsModule,
        MatToolbarModule,
        TranslateModule,
        // pip-webui2
        PipActionListModule,
        PipDocumentLayoutModule,
        PipEmptyStateModule,
        PipMediaModule,
        PipShadowModule,
        // iqs-clients2
        IqsAskDialogModule,
        IqsDataprofilesComponentsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IqsDataprofilesContainerModule { }
