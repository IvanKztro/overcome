import { Component, Inject, OnInit } from '@angular/core';
import {
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/shared/services/users.service';

// import firebase from 'firebase/app';
// import 'firebase/auth';
// <-- make sure you have auth imported

@Component({
  selector: 'app-dialog-profile',
  templateUrl: './dialog-profile.component.html',
  styleUrls: ['./dialog-profile.component.css'],
})
export class DialogProfileComponent implements OnInit {
  userForm!: FormGroup;
  errorForm: null | string = null;
  hide1: boolean = true;
  hide2: boolean = true;
  hide3: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<DialogProfileComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      typeAction: string;
      labelButton: string;
      userId: string;
      userData: any;
      userForm: any;
    }, // private storage: Storage,
    private us: UsersService,
    private snackBar: MatSnackBar,
    private auth: Auth
  ) {
    this.userForm = data.userForm;
  }

  ngOnInit(): void {
    // console.log(this.userForm);
  }

  hnadleClick() {
    if (this.data.typeAction === 'email') this.changeEmail();
    if (this.data.typeAction === 'password') this.changePassword();
  }

  async changeEmail() {
    this.errorForm = null;

    const { email, email2 } = this.userForm.value;
    if (email !== email2) {
      this.errorForm = 'Los correos no son iguales';
      console.log('Errro');
      return;
    }

    const data = {
      email,
    };
    try {
      this.us.updateUser(this.data.userId, data);
      this.snackBar.open(`email update succesfully`, 'Close', {
        duration: 4000,
      });
      this.dialogRef.close();
      this.errorForm = null;
    } catch (error: any) {
      this.snackBar.open(`${error.message} email update error`, 'Close', {
        duration: 4000,
      });
    }
  }

  async changePassword() {
    const { oldpassword, newpassword, newpassword2 } = this.userForm.value;

    if (newpassword !== newpassword2) {
      this.errorForm = 'La nueva contraseña debe coincidir';
      // console.log('Errro');
      return;
    }

    // TODO(you): prompt the user to re-provide their sign-in credentials
    const user: any = this.auth.currentUser;
    console.log(user);
    const email = user?.email ? user?.email : this.data.userData.email;
    const credential = EmailAuthProvider.credential(email, oldpassword);

    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newpassword).then((response) => {
          this.snackBar.open(`password update succesfully`, 'Close', {
            duration: 4000,
          });

          this.dialogRef.close();
          this.errorForm = null;
        });
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password')
          this.errorForm = 'Contraseña actual incorrecta';
      });
  }
}
