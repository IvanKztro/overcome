import { Timestamp } from '@firebase/firestore-types';
export interface Ticket {
  id: string;
  ticket_Id?: string;
  title: string;
  createdAt?: Timestamp;
  createdBy: string;
  team?: Team;
  typeError: TypeError;
  levelError: LevelError;
  softwareVersion?: string;
  description: string;
  status?: StatusT;
}

export enum Team {
  soporte = 'Soporte',
  desarrollo = 'Desarrollo',
  atencion_cliente = 'Atencion a cliente',
}

export enum TypeError {
  bug = 'Bug',
  feature = 'Feature',
}

export enum LevelError {
  high = 'High',
  medium = 'Medium',
  low = 'Low',
}

export enum StatusT {
  newt = 'Nuevo',
  proccesst = 'En proceso',
  completet = 'Atendido',
  archived = 'Archivado',
}
