import { Component, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as UserSelectors from '../../store/user.selectors';
import * as UserActions from '../../store/user.actions';
import { UserState } from '../../store/user.state';
import { User } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { faSave, faEdit, faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  public faSave = faSave;
  public faEdit = faEdit;
  public faClose = faClose;

  public users$ = this.store.select(UserSelectors.selectUsers);
  public fetchingUsers$ = this.store.select(UserSelectors.selectFetchingUsers);
  public fetchingError$ = this.store.select(UserSelectors.selectFetchingError);

  public userForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
  });

  public editingUser: User | null = null;

  constructor(
    private readonly store: Store<{ user: UserState }>,
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly toast: ToastrService
  ) {}

  public ngOnInit(): void {
    this.fetchUsers();
  }

  public fetchUsers(): void {
    this.store.dispatch(UserActions.loadUsers());
  }

  public initiateEditing(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue(user);
  }

  public closeEditing(): void {
    if (this.userForm.touched && this.userForm.dirty) {
      const userConfirmation = confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!userConfirmation) {
        return;
      }
    }
    this.editingUser = null;
    this.userForm.reset();
  }

  public saveUser(): void {
    if (this.userForm.untouched || this.userForm.pristine) {
      this.toast.info('No changes to save.');
      this.closeEditing();
      return;
    }
    if (this.editingUser && this.userForm.valid) {
      const updatedUser: User = {
        ...this.userForm.getRawValue(),
        id: this.editingUser.id,
      };
      this.store.dispatch(
        UserActions.updateUser({
          user: updatedUser,
          originalUser: this.editingUser,
        })
      );
      this.userForm.markAsPristine();
      this.userForm.markAsUntouched();
      this.closeEditing();
    }
  }

  public ngOnDestroy(): void {}
}
