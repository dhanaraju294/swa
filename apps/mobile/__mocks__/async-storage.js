/**
 * Jest stand-in for @react-native-async-storage/async-storage.
 *
 * Mirrors the two properties the engine relies on:
 *  - all calls are async and resolve in call order (native queue is FIFO);
 *  - data survives across "engine restarts" within a test (real storage).
 */
const store = new Map();
let chain = Promise.resolve();

function enqueue(fn) {
  const run = chain.then(fn);
  chain = run.catch(() => undefined);
  return run;
}

module.exports = {
  __esModule: true,
  default: {
    getItem: (key) => enqueue(async () => (store.has(key) ? store.get(key) : null)),
    setItem: (key, value) => enqueue(async () => store.set(key, String(value))),
    removeItem: (key) => enqueue(async () => store.delete(key)),
    clear: () => enqueue(async () => store.clear()),
    // Test-only handle for assertions on the raw persisted payload.
    _raw: store,
  },
};
