import { ObjectModel } from './object.model';

export class User extends ObjectModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  token?: string;
}
