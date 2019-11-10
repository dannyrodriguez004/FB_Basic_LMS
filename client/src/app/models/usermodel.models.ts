import {UsertypeModel} from './usertype.model';

export class UserModel {

  constructor () {
    this.type = UsertypeModel.Guest;
  }


  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  country?: string;
  token?: string;
  type: UsertypeModel;
}
