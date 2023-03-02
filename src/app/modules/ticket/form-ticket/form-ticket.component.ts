import { UserProfile } from 'src/app/shared/types/user';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
// import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { Ticket, StatusT } from 'src/app/shared/types/ticket';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/app/shared/services/tickets.service';

// import { OfficesService } from 'src/app/shared/services/offices.service';
import { Observable } from 'rxjs';

import {
  Storage,
  ref,
  deleteObject,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  percentage,
  getDownloadURL,
} from '@angular/fire/storage';

import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { UsersService } from 'src/app/shared/services/users.service';
const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-form-ticket',
  templateUrl: './form-ticket.component.html',
  styleUrls: ['./form-ticket.component.css'],
})
export class FormTicketComponent implements OnInit {
  ticketForm!: FormGroup;

  //var to upload file
  task!: AngularFireUploadTask;
  percentage!: Observable<any> | null;
  snapshot!: Observable<any> | null;
  downloadUrl: any;
  htmlPreview!: any;
  previewPhoto: any = null;

  // key: string;
  fileState: boolean = false;
  isupload: boolean = false;
  fileinput: any = null;
  dataedited?: any;
  currentUser?: UserProfile | null;

  teams = ['Soporte', 'Desarrollo', 'Atencion a clientes'];
  bugs = ['Bug', 'Feature'];
  levels = ['Higt', 'Medium', 'Low'];
  statusss = ['Nuevo', 'En proceso', 'Atendido'];

  private isClicked = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    public us: UsersService,
    public ts: TicketsService,
    private dialogRef: MatDialogRef<FormTicketComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      ticketForm: FormGroup;
      typeAction: string;
      labelButton: string;
      ticketId: string;
      // attachmentUrl: string;
    },
    private storage: Storage
  ) {
    this.ticketForm = data.ticketForm;
    // this.previewPhoto = data.attachmentUrl;
    // this.ss.getOffices();
    this.us.getUsers();
  }

  ngOnInit(): void {}

  async handleTicket() {
    const user = await this.auth.getUser();
    if (!user) {
      this.snackBar.open('No calzado valido', 'Close', {
        duration: 4000,
      });
      return;
    }

    if (this.isClicked) {
      return;
    }
    this.isClicked = true;

    // const referenceOwner = user.createdBy ? user.createdBy : 'none';
    // console.log(referenceOwner);

    if (this.data.typeAction === 'Create') this.addTicket(user.uid);

    if (this.data.typeAction === 'Edit') this.editTicket();
  }

  async addTicket(uid: string) {
    const createdAt = Timestamp.now();
    const {
      title,
      team,
      typeError,
      levelError,
      softwareVersion,
      description,
      incharge,
    } = this.ticketForm.value;

    const data = {
      id: '',
      title,
      team,
      typeError,
      levelError,
      softwareVersion,
      createdBy: uid,
      createdAt: createdAt,
      status: StatusT.newt,
      description,
      incharge,
    };
    try {
      await this.ts.addTicket(data);
      this.dialogRef.close();
      this.snackBar.open(`Agrerado con exito`, 'Close', {
        duration: 4000,
      });
      // }
    } catch (error: any) {
      this.snackBar.open(`${error.message} error al agregar`, 'Close', {
        duration: 4000,
      });
    }
  }

  async editTicket() {
    const {
      title,
      team,
      typeError,
      levelError,
      softwareVersion,
      description,
      incharge,
      status,
    } = this.ticketForm.value;

    const data = {
      title,
      typeError,
      levelError,
      softwareVersion,
      status,
      team,
      description,
      incharge,
    };

    try {
      this.ts.updateTicket(this.data.ticketId, data);
      this.snackBar.open(`modificado exitosamente`, 'Close', {
        duration: 4000,
      });
      this.dialogRef.close();
      this.dataedited = null;
    } catch (error: any) {
      this.snackBar.open(`${error.message} erro al modificar`, 'Close', {
        duration: 4000,
      });
    }
  }
}
