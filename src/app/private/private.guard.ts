import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../public/services/user.service';
import { GlobalErrorHandlerService } from '../public/services/globalErrorHandler/global-error-handler.service';

// Definition of a guard function to protect routes based on user authentication and permissions
export const privateGuard: CanActivateFn = (_, state) => {

  // Service for user authentication
  const auth = inject(UserService);
  // Angular router service for navigation
  const router = inject(Router);
  // Service for handling global errors
  const globalErrorHandler = inject(GlobalErrorHandlerService);

  // Return an observable that determines if the route can be activated
  return auth.userData$.pipe(

    // Switch to another observable based on user authentication status
    switchMap((user) => {
      // Check if user is authenticated

      if (user) {
        // Return an observable indicating whether the user is active
        return of(user.isActive);

      } else {
        // If user is not authenticated, return an observable with false value
        return of(false);
      }
    }),

    // Map the result of the observable to either true (if user is active) or perform redirection
    map((verified) => {

      // If user is active, allow route activation
      if (verified) {
        return true;

      } else {
        // If user is not active, generate an error message and redirect to login page
        const errorMessage = `Unauthorized Access:
          \n Please ensure you have appropriate permissions to view this content.`;
        globalErrorHandler.handleError(errorMessage);
        
        // Create a URL tree for redirection to the login page with a return URL
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
      }
    })
  );
};
