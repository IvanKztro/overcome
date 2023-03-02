import { Component, OnInit } from '@angular/core';
import { FormTicketComponent } from './form-ticket/form-ticket.component';
// import { TicketsService } from './../../../shared/services/tickets.service';
// import { FormToyComponent } from './../form-toy/form-toy.component';
import { Subscription } from 'rxjs';
// import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketsService } from 'src/app/shared/services/tickets.service';
// import { Ticket, TypeError } from './../../../shared/types/ticket';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AlertDeleteComponent } from 'src/app/shared/components/alert-delete/alert-delete.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit {
  ticketForm!: FormGroup;

  constructor(
    private ticketsService: TicketsService,
    private fb: FormBuilder,
    // public auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  createTicket() {
    /*
     name: string;
  sizes?: [];
  stock: number;
  colors?: [];
  type?: string;
  urlPhoto?:string;
     */
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required]],
      // sizes: [''],
      stock: [0, [Validators.required]],
      amount_sale: [0, [Validators.required]],
      amount_buy: [0, [Validators.required]],
      type: ['', [Validators.required]],
      ticket_Id: ['', [Validators.required]],
    });

    this.dialog.open(FormTicketComponent, {
      data: {
        title: 'Nuevo Ticket',
        typeAction: 'Create',
        // ticketForm: this.ticketForm,
        // labelButton: 'Crear',
        // ticketId: '',
        // attachmentUrl: '',
      },
      width: '640px',
    });
  }
}
