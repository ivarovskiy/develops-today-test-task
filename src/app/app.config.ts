import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from '@interceptors/http.interceptor';
import { provideStore } from '@ngrx/store';
import { favoriteReducer, metaReducers } from '@state/country/country.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideAnimationsAsync(),
    provideStore(),
    provideStore({ favorites: favoriteReducer }, { metaReducers }),
  ],
};
