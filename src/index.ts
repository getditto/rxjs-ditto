

import { PendingCursorOperation, Document, PendingIDSpecificOperation } from "@dittolive/ditto";
import { Observable } from "rxjs";

/**
 * Transforms a cursor into an `Observable<Document[]>`
 * @param pendingCursorOperation A cursor
 */
export function toObservable(pendingCursorOperation: PendingCursorOperation): Observable<Document[]>
/**
 * Transforms a cursor into an `Observable<Document | undefined>`
 * @param pendingIDSpecificOperation A cursor for a specific ID
 */
export function toObservable(pendingIDSpecificOperation: PendingIDSpecificOperation): Observable<Document | undefined>
export function toObservable(o: any): any {
  if (getAnyClass(o) === 'PendingCursorOperation') {
    return new Observable((subscriber) => {
      let liveQuery = (<PendingCursorOperation>o).observe((docs) => {
        subscriber.next(docs)
      })
      return () => { liveQuery?.stop() }
    })
  }
  if (getAnyClass(o) === "PendingIDSpecificOperation") {
    return new Observable((subscriber) => {
      let liveQuery = (<PendingIDSpecificOperation>o).observe((docs) => {
        subscriber.next(docs)
      })
      return () => { liveQuery?.stop() }
    })
  }
  throw new Error(`"${getAnyClass(o)}, parameter can only be of a type PendingCursorOperation or PendingIDSpecificOperation`)
}

function getAnyClass(obj) {
  if (typeof obj === "undefined") return "undefined";
  if (obj === null) return "null";
  return obj.constructor.name;
}
