import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import pickBy from 'lodash/pickBy';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { paramDialogTranslations } from './param-dialog.strings';
import {
    ActuatorCommand,
    ConfigParameter,
    SensorEvent,
    SensorParameter,
    DeviceProfileParamsListType
} from '../../models';
import {
    ActuatorCommandType,
    SensorEventType,
    SensorParameterType
} from '../../../dataprofiles/models';
import { IqsDataprofilesTranslateService } from '../../../dataprofiles/services';

export interface IqsDeviceprofilesParamDialogData {
    param?: ActuatorCommand | ConfigParameter | SensorEvent | SensorParameter;
    params$: Observable<(ActuatorCommandType | SensorEventType | SensorParameterType)[]>;
    type: DeviceProfileParamsListType;
    readonly?: boolean;
    renameable?: boolean;
    configurable?: boolean;
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
    selector: 'iqs-param-dialog',
    templateUrl: './param-dialog.component.html',
    styleUrls: ['./param-dialog.component.scss']
})
export class IqsDeviceprofilesParamDialogComponent implements OnInit {

    public form: FormGroup;
    // public paramOptions: { value: number, name: string }[];
    public params$: Observable<(ActuatorCommandType | SensorEventType | SensorParameterType)[]>;
    public dialogTitle: string;
    public actionButtonText: string;
    public readonly: boolean;
    public noScaleAndOffset = false;

    @Output() tryAdd = new EventEmitter<ActuatorCommand | ConfigParameter | SensorEvent | SensorParameter>();

    constructor(
        public dpTranslate: IqsDataprofilesTranslateService,
        @Inject(MAT_DIALOG_DATA) private data: IqsDeviceprofilesParamDialogData,
        private fb: FormBuilder,
        private translate: TranslateService,
    ) {
        this.translate.setTranslation('en', paramDialogTranslations.en, true);
        this.translate.setTranslation('ru', paramDialogTranslations.ru, true);

        this.form = this.fb.group({
            id: [null, [Validators.required, Validators.min(100)]],
            name: ['', Validators.required],
            type: [null],
            min_value: [null],
            max_value: [null],
            offset: [null],
            scale: [null]
        }, {
                validators: [MinMaxValidator.RangeValidator]
            });
    }

    ngOnInit() {
        if (this.data.readonly) {
            this.form.disable();
            this.readonly = true;
        }
        if (this.data.renameable !== true) {
            this.form.get('name').disable();
        }
        if (this.data.configurable !== true) {
            this.form.get('min_value').disable();
            this.form.get('max_value').disable();
            this.form.get('offset').disable();
            this.form.get('scale').disable();
        }
        switch (this.data.type) {
            case DeviceProfileParamsListType.Command:
                this.dialogTitle = this.readonly
                    ? 'PARAM_DIALOG_TITLE_COMMAND_VIEW'
                    : this.data.param ? 'PARAM_DIALOG_TITLE_COMMAND_EDIT' : 'PARAM_DIALOG_TITLE_COMMAND_ADD';
                break;
            case DeviceProfileParamsListType.Event:
                this.dialogTitle = this.readonly
                    ? 'PARAM_DIALOG_TITLE_EVENT_VIEW'
                    : this.data.param ? 'PARAM_DIALOG_TITLE_EVENT_EDIT' : 'PARAM_DIALOG_TITLE_EVENT_ADD';
                break;
            case DeviceProfileParamsListType.Parameter:
                this.dialogTitle = this.readonly
                    ? 'PARAM_DIALOG_TITLE_PARAMETER_VIEW'
                    : this.data.param ? 'PARAM_DIALOG_TITLE_PARAMETER_EDIT' : 'PARAM_DIALOG_TITLE_PARAMETER_ADD';
                break;
            case DeviceProfileParamsListType.Config:
                this.dialogTitle = this.readonly
                    ? 'PARAM_DIALOG_TITLE_CONFIG_VIEW'
                    : this.data.param ? 'PARAM_DIALOG_TITLE_CONFIG_EDIT' : 'PARAM_DIALOG_TITLE_CONFIG_ADD';
                this.noScaleAndOffset = true;
                break;
        }
        this.params$ = this.data.params$;
        this.actionButtonText = this.data.param ? 'PARAM_DIALOG_ACTION_SAVE' : 'PARAM_DIALOG_ACTION_ADD';
        if (this.data.param) {
            this.form.setValue({
                id: this.data.param.id,
                name: this.data.param.name || '',
                type: this.data.param.type || null,
                min_value: this.data.param.hasOwnProperty('min_value') ? this.data.param.min_value : null,
                max_value: this.data.param.hasOwnProperty('max_value') ? this.data.param.max_value : null,
                offset: this.data.param.hasOwnProperty('offset') ? this.data.param['offset'] : null,
                scale: this.data.param.hasOwnProperty('scale') ? this.data.param['scale'] : null
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
