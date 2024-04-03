import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from './services/user.service';

/**
 * A guard function to restrict access to public routes.
 * If the user is authenticated, they are redirected to the '/recipes-list' route.
 * If the user is not authenticated, they are allowed to access the route.
 *
 * @param route The route being activated.
 * @param state The current router state.
 * @returns A boolean indicating whether the user is allowed to access the route.
 */
export const publicGuard: CanActivateFn = (route, state) => {
  // Injecting UserService and Router dependencies
  const auth = inject(UserService);
  const router = inject(Router);

  // Using the userData$ observable from UserService to check user authentication status
  return auth.userData$.pipe(
    map((user) => {

      // If user is not authenticated, allow access to the route
      if (!user) {
        return true;
        
      } else {
        // If user is authenticated, redirect to '/recipes-list' route
        router.navigate(['/recipes-list']);
        return false;
      }
    })
  );
};
