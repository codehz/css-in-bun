export class Collector {
  #channel = new BroadcastChannel("css-in-bun");
  #definitions = new Set<string>();
  #listener = (ev: { data: string }) => void this.#definitions.add(ev.data);
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
