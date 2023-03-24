import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { TestComponent } from './testing/test/test.component';

const routes: Routes = [
  { path: 'auth/login', component: LoginPageComponent, canActivate:[AuthGuard] },
  { path: 'auth/signup', component: SignupPageComponent, canActivate:[AuthGuard]},
  { path: 'home', component: HomePageComponent },
  { path: 'test', component: TestComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
