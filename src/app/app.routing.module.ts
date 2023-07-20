import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { CnComponent } from "./home/cn/cn.component";
import { RnComponent } from "./home/rn/rn.component";
import { BscComponent } from "./home/rn/bsc/bsc.component";
import { ChronicComponent } from "./home/rn/chronic/chronic.component";
import { HubComponent } from "./home/rn/hub/hub.component";

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: "full"},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent, children: [
        {path: 'cn', component: CnComponent},
        {path: 'rn', component: RnComponent, children: [
            {path: 'bsc', component: BscComponent},
            {path: 'chronic', component: ChronicComponent},
            {path: 'hub', component: HubComponent}
        ]},
        {path: 'HUB/:id', component: HubComponent},
        {path: 'CORE/:id', component: CnComponent},
        {path: 'CHRONIC/:id', component: ChronicComponent},
        {path: 'BSC/RNC/:id', component: BscComponent},
    ]}
]

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule {

}