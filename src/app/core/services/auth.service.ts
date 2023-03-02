import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile,
  user,
  User,
  signInWithPopup,
} from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { UserProfile } from 'src/app/shared/types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<UserProfile | null>;
  constructor(
    private router: Router,
    private auth: Auth,
    private afs: Firestore // private snackBar: MatSnackBar
  ) {
    this.user$ = user(this.auth).pipe(
      switchMap((user: UserProfile | null) =>
        user
          ? (docData(
              doc(this.afs, 'users', user.uid)
            ) as Observable<UserProfile>)
          : of(null)
      )
    );
  }

  // loginWithGoogle() {
  //   try {
  //     const userCredential = signInWithPopup(
  //       this.auth,
  //       new GoogleAuthProvider()
  //     );
  //     const user = userCredential.user;
  //     // console.log(user);
  //     await this.updateUser(user);
  //     await this.router.navigate(['/tickets']);
  //   } catch (error: any) {
  //     const errorMessage = error.message;
  //     // this.snackBar.open(errorMessage, 'Close', {
  //     //   duration: 3000,
  //     // });
  //   }
  // }

  async loginWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      await this.updateUser(user);
      await this.router.navigate(['/tickets']);
    } catch (error: any) {
      const errorMessage = error.message;
    }
  }

  async registerWithEmail(
    displayName: string,
    email: string,
    password: string
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      if (!this.auth.currentUser) {
        // this.snackBar.open('Update user error: no current user', 'Close', {
        //   duration: 3000,
        // });
        return;
      }
      await updateProfile(this.auth.currentUser, {
        displayName: displayName,
      });
      await this.updateUser(user);
      await this.router.navigate(['/']);
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.message;
      // this.snackBar.open(errorMessage, 'Close', {
      //   duration: 3000,
      // });
    }
  }
  async updateUser(user: User) {
    // console.log('updateUser');
    // console.log(user);
    const ref = doc(this.afs, 'users', user.uid);
    const {
      uid,
      displayName,
      email,
      emailVerified,
      phoneNumber,
      isAnonymous,
      providerData,
    } = user;
    setDoc(
      ref,
      {
        uid,
        displayName,
        email,
        emailVerified,
        phoneNumber,
        isAnonymous,
        providerData,
      },
      { merge: true }
    );
  }

  async sendPasswordReset(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      // this.snackBar.open(`Email link sent succesfully. Please login`, 'Close', {
      //   duration: 3000,
      // });
    } catch (error: any) {
      const errorMessage = error.message;
      // this.snackBar.open(errorMessage, 'Close', {
      //   duration: 3000,
      // });
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
      await this.router.navigate(['auth/login']);
    } catch (error: any) {
      const errorMessage = error.message;
      // this.snackBar.open(errorMessage, 'Close', {
      //   duration: 3000,
      // });
    }
  }

  async getUser(): Promise<UserProfile | null> {
    return await firstValueFrom(this.user$);
  }
}
