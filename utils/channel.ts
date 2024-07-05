const channel = new BroadcastChannel("css-in-bun");

export function insert(defintion: string) {
  channel.postMessage(defintion);
}
