import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import pickBy from 'lodash/pickBy';
import { take } from 'rxjs/operators';

import { typeDialogTranslations } from './state-dialog.strings';
import {
    ActuatorCommandType,
    SensorEventType,
    SensorParameterType,
    SensorStateType,
    SensorStateAlgorithm,
} from '../../models';
import { IqsDataprofilesTranslateService } from '../../services';

export interface IqsDataprofilesStateDialogData {
    state: SensorStateType;
    commands: ActuatorCommandType[];
    events: SensorEventType[];
    parameters: SensorParameterType[];
    readonly?: boolean;
}

class MinMaxValidator {
    static RangeValidator(control: AbstractControl) {
        const min = control.get('value_min').value;
        const max = control.get('value_max').value;
        if (min && max && min > max) {
            control.get('value_min').setErrors({ range: true });
            control.get('value_max').setErrors({ range: true });
        } else {
            control.get('value_min').setErrors(null);
            control.get('value_max').setErrors(null);
            return null;
        }
    }
}

@Component({
    selector: 'iqs-state-dialog',
    templateUrl: './state-dialog.component.html',
    styleUrls: ['./state-dialog.component.scss']
})
export class IqsDataprofilesStateDialogComponent implements OnInit {

    public form: FormGroup;
    public algOptions = Object.values(SensorStateAlgorithm);
    public dialogTitle: string;
    public actionButtonText: string;
    public readonly: boolean;

    @Output() tryAdd = new EventEmitter<SensorEventType>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IqsDataprofilesStateDialogData,
        private fb: FormBuilder,
        private translate: TranslateService,
        public dpTranslate: IqsDataprofilesTranslateService
    ) {
        this.translate.setTranslation('en', typeDialogTranslations.en, true);
        this.translate.setTranslation('ru', typeDialogTranslations.ru, true);

        this.form = this.fb.group({
            id: ['', [Validators.required, Validators.min(100)]],
            name: ['', Validators.required],
            algorithm: ['', Validators.required],
            param_id: [''],
            command_id: [''],
            event_id: [''],
            on_event_id: [''],
            off_event_id: [''],
            value_min: [null],
            value_max: [null],
        }, {
                validators: [MinMaxValidator.RangeValidator]
            });
    }

    ngOnInit() {
        if (this.data.readonly) {
            this.form.disable();
            this.readonly = true;
        }
        this.dialogTitle = this.readonly
            ? 'STATE_DIALOG_TITLE_VIEW'
            : (this.data.state ? 'STATE_DIALOG_TITLE_EDIT' : 'STATE_DIALOG_TITLE_ADD');
        this.actionButtonText = this.data.state ? 'STATE_DIALOG_ACTION_SAVE' : 'STATE_DIALOG_ACTION_ADD';
        if (this.data.state) {
            this.form.setValue({
                id: this.data.state.id,
                name: this.data.state.name,
                algorithm: this.data.state.algorithm,
                param_id: this.data.state.param_id || null,
                command_id: this.data.state.command_id || null,
                event_id: this.data.state.event_id || null,
                on_event_id: this.data.state.on_event_id || null,
                off_event_id: this.data.state.off_event_id || null,
                value_min: this.data.state.hasOwnProperty('value_min') ? this.data.state.value_min : null,
                value_max: this.data.state.hasOwnProperty('value_max') ? this.data.state.value_max : null,
            });
            this.form.markAsUntouched();
        }
    }

    public hasError(field: string, error: string) {
        return this.form.get(field).getError(error) && this.form.get(field).touched;
    }

    public setExistError() {
        this.form.get('id').setErrors({ 'exist': true });
        this.form.get('id').valueChanges.pipe(take(1)).subscribe(() => this.form.get('id').setErrors({ 'exist': false }));
    }

    public onTryAdd() {
        this.tryAdd.emit(pickBy(this.form.getRawValue(), (val) => val !== null && val !== ''));
    }

}
