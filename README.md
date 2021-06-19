# RxJS Ditto

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A wrapper library for [RxJS](https://rxjs.dev/) and [Ditto](https://www.ditto.live). Great for [Angular apps](https://angular.io/)

## Quick Start

This package requires `@dittolive/ditto` and `rxjs` (minium 6.0.0) as a peer dependency.

1. Run `npm install rxjs @dittolive/ditto @dittolive/rxjs-ditto` 
2. Construct an `RxDitto` instance like so and begin observing 

```ts
import { RxDitto } from "@dittolive/rxjs-ditto"

const rxDitto = new RxDitto(yourExistingDittoInstance);

let documents$ = rxDitto.store.collection("cars")
  .find("color == 'red'")
  .document$
```

Or observe a single document 

```ts
import { RxDitto, DocumentID } from "@dittolive/rxjs-ditto"

const rxDitto = new RxDitto(yourExistingDittoInstance);

let documents$: Observable<Document[]> = rxDitto.store.collection("cars")
  .findByID(new Document("123abc"))
  .document$
```

```ts
import { RxDitto, DocumentID } from "@dittolive/rxjs-ditto"

const rxDitto = new RxDitto(yourExistingDittoInstance);

let document$ : Observable<Document | undefined>  = rxDitto.store.collection("cars")
  .findByID(new Document("123abc"))
  .document$
```

Observe peers like:

```ts
let peers$: Observable<RemotePeer[]> = rxDitto.peers$
```

## Run Example Angular App

1. In this directory run `yarn` or `npm install`
2. Then run `yarn build` or `npm build` to build this library
3. Follow then [./examples/angular-example/README.md](./examples/angular-example/README.md) 
