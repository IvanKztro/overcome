import { DialogProfileComponent } from './components/dialog-profile/dialog-profile.component';
import { UploadPhotoComponent } from './components/upload-photo/upload-photo.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser!: any;
  userForm!: FormGroup;

  constructor(
    private router: Router,
    public auth: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.auth.getUser();
  }

  openDialogUploadPhoto() {
    this.dialog.open(UploadPhotoComponent, {
      data: {
        title: 'Cambio de foto',
        typeAction: 'photo',
        labelButton: 'Guardar',
        userId: this.currentUser.uid,
        userData: this.currentUser,
      },
      width: '420px',
    });
  }

  openDialog(typeFn: string) {
    let titlet = '';
    if (typeFn === 'email') {
      titlet = 'Correo';
      this.userForm = this.fb.group({
        email: ['', [Validators.required]],
        email2: ['', [Validators.required]],
      });
    } else {
      titlet = 'Contraseña';
      this.userForm = this.fb.group({
        oldpassword: ['', [Validators.required]],
        newpassword: ['', [Validators.required]],
        newpassword2: ['', [Validators.required]],
      });
    }

    this.dialog.open(DialogProfileComponent, {
      data: {
        title: `Cambiar ${titlet}`,
        typeAction: typeFn,
        labelButton: 'Guardar',
        userId: this.currentUser.uid,
        userData: this.currentUser,
        userForm: this.userForm,
      },
      width: '420px',
    });
  }
}
