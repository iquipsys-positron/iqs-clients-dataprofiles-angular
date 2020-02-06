import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import find from 'lodash/find';

import {
    ActuatorCommandType,
    DataprofileListItem,
    SensorParameterType,
    SensorEventType,
    SensorStateType,
    SensorStateAlgorithm,
    ValueUnit
} from '../../models';
import { IqsDataprofilesTranslateService } from '../../services/dataprofiles.translate.service';

@Component({
    selector: 'iqs-state-list',
    templateUrl: './state-list.component.html',
    styleUrls: ['./state-list.component.scss']
})
export class IqsDataprofilesStateListComponent implements OnChanges {

    public params: DataprofileListItem[];

    @Input() loading: boolean;
    @Input() states: SensorStateType[];
    @Input() parameters: SensorParameterType[];
    @Input() events: SensorEventType[];
    @Input() commands: ActuatorCommandType[];

    @Output() stateClick = new EventEmitter<number>();
    @Output() removeClick = new EventEmitter<number>();

    constructor(
        private dpTranslate: IqsDataprofilesTranslateService
    ) { }


    ngOnChanges(changes: SimpleChanges) {
        if ((changes.states || changes.parameters || changes.events || changes.commands) && this.states) {
            this.params = [];
            for (const state of this.states) {
                const item = new DataprofileListItem();
                item.id = state.id;
                item.title = `${state.id}. ${this.dpTranslate.getTranslation('param', state.name)}`;
                item.subtitle = this.dpTranslate.getTranslation('alg', state.algorithm);
                if (state.hasOwnProperty('param_id')
                    || state.hasOwnProperty('event_id')
                    || state.hasOwnProperty('command_id')
                    || state.hasOwnProperty('on_event_id')
                    || state.hasOwnProperty('off_event_id')) {
                    item.subtitle += '. ';
                    let unit: ValueUnit;
                    const subtitleParts = [];
                    if (state.hasOwnProperty('param_id')) {
                        let subtitlePart = this.dpTranslate.getTranslation('kw', 'activation_by_parameter');
                        const param: SensorParameterType = find(this.parameters, ['id', state.param_id]);
                        subtitlePart += param ? ` "${this.dpTranslate.getTranslation('param', param.name)}"` : ' #' + state.param_id;
                        if (param && param.value_unit) { unit = param.value_unit; }
                        if (state.hasOwnProperty('value_min') || state.hasOwnProperty('value_max')) {
                            const parts = [];
                            if (state.hasOwnProperty('value_min')) {
                                parts.push(
                                    this.dpTranslate.getTranslation('kw', 'from', { value: state.value_min }) +
                                    (unit ? ' ' + this.dpTranslate.getTranslation('unit', unit) : '')
                                );
                            }
                            if (state.hasOwnProperty('value_max')) {
                                parts.push(
                                    this.dpTranslate.getTranslation('kw', 'to', { value: state.value_max }) +
                                    (unit ? ' ' + this.dpTranslate.getTranslation('unit', unit) : '')
                                );
                            }
                            subtitlePart += ' ' + parts.join(' ');
                        }
                        subtitleParts.push(subtitlePart);
                    }
                    if (state.hasOwnProperty('event_id')) {
                        let subtitlePart = this.dpTranslate.getTranslation('kw', 'activation_by_event');
                        const event: SensorEventType = find(this.events, ['id', state.event_id]);
                        subtitlePart += event ? ` "${this.dpTranslate.getTranslation('param', event.name)}"` : ' #' + state.event_id;
                        subtitleParts.push(subtitlePart);
                    }
                    if (state.hasOwnProperty('command_id')) {
                        let subtitlePart = this.dpTranslate.getTranslation('kw', 'activation_by_command');
                        const command: ActuatorCommandType = find(this.commands, ['id', state.command_id]);
                        subtitlePart += command ? ` "${this.dpTranslate.getTranslation('param', command.name)}"` : ' #' + state.command_id;
                        subtitleParts.push(subtitlePart);
                    }
                    if (state.hasOwnProperty('on_event_id')) {
                        let subtitlePart = this.dpTranslate.getTranslation('kw', 'activation_by_on_event');
                        const on_event: SensorEventType = find(this.events, ['id', state.on_event_id]);
                        subtitlePart += on_event
                            ? ` "${this.dpTranslate.getTranslation('event', on_event.name)}"`
                            : ' #' + state.on_event_id;
                        subtitleParts.push(subtitlePart);
                    }
                    if (state.hasOwnProperty('off_event_id')) {
                        let subtitlePart = this.dpTranslate.getTranslation('kw', 'activation_by_off_event');
                        const off_event: SensorEventType = find(this.events, ['id', state.off_event_id]);
                        subtitlePart += off_event
                            ? ` "${this.dpTranslate.getTranslation('event', off_event.name)}"`
                            : ' #' + state.off_event_id;
                        subtitleParts.push(subtitlePart);
                    }
                    item.subtitle += subtitleParts.join('. ');
                }
                switch (state.algorithm) {
                    case SensorStateAlgorithm.Duration:
                        item.fontIcon = 'webui-time';
                        break;
                    case SensorStateAlgorithm.Utilization:
                        item.fontIcon = 'iqt-speedometer';
                        break;
                    default:
                        item.fontIcon = 'webui-question';
                        break;
                }
                this.params.push(item);
            }
        }
    }

    public trackById(state: SensorStateType) {
        return state && state.id;
    }

    public onStateClick(state_id: number) {
        if (this.loading || !state_id) { return; }
        this.stateClick.emit(state_id);
    }

    public onRemoveClick(event: MouseEvent, state_id: number) {
        if (this.loading || state_id < 100) { return; }
        event.stopPropagation();
        this.removeClick.emit(state_id);
    }

}
