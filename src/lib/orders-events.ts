import { EventEmitter } from "events";

declare global {
  // para que no se duplique en hot-reload de dev
  // eslint-disable-next-line no-var
  var ordersEmitter: EventEmitter | undefined;
}

export const ordersEmitter = globalThis.ordersEmitter ?? new EventEmitter();
globalThis.ordersEmitter = ordersEmitter;
