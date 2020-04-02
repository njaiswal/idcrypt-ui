# IdcryptUi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.23.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# Nishant - Notes:
- aws-export.js file gets created. I have to rename it to aws-export.ts and update reference in main.ts file so that build passes.
  Each time amplify push is run another aws-export.js file is created and I have to manually do above step.
  More over aws-export.js file is included in .gitignore hence it does not get checked in.
  This manual process needs to be ironed out.

- environment.ts file needed to be updated each time amplify auth delete and amplify push is called that creates a new user pool.

- url redirect rule needs to be added manually to amplify UI to make SPA routing work as expected.
  refer: https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa
  Can this be included in amplify config so that it gets carried over to next env.
  
- General deployment steps are 

    amplify status
    amplify push
    git commit 
    git push
    
    Let the amplify pipeline build.

- S3 uploads bucket has a IAM policy applied to it.
  Try fining Role: amplify-idcryptui-dev-172024-authRole    
  This policy should be fine-tuned and public and protected parts of the policy should be removed. 
