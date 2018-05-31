// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBuCEBNH7x0Ms6BFs0MbkvRqIk4KzTae3Q",
    authDomain: "todo-fbbc6.firebaseapp.com",
    databaseURL: "https://todo-fbbc6.firebaseio.com",
    projectId: "todo-fbbc6",
    storageBucket: "todo-fbbc6.appspot.com",
    messagingSenderId: "701691366934"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
