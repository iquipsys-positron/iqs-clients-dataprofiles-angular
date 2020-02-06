import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { selectBaseDialogTranslations } from './select-base-dialog.strings';
import { IqsDeviceprofilesHelpService } from '../../services';
import { BaseDeviceProfile } from '../../models';

export interface IqsDeviceprofilesSelectBaseDialogData {
    profiles$: Observable<BaseDeviceProfile[]>;
}

@Component({
    selector: 'iqs-select-base-dialog',
    templateUrl: './select-base-dialog.component.html',
    styleUrls: ['./select-base-dialog.component.scss']
})
export class IqsDeviceprofilesSelectBaseDialogComponent {

    public profile: BaseDeviceProfile;
    public profiles$: Observable<BaseDeviceProfile[]>;

    constructor(
        public deviceprofilesHelp: IqsDeviceprofilesHelpService,
        @Inject(MAT_DIALOG_DATA) private data: IqsDeviceprofilesSelectBaseDialogData,
        private translate: TranslateService
    ) {
        this.translate.setTranslation('en', selectBaseDialogTranslations.en, true);
        this.translate.setTranslation('ru', selectBaseDialogTranslations.ru, true);

        this.profiles$ = this.data.profiles$;
        this.profiles$.pipe(filter(p => p && p.length > 0), take(1)).subscribe(p => this.profile = p[0]);
    }

    public selectProfile(profile: BaseDeviceProfile) {
        this.profile = profile;
    }

}
