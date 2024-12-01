import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import * as UserActions from './user.actions';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.userService.getUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(UserActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap((action) => {
        const loadingToast = this.toastr.info('Updating user');
        return this.userService.updateUser(action.user).pipe(
          map((user) => {
            this.toastr.clear(loadingToast.toastId);
            this.toastr.success('User updated successfully');
            return UserActions.updateUserSuccess({ user });
          }),
          catchError((error) => {
            this.toastr.clear(loadingToast.toastId);
            return of(
              UserActions.updateUserFailure({
                error: error.message,
                originalUser: action.originalUser,
              })
            );
          })
        );
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService,
    private readonly toastr: ToastrService
  ) {}
}
