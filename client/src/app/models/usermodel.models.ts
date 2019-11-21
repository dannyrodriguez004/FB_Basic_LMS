import {UsertypeModel} from './usertype.model';

export class UserModel {

  constructor() {
    this.type = UsertypeModel.Guest;
  }
  id: string;
  // tslint:disable-next-line:variable-name
  first_name: string;
  // tslint:disable-next-line:variable-name
  last_name: string;
  email?: string;
  phone?: string;
  country?: string;
  token?: string;
  type: UsertypeModel;
  photo?: string;
  photoToken?: string;
}
