import { Board } from 'src/app/shared/types/board';
import { UserProfile } from 'src/app/shared/types/user';
import { TicketsService } from 'src/app/shared/services/tickets.service';
import { Component, Input, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Ticket } from 'src/app/shared/types/ticket';
import { FormTicketComponent } from '../form-ticket/form-ticket.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.css'],
})
export class TicketCardComponent implements OnInit {
  @Input() tickets: Ticket[] | undefined;
  @Input() currentboard: Board | undefined;
  @Input() currentUser: UserProfile | null | undefined;
  @Input() title: string | undefined;
  ticketForm!: FormGroup;

  constructor(
    private ticketsService: TicketsService,
    private fb: FormBuilder,
    // public auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  drop(event: CdkDragDrop<any[] | any>) {
    const itemdrop = event.previousContainer.data[event.previousIndex];

    if (event) {
      if (event.previousContainer === event.container) {
        moveItemInArray(
          event?.container?.data,
          event.previousIndex,
          event.currentIndex
        );
        // console.log(event.container?.data);
        // console.log(event.previousIndex);
        // console.log(event.currentIndex);
      } else {
        transferArrayItem(
          event?.previousContainer?.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        // console.log(event.container?.data);
        // console.log(event.previousIndex);
        // console.log(event.currentIndex);
      }

      itemdrop.status = event.container.id;
      itemdrop.position = event.currentIndex;

      // console.log(event.previousContainer?.data);
      // console.log(event.container?.data);
      this.updateTasks(event.container?.data, itemdrop.status);
      // this.updateTasks(event?.previousContainer?.data, itemdrop.status);
    }
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
        boardId: this.currentboard?.id,
        iscreator: this.isCreatorUser(),
      },
      width: '700px',
    });
  }

  updateTasks(currentTasks: Ticket[], status: string) {
    // let position = 0;

    currentTasks.map((task, index) => {
      // console.log(task.title);
      // console.log(index);
      // console.log(task.position);
      // if (task.position !== index) {
      task.position = index;
      const update = {
        position: task?.position ? task?.position : 0,
        status: task.status,
      };
      this.ticketsService.updateTicket(
        task.id,
        update,
        this.currentboard?.id ? this.currentboard?.id : ''
      );
      // }
      // task.position = position;
      // position++;
    });

    // console.log(currentTasks);
  }
  isCreatorUser() {
    return this.currentboard?.createdBy === this.currentUser?.uid
      ? true
      : false;
  }
}
