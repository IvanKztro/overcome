import { UserProfile } from './../../types/user';
import { Subscription } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
// import { StatusT } from 'src/app/shared/types/ticket';

import { UsersService } from 'src/app/shared/services/users.service';
// import { TicketsService } from 'src/app/shared/services/tickets.service';

import { BoardsService } from './../../services/boards.service';
import { Board } from '../../types/board';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-form-board',
  templateUrl: './form-board.component.html',
  styleUrls: ['./form-board.component.css'],
})
export class FormBoardComponent implements OnInit {
  boardForm!: FormGroup;
  currentUser!: UserProfile | null;

  private isClicked = false;
  members = new FormControl('');
  selectedmembers: string[] = [];

  textbutton: string = 'Editar';
  subscriptionuser?: Subscription;
  userswithoutme?: UserProfile[];
  // iseditable: boolean = false;

  constructor(
    // private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    public us: UsersService,
    public bs: BoardsService,
    private dialogRef: MatDialogRef<FormBoardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      boardForm: FormGroup;
      typeAction: string;
      labelButton: string;
      boardId: string;
      // incharge: string;
    }
  ) {
    // console.log(data.boardForm);
    this.boardForm = data.boardForm;
    // this.us.getUsersWithOutCurrentUser();

    // console.log('data.typeAction');
    // console.log(data.typeAction);
    // console.log(data.incharge);
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.auth.getUser();

    if (this.currentUser) {
      this.us.getUsersWithOutCurrentUser(this.currentUser?.uid);

      this.subscriptionuser = this.us.userswithoutlogged$?.subscribe(
        (users) => {
          console.log(users);
          if (users) this.userswithoutme = users;
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionuser) {
      this.subscriptionuser.unsubscribe();
    }
  }

  async handleBoard() {
    const user = await this.auth.getUser();
    if (!user) {
      this.snackBar.open('Proyecto No valido', 'Close', {
        duration: 4000,
      });
      return;
    }

    if (this.isClicked) {
      return;
    }
    this.isClicked = true;

    if (this.data.typeAction === 'Create') this.addBoard(user.uid);

    // if (this.data.typeAction === 'Edit') this.editTicket();
  }

  async addBoard(uid: string) {
    //   id: string;
    // title: string;
    // createdBy: string;
    // createdAt: Timestamp;
    // ticketArray?: string[];
    // team?: UserProfile[];
    const createdAt = Timestamp.now();
    const { title } = this.boardForm.value;
    console.log(this.selectedmembers);
    const members = [
      this.currentUser?.uid ? this.currentUser?.uid : '',
      ...this.selectedmembers,
    ];
    console.log(members);

    const data: Board = {
      id: '',
      title,
      createdBy: uid,
      createdAt: createdAt,
      team: members,
      // ticketArray:[],
    };

    // console.log(data);
    try {
      await this.bs.createBoard(data);
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

  // async editBoard() {
  //   const {
  //     title,
  //     team,
  //     typeError,
  //     levelError,
  //     softwareVersion,
  //     description,
  //     status,
  //     incharge,
  //   } = this.boardForm.value;

  //   const data = {
  //     title,
  //     typeError,
  //     levelError,
  //     softwareVersion,
  //     status,
  //     team,
  //     description,
  //     incharge,
  //   };

  //   try {
  //     this.ts.updateTicket(this.data.ticketId, data);
  //     // this.snackBar.open(`modificado exitosamente`, 'Close', {
  //     //   duration: 4000,
  //     // });
  //     this.dialogRef.close();
  //   } catch (error: any) {
  //     this.snackBar.open(`${error.message} erro al modificar`, 'Close', {
  //       duration: 4000,
  //     });
  //   }
  // }

  // changeStatusButton() {
  //   this.iseditable = !this.iseditable;
  //   // this.textbutton = this.iseditable ? 'Visualizar' : 'Editar';
  // }
}
