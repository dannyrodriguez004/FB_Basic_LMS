import { ConfirmEnrollComponent } from './course/confirm-enroll/confirm-enroll.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { CoursesComponent } from './courses/courses.component';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { NgModule } from '@angular/core';
import { QuizResultComponent } from './assessment/quiz-result/quiz-result.component';

const routes: Routes = [
    {path:'', component: CoursesComponent},
    {path:'view-course', component: CourseComponent},
    {path:'assessment', component: AssessmentComponent},
    {path:'result', component: QuizResultComponent},
    {path:'confirm-enroll', component: ConfirmEnrollComponent},
    {path:'**', redirectTo: '' },
];

@NgModule({ 
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CoursesRoutingModule {}