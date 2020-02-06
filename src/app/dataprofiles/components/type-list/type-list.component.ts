import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

import {
    ActuatorCommandType,
    ActuatorCommandAlgorithm,
    DataprofileListItem,
    SensorEventType,
    SensorEventAlgorithm,
    SensorParameterType,
    SensorParameterAlgorithm,
} from '../../models';
import { IqsDataprofilesTranslateService } from '../../services/dataprofiles.translate.service';


@Component({
    selector: 'iqs-type-list',
    templateUrl: './type-list.component.html',
    styleUrls: ['./type-list.component.scss']
})
export class IqsDataprofilesTypeListComponent implements OnChanges {

    public params: DataprofileListItem[];

    @Input() loading: boolean;
    @Input() parameters: ActuatorCommandType[] | SensorEventType[] | SensorParameterType[];

    @Output() paramClick = new EventEmitter<number>();
    @Output() removeClick = new EventEmitter<number>();

    constructor(
        private dpTranslate: IqsDataprofilesTranslateService
    ) { }


    ngOnChanges(changes: SimpleChanges) {
        if (changes.parameters && this.parameters) {
            this.params = [];
            for (const param of this.parameters) {
                const item = new DataprofileListItem();
                item.id = param.id;
                item.title = `${param.id}. ${this.dpTranslate.getTranslation('param', param.name)}`;
                if (param.value_unit) { item.title += ' (' + this.dpTranslate.getTranslation('unit', param.value_unit) + ')'; }
                item.subtitle = this.dpTranslate.getTranslation('alg', param.algorithm);
                if (param.value_type) { item.subtitle += `. ${this.dpTranslate.getTranslation('value_type', param.value_type)}`; }
                if (param.hasOwnProperty('min_value') || param.hasOwnProperty('max_value')) {
                    const parts = [];
                    if (param.hasOwnProperty('min_value')) {
                        parts.push(this.dpTranslate.getTranslation('kw', 'gt', { value: param.min_value }));
                    }
                    if (param.hasOwnProperty('max_value')) {
                        parts.push(this.dpTranslate.getTranslation('kw', 'lt', { value: param.max_value }));
                    }
                    item.subtitle += ' ' + parts.join(` ${this.dpTranslate.getTranslation('kw', 'and')} `);
                }
                switch (param.algorithm) {
                    case ActuatorCommandAlgorithm.SoundSignal:
                        item.fontIcon = 'webui-bell-ring';
                        break;
                    case SensorEventAlgorithm.Count:
                    case SensorParameterAlgorithm.Count:
                        item.fontIcon = 'webui-pie-circle';
                        break;
                    case SensorParameterAlgorithm.Statistics:
                        item.fontIcon = 'webui-bars';
                        break;
                    case SensorParameterAlgorithm.Duration:
                        item.fontIcon = 'webui-clock-back';
                        break;
                    case SensorParameterAlgorithm.Transport:
                        item.fontIcon = 'iqt-truck-fast';
                        break;
                    case SensorParameterAlgorithm.Consumption:
                        item.fontIcon = 'iqt-speedometer';
                        break;
                    case SensorParameterAlgorithm.Pressure:
                        item.fontIcon = 'iqt-engine';
                        break;
                    default:
                        item.fontIcon = 'webui-question';
                        break;
                }
                this.params.push(item);
            }
        }
    }

    public trackById(param: ActuatorCommandType | SensorEventType | SensorParameterType) {
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
