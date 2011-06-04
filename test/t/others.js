module("test for others");

is = strictEqual;

test("r.id", function() {
  var div = r.id("div1");
  is ( div.__proto__, r.fn, "__proto__ of wrapped object is r.fn" );
  ok ( div[0] instanceof HTMLDivElement, "first item of wrapped object is HTMLDivElement" );
});

test("r.cls", function() {
  var divs = r.cls("div");
  is ( divs.__proto__, r.fn, "__proto__ of wrapped object is r.fn" );

  divs.forEach(function(div) {
    ok ( div instanceof HTMLDivElement, "all items of wrapped object is HTMLDivElement" );
  });
});

test("r.fn.addClass", function() {
  var none = r("#div1");
  none.addClass("red");
  is ( none.css("float"), "left", "normal got red" );
});

test("r.fn.removeClass", function() {
  var red = r("#div2");

  red.addClass("redmine");
  red.removeClass("red");
  is ( red.css("float"), "none", "red lost red" );
  is ( red.css("visibility"), "hidden", "red did not lost redmine" );

  red.addClass("green");
  red.addClass("green");
  is ( red.css("float"), "right", "red got green * 2" );

  red.removeClass("green");
  is ( red.css("float"), "none", "red lost green * 2" );

  red.addClass("red");
  is ( red.css("float"), "left", "red got red" );
});
