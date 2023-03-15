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

  getTickets(userP: UserProfile) {
    const refUser = query(collection(this.firestore, 'users'));

    this.users$ = collectionData(refUser) as Observable<UserProfile[]>;

    const ref = query(collection(this.firestore, 'tickets'));
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
  }

  getTicketById(id: string) {
    const ref = doc(collection(this.firestore, 'tickets'), id);
    this.ticket$ = docData(ref) as Observable<Ticket>;
  }

  async addTicket(data: Ticket) {
    const docRef = doc(collection(this.firestore, 'tickets'));
    data.id = docRef.id;
    await setDoc(docRef, data);
    return data.id;
  }

  async updateTicket(ticketId: string, updates: Partial<Ticket>) {
    try {
      const docRef = doc(collection(this.firestore, 'tickets'), ticketId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.log('Error on update ticket: ', ticketId, error);
    }
  }
}
