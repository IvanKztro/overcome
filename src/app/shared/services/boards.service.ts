import { Ticket } from './../types/ticket';
import { Observable, of, shareReplay } from 'rxjs';
import { AuthService } from './../../core/services/auth.service';
import {
  collectionData,
  query,
  collection,
  Firestore,
  doc,
  setDoc,
  docData,
  where,
  getDoc,
  getDocs,
  onSnapshot,
  // where
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Board } from '../types/board';
import { deleteDoc, updateDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  boards$?: Observable<Board[] | null>;
  board$?: Observable<Board | null>;
  boardidselected?: Board | null;

  constructor(private firestore: Firestore, private auth: AuthService) {}

  getBoards(userId: string) {
    const refBoard = query(
      collection(this.firestore, 'boards'),
      // where('createdBy', '==', userId),
      where('team', 'array-contains', userId)
    );

    this.boards$ = collectionData(refBoard) as Observable<Board[]>;
  }

  // getBoardByID() {
  //   const refBoard = query(collection(this.firestore, 'boards'));

  //   this.boards$ = collectionData(refBoard) as Observable<Board[]>;
  // }

  async createBoard(data: Board) {
    try {
      const docref = doc(collection(this.firestore, 'boards'));
      data.id = docref.id;
      await setDoc(docref, data);
    } catch (error) {
      console.log('Error create new Board: ', error);
    }
  }

  // async addTicket(data: Ticket) {
  //   const docRef = doc(collection(this.firestore, 'tickets'));
  //   data.id = docRef.id;
  //   await setDoc(docRef, data);
  //   return data.id;
  // }

  async getBoardById(id: string) {
    let array: any = [];
    // console.log('service getBoardById');
    // console.log(id);
    // console.log(`boards/${id}/ticketsArray`);

    // try {
    //   const ref = doc(collection(this.firestore, 'board'));
    // } catch (error) {}

    try {
      const ref = doc(collection(this.firestore, 'boards'), id);
      this.board$ = docData(ref) as Observable<Board>;
    } catch (error) {
      console.log(error);
    }

    // this.board$ = docData(ref) as Observable<Board>;
    // this.board$ = docData(ref.data()) as Observable<Board>;
  }

  async updateBoard(id: string, updates: Partial<Board>) {
    try {
      const ref = doc(collection(this.firestore, 'boards'), id);
      await updateDoc(ref, updates);
    } catch (error) {
      console.log('Error update board: ', error);
    }
  }

  async deleteBoard(id: string) {
    try {
      const docref = doc(this.firestore, 'boars', id);
      await deleteDoc(docref);
    } catch (error) {
      console.log('Error delete Board: ', error);
    }
  }
}
function leftJoinDocument(
  arg0: string,
  arg1: string
): import('rxjs').OperatorFunction<any, unknown> {
  throw new Error('Function not implemented.');
}
