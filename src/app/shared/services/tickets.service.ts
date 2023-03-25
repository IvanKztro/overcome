import { UserProfile } from './../types/user';
import { Injectable } from '@angular/core';
import {
  collectionData,
  Firestore,
  query,
  setDoc,
  docData,
  updateDoc,
  deleteDoc,
  where,
  getDocs,
  collectionGroup,
} from '@angular/fire/firestore';
import { collection, doc, orderBy } from '@firebase/firestore';
import { AuthService } from 'src/app/core/services/auth.service';
import { Ticket } from '../types/ticket';
import { combineLatestAll, map, Observable, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  tickets$?: Observable<Ticket[] | null>;
  users$?: Observable<UserProfile[] | null>;
  ticketsuser$?: Observable<Ticket[] | null>;
  ticketsAll?: Ticket[] | null;
  ticket$?: Observable<Ticket | null>;
  urlTicket = '';
  constructor(private firestore: Firestore, private auth: AuthService) {}

  // getTickets(userP: UserProfile, boardId: string) {
  //   const refUser = query(collection(this.firestore, 'users'));

  //   this.users$ = collectionData(refUser) as Observable<UserProfile[]>;

  //   const ref = query(
  //     collection(this.firestore, 'tickets'),
  //     where('boardId', '==', boardId),
  //     orderBy('position', 'asc')
  //   );
  //   this.tickets$ = collectionData(ref) as Observable<Ticket[]>;

  //   const arr$ = combineLatest([this.tickets$, this.users$]).pipe(
  //     map(([tickets, users]) => {
  //       return tickets?.map((ticket) => ({
  //         ...ticket,
  //         creator: users?.find((user) => user.uid === ticket.createdBy),
  //         inchargeObj: users?.find((user) => user.uid === ticket.incharge),
  //       }));
  //     })
  //   );
  //   this.ticketsuser$ = arr$ as Observable<[]>;
  // }

  async getTicketsByBoard(userP: UserProfile | null, boardId: string) {
    // let array: any = [];
    const refUser = query(collection(this.firestore, 'users'));
    this.users$ = collectionData(refUser) as Observable<UserProfile[]>;
    console.log('userP.uid');
    console.log(userP?.uid);
    console.log('boardId');
    console.log(boardId);
    try {
      const ref = query(
        collectionGroup(this.firestore, 'ticketsArray'),
        where('boardId', '==', boardId),
        orderBy('position', 'asc')
      );
      // const querySnapshot = await getDocs(museums);
      // querySnapshot.forEach((doc) => {
      //   console.log(doc.id, ' => ', doc.data());
      // });

      // const ref = query(
      //   collection(this.firestore, `boards/${boardId}/ticketsArray`),
      //   // where('boardId', '==', boardId),
      //   // where('team', 'array-contains', userP?.uid),
      //   orderBy('position', 'asc')
      // );
      this.tickets$ = collectionData(ref) as Observable<Ticket[]>;

      const arr$ = combineLatest([this.tickets$, this.users$]).pipe(
        map(([tickets, users]) => {
          return tickets?.map((ticket) => ({
            ...ticket,
            creator: users?.find((user) => user.uid === ticket.createdBy),
            inchargeObj: users?.find((user) => user.uid === ticket.incharge),
          }));
        })
      );
      this.ticketsuser$ = arr$ as Observable<[]>;
    } catch (error) {
      console.log('Error: ', error);
    }

    // console.log('service getBoardById');
    // console.log(boardId);
    // console.log(`boards/${boardId}/ticketsArray`);
    // try {
    //   const refquery = query(
    //     collection(this.firestore, `boards/${boardId}/ticketsArray`)
    //   );
    //   this.tickets$ = collectionData(refquery) as Observable<Ticket[]>;
    // } catch (error) {
    //   console.log(error);
    // }
  }

  getTicketById(id: string) {
    const ref = doc(collection(this.firestore, 'tickets'), id);
    this.ticket$ = docData(ref) as Observable<Ticket>;
  }

  // async createBoard(data: Board) {
  //   try {
  //     const docref = doc(collection(this.firestore, 'boards'));
  //     data.id = docref.id;
  //     await setDoc(docref, data);
  //   } catch (error) {
  //     console.log('Error create new Board: ', error);
  //   }
  // }

  async addTicket(data: Ticket, boardId: string) {
    // const washingtonRef = doc(this.firestore, 'cities');

    // const docRef = doc(collection(this.firestore, 'boards'), boardId);
    try {
      const docRef = doc(
        collection(this.firestore, `boards/${boardId}/ticketsArray`)
      );
      data.id = docRef.id;
      await setDoc(docRef, data);
    } catch (error) {
      console.log('Error on update proyecto: ', boardId, error);
    }
  }

  async updateTicket(
    ticketId: string,
    updates: Partial<Ticket>,
    boardId: string
  ) {
    try {
      const docRef = doc(
        collection(this.firestore, `boards/${boardId}/ticketsArray`),
        ticketId
      );
      await updateDoc(docRef, updates);
    } catch (error) {
      console.log('Error on update ticket: ', ticketId, error);
    }
  }
}
