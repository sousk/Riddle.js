module("test for storage plugin");

is = strictEqual;

localStorage.clear();
sessionStorage.clear();

test("r.storage - init", function() {
  var local = r.storage("local"), session = r.storage("session");

  is ( typeof local.storage, "object", "RStorage initialized with storage" );
  is ( typeof session.storage, "object", "RStorage initialized with storage" );

  is ( local, r.storage("local"), "r.storage returns Singleton object" );
  is ( local, r.storage("session"), "r.storage returns Singleton object" );
});

test("r.storage - set with error", function() {
  var local = r.storage("local"), session = r.storage("session");

  raises(function() {
    local.set(null, "hoge");
  }, null, "set with null key throws error");

  raises(function() {
    session.set(undefined, "hoge");
  }, null, "set with undefined key throws error");

  raises(function() {
    local.set({}, "hoge");
  }, null, "set with object key throws error");

  raises(function() {
    session.set({}, null);
  }, null, "set with undefined value throws error");

  local.clear();
  session.clear();
});

test("r.storage - set, get and clear", function() {
  var local = r.storage("local"), session = r.storage("session");

  is ( local.get("k"), null, "access to undefined value returns null");
  is ( session.get("k"), null, "access to undefined value returns null");

  local.set(1, "foo");
  local.set("k", "v");
  is ( local.get(1), "foo", "get returns original value");
  is ( local.get("k"), "v", "get returns original value");

  session.set(1, "foo");
  session.set("k", "v");
  is ( session.get(1), "foo", "get returns original value");
  is ( session.get("k"), "v", "get returns original value");

  local.clear();
  session.clear();

  is ( local.storage.length, 0, "internal storage cleared");
  is ( session.storage.length, 0, "internal storage cleared");
});

test("r.storage - set and get objects", function() {
  var local = r.storage("local"), session = r.storage("session");

  var orig = { foo: 1, bar: { baz: "baz"}, foobar: ["foo", "bar"] };

  local.set("obj1", orig);

  var returned = local.get("obj1");

  is ( returned.foo, 1, "number in object is serialized and desirialized correctly" );
  is ( returned.bar.baz, "baz", "object in object is serialized and desirialized correctly" );
  is ( returned.foobar[0], "foo", "Array in object is serialized and desirialized correctly" );

  session.set("obj1", orig);

  returned = session.get("obj1");

  is ( returned.foo, 1, "number in object is serialized and desirialized correctly" );
  is ( returned.bar.baz, "baz", "object in object is serialized and desirialized correctly" );
  is ( returned.foobar[0], "foo", "Array in object is serialized and desirialized correctly" );

  local.clear();
  session.clear();
});

test("r.storage - size, keys and values", function() {
  var local = r.storage("local"), session = r.storage("session");

  local.set("foo", "foofoo");
  is ( local.size(), 1, "size returns internal storage size correctly");

  local.set("bar", "barbar");
  ok ( local.keys().indexOf("foo") !== -1, "keys include foo");
  ok ( local.keys().indexOf("bar") !== -1, "keys include bar");

  ok ( local.values().indexOf("foofoo") !== -1, "values include foofoo");
  ok ( local.values().indexOf("barbar") !== -1, "values include barbar");

  local.clear();
  session.clear();
});
