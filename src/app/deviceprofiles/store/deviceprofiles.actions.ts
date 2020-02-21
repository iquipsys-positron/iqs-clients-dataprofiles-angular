import { Action } from '@ngrx/store';

import { BaseDeviceProfile, DeviceprofilesViewState, DeviceProfile } from '../models';

export enum DeviceprofilesActionType {
    DeviceprofilesInit = '[Deviceprofiles] Init',
    DeviceprofilesSuccess = '[Deviceprofiles] Success',
    DeviceprofilesFailure = '[Deviceprofiles] Failure',
    DeviceprofilesChangeState = '[Deviceprofiles] ChangeState',
    DeviceprofilesSelect = '[Deviceprofiles] Select',
    DeviceprofilesChangeSingle = '[Deviceprofiles] ChangeSingle',
    DeviceprofilesCreate = '[Deviceprofiles] Create',
    DeviceprofilesCreateSuccess = '[Deviceprofiles] CreateSuccess',
    DeviceprofilesCreateFailure = '[Deviceprofiles] CreateFailure',
    DeviceprofilesUpdate = '[Deviceprofiles] Update',
    DeviceprofilesUpdateSuccess = '[Deviceprofiles] UpdateSuccess',
    DeviceprofilesUpdateFailure = '[Deviceprofiles] UpdateFailure',
    DeviceprofilesDelete = '[Deviceprofiles] Delete',
    DeviceprofilesDeleteSuccess = '[Deviceprofiles] DeleteSuccess',
    DeviceprofilesDeleteFailure = '[Deviceprofiles] DeleteFailure',
}

export class DeviceprofilesInitAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesInit;

    constructor() { }
}

export class DeviceprofilesSuccessAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesSuccess;

    constructor(public payload: {
        base: BaseDeviceProfile[],
        profiles: DeviceProfile[]
    }) { }
}

export class DeviceprofilesFailureAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export class DeviceprofilesChangeStateAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesChangeState;

    constructor(public payload: {
        state: DeviceprofilesViewState
    }) { }
}

export class DeviceprofilesSelectAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesSelect;

    constructor(public payload: {
        // idx: number,
        id: string,
        // state?: DeviceprofilesViewState
    }) { }
}

export class DeviceprofilesChangeSingleAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesChangeSingle;

    constructor(public payload: {
        single: boolean
    }) { }
}

export class DeviceprofilesCreateAction {
    readonly type = DeviceprofilesActionType.DeviceprofilesCreate;

    constructor(public payload: {
        profile: DeviceProfile
    }) { }
}

export class DeviceprofilesCreateSuccessAction {
    readonly type = DeviceprofilesActionType.DeviceprofilesCreateSuccess;

    constructor(public payload: {
        profile: DeviceProfile
    }) { }
}

export class DeviceprofilesCreateFailureAction {
    readonly type = DeviceprofilesActionType.DeviceprofilesCreateFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export class DeviceprofilesUpdateAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesUpdate;

    constructor(public payload: {
        id: string,
        profile: DeviceProfile
    }) { }
}

export class DeviceprofilesUpdateSuccessAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesUpdateSuccess;

    constructor(public payload: {
        id: string,
        profile: DeviceProfile
    }) { }
}

export class DeviceprofilesUpdateFailureAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesUpdateFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export class DeviceprofilesDeleteAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesDelete;

    constructor(public payload: {
        id: string
    }) { }
}

export class DeviceprofilesDeleteSuccessAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesDeleteSuccess;

    constructor(public payload: {
        id: string
    }) { }
}

export class DeviceprofilesDeleteFailureAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesDeleteFailure;

    constructor(public payload: {
        error: any
    }) { }
}


export type DeviceprofilesAction =
    DeviceprofilesInitAction
    | DeviceprofilesFailureAction
    | DeviceprofilesSuccessAction
    | DeviceprofilesChangeStateAction
    | DeviceprofilesSelectAction
    | DeviceprofilesChangeSingleAction
    | DeviceprofilesCreateAction
    | DeviceprofilesCreateSuccessAction
    | DeviceprofilesCreateFailureAction
    | DeviceprofilesUpdateAction
    | DeviceprofilesUpdateSuccessAction
    | DeviceprofilesUpdateFailureAction
    | DeviceprofilesDeleteAction
    | DeviceprofilesDeleteSuccessAction
    | DeviceprofilesDeleteFailureAction;
