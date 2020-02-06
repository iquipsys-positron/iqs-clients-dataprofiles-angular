import { fromJS } from 'immutable';

import { DeviceprofilesAction, DeviceprofilesActionType } from './deviceprofiles.actions';
import { DeviceprofilesState } from './deviceprofiles.state';
import { DeviceprofilesViewState, DeviceProfile } from '../models';

export const deviceprofilesInitialState: DeviceprofilesState = {
    base: [],
    profiles: [],
    selectedIndex: null,
    state: DeviceprofilesViewState.Progress,
    isSingle: false,
    loading: false,
    error: null,
};

export function deviceprofilesReducer(
    state = deviceprofilesInitialState,
    action: DeviceprofilesAction
): DeviceprofilesState {

    switch (action.type) {
        case DeviceprofilesActionType.DeviceprofilesInit: {
            let map = fromJS(state);
            map = map.set('state', DeviceprofilesViewState.Progress);
            map = map.set('loading', false);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesSuccess: {
            let map = fromJS(state);
            map = map.set('base', action.payload.base);
            map = map.set('profiles', action.payload.profiles);
            map = map.set('loading', false);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesChangeSingle: {
            let map = fromJS(state);
            map = map.set('isSingle', action.payload.single);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesSelect: {
            let map = fromJS(state);
            map = map.set('selectedIndex', action.payload.idx);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesChangeState: {
            let map = fromJS(state);
            map = map.set('state', action.payload.state);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesCreate: {
            let map = fromJS(state);
            map = map.set('loading', true);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesCreateSuccess: {
            let map = fromJS(state);
            const profiles: DeviceProfile[] = map.get('profiles').toJS();
            profiles.push(action.payload.profile);
            map = map.set('profiles', profiles);
            map = map.set('loading', false);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesCreateFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesUpdate: {
            let map = fromJS(state);
            map = map.set('loading', true);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesUpdateSuccess: {
            let map = fromJS(state);
            const profiles: DeviceProfile[] = map.get('profiles').toJS();
            const idx = profiles.findIndex(p => p.id === action.payload.id);
            if (idx >= 0) {
                profiles[idx] = action.payload.profile;
            }
            map = map.set('profiles', profiles);
            map = map.set('loading', false);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesUpdateFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesDelete: {
            let map = fromJS(state);
            map = map.set('loading', true);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesDeleteSuccess: {
            let map = fromJS(state);
            const profiles: DeviceProfile[] = map.get('profiles').toJS();
            const idx = profiles.findIndex(p => p.id === action.payload.id);
            if (idx >= 0) {
                profiles.splice(idx, 1);
            }
            if (profiles.length > 0) {
                map = map.set('selectedIndex', idx === 0 ? idx : idx - 1);
                map = map.set('state', DeviceprofilesViewState.View);
            } else {
                map = map.set('state', DeviceprofilesViewState.Empty);
            }
            map = map.set('profiles', profiles);
            map = map.set('loading', false);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesDeleteFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return <DeviceprofilesState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
