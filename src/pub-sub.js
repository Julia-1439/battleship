/**
 * @module PubSub 
 * A modified version of the PubSub implementation in https://medium.com/@ignatovich.dm/implementing-the-pub-sub-pattern-in-javascript-a-guide-for-beginners-44714a76d8c7
 */

export default class PubSub {
  #events; // map event names to subscribers
  #subscriberId;
  constructor() {
    this.#events = new Map();
    this.#subscriberId = 0;
  }

  subscribe(event, callback) {
    if (!this.#events.has(event)) this.#events.set(event, new Set());
    const subscribers = this.#events.get(event);
    const id = this.#subscriberId;
    this.#subscriberId++;
    subscribers.add({ id, callback });
    return id;
  }

  // runtime: linear time on number of events. should be okay since unsubbing I imagine to be a less common process
  unsubscribe(event, id) {
    if (!this.#events.has(event)) return;
    let subscribers = this.#events.get(event);
    subscribers = new Set(
      [...subscribers].filter((subscriber) => subscriber.id !== id)
    ); // there's no built-in "filter" method for Set, so this is the workaround
    this.#events.set(event, subscribers);
  }

  publish(event, data) {
    if (!this.#events.has(event)) return;
    const subscribers = this.#events.get(event);
    subscribers.forEach((subscriber) => subscriber.callback(data));
  }
}