import { createReducer, on } from '@ngrx/store';
import { initialUserState } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUsers, (state) => ({
    ...state,
    fetchingUsers: true,
    fetchingError: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    fetchingUsers: false,
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    fetchingError: error,
    fetchingUsers: false,
  })),
  on(UserActions.updateUser, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    savingUser: true,
  })),
  on(UserActions.updateUserSuccess, (state) => ({
    ...state,
    savingUser: false,
  })),
  on(UserActions.updateUserFailure, (state, { error, originalUser }) => ({
    ...state,
    savingUser: false,
    users: state.users.map((u) =>
      u.id === originalUser.id ? originalUser : u
    ),
    error,
  }))
);
