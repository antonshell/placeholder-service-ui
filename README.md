# Placeholder service UI

There is a simple UI for simple self-hosted [placeholder service](https://github.com/antonshell/placeholder-service).

![demo](https://raw.githubusercontent.com/antonshell/placeholder-service-ui/master/demo.png)

Demo: [https://placeholder-ui.antonshell.me/](https://placeholder-ui.antonshell.me/)

Project created with:
- [Angular](https://github.com/angular/angular) version 17.0.8 
- [Node.js](https://nodejs.org/) version 20
- [Bootstrap](https://getbootstrap.com/) version 5

# Install

1 . Clone repository

```
git clone https://github.com/antonshell/placeholder-service-ui.git
```

2 . Install dependencies

```
npm install
```

3 . Start application

```
npm start
```

4 . Open app

[http://localhost:4200/](http://localhost:4200/)

# Production build

Production deployment is automated via [ssh_deploy](https://github.com/antonshell/placeholder-service-ui/actions/workflows/ssh_deploy.yml) github action.
There is such command for building production app.

```
npm run ng build --prod --output-hashing=all
```

# Tests

1 . Run unit & integration tests

```
ng test --no-watch --no-progress --browsers=ChromeHeadless --code-coverage --karma-config=karma.conf.js
```

2 . Run Cypress e2e tests

```
npm run cypress:run
```

3 . Open Cypress UI

```
npm run cypress:open
```

# Code generation

```
ng generate service services/auth
ng generate guard guards/auth
ng generate component components/tag-edit
```
