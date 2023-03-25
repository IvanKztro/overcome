import { BoardsService } from './../../shared/services/boards.service';
import { Component, OnInit } from '@angular/core';
import { FormTicketComponent } from './form-ticket/form-ticket.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit {
  ticketForm!: FormGroup;
  subscriptionparams?: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private routeractived: ActivatedRoute,
    private router: Router,
    public bs: BoardsService
  ) {}

  ngOnInit(): void {
    // this.subscriptionparams = this.routeractived.paramMap.subscribe(
    //   (params) => {
    //     console.log(params.get('boardId'));
    //     // console.log(params);
    //     // console.log(this.routeractived.data);
    //     // this.routeractived.data.subscribe((data) => {
    //     //   console.log(data);
    //     //   // this.getBook(params.id, data.uid);
    //     // });
    //   }
    // );
    // this.routeractived.params.subscribe((params) => {
    //   console.log(params);
    //   const { id } = params;
    //   this.bs.boardidselected = id;
    //   // if(id &&)
    //   // console.log(params);
    //   // console.log(this.routeractived.data);
    //   // this.routeractived.data.subscribe((data) => {
    //   //   console.log(data);
    //   //   // this.getBook(params.id, data.uid);
    //   // });
    // });
  }

  // ngOnDestroy(): void {
  //   if (this.subscriptionparams) {
  //     this.subscriptionparams.unsubscribe();
  //   }
  // }

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
