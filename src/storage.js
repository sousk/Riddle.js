(function() {

  function RStorage(storage) {
    this.storage = storage;
  }

  function set(key, value) {
    this.storage[key] = JSON.stringify(value);
  }

  function get(key) {
    return JSON.parse(this.storage[key]);
  }

  function clear() {
    this.storage.clear();
  }

  function size() {
    return this.storage.length;
  }

  function keys() {
    var result = [], k;

    for ( k in this.storage ) {
      result.push(k);
    }

    return result;
  }

  function values() {
    var result = [], k;

    for ( k in this.storage ) {
      result.push(this.storage[k]);
    }

    return result;
  }

  RStorage.prototype.set = set;
  RStorage.prototype.get = get;
  RStorage.prototype.clear = clear;
  RStorage.prototype.size = size;


  function storage(name) {
    return storage.name || (storage.name = new RStorage(window[name + "Storage"]));
  }

  r.storage = storage;

})();
