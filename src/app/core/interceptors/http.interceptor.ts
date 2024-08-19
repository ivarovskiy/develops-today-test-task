import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { catchError, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.baseUrl;

  const modifyReq = req.clone({
    url: req.url.replace('', baseUrl),
  });

  return next(modifyReq).pipe(
    catchError((e: HttpErrorResponse) => {
      if (e.status === 401) {
        console.log(
          'Request had bad syntax or the parameters supplied were invalid.'
        );
      }
      if (e.status === 503) {
        console.error('API limit reached, using default data');
      }
      console.error(e.message);
      const error = e.error?.error?.message || e.statusText;
      return throwError(() => error);
    })
  );
};
