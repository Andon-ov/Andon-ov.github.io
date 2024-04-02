import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../public/services/user.service';
import { GlobalErrorHandlerService } from '../public/services/globalErrorHandler/global-error-handler.service';

export const privateGuard: CanActivateFn = (_, state) => {
  const auth = inject(UserService);
  const router = inject(Router);
  const globalErrorHandler = inject(GlobalErrorHandlerService);

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
        const errorMessage = `Unauthorized Access:
          \n Please ensure you have appropriate permissions to view this content.`;
        globalErrorHandler.handleError(errorMessage);
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
      }
    })
  );
};
