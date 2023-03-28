import { ActivatedRoute, Router } from '@angular/router';
import { BoardsService } from './../../../shared/services/boards.service';
import { DialogInfoComponent } from './../../../shared/components/dialog-info/dialog-info.component';
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
import { Board } from 'src/app/shared/types/board';
import { FormBoardComponent } from 'src/app/shared/components/form-board/form-board.component';

// import { TooltipPosition } from '@angular/material/tooltip';

// import {DialogInfoComponent}

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
  subscriptionparams?: Subscription;
  subscriptionboards?: Subscription;
  ticketForm!: FormGroup;
  boardForm!: FormGroup;

  currentUser!: UserProfile | null;

  noProjects: string = '';
  currentboard!: Board;

  ticketsnews?: Ticket[] = [];
  ticketsprocess?: Ticket[] = [];
  ticketscomplets?: Ticket[] = [];

  show: boolean = false;
  first: boolean = false;

  constructor(
    private ticketsService: TicketsService,
    private fb: FormBuilder,
    public auth: AuthService,
    private dialog: MatDialog,
    public bs: BoardsService,
    private routeractived: ActivatedRoute,
    private router: Router
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

    this.boardForm = this.fb.group({
      title: ['', [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    // this.currentidboard = '';
    this.currentUser = await this.auth.getUser();

    if (this.currentUser) {
      this.routeractived.params.subscribe((params) => {
        // console.log(params);
        const { id } = params;
        // console.log(id);
        const uid = this.currentUser?.uid ? this.currentUser.uid : '';

        if (id === '0') this.getBoardID(uid);
        else if (id === 'none') {
          this.noProjects = 'NO se han creado proyectos ';
        } else {
          this.bs.getBoardById(id);
          this.bs.board$?.subscribe((board) => {
            if (board && board.team?.includes(uid)) {
              // console.log('board');
              // console.log(board);
              this.currentboard = board;
              // console.log(
              //   'SIDEBAR: boardselected after selectedddddddddd- ',
              //   board
              // );
              this.getObservableTickets(
                this.currentUser ? this.currentUser : null,
                this.currentboard.id
              );
            }
          });
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.destroySubscription(this.subscriptionTickets as Subscription);
    this.destroySubscription(this.subscriptionboards as Subscription);
    this.destroySubscription(this.subscriptionparams as Subscription);

    // if (this.subscriptionTickets) {
    //   this.subscriptionTickets.unsubscribe();
    // }

    // if (this.subscriptionboards) {
    //   this.subscriptionboards.unsubscribe();
    // }

    // if (this.subscriptionparams) {
    //   this.subscriptionparams.unsubscribe();
    // }
  }

  getObservableTickets(
    currentUser: UserProfile | null,
    idcurrentboard: string
  ) {
    // console.log(currentUser);
    // console.log(idcurrentboard);
    this.ticketsService.getTicketsByBoard(currentUser, idcurrentboard);

    // console.log(this.subscriptionTickets);
    this.destroySubscription(this.subscriptionTickets as Subscription);
    // if (this.subscriptionTickets) {
    //   this.subscriptionTickets.unsubscribe();
    // }
    this.subscriptionTickets = this.ticketsService.ticketsuser$?.subscribe(
      (tickets) => {
        // console.log(tickets);
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
            const position = ticket?.position ? ticket.position : 0;
            if (ticket.status === StatusT.newt) {
              // this.ticketsnews?.push(ticket);
              this.ticketsnews?.splice(position, 0, ticket);
            }
            if (ticket.status === StatusT.proccesst) {
              // this.ticketsprocess?.push(ticket);
              this.ticketsprocess?.splice(position, 0, ticket);
            }
            if (ticket.status === StatusT.completet) {
              // this.ticketscomplets?.push(ticket);
              this.ticketscomplets?.splice(position, 0, ticket);
            }
          });

          //show dialog drag-drop
        }
        if (!this.first && !this.currentUser?.dragdropInfo) {
          this.showDialogDragDrop();
          this.first = true;
        }
      }
    );
  }

  getBoardID(userid: string) {
    // if (this.subscriptionboards) {
    //   this.subscriptionboards.unsubscribe();
    // }
    this.destroySubscription(this.subscriptionboards as Subscription);

    this.bs.getBoards(userid);

    this.subscriptionboards = this.bs.boards$?.subscribe((boards) => {
      if (boards) {
        // console.log(boards);
        // console.log(this.currentboard);
        // if (boards[0]?.id !== this.currentboard.id) {
        if (boards.length !== 0) {
          const boardId = boards[0]?.id;
          this.currentboard = boards[0];
          this.router.navigate(['boards', boardId]);
        } else {
          this.router.navigate(['boards', 'none']);
        }
        // }

        // this.bs.boardidselected = boards[0];
        // console.log('SIDEBAR: boardselected - ', this.bs.boardidselected);
        // this.subscriptionparams = this.routeractived.params.subscribe((p) => {
        //   console.log('PARAMS: ', p);
        // });
      }
    });
  }

  destroySubscription(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
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
        boardId: this.currentboard.id,
        iscreator: this.isCreatorUser(),
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
        boardId: this.currentboard.id,
        iscreator: this.isCreatorUser(),
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
        boardId: this.currentboard.id,
        iscreator: this.isCreatorUser(),
      },
      width: '700px',
    });
  }

  isCreatorUser() {
    return this.currentboard.createdBy === this.currentUser?.uid ? true : false;
  }

  showDialogDragDrop() {
    this.dialog.open(DialogInfoComponent, {
      data: {
        title: `Usted puede arrastrar y soltar los Tickets entre las columnas de estados`,
        typeItem: 'DragDrop',
        header: 'Información de uso',
        // id: maintenance.id,
        // functionDelete: this.deletedItem,
      },
      width: '700px',
    });
  }

  openDialogEditBoard(board: Board) {
    const { title, team } = board;
    // console.log(board);
    this.boardForm = this.fb.group({
      title: [title],
      team: [team],
    });
    this.dialog.open(FormBoardComponent, {
      data: {
        title: `Editar Proyecto`,
        header: 'Proyecto',
        boardForm: this.boardForm,
        labelButton: 'Guardar',
        typeAction: 'Edit',
        team,
        boardId: this.currentboard.id,
      },
      width: '440px',
    });
  }

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
      this.ticketsService.updateTicket(task.id, update, this.currentboard.id);
      // }
      // task.position = position;
      // position++;
    });

    // console.log(currentTasks);
  }
}
