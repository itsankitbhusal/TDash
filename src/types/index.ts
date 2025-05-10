export interface IUser {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  active: string;
  address: string;
  country: string;
  join_date: string;
}

export interface ISub {
  id: number;
  user_id: string;
  package: string;
  expires_on: string;
}

export interface IUserWithSub extends IUser {
  packages?: string[];
  expires_on?: string[];
}
