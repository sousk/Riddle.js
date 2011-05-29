module("test for attribute accessor function of selector results");

is = strictEqual;

test("r.fn.attr with one element", function() {
  var list = r("#list");
  is( list.attr("name"), "list", "name of list is list");

  list.attr("name", "new");
  is( list.attr("name"), "new", "name of list updated");

  list.attr( { "name": "ry", "value": "v" } );
  is( list.attr("name"), "ry", "name of list updated");
  is( list.attr("value"), "v", "name of list updated");
});

test("r.fn.attr with multiple elements", function() {
  var lis = r("#lis li");

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
  var list = r("#ol");
  is( list.css("font-size"), "1px", "font-size of ol is 1px");

  list.css("font-size", "2px");
  is( list.css("font-size"), "2px", "font-size updated as 2px");

  list.css( { "font-size": "4px", "color": "#ffffff" } );
  is( list.css("font-size"), "4px", "font-size updated as 4px");
  is( list.css("color"), "rgb(255, 255, 255)", "color updated as #ffffff");
});

test("r.fn.css with multiple elements", function() {
  var lis = r("#ol li");

  lis.css("font-size").forEach(function(fontSize) {
    is( fontSize, "2px", "font-size of li 2px!");
  });

  lis.css("font-size", "3px");
  lis.css("font-size").forEach(function(fontSize) {
    is( fontSize, "3px", "font-size of li 2px!");
  });

  lis.css( { "font-size": "4px", "color": "#fffff" } );
  lis.css("font-size").forEach(function(fontSize) {
    is( fontSize, "4px", "font-size of li is 2px!");
  });
  lis.css("color").forEach(function(color) {
    is(color, "rgb(255, 255, 255)", "color of li is #ffffff!");
  });
});
