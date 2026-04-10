import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = error.error.message;
      } else {
        // Error del lado del servidor
        errorMessage = error.error?.message || `Código de error: ${error.status}`;
        
        // Si hay errores de validación de Zod
        if (error.error?.errors) {
          const validationErrors = error.error.errors
            .map((e: any) => e.message)
            .join(', ');
          errorMessage = `${error.error.message}: ${validationErrors}`;
        }
      }

      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
