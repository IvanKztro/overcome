import { Timestamp } from '@firebase/firestore-types';
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  emailVerified: boolean;
  phoneNumber?: string | null;
  role?: TypeRole;
  providerData?: any[];
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
