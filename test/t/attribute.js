module("test for attribute accessor function of selector results");

is = strictEqual;

test("r.fn.attr with one element", function() {
  var list = r("#list0");
  is( list.attr("name"), "list", "name of list is list");

  list.attr("name", "new");
  is( list.attr("name"), "new", "name of list updated");

  list.attr( { "name": "ry", "value": "v" } );
  is( list.attr("name"), "ry", "name of list updated");
  is( list.attr("value"), "v", "name of list updated");
});

test("r.fn.attr with multiple elements", function() {
  var lis = r("#list1 li");

  lis.attr("name").forEach(function(name) {
    is(name, "li", "name of li is li!");
  });

  lis.attr("name", "le");

  lis.attr("name").forEach(function(name) {
    is(name, "le", "name of li is le!");
  });

  lis.attr( { "name": "ry", "value": "v" } );

  lis.attr("name").forEach(function(name) {
    is(name, "ry", "name of li is ry!");
  });
  lis.attr("value").forEach(function(name) {
    is(name, "v", "value of li is v!");
  });
});

test("r.fn.css with one element", function() {
  var list = r("#list2");
  is( list.css("visibility"), "visible", "visibility is visible at first");

  list.css("visibility", "hidden");
  is( list.css("visibility"), "hidden", "visibility changed as hidden");

  list.css( { "visibility": "visible", "color": "#ffffff" } );
  is( list.css("visibility"), "visible", "visibility get back to visible");
  is( list.css("color"), "rgb(255, 255, 255)", "color updated as #ffffff");
});

test("r.fn.css with multiple elements", function() {
  var lis = r("#list3 li");

  lis.css("display").forEach(function(display) {
    is( display, "list-item", "display of li is list-item at first");
  });

  lis.css("display", "block");
  lis.css("display").forEach(function(display) {
    is( display, "block", "display of li is block, next");
  });

  lis.css( { "display": "inline", "color": "#ffffff" } );
  lis.css("display").forEach(function(display) {
    is( display, "inline", "display of li inline now!");
  });
  lis.css("color").forEach(function(color) {
    is(color, "rgb(255, 255, 255)", "color of li is #ffffff!");
  });
});
