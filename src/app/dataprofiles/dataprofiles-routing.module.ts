import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'iqs-libs-clientshell2-angular';

import { IqsDataprofilesContainerComponent } from './containers/dataprofiles-container/dataprofiles-container.component';

export const routes: Routes = [
    { path: '', component: IqsDataprofilesContainerComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IqsDataprofilesRoutingModule { }
