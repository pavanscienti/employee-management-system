// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EmployeeRegistrationComponent } from './pages/employee-registration/employee-registration.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'employee', component: EmployeeRegistrationComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route redirects to the login page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
