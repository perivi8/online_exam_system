import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { HeaderComponent } from './components/header/header.component';
import { EditExamComponent } from './components/edit-exam/edit-exam.component';
import { AuthGuard } from './guards/auth.guard';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    StudentDashboardComponent,
    TeacherDashboardComponent,
    ExaminerDashboardComponent,
    ProctorDashboardComponent,
    ScheduledExamsComponent,
    TakeExamComponent,
    ExamResultsComponent,
    RaiseQueriesComponent,
    CreateExamComponent,
    PerformanceReportComponent,
    EvaluateExamComponent,
    HeaderComponent,
    EditExamComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }