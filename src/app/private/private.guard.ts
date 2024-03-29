import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {UserService} from '../public/services/user.service';

export const privateGuard: CanActivateFn = (route, state) => {
  const auth = inject(UserService);
  const router = inject(Router);
  return auth.userData$.pipe(
    switchMap((user) => {
      if (user) {
        return of(user.isActive);
      } else {
        return of(false);
      }
    }),
    map((verified) => {
      if (verified) {
        return true;
      } else {
        alert('Not authorized');
        console.log('Not authorized');
        return router.createUrlTree(['/login'], {
          queryParams: {returnUrl: state.url},
        });
      }
    })
  );
};
