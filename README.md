# RxJS Ditto

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A wrapper library for [RxJS](https://rxjs.dev/) and [Ditto](https://www.ditto.live). Great for [Angular apps](https://angular.io/)

## Quick Start

This package requires `@dittolive/ditto` and `rxjs` (minium 6.0.0) as a peer dependency.

1. Run `npm install rxjs @dittolive/ditto @dittolive/rxjs-ditto` 
2. Wrap your query into `toObservable` like so:

```ts
import { toObservable } from "@dittolive/rxjs-ditto"

let documents$ = toObservable(ditto.store.collection("cars")
  .find("color == 'red'"))

```

Or observe a single document 

```ts
import { toObservable } from "@dittolive/rxjs-ditto"


let documents$: Observable<Document[]> = toObservable(rxDitto.store.collection("cars")
  .findByID(new Document("123abc")))
```
## Run Example Angular App

1. In this directory run `yarn` or `npm install`
2. Then run `yarn build` or `npm build` to build this library
3. Follow then [./examples/angular-example/README.md](./examples/angular-example/README.md) 
