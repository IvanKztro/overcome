import { Injectable } from '@angular/core';
import {
  collectionData,
  Firestore,
  limit,
  query,
  Timestamp,
  setDoc,
  where,
  orderBy,
  docData,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { collection, doc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserProfile } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users$?: Observable<UserProfile[] | null>;
  userswithoutlogged$?: Observable<UserProfile[] | null>;
  constructor(private firestore: Firestore, private auth: AuthService) {}

  getUsers() {
    const ref = query(collection(this.firestore, 'users'));
    this.users$ = collectionData(ref) as Observable<UserProfile[]>;
  }
  getUsersWithOutCurrentUser(uid: string) {
    const ref = query(
      collection(this.firestore, 'users'),
      where('uid', '!=', uid)
    );
    this.userswithoutlogged$ = collectionData(ref) as Observable<UserProfile[]>;
  }

  async addUser(data: UserProfile, password: string) {
    const docRef = doc(collection(this.firestore, 'users'));
    data.uid = docRef.id;
    await setDoc(docRef, data);
  }

  async updateUser(userId: string, updates: Partial<UserProfile>) {
    try {
      const docRef = doc(collection(this.firestore, 'users'), userId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.log('Error on update user: ', userId, error);
    }
  }

  async deleteUser(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'users', id));
    } catch (error) {
      console.log(error);
    }
  }
}
