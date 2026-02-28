import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Usage: canActivate: [authGuard, roleGuard], data: { roles: ['student', 'instructor'] }
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUser();
  const allowedRoles = (route.data['roles'] as string[]) || [];
  const role = (user?.role ?? '').toLowerCase();
  if (allowedRoles.length === 0 || allowedRoles.some((r) => r.toLowerCase() === role)) return true;
  // Redirect to appropriate dashboard by role
  if (role === 'admin') router.navigate(['/admin/dashboard']);
  else if (role === 'instructor') router.navigate(['/instructor/dashboard']);
  else router.navigate(['/student/dashboard']);
  return false;
};
