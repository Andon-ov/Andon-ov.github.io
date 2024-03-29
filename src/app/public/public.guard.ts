import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {UserService} from './services/user.service';

export const publicGuard: CanActivateFn = (route, state) => {


  const auth = inject(UserService);
  return auth.userData$.pipe(
    switchMap((user) => {
      if (!user) {
        return of(true);
      } else {
        return of(false);

      }
    }),
    map((verified) => {
      if (verified) {
        return true;
      } else {

        window.alert('You are already logged in. Please log out to access this functionality.');
        return false;
      }
    })
  );

};
