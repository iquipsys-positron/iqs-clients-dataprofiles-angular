import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

import { deviceprofilesListTranslations } from './deviceprofiles-list.strings';
import { DeviceProfile, DeviceprofilesViewState } from '../../models';
import { IqsDeviceprofilesService, IqsDeviceprofilesHelpService } from '../../services';

@Component({
    selector: 'iqs-deviceprofiles-list',
    templateUrl: './deviceprofiles-list.component.html',
    styleUrls: ['./deviceprofiles-list.component.scss']
})
export class IqsDeviceprofilesListComponent implements OnInit {

    public selectedIndex$: Observable<number>;
    public disableSelected$: Observable<boolean>;

    @Input() profiles: DeviceProfile[];
    @Input() state: DeviceprofilesViewState;

    @Output() select = new EventEmitter();

    constructor(
        public deviceprofilesHelp: IqsDeviceprofilesHelpService,
        private deviceprofilesService: IqsDeviceprofilesService,
        private translate: TranslateService
    ) {
        this.translate.setTranslation('en', deviceprofilesListTranslations.en, true);
        this.translate.setTranslation('ru', deviceprofilesListTranslations.ru, true);

        this.selectedIndex$ = this.deviceprofilesService.selectedIndex$.pipe(
            withLatestFrom(this.deviceprofilesService.state$),
            map(([index, state]: [number, DeviceprofilesViewState]) => {
                if (state === DeviceprofilesViewState.Create) {
                    return 0;
                } else {
                    return index;
                }
            })
        );
        this.disableSelected$ = combineLatest(
            this.deviceprofilesService.state$,
            this.selectedIndex$
        ).pipe(
            map(([state, index]: [DeviceprofilesViewState, number]) =>
                (state === DeviceprofilesViewState.Create && index === 0) || state === DeviceprofilesViewState.Edit)
        );
    }

    ngOnInit() { }

    public trackById(profile: DeviceProfile) {
        return profile && profile.id;
    }

    public onSelect(payload: any) {
        if (!payload || !payload.hasOwnProperty('index')) { return; }
        this.select.emit(payload.index);
    }
}
