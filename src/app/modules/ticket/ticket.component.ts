import { Component, OnInit } from '@angular/core';
import { FormTicketComponent } from './form-ticket/form-ticket.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit {
  ticketForm!: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {}

  createTicket() {
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
      },
      width: '640px',
    });
  }
}
