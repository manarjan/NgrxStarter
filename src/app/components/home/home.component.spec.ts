import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HomeComponent } from './home.component';
import * as UserActions from '../../store/user.actions';
import { User } from '../../models/user.model';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore;
  let toastrService: ToastrService;
  let confirmSpy: jasmine.Spy;

  const initialState = {
    user: {
      users: [],
      loading: false,
      error: null,
    },
  };

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [ReactiveFormsModule, ToastrModule.forRoot()],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    toastrService = TestBed.inject(ToastrService);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUsers on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(UserActions.loadUsers());
  });

  it('should initialize form with empty values', () => {
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('username')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.userForm;
    expect(form.valid).toBeFalsy();

    form.controls.name.setValue('Test User');
    form.controls.email.setValue('test@example.com');
    form.controls.username.setValue('testuser');

    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.userForm.controls.email;
    emailControl.setValue('invalid-email');
    expect(emailControl.errors?.['email']).toBeTruthy();

    emailControl.setValue('valid@email.com');
    expect(emailControl.errors).toBeNull();
  });

  it('should initiate editing with user data', () => {
    component.initiateEditing(mockUser);

    expect(component.editingUser).toBe(mockUser);
    expect(component.userForm.getRawValue()).toEqual({
      name: mockUser.name,
      email: mockUser.email,
      username: mockUser.username,
    });
  });

  it('should show info toast and close editing when form is pristine', () => {
    const toastrSpy = spyOn(toastrService, 'info');
    component.userForm.markAsPristine();
    component.userForm.markAsTouched();
    spyOn(component, 'closeEditing');

    component.saveUser();

    expect(toastrSpy).toHaveBeenCalledWith('No changes to save.');
    expect(component.closeEditing).toHaveBeenCalled();
  });

  it('should prompt for confirmation when closing with unsaved changes', () => {
    confirmSpy.and.returnValue(false);

    component.initiateEditing(mockUser);
    component.userForm.controls.name.setValue('Changed Name');
    component.userForm.controls.name.markAsDirty();
    component.userForm.controls.name.markAsTouched();

    component.closeEditing();

    expect(confirmSpy).toHaveBeenCalled();
    expect(component.editingUser).toBe(mockUser);
  });

  it('should save updated user', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.initiateEditing(mockUser);
    component.userForm.controls.name.setValue('Updated Name');
    component.userForm.controls.email.markAsDirty();
    component.userForm.controls.email.markAsTouched();
    component.userForm.updateValueAndValidity();

    component.saveUser();

    expect(dispatchSpy).toHaveBeenCalledWith(
      UserActions.updateUser({
        user: {
          ...mockUser,
          name: 'Updated Name',
        },
        originalUser: mockUser,
      })
    );
    expect(component.editingUser).toBeNull();
  });

  it('should not save invalid form', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.initiateEditing(mockUser);
    component.userForm.controls.email.setValue('invalid-email');
    component.userForm.controls.email.markAsDirty();
    component.userForm.controls.email.markAsTouched();
    component.userForm.updateValueAndValidity();

    component.saveUser();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.editingUser).not.toBeNull();
  });
});
