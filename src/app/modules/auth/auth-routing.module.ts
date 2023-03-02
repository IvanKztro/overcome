import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

// import { SignUpComponent } from './sign-up/sign-up.component';
// import { SignInComponent } from './sign-in/sign-in.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      // { path: 'sign-in', component: SignInComponent },
      // { path: 'sign-up', component: SignUpComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
