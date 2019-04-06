// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: false,
  hmr: true,
  baseUrl:  'http://localhost:8080/cwt',
  retryCount: 4,
  timeout: 100000
};

