import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
    { path: 'data', loadChildren: './dataprofiles/dataprofiles.module#IqsDataprofilesModule' },
    { path: 'device', loadChildren: './deviceprofiles/deviceprofiles.module#IqsDeviceprofilesModule' },
    { path: '', redirectTo: 'device', pathMatch: 'full' },
    { path: '**', redirectTo: '404' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
