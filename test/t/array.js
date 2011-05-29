module("test for Array++ features");

is = strictEqual;

test("r.fn.detect", function() {
  var options = r("#select1 option");

  is( options.detect(function(el) { return el.value === "1"; }).innerHTML, "one-1", "detect find first one" );
  is( options.detect(function(el) { return el.value === "999"; }), void(0), "detect find undefined if nothing matched" );
});

test("r.fn.invoke", function() {
  var options = r("#select2 option");

  var start = 1;
  options.invoke("getAttribute", "value").forEach(function(item) {
    is( item, String(start), "option value is " + start );
    start++;
  });
});

test("r.fn.pluck", function() {
  var options = r("#select2 option");

  var start = 1;
  options.pluck("value").forEach(function(item) {
    is( item, String(start), "option value is " + start );
    start++;
  });
});
