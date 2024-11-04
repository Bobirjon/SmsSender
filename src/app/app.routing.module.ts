import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CnComponent } from './home/cn/core-template/cn.component';
import { RnComponent } from './home/rn/rn.component';
import { BscComponent } from './home/rn/bsc/bsc.component';
import { ChronicComponent } from './home/rn/chronic/chronic.component';
import { HubComponent } from './home/rn/hub/hub.component';
import { AuthGuard } from './auth-guard.service';
import { AddPhoneNumbersComponent } from './add-phone-numbers/add-phone-numbers.component';
import { RoleGuardGuard } from './role-guard.guard';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { NewIdeasComponent } from './home/new-ideas/new-ideas.component';
import { CoreTemplateComponent } from './home/cn/core-template.component';
import { InternetTemplateComponent } from './home/cn/internet-template/internet-template.component';
import { MassPowerComponent } from './home/rn/mass-power/mass-power.component';
import { RingComponent } from './home/rn/ring/ring.component';
import { SelectedCasesComponent } from './home/selected-cases/selected-cases.component';
import { CorrectionComponent } from './home/correction/correction.component';
import { MainHomeComponent } from './main-home/main-home.component';
import { AlarmMonitorComponent } from './alarm-monitor/alarm-monitor.component';
import { DoorAlarmComponent } from './door-alarm/door-alarm.component';
import { CellDownComponent } from './cell-down/cell-down.component';
import { ReportComponent } from './report/report.component';
import { AllowedUsersComponent } from './door-alarm/allowed-users/allowed-users.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: MainHomeComponent, canActivate: [AuthGuard] },
  { path: 'senderHome', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'alarmMonitor',
    component: AlarmMonitorComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'doorAlarm',
    component: DoorAlarmComponent,
    canActivate: [AuthGuard],
  },

  { path: 'doorAlarm/allowedUser', component: AllowedUsersComponent },

  { path: 'cellDown', component: CellDownComponent, canActivate: [AuthGuard] },
  { path: 'report', component: ReportComponent, canActivate: [AuthGuard] },

  {
    path: 'home/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/newIdeas',
    component: NewIdeasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/selectedCases',
    component: SelectedCasesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/correctionList',
    component: CorrectionComponent,
    canActivate: [AuthGuard],
  },
  //{ path: 'home/cn', component: CnComponent , canActivate:[AuthGuard]},
  {
    path: 'home/cn',
    component: CoreTemplateComponent,
    children: [
      { path: 'template', component: CnComponent },
      { path: 'internet', component: InternetTemplateComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'home/rn',
    component: RnComponent,
    children: [
      { path: 'bsc', component: BscComponent },
      { path: 'chronic', component: ChronicComponent },
      { path: 'hub', component: HubComponent },
      { path: 'ring', component: RingComponent },
    ],
    canActivate: [AuthGuard],
  },
  { path: 'home/HUB/:id', component: HubComponent, canActivate: [AuthGuard] },
  { path: 'home/CORE/:id', component: CnComponent, canActivate: [AuthGuard] },
  {
    path: 'home/INTERNET/:id',
    component: InternetTemplateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/MASSPOWER/:id',
    component: MassPowerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/CHRONIC/:id',
    component: ChronicComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/BSC/RNC/:id',
    component: BscComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home/RING/:id', component: RingComponent, canActivate: [AuthGuard] },

  {
    path: 'home/HUB/update/:id',
    component: HubComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/CORE/update/:id',
    component: CnComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/INTERNET/update/:id',
    component: InternetTemplateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/MASSPOWER/update/:id',
    component: MassPowerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/CHRONIC/update/:id',
    component: ChronicComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/BSC/RNC/update/:id',
    component: BscComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/RING/update/:id',
    component: RingComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'add',
    component: AddPhoneNumbersComponent,
    canActivate: [AuthGuard, RoleGuardGuard],
    data: {
      expectedRoles: ['admin'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
