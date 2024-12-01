import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserStore = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
  selectUserStore,
  (state) => state.users
);

export const selectFetchingUsers = createSelector(
  selectUserStore,
  (state) => state.fetchingUsers
);

export const selectFetchingError = createSelector(
  selectUserStore,
  (state) => state.fetchingError
);

export const selectUserById = (userId: number) =>
  createSelector(selectUsers, (users) =>
    users.find((user) => user.id === userId)
  );
