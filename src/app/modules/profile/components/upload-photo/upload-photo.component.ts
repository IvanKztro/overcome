import { UsersService } from './../../../../shared/services/users.service';
import { Component, Inject, OnInit } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytesResumable,
  percentage,
  getDownloadURL,
} from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.css'],
})
export class UploadPhotoComponent implements OnInit {
  //upload File
  task!: AngularFireUploadTask;
  percentage!: Observable<any> | null;
  snapshot!: Observable<any> | null;
  downloadUrl: any;
  // key: string;
  fileState: boolean = false;
  isupload: boolean = false;
  fileinput: any = null;
  previewPhoto: any = null;
  htmlPreview!: any;

  constructor(
    private dialogRef: MatDialogRef<UploadPhotoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      typeAction: string;
      labelButton: string;
      userId: string;
      userData: any;
    },
    private storage: Storage,
    private snackBar: MatSnackBar,
    private us: UsersService
  ) {
    this.previewPhoto = data.userData?.photoURL;
  }
  ngOnInit(): void {}

  ngAfterViewInit() {
    this.htmlPreview = document.querySelector('#imgpreview');
    this.htmlPreview.src = this.previewPhoto;
  }

  selectFile(e: any) {
    this.htmlPreview = document.querySelector('#imgpreview');
    this.fileinput = e.target.files[0];
    this.previewPhoto = URL.createObjectURL(this.fileinput);
    this.htmlPreview.src = this.previewPhoto;
  }

  handleClick() {
    const { typeAction } = this.data;
    if (typeAction === 'photo') {
      console.log('update Photo');
    }
  }

  async uploadFile() {
    const user = this.data.userData;
    const urld = `/users/${user?.uid}/profile-photo`;

    // return;
    this.isupload = true;

    if (this.fileinput) {
      try {
        const storageRef = ref(this.storage, urld);
        const task = uploadBytesResumable(storageRef, this.fileinput);
        this.percentage = percentage(task);
        await task;
        const url = await getDownloadURL(storageRef);

        const data = { photoURL: url };
        this.us.updateUser(user.uid, data);
        // }
        this.dialogRef.close();
        this.isupload = false;
        this.snackBar.open(` upload photo succesfully`, 'Close', {
          duration: 4000,
        });
      } catch (e: any) {
        console.error(e);
      }
    } else {
      // handle invalid file
    }
  }
}
