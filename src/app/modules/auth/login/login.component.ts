import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  signForm: FormGroup;
  visibility: boolean;
  constructor(public auth: AuthService, private fb: FormBuilder) {
    this.visibility = false;
    this.signForm = this.fb.group({
      displayName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberUser: false,
    });
  }

  ngOnInit(): void {}

  async login() {
    const { email, password } = this.signForm.value;
    await this.auth.loginWithEmail(email, password);
  }

  async registerUser() {
    const { email, password, displayName } = this.signForm.value;

    await this.auth.registerWithEmail(displayName, email, password);
  }

  visibilityToggle() {
    this.visibility = !this.visibility;
  }
}
