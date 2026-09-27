import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      // Emits Scroll events only; the scrolling itself is handled in AppComponent
      withInMemoryScrolling({
        anchorScrolling: 'disabled',
        scrollPositionRestoration: 'disabled',
      }),
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
  ]
};
