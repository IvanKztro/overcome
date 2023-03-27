import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { UsersService } from 'src/app/shared/services/users.service';
import { UserProfile } from 'src/app/shared/types/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  signForm: FormGroup;
  visibility: boolean;
  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public us: UsersService
  ) {
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

  async addUser(uid: string) {
    const createdAt = Timestamp.now();
    const { email, password, displayName } = this.signForm.value;

    const data: UserProfile = {
      uid: '',
      displayName,
      // role,
      email,
      createdBy: uid,
      emailVerified: false,
      status: 'active',
      plan: 'trial',
      createdAt,
    };
    try {
      this.us.addUser(data, password);
      this.snackBar.open(`${displayName} added succesfully`, 'Close', {
        duration: 4000,
      });
      // this.dialogRef.close();
    } catch (error: any) {
      this.snackBar.open(`${error.message} added error`, 'Close', {
        duration: 4000,
      });
    }
  }

  visibilityToggle() {
    this.visibility = !this.visibility;
  }
}
