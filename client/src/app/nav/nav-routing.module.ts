import { MainComponent } from './main/main.component';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../security/security/auth.guard';

const routes: Routes = [
    { path: '', component: MainComponent, children: [
        {path: 'courses', loadChildren: () => import('../courses/courses.module').then(mod => mod.CoursesModule), canActivate: [AuthGuard]},
        {path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module')
            .then(mod => mod.DashboardModule), canActivate: [AuthGuard]},
        {path: 'helppage', loadChildren: () => import('../helppage/helppage.module').then(mod => mod.HelppageModule)},
        {path: 'home', loadChildren: () => import('../home/home.module').then(mod => mod.HomeModule)},
        {path: 'add-user', loadChildren: () => import('./fbregister/fbregister.component').then(mod => mod.FBRegisterComponent)},
        {path: 'add-course', loadChildren: () => import('./newcourse/newcourse.component')
            .then(mod => mod.NewcourseComponent), canActivate: [AuthGuard]},
        {path: 'security', loadChildren: () => import('../security/security.module').then(mod => mod.SecurityModule)},
        {path: 'security/profile', loadChildren: () => import('../security/profile/profile.component').then(mod => mod.ProfileComponent)},
        {path: 'inbox', loadChildren: () => import('../inbox/inbox.module').then(mod => mod.InboxModule)}
        // {path: '/courses/courses/discussions/', loadChildren: () => import('../courses/course/discussions/discussions.module').then(mod => mod.Cou)}

      ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NavRoutingModule {}
