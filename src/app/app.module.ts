import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app.routing.module';
import { AuthInterceptorService } from './auth-interceptor.service'
import { CnComponent } from './home/cn/core-template/cn.component';
import { CoreTemplateComponent } from './home/cn/core-template.component';
import { RnComponent } from './home/rn/rn.component';
import { ChronicComponent } from './home/rn/chronic/chronic.component';
import { HubComponent } from './home/rn/hub/hub.component';
import { BscComponent } from './home/rn/bsc/bsc.component';
import { StartComponent } from './home/start/start.component';
import { AddPhoneNumbersComponent } from './add-phone-numbers/add-phone-numbers.component';
import { AuthGuard } from './auth-guard.service';
import {MassPowerComponent} from './home/rn/mass-power/mass-power.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { DatePipe } from '@angular/common';
import { NewIdeasComponent } from './home/new-ideas/new-ideas.component';
import { InternetTemplateComponent } from './home/cn/internet-template/internet-template.component';
import { EditPageComponent } from './home/new-ideas/edit-page/edit-page.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    CnComponent,
    CoreTemplateComponent,
    InternetTemplateComponent,
    RnComponent,
    ChronicComponent,
    HubComponent,
    BscComponent,
    MassPowerComponent,
    DashboardComponent,
    StartComponent,
    AddPhoneNumbersComponent,
    NewIdeasComponent,
    EditPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  providers: [ AuthGuard, DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
