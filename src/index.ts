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
  RemotePeer,
  Observer,
  SingleObservationHandler,
} from "@dittolive/ditto";

import { Observable } from "rxjs";

export class RxPendingIDSpecificOperation
  implements PendingIDSpecificOperation
{
  op: PendingIDSpecificOperation;

  constructor(op: PendingIDSpecificOperation) {
    this.op = op;
  }
  evict(): Promise<boolean> {
    return this.op.evict();
  }
  exec(): Promise<Document> {
    return this.op.exec();
  }
  update(closure: (document: any) => void): Promise<UpdateResult[]> {
    return this.op.update(closure);
  }
  then<TResult1 = DocumentValue, TResult2 = never>(
    onfulfilled?: (value: DocumentValue) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): PromiseLike<TResult1 | TResult2> {
    return this.op.then(onfulfilled, onrejected);
  }

  subscribe(): Subscription {
    return this.op.subscribe();
  }
  observe(handler: SingleObservationHandler): Promise<LiveQuery> {
    return this.op.observe(handler);
  }
  remove(): Promise<boolean> {
    return this.op.remove();
  }

  get document$(): Observable<Document | undefined> {
    return new Observable((subscriber) => {
      let liveQuery: LiveQuery | undefined;

      this.op
        .observe((doc) => {
          subscriber.next(doc);
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

export class RxPendingCursorOperation implements PendingCursorOperation {
  private op: PendingCursorOperation;

  constructor(op: PendingCursorOperation) {
    this.op = op;
  }

  sort(
    propertyPath: string,
    direction?: SortDirection
  ): RxPendingCursorOperation;
  sort(propertyPath: string): RxPendingCursorOperation;
  sort(propertyPath: any, direction?: any): RxPendingCursorOperation {
    return new RxPendingCursorOperation(this.op.sort(propertyPath, direction));
  }
  offset(count: number): PendingCursorOperation {
    return new RxPendingCursorOperation(this.op.offset(count));
  }
  limit(count: number): PendingCursorOperation {
    return new RxPendingCursorOperation(this.op.limit(count));
  }
  subscribe(): Subscription {
    return this.op.subscribe();
  }
  observe(handler: QueryObservationHandler): Promise<LiveQuery> {
    return this.op.observe(handler);
  }
  remove(): Promise<DocumentID[]> {
    return this.op.remove();
  }
  evict(): Promise<DocumentID[]> {
    return this.op.evict();
  }
  exec(): Promise<Document[]> {
    return this.op.exec();
  }
  update(
    closure: (documents: [any]) => void
  ): Promise<{ [documentID: string]: UpdateResult[] }> {
    return this.op.update(closure);
  }
  then<TResult1 = DocumentValue[], TResult2 = never>(
    onfulfilled?: (value: DocumentValue[]) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): PromiseLike<TResult1 | TResult2> {
    return this.op.then(onfulfilled, onrejected);
  }

  get documents$(): Observable<Document[]> {
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

  findByID(id: DocumentID): RxPendingIDSpecificOperation {
    return new RxPendingIDSpecificOperation(
      this.store.collection(this.name).findByID(id)
    );
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

  get siteID(): number | BigInt {
    return this.ditto.siteID;
  }

  constructor(ditto: Ditto) {
    this.ditto = ditto;
  }

  get store(): RxStore {
    return new RxStore(this.ditto);
  }

  startSync() {
    this.ditto.startSync();
  }

  stopSync() {
    this.ditto.stopSync();
  }

  setAccessLicense(token: string) {
    this.ditto.setAccessLicense(token);
  }

  /**
   * An RxJS Observable of RemotePeer[]
   */
  get peers$(): Observable<RemotePeer[]> {
    return new Observable((subscriber) => {
      let obs: Observer | undefined;
      this.ditto
        .observePeers((remotePeers) => {
          subscriber.next(remotePeers);
        })
        .then((o) => {
          obs = o;
        });
      return () => {
        obs?.stop();
      };
    });
  }
}
