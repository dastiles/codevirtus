import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { CompanyService } from './services/api/company/company.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AuthComponent,
    CompanyDetailsComponent,
    UserDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
  ],
  providers: [CompanyService, HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
