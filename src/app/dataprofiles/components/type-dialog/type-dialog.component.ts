import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import pickBy from 'lodash/pickBy';
import { take } from 'rxjs/operators';

import { typeDialogTranslations } from './type-dialog.strings';
import {
    ActuatorCommandType,
    ActuatorCommandAlgorithm,
    SensorEventType,
    SensorEventAlgorithm,
    SensorParameterType,
    SensorParameterAlgorithm,
    TypeDialogType,
    ValueType,
    ValueUnit
} from '../../models';

export interface IqsDataprofilesTypeDialogData {
    param: ActuatorCommandType | SensorEventType | SensorParameterType;
    type: TypeDialogType;
    readonly?: boolean;
}

class MinMaxValidator {
    static RangeValidator(control: AbstractControl) {
        const min = control.get('min_value').value;
        const max = control.get('max_value').value;
        if (min && max && min > max) {
            control.get('min_value').setErrors({ range: true });
            control.get('max_value').setErrors({ range: true });
        } else {
            control.get('min_value').setErrors(null);
            control.get('max_value').setErrors(null);
            return null;
        }
    }
}

@Component({
    selector: 'iqs-type-dialog',
    templateUrl: './type-dialog.component.html',
    styleUrls: ['./type-dialog.component.scss']
})
export class IqsDataprofilesTypeDialogComponent implements OnInit {

    public form: FormGroup;
    public typeOptions = Object.values(ValueType);
    public unitOptions = Object.values(ValueUnit);
    public algOptions: string[];
    public dialogTitle: string;
    public actionButtonText: string;
    public readonly: boolean;

    @Output() tryAdd = new EventEmitter<ActuatorCommandType | SensorEventType | SensorParameterType>();

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: IqsDataprofilesTypeDialogData,
        private fb: FormBuilder,
        private translate: TranslateService,
    ) {
        this.translate.setTranslation('en', typeDialogTranslations.en, true);
        this.translate.setTranslation('ru', typeDialogTranslations.ru, true);

        this.form = this.fb.group({
            id: ['', [Validators.required, Validators.min(100)]],
            name: ['', Validators.required],
            algorithm: ['', Validators.required],
            value_type: ['', Validators.required],
            value_unit: [''],
            min_value: [null],
            max_value: [null],
        }, {
                validators: [MinMaxValidator.RangeValidator]
            });
    }

    ngOnInit() {
        if (this.data.readonly) {
            this.form.disable();
            this.readonly = true;
        }
        switch (this.data.type) {
            case TypeDialogType.Command:
                this.dialogTitle = this.readonly
                    ? 'TYPE_DIALOG_TITLE_COMMAND_VIEW'
                    : this.data.param ? 'TYPE_DIALOG_TITLE_COMMAND_EDIT' : 'TYPE_DIALOG_TITLE_COMMAND_ADD';
                this.algOptions = Object.values(ActuatorCommandAlgorithm);
                break;
            case TypeDialogType.Event:
                this.dialogTitle = this.readonly
                    ? 'TYPE_DIALOG_TITLE_EVENT_VIEW'
                    : this.data.param ? 'TYPE_DIALOG_TITLE_EVENT_EDIT' : 'TYPE_DIALOG_TITLE_EVENT_ADD';
                this.algOptions = Object.values(SensorEventAlgorithm);
                break;
            case TypeDialogType.Parameter:
                this.dialogTitle = this.readonly
                    ? 'TYPE_DIALOG_TITLE_PARAMETER_VIEW'
                    : this.data.param ? 'TYPE_DIALOG_TITLE_PARAMETER_EDIT' : 'TYPE_DIALOG_TITLE_PARAMETER_ADD';
                this.algOptions = Object.values(SensorParameterAlgorithm);
                break;
        }
        this.actionButtonText = this.data.param ? 'TYPE_DIALOG_ACTION_SAVE' : 'TYPE_DIALOG_ACTION_ADD';
        if (this.data.param) {
            this.form.setValue({
                id: this.data.param.id,
                name: this.data.param.name,
                algorithm: this.data.param.algorithm,
                value_type: this.data.param.value_type || '',
                value_unit: this.data.param.value_unit || '',
                min_value: this.data.param.hasOwnProperty('min_value') ? this.data.param.min_value : null,
                max_value: this.data.param.hasOwnProperty('max_value') ? this.data.param.max_value : null,
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
