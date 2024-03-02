import {
  DocumentData,
  DocumentReference,
  Timestamp,
} from '@angular/fire/firestore';

export interface Recipe {
  id: string;
  image: string;
  is_active: boolean;
  description: string;
  title: string;
  subtitle?: string;
}
