import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://jsonplaceholder.typicode.com/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return users array on successful request', () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          username: 'johnd',
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane@example.com',
          username: 'janed',
        },
      ];

      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(2);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle error when API fails', () => {
      service.getUsers().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', () => {
      const mockUser: User = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
        username: 'user',
      };

      service.updateUser(mockUser).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockUser.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUser);
      req.flush(mockUser);
    });

    it('should handle error when update fails', () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
      };

      service.updateUser(mockUser).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockUser.id}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
