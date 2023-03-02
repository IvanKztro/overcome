import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

//componentes
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FlexLayoutModule } from '@angular/flex-layout';

// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSnackBarModule } from '@angular/material/snack-bar';

//routes
// import { SignUpComponent } from './sign-up/sign-up.component';
// import { SignInComponent } from './sign-in/sign-in.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
// import { ForgetPasswordComponent } from './forget-password/forget-password.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    // SignInComponent,
    // SignUpComponent,
    // ForgetPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // MatCheckboxModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatButtonModule,
    // MatIconModule,
    // MatSnackBarModule,
    // FlexLayoutModule,
  ],
})
export class AuthModule {}
