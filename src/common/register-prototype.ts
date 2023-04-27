Array.prototype.trim = function (this: string[]) {
  return this.map((e) => (typeof e === 'string' ? e.trim() : e))
}
