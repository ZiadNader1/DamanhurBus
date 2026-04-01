import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

let isRedirecting = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401 && !isRedirecting && router.url !== '/login') {
                isRedirecting = true;
                // Clear old/invalid tokens and redirect to login
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.navigate(['/login']).then(() => {
                    // Reset flag after navigation completes
                    setTimeout(() => { isRedirecting = false; }, 1000);
                });
            }
            return throwError(() => error);
        })
    );
};
