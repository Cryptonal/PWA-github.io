import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Params, Router, RouterState } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, throwError } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { CustomerLoginType, CustomerRegistrationType } from '../../models/customer/customer.model';
import { HttpErrorMapper } from '../../models/http-error/http-error.mapper';
import { HttpError } from '../../models/http-error/http-error.model';
import { User } from '../../models/user/user.model';
import { UserService } from '../../services/user/user.service';
import { coreReducers } from '../core-store.module';

import * as ua from './user.actions';
import { UserEffects } from './user.effects';

describe('User Effects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let store$: Store<{}>;
  let userServiceMock: UserService;
  let routerMock: Router;

  const loginResponseData = {
    customer: {
      type: 'SMBCustomer',
      customerNo: 'PC',
    },
  } as CustomerLoginType;

  beforeEach(() => {
    routerMock = mock(Router);
    userServiceMock = mock(UserService);
    when(userServiceMock.signinUser(anything())).thenReturn(of(loginResponseData));
    when(userServiceMock.createUser(anything())).thenReturn(of(undefined));
    when(userServiceMock.getCompanyUserData()).thenReturn(of({ firstName: 'patricia' } as User));

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: Router, useFactory: () => instance(routerMock) },
        { provide: UserService, useFactory: () => instance(userServiceMock) },
      ],
    });

    effects = TestBed.get(UserEffects);
    store$ = TestBed.get(Store);
  });

  describe('loginUser$', () => {
    it('should call the api service when LoginUser event is called', done => {
      const action = new ua.LoginUser({ credentials: { login: 'dummy', password: 'dummy' } });

      actions$ = of(action);

      effects.loginUser$.subscribe(() => {
        verify(userServiceMock.signinUser(anything())).once();
        done();
      });
    });

    it('should dispatch a LoginUserSuccess action on successful login', () => {
      const action = new ua.LoginUser({ credentials: { login: 'dummy', password: 'dummy' } });
      const completion = new ua.LoginUserSuccess(loginResponseData);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loginUser$).toBeObservable(expected$);
    });

    it('should dispatch a LoginUserFail action on failed login', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'error') } as HttpErrorResponse;

      when(userServiceMock.signinUser(anything())).thenReturn(throwError(error));

      const action = new ua.LoginUser({ credentials: { login: 'dummy', password: 'dummy' } });
      const completion = new ua.LoginUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });
      expect(effects.loginUser$).toBeObservable(expected$);
    });
  });

  describe('loadCompanyUser$', () => {
    it('should call the registationService for LoadCompanyUser', done => {
      const action = new ua.LoadCompanyUser();
      actions$ = of(action);

      effects.loadCompanyUser$.subscribe(() => {
        verify(userServiceMock.getCompanyUserData()).once();
        done();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const action = new ua.LoadCompanyUser();
      const completion = new ua.LoadCompanyUserSuccess({ user: { firstName: 'patricia' } as User });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCompanyUser$).toBeObservable(expected$);
    });

    // TODO: test LoadBasketFail
  });

  describe('goToHomeAfterLogout$', () => {
    it('should navigate to /home after LogoutUser', done => {
      const action = new ua.LogoutUser();
      actions$ = of(action);

      effects.goToHomeAfterLogout$.subscribe(() => {
        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/home']);
        done();
      });
    });
  });

  describe('goToAccountAfterLogin$', () => {
    it('should navigate to /account after LoginUserSuccess', done => {
      const action = new ua.LoginUserSuccess(loginResponseData);

      actions$ = of(action);

      effects.goToAccountAfterLogin$.subscribe(() => {
        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/account']);
        done();
      });
    });

    it('should navigate to returnUrl after LoginUserSuccess when it is set', done => {
      when(routerMock.routerState).thenReturn({
        snapshot: {
          root: {
            queryParams: {
              returnUrl: '/foobar',
            } as Params,
          },
        },
      } as RouterState);

      const action = new ua.LoginUserSuccess(loginResponseData);

      actions$ = of(action);

      effects.goToAccountAfterLogin$.subscribe(() => {
        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/foobar']);
        done();
      });
    });
  });

  describe('createUser$', () => {
    it('should call the api service when Create event is called', done => {
      const action = new ua.CreateUser({
        customer: {
          type: 'SMBCustomer',
          customerNo: 'PC',
        },
      } as CustomerRegistrationType);

      actions$ = of(action);

      effects.createUser$.subscribe(() => {
        verify(userServiceMock.createUser(anything())).once();
        done();
      });
    });

    it('should dispatch a CreateUserLogin action on successful user creation', () => {
      const credentials: LoginCredentials = { login: '1234', password: 'xxx' };

      const action = new ua.CreateUser({ credentials } as CustomerRegistrationType);
      const completion = new ua.LoginUser({ credentials });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });

    it('should dispatch a CreateUserFail action on failed user creation', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'feld') } as HttpErrorResponse;
      when(userServiceMock.createUser(anything())).thenReturn(throwError(error));

      const action = new ua.CreateUser({} as CustomerRegistrationType);
      const completion = new ua.CreateUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });
  });

  describe('resetUserError$', () => {
    it('should not dispatch UserErrorReset action on router navigation if error is not set', () => {
      actions$ = hot('a', { a: new RouteNavigation({ path: 'any', params: {}, queryParams: {} }) });

      expect(effects.resetUserError$).toBeObservable(cold('-'));
    });

    it('should dispatch UserErrorReset action on router navigation if error was set', () => {
      store$.dispatch(new ua.LoginUserFail({ error: { message: 'error' } as HttpError }));

      actions$ = hot('a', { a: new RouteNavigation({ path: 'any', params: {}, queryParams: {} }) });

      expect(effects.resetUserError$).toBeObservable(cold('a', { a: new ua.UserErrorReset() }));
    });
  });
});