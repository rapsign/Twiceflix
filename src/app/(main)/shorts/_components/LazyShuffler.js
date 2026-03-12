export class LazyShuffler {
  constructor(length) {
    this.length = length;
    this.map = {};
    this.resolved = new Set();
    this.pointer = length - 1;
  }

  _val(i) {
    return this.map[i] !== undefined ? this.map[i] : i;
  }

  get(n) {
    if (n < 0 || n >= this.length) return -1;
    if (this.resolved.has(n)) return this.map[n];
    for (let i = this.pointer; i >= n; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const vi = this._val(i),
        vj = this._val(j);
      this.map[i] = vj;
      this.map[j] = vi;
      this.resolved.add(i);
    }
    this.pointer = n - 1;
    return this.map[n];
  }
}
