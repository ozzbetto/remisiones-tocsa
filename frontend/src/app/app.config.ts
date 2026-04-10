import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';
import { errorInterceptor } from './core/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark'
        }
      }
    }),
    MessageService
  ]
};
