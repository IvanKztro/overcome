import { Subscription } from 'rxjs';
import { BoardsService } from './../../services/boards.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
// import { ActivatedRoute, Router } from '@angular/router';
// ActivatedRoute
import { Board } from '../../types/board';

import { FormBoardComponent } from '../form-board/form-board.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  userLogged?: any;
  subscriptionboard?: Subscription;
  // subscriptionparams?: Subscription;
  boards?: Board[] = [];

  navigationUser = [
    {
      label: 'Perfil',
      links: [
        {
          label: 'Mi Perfil',
          icon: 'perm_identity',
          route: '/profile',
        },
        // {
        //   label: 'Configuración',
        //   icon: 'settings',
        //   route: '/expenses',
        // },
      ],
      divider: false,
    },
  ];

  boardForm!: FormGroup;
  members = new FormControl('');

  constructor(
    public auth: AuthService,
    // private routeractived: ActivatedRoute,
    private router: Router,
    private bs: BoardsService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.boardForm = this.fb.group({
      title: ['', [Validators.required]],
      // team: [this.members],
      // stock: [0, [Validators.required]],
      // amount: [0, [Validators.required]],
      // type: ['', [Validators.required]],
      // toy_Id: ['', [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.userLogged = await this.auth.getUser();

    if (this.userLogged) {
      this.bs.getBoards(this.userLogged?.uid);

      this.subscriptionboard = this.bs.boards$?.subscribe((boards) => {
        if (boards) {
          this.boards = boards;
          // this.bs.boardidselected = boards[0];
          // console.log('SIDEBAR: boardselected - ', this.bs.boardidselected);
          // this.subscriptionparams = this.routeractived.params.subscribe((p) => {
          //   console.log('PARAMS: ', p);
          // });
        }
      });
    }

    // this.router.
  }

  ngOnDestroy(): void {
    if (this.subscriptionboard) {
      this.subscriptionboard.unsubscribe();
    }

    // if (this.subscriptionparams) {
    //   this.subscriptionparams.unsubscribe();
    // }
  }

  goToBoard(boardId: string): void {
    this.router.navigate(['boards', boardId]);
  }

  openDialog() {
    // console.log(this.boardForm);
    this.dialog.open(FormBoardComponent, {
      data: {
        title: `Nuevo Proyecto`,
        header: 'Proyecto',
        boardForm: this.boardForm,
        labelButton: 'Guardar',
        typeAction: 'Create',
        // id: board.id,
      },
      width: '440px',
    });
  }

  createBoard(): void {
    // this.currentUser = await this.auth.getUser();
    // if (this.userLogged) {
    //   bs
    // }
  }
}
