import { UsertypeModel } from './usertype.model';
import { ObjectModel } from './object.model';

export class User extends ObjectModel {
  id: number;
  name: string;
  email: string;
  password: string;
  user: UsertypeModel;
  token?: string;
}
