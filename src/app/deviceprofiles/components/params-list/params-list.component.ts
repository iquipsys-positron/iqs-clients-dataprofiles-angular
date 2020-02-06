import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { paramsListTranslations } from './params-list.string';
import {
    ConfigParameter,
    ActuatorCommand,
    SensorEvent,
    SensorParameter,
    DeviceProfileParamsListType,
} from '../../models';
import { DataprofileListItem, DataProfileType } from '../../../dataprofiles/models';
import { IqsDataprofilesTranslateService, IqsDataprofilesService } from '../../../dataprofiles/services';

@Component({
    selector: 'iqs-params-list',
    templateUrl: './params-list.component.html',
    styleUrls: ['./params-list.component.scss']
})
export class IqsDeviceprofilesParamsListComponent implements OnChanges {

    public params: DataprofileListItem[];

    @Input() loading: boolean;
    @Input() parameters: ConfigParameter[] | ActuatorCommand[] | SensorEvent[] | SensorParameter[];
    @Input() type: DeviceProfileParamsListType;
    @Input() removable: boolean;

    @Output() paramClick = new EventEmitter<number>();
    @Output() removeClick = new EventEmitter<number>();

    constructor(
        private dataprofiles: IqsDataprofilesService,
        private dpTranslate: IqsDataprofilesTranslateService,
        private translate: TranslateService
    ) {
        this.translate.setTranslation('en', paramsListTranslations.en, true);
        this.translate.setTranslation('ru', paramsListTranslations.ru, true);
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes.parameters && this.parameters) {
            this.params = [];
            for (const param of this.parameters) {
                const item = new DataprofileListItem();
                item.id = param.id;
                item.title = param.id ? param.id.toString() : '+';
                if (param.name) { item.title += `. ${this.dpTranslate.getTranslation('param', param.name)}`; }
                let type, name;
                switch (this.type) {
                    case DeviceProfileParamsListType.Command:
                        type = this.dataprofiles.getTypeById(DataProfileType.Command, param.type);
                        name = type
                            ? this.dpTranslate.getTranslation('param', type.name)
                            : this.translate.instant('DEVICEPROFILES_DISPLAYED_ON_COMMAND', { number: param.type });
                        break;
                    case DeviceProfileParamsListType.Event:
                        type = this.dataprofiles.getTypeById(DataProfileType.Event, param.type);
                        name = type
                            ? this.dpTranslate.getTranslation('param', type.name)
                            : this.translate.instant('DEVICEPROFILES_DISPLAYED_ON_EVENT', { number: param.type });
                        break;
                    case DeviceProfileParamsListType.Parameter:
                        type = this.dataprofiles.getTypeById(DataProfileType.Parameter, param.type);
                        name = type
                            ? this.dpTranslate.getTranslation('param', type.name)
                            : this.translate.instant('DEVICEPROFILES_DISPLAYED_ON_PARAMETER', { number: param.type });
                        break;
                    default:
                        name = this.translate.instant('DEVICEPROFILES_DISPLAYED_ON_CONFIG', { number: param.type });
                        break;
                }
                item.subtitle = this.translate.instant('DEVICEPROFILES_DISPLAYED_ON', { name });
                if (param.hasOwnProperty('offset')
                    || param.hasOwnProperty('scale')
                    || param.hasOwnProperty('min_value')
                    || param.hasOwnProperty('max_value')) {
                    item.subtitle += '. ' + this.translate.instant('DEVICEPROFILES_VALUES');
                    let valuesStr = '';
                    if (param.hasOwnProperty('min_value') && param.hasOwnProperty('max_value')) {
                        valuesStr += `${param.min_value} - ${param.max_value}`;
                    } else if (param.hasOwnProperty('min_value')) {
                        valuesStr += `> ${param.min_value}`;
                    } else if (param.hasOwnProperty('max_value')) {
                        valuesStr += `< ${param.max_value}`;
                    } else {
                        valuesStr += '*';
                    }
                    if (param.hasOwnProperty('scale')) {
                        valuesStr = `(${valuesStr}) * ${param['scale']}`;
                    }
                    if (param.hasOwnProperty('offset')) {
                        valuesStr += ` + ${param['offset']}`;
                    }
                    item.subtitle += valuesStr;
                }
                this.params.push(item);
            }
        }
    }

    public trackById(param: ConfigParameter | ActuatorCommand | SensorEvent | SensorParameter) {
        return param && param.id;
    }

    public onParamClick(param_id: number) {
        if (this.loading || !param_id) { return; }
        this.paramClick.emit(param_id);
    }

    public onRemoveClick(event: MouseEvent, param_id: number) {
        if (this.loading || param_id < 100) { return; }
        event.stopPropagation();
        this.removeClick.emit(param_id);
    }

}
