import Ditto, {
  PendingCursorOperation,
  PendingIDSpecificOperation,
  Document,
  LiveQuery,
  Store,
  Collection,
  DocumentID,
  DocumentToInsert,
  DocumentValue,
  QueryObservationHandler,
  SortDirection,
  Subscription,
  UpdateResult,
} from "@dittolive/ditto";

import { Observable } from "rxjs";

export class RxPendingCursorOperation implements PendingCursorOperation {
  private op: PendingCursorOperation;

  constructor(op: PendingCursorOperation) {
    this.op = op;
  }

  sort(propertyPath: string, direction?: SortDirection): PendingCursorOperation;
  sort(propertyPath: string): PendingCursorOperation;
  sort(propertyPath: any, direction?: any): PendingCursorOperation {
    throw new Error("Method not implemented.");
  }
  offset(count: number): PendingCursorOperation {
    throw new Error("Method not implemented.");
  }
  limit(count: number): PendingCursorOperation {
    throw new Error("Method not implemented.");
  }
  subscribe(): Subscription {
    throw new Error("Method not implemented.");
  }
  observe(handler: QueryObservationHandler): Promise<LiveQuery> {
    throw new Error("Method not implemented.");
  }
  remove(): Promise<DocumentID[]> {
    throw new Error("Method not implemented.");
  }
  evict(): Promise<DocumentID[]> {
    throw new Error("Method not implemented.");
  }
  exec(): Promise<Document[]> {
    throw new Error("Method not implemented.");
  }
  update(
    closure: (documents: [any]) => void
  ): Promise<{ [documentID: string]: UpdateResult[] }> {
    throw new Error("Method not implemented.");
  }
  then<TResult1 = DocumentValue[], TResult2 = never>(
    onfulfilled?: (value: DocumentValue[]) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): PromiseLike<TResult1 | TResult2> {
    throw new Error("Method not implemented.");
  }

  toObservable(): Observable<Document[]> {
    return new Observable((subscriber) => {
      let liveQuery: LiveQuery | undefined;
      this.op
        .observe((docs) => {
          subscriber.next(docs);
        })
        .then((lq) => {
          liveQuery = lq;
        });
      return () => {
        liveQuery?.stop();
      };
    });
  }
}

export class RxCollection implements Collection {
  name: string;
  store: Store;

  constructor(name: string, ditto: Ditto) {
    this.name = name;
    this.store = ditto.store;
  }

  find(queryString: string): RxPendingCursorOperation {
    return new RxPendingCursorOperation(
      this.store.collection(this.name).find(queryString)
    );
  }

  findAll(): RxPendingCursorOperation {
    return new RxPendingCursorOperation(
      this.store.collection(this.name).findAll()
    );
  }

  findByID(id: DocumentID): PendingIDSpecificOperation {
    return this.store.collection(this.name).findByID(id);
  }

  insert(value: DocumentToInsert): Promise<DocumentID> {
    return this.store.collection(this.name).insert(value);
  }
}

export class RxStore implements Store {
  ditto: Ditto;

  constructor(ditto: Ditto) {
    this.ditto = ditto;
  }

  collection(name: string): RxCollection {
    return new RxCollection(name, this.ditto);
  }
  collectionNames(): Promise<string[]> {
    return this.ditto.store.collectionNames();
  }
}

export default class RxDitto {
  ditto: Ditto;

  constructor(ditto: Ditto) {
    this.ditto = ditto;
  }

  get store(): RxStore {
    return new RxStore(this.ditto);
  }
  
  startSync() {
    this.ditto.startSync()
  }
  
  stopSync() {
    this.ditto.stopSync()
  }
  
  setAccessLicense(token: string) {
    this.ditto.setAccessLicense(token)
  }
}
