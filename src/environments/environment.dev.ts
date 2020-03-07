// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'dev',
  amplify: {
    Auth: {
      // identityPoolId: 'eu-west-1:727dc0ba-fd1b-4591-b036-8c7f5f0a3c9b',
      region: 'eu-west-1',
      userPoolId: 'eu-west-1_R8z2Oswjr',
      userPoolWebClientId: '6bk8pp1tf9cla2rq6n9q0c9uop'
    },
    API: {
      endpoints: [
        {
          name: 'backend',
          endpoint: 'https://dev.api.idcrypt.io/api/v1.0'
        }
      ]
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
