import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { ExaminerDashboardComponent } from './components/examiner-dashboard/examiner-dashboard.component';
import { ProctorDashboardComponent } from './components/proctor-dashboard/proctor-dashboard.component';
import { ScheduledExamsComponent } from './components/scheduled-exams/scheduled-exams.component';
import { TakeExamComponent } from './components/take-exam/take-exam.component';
import { ExamResultsComponent } from './components/exam-results/exam-results.component';
import { RaiseQueriesComponent } from './components/raise-queries/raise-queries.component';
import { CreateExamComponent } from './components/create-exam/create-exam.component';
import { PerformanceReportComponent } from './components/performance-report/performance-report.component';
import { EvaluateExamComponent } from './components/evaluate-exam/evaluate-exam.component';
import { EditExamComponent } from './components/edit-exam/edit-exam.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard] },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent, canActivate: [AuthGuard] },
  { path: 'examiner-dashboard', component: ExaminerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'proctor-dashboard', component: ProctorDashboardComponent, canActivate: [AuthGuard] },
  { path: 'scheduled-exams', component: ScheduledExamsComponent, canActivate: [AuthGuard] },
  { path: 'take-exam/:id', component: TakeExamComponent, canActivate: [AuthGuard] },
  { path: 'exam-results', component: ExamResultsComponent, canActivate: [AuthGuard] },
  { path: 'raise-queries', component: RaiseQueriesComponent, canActivate: [AuthGuard] },
  { path: 'create-exam', component: CreateExamComponent, canActivate: [AuthGuard] },
  { path: 'edit-exam/:id', component: EditExamComponent, canActivate: [AuthGuard] },
  { path: 'performance-report', component: PerformanceReportComponent, canActivate: [AuthGuard] },
  { path: 'evaluate-exam', component: EvaluateExamComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }