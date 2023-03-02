import { Timestamp } from '@firebase/firestore-types';
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  emailVerified: boolean;
  phoneNumber?: string | null;
  role?: TypeRole;
  isAnonymous?: boolean;
  providerData?: any[];
  client?: string;
  plan?: string;
  status?: string;
  createdBy?: string;
  createdAt?: Timestamp;
}

export enum TypeRole {
  Admin = 'Administrador',
  SuperAdmin = 'SuperAdmin',
  Manager = 'Manager',
  Empleado = 'Empleado',
}
