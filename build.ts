export class Collector {
  #channel = new BroadcastChannel("css-in-bun");
  #definitions = new Set<string>();
  #listener = (e: MessageEvent<any>) => this.#definitions.add(e.data);
  constructor() {
    this.#channel.addEventListener("message", this.#listener);
  }
  collect() {
    return [...this.#definitions].toSorted().join("");
  }
  [Symbol.dispose]() {
    this.#channel.removeEventListener("message", this.#listener);
    this.#channel.close();
  }
}
