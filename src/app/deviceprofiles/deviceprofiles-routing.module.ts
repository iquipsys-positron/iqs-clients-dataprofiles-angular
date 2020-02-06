import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'iqs-libs-clientshell2-angular';

import { IqsDeviceprofilesContainerComponent } from './containers/deviceprofiles-container/deviceprofiles-container.component';

export const routes: Routes = [
    { path: '', component: IqsDeviceprofilesContainerComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IqsDeviceprofilesRoutingModule { }
