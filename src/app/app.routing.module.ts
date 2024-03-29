import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { CnComponent } from "./home/cn/core-template/cn.component";
import { RnComponent } from "./home/rn/rn.component";
import { BscComponent } from "./home/rn/bsc/bsc.component";
import { ChronicComponent } from "./home/rn/chronic/chronic.component";
import { HubComponent } from "./home/rn/hub/hub.component";
import { AuthGuard } from "./auth-guard.service";
import { AddPhoneNumbersComponent } from "./add-phone-numbers/add-phone-numbers.component";
import { RoleGuardGuard } from "./role-guard.guard";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { NewIdeasComponent } from "./home/new-ideas/new-ideas.component";
import { CoreTemplateComponent } from "./home/cn/core-template.component";
import { InternetTemplateComponent } from "./home/cn/internet-template/internet-template.component";
import { MassPowerComponent } from "./home/rn/mass-power/mass-power.component";

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate:[AuthGuard]  },
    { path: 'home/dashboard', component: DashboardComponent , canActivate:[AuthGuard]},
    { path: 'home/newIdeas', component: NewIdeasComponent , canActivate:[AuthGuard]},
    //{ path: 'home/cn', component: CnComponent , canActivate:[AuthGuard]},
    {
        path: 'home/cn', component: CoreTemplateComponent, children: [
            { path: 'template', component: CnComponent },
            { path: 'internet', component: InternetTemplateComponent },
        ] , canActivate:[AuthGuard]
    },
    {
        path: 'home/rn', component: RnComponent, children: [
            { path: 'bsc', component: BscComponent },
            { path: 'chronic', component: ChronicComponent },
            { path: 'hub', component: HubComponent },
        ] , canActivate:[AuthGuard]
    },
    { path: 'home/HUB/:id', component: HubComponent, canActivate:[AuthGuard]  },
    { path: 'home/CORE/:id', component: CnComponent  , canActivate:[AuthGuard]},
    { path: 'home/InternetCases/:id', component: InternetTemplateComponent, canActivate:[AuthGuard]},
    { path: 'home/MassPower/:id', component: MassPowerComponent , canActivate:[AuthGuard]},
    { path: 'home/CHRONIC/:id', component: ChronicComponent , canActivate:[AuthGuard] },
    { path: 'home/BSC/RNC/:id', component: BscComponent , canActivate:[AuthGuard] },

    { path: 'home/HUB/update/:id', component: HubComponent, canActivate:[AuthGuard]  },
    { path: 'home/CORE/update/:id', component: CnComponent  , canActivate:[AuthGuard]},
    { path: 'home/InternetCases/update/:id', component: InternetTemplateComponent, canActivate:[AuthGuard]},
    { path: 'home/MassPower/update/:id', component: MassPowerComponent , canActivate:[AuthGuard]},
    { path: 'home/CHRONIC/update/:id', component: ChronicComponent , canActivate:[AuthGuard] },
    { path: 'home/BSC/RNC/update/:id', component: BscComponent , canActivate:[AuthGuard] },

    {
        path: 'add',
        component: AddPhoneNumbersComponent,
        canActivate: [AuthGuard, RoleGuardGuard],
        data: {
            expectedRoles: ['admin']
        }
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {

}