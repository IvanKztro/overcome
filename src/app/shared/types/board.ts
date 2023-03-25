import { Ticket } from './ticket';
import { Timestamp } from '@firebase/firestore-types';
import { UserProfile } from './user';

export interface Board {
  id: string;
  title: string;
  createdBy: string;
  createdAt: Timestamp;
  ticketArray?: Ticket[];
  team?: string[];

  //readonly
  owner?: UserProfile;
}
