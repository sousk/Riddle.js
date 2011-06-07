(function() {

  function RStorage(storage) {
    this.storage = storage;
  }

  function set(key, value) {
    if ( typeof key === "number" || typeof key === "string" ) {
      this.storage.setItem(key, JSON.stringify(value));
    }
    else if ( typeof value === "undefined" ) {
      throw Error("typeof value is 'undefined'. Maybe you're doing something wrong");
    }
    else {
      throw Error("Given value as key is OK but seems not a good manner");
    }
  }

  function get(key) {
    if ( typeof this.storage[key] === "undefined" ) {
      return null;
    }
    else {
      return JSON.parse(this.storage.getItem(key));
    }
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
      result.push(this.get(k));
    }

    return result;
  }

  RStorage.prototype.set = set;
  RStorage.prototype.get = get;
  RStorage.prototype.clear = clear;
  RStorage.prototype.size = size;
  RStorage.prototype.keys = keys;
  RStorage.prototype.values = values;


  function storage(name) {
    return storage.sname || (storage.sname = new RStorage(window[name + "Storage"]));
  }

  r.storage = storage;

})();
