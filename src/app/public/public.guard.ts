import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from './services/user.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const auth = inject(UserService);
  const router = inject(Router);
  return auth.userData$.pipe(
    map((user) => {
      if (!user) {
        return true;
      } else {
        router.navigate(['/recipes-list']);
        return false;
      }
    })
  );
};
