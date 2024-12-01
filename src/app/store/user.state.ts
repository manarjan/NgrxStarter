import { User } from '../models/user.model';

export interface UserState {
  users: User[];
  fetchingUsers: boolean;
  fetchingError: string | null;
  savingUser: boolean;
  savingError: string | null;
}

export const initialUserState: UserState = {
  users: [],
  fetchingUsers: false,
  fetchingError: null,
  savingUser: false,
  savingError: null,
};
