import { ConfirmEnrollComponent } from './course/confirm-enroll/confirm-enroll.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { CoursesComponent } from './courses/courses.component';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { NgModule } from '@angular/core';
import { QuizResultComponent } from './assessment/quiz-result/quiz-result.component';
import { AuthGuard } from '../security/security/auth.guard';

const routes: Routes = [
    {path:'', component: CoursesComponent},
    {path:'view-course', component: CourseComponent, canActivate: [AuthGuard]},
    {path:'assessment', component: AssessmentComponent, canActivate: [AuthGuard]},
    {path:'result', component: QuizResultComponent, canActivate: [AuthGuard]},
    {path:'confirm-enroll', component: ConfirmEnrollComponent, canActivate: [AuthGuard]},
    {path:'**', redirectTo: '' },
];

@NgModule({ 
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CoursesRoutingModule {}