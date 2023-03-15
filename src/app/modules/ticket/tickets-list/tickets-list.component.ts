import { UserProfile } from 'src/app/shared/types/user';
import { StatusT } from 'src/app/shared/types/ticket';
import { FormTicketComponent } from './../form-ticket/form-ticket.component';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketsService } from 'src/app/shared/services/tickets.service';
import { Ticket } from './../../../shared/types/ticket';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.css'],
})
export class TicketsListComponent implements OnInit {
  tickets?: Ticket[];
  filter: string = '';
  alltickets?: Ticket[];
  subscriptionTickets?: Subscription;
  ticketForm!: FormGroup;
  currentUser!: UserProfile | null;

  ticketsnews?: Ticket[] = [];
  ticketsprocess?: Ticket[] = [];
  ticketscomplets?: Ticket[] = [];

  show: boolean = false;

  constructor(
    private ticketsService: TicketsService,
    private fb: FormBuilder,
    public auth: AuthService,
    private dialog: MatDialog
  ) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required]],
      team: [''],
      typeError: ['', [Validators.required]],
      levelError: ['', [Validators.required]],
      softwareVersion: [''],
      status: [''],
      incharge: [''],
    });
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.auth.getUser();
    if (this.currentUser) {
      this.ticketsService.getTickets(this.currentUser);
      this.subscriptionTickets = this.ticketsService.ticketsuser$?.subscribe(
        (tickets) => {
          this.tickets = [];
          this.alltickets = [];
          this.ticketsService.ticketsAll = [];
          this.ticketsnews = [];
          this.ticketsprocess = [];
          this.ticketscomplets = [];

          if (tickets) {
            this.tickets = tickets;
            this.alltickets = tickets;
            this.ticketsService.ticketsAll = tickets;
            tickets?.map((ticket) => {
              if (ticket.status === StatusT.newt) {
                this.ticketsnews?.push(ticket);
              }
              if (ticket.status === StatusT.proccesst) {
                this.ticketsprocess?.push(ticket);
              }
              if (ticket.status === StatusT.completet) {
                this.ticketscomplets?.push(ticket);
              }
            });
          }
        }
      );
    }
  }
  ngOnDestroy(): void {
    if (this.subscriptionTickets) {
      this.subscriptionTickets.unsubscribe();
    }
  }

  createTicket() {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required]],
      // sizes: [''],
      team: [''],
      typeError: ['', [Validators.required]],
      levelError: ['', [Validators.required]],
      softwareVersion: [''],
      status: [''],
      description: ['', [Validators.required]],
      incharge: [''],
    });

    this.dialog.open(FormTicketComponent, {
      data: {
        title: 'Nuevo Ticket',
        typeAction: 'Create',
        ticketForm: this.ticketForm,
        labelButton: 'Crear',
        ticketId: '',
      },
      width: '700px',
    });
  }

  viewTicket(ticket: Ticket) {
    this.ticketForm = this.fb.group({
      title: [ticket.title],
      // sizes: [''],
      team: [ticket.team],
      typeError: [ticket.typeError],
      levelError: [ticket.levelError],
      softwareVersion: [ticket.softwareVersion],
      status: [ticket.status ? ticket.status : ''],
      description: [ticket.description],
      incharge: [ticket.incharge],
    });

    this.dialog.open(FormTicketComponent, {
      data: {
        title: ticket.title,
        typeAction: 'Edit',
        ticketForm: this.ticketForm,
        labelButton: 'Guardar',
        ticketId: ticket.id,
        incharge: ticket.inchargeObj ? ticket.inchargeObj.displayName : 'None',
      },
      width: '700px',
    });
  }

  editTicket(ticket: Ticket) {
    this.ticketForm = this.fb.group({
      title: [ticket.title],
      // sizes: [''],
      team: [ticket.team],
      typeError: [ticket.typeError],
      levelError: [ticket.levelError],
      softwareVersion: [ticket.softwareVersion],
      status: [ticket.status ? ticket.status : ''],
      description: [ticket.description],
      incharge: [ticket.incharge],
    });

    this.dialog.open(FormTicketComponent, {
      data: {
        title: 'Editar Ticket',
        typeAction: 'Edit',
        ticketForm: this.ticketForm,
        labelButton: 'Guardar',
        ticketId: ticket.id,
      },
      width: '700px',
    });
  }

  showTicket() {
    this.show = !this.show;
  }

  drop(event: CdkDragDrop<any[] | any>) {
    const itemdrop = event.previousContainer.data[event.previousIndex];

    itemdrop.status = event.container.id;
    this.ticketsService.updateTicket(itemdrop.id, itemdrop);

    if (event) {
      if (event.previousContainer === event.container) {
        moveItemInArray(
          event?.container?.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        transferArrayItem(
          event?.previousContainer?.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }
}
