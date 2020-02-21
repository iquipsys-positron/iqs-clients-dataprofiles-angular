import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import findIndex from 'lodash/findIndex';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';

import { IqsDeviceprofilesDataService } from '../services/deviceprofiles.data.service';
import * as actionsFromDeviceprofiles from './deviceprofiles.actions';
import { DeviceprofilesViewState, BaseDeviceProfile, DeviceProfile } from '../models';

@Injectable()
export class IqsDeviceprofilesEffects {
    constructor(
        private activatedRoute: ActivatedRoute,
        private actions$: Actions,
        private ds: IqsDeviceprofilesDataService
    ) { }

    @Effect() deviceprofiles$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromDeviceprofiles.DeviceprofilesActionType.DeviceprofilesInit),
        switchMap((action: actionsFromDeviceprofiles.DeviceprofilesInitAction) => {
            return forkJoin(
                this.ds.readBaseDeviceProfiles(),
                this.ds.readDeviceProfiles()
            ).pipe(
                map(([base, profiles]: [BaseDeviceProfile[], DeviceProfile[]]) =>
                    new actionsFromDeviceprofiles.DeviceprofilesSuccessAction({ base, profiles })),
                catchError(error => of(new actionsFromDeviceprofiles.DeviceprofilesFailureAction({ error })))
            );
        })
    );

    @Effect() deviceprofilesSuccess$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromDeviceprofiles.DeviceprofilesActionType.DeviceprofilesSuccess),
        mergeMap((action: actionsFromDeviceprofiles.DeviceprofilesSuccessAction) => {
            const actions: Action[] = [];
            const state = this.activatedRoute.snapshot.queryParams['state'];
            if (action.payload.profiles && action.payload.profiles.length) {
                const profile_id = this.activatedRoute.snapshot.queryParams['profile_id'];
                let idx = findIndex(action.payload.profiles, ['id', profile_id]);
                if (idx < 0) { idx = 0; }
                actions.push(new actionsFromDeviceprofiles.DeviceprofilesSelectAction({
                    id: action.payload.profiles[idx].id
                }));
            }
            actions.push(new actionsFromDeviceprofiles.DeviceprofilesChangeStateAction({
                state: state && state === DeviceprofilesViewState.Edit
                    ? state
                    : (action.payload.profiles && action.payload.profiles.length
                        ? DeviceprofilesViewState.View
                        : DeviceprofilesViewState.Empty)
            }));
            return actions;
        })
    );

    @Effect() deviceprofilesFailure$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromDeviceprofiles.DeviceprofilesActionType.DeviceprofilesFailure),
        map((action: actionsFromDeviceprofiles.DeviceprofilesFailureAction) => {
            return new actionsFromDeviceprofiles.DeviceprofilesChangeStateAction({
                state: DeviceprofilesViewState.Error
            });
        })
    );

    @Effect() deviceprofileCreate$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromDeviceprofiles.DeviceprofilesActionType.DeviceprofilesCreate),
        switchMap((action: actionsFromDeviceprofiles.DeviceprofilesCreateAction) => {
            return this.ds.createDeviceProfile(action.payload.profile).pipe(
                map(profile => new actionsFromDeviceprofiles.DeviceprofilesCreateSuccessAction({ profile })),
                catchError(error => of(new actionsFromDeviceprofiles.DeviceprofilesCreateFailureAction({ error })))
            );
        })
    );

    @Effect() deviceprofileUpdate$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromDeviceprofiles.DeviceprofilesActionType.DeviceprofilesUpdate),
        switchMap((action: actionsFromDeviceprofiles.DeviceprofilesUpdateAction) => {
            return this.ds.updateDeviceProfile(action.payload.id, action.payload.profile).pipe(
                map(profile => new actionsFromDeviceprofiles.DeviceprofilesUpdateSuccessAction({ id: action.payload.id, profile })),
                catchError(error => of(new actionsFromDeviceprofiles.DeviceprofilesUpdateFailureAction({ error })))
            );
        })
    );

    @Effect() deviceprofileDelete$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromDeviceprofiles.DeviceprofilesActionType.DeviceprofilesDelete),
        switchMap((action: actionsFromDeviceprofiles.DeviceprofilesDeleteAction) => {
            return this.ds.deleteDeviceProfile(action.payload.id).pipe(
                map(() => new actionsFromDeviceprofiles.DeviceprofilesDeleteSuccessAction({ id: action.payload.id })),
                catchError(error => of(new actionsFromDeviceprofiles.DeviceprofilesDeleteFailureAction({ error })))
            );
        })
    );
}
