import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { StatusT } from 'src/app/shared/types/ticket';

import { UsersService } from 'src/app/shared/services/users.service';
import { TicketsService } from 'src/app/shared/services/tickets.service';

@Component({
  selector: 'app-form-ticket',
  templateUrl: './form-ticket.component.html',
  styleUrls: ['./form-ticket.component.css'],
})
export class FormTicketComponent implements OnInit {
  ticketForm!: FormGroup;

  teams = ['Soporte', 'Desarrollo', 'Atencion a clientes'];
  bugs = ['Bug', 'Feature'];
  levels = ['High', 'Medium', 'Low'];
  statusss = ['Nuevo', 'En proceso', 'Atendido', 'Archivado'];

  private isClicked = false;

  textbutton: string = 'Editar';
  iseditable: boolean = false;

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
    }
  ) {
    this.ticketForm = data.ticketForm;
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

    if (this.data.typeAction === 'Create') this.addTicket(user.uid);

    if (this.data.typeAction === 'Edit') this.editTicket();
  }

  async addTicket(uid: string) {
    const createdAt = Timestamp.now();
    const { title, team, typeError, levelError, softwareVersion, description } =
      this.ticketForm.value;

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
    };
    try {
      await this.ts.addTicket(data);
      this.dialogRef.close();
      // this.snackBar.open(`Agrerado con exito`, 'Close', {
      //   duration: 4000,
      // });
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
    };

    try {
      this.ts.updateTicket(this.data.ticketId, data);
      // this.snackBar.open(`modificado exitosamente`, 'Close', {
      //   duration: 4000,
      // });
      this.dialogRef.close();
    } catch (error: any) {
      this.snackBar.open(`${error.message} erro al modificar`, 'Close', {
        duration: 4000,
      });
    }
  }

  changeStatusButton() {
    this.textbutton = this.iseditable ? 'Visualizar' : 'Editar';
  }
}
