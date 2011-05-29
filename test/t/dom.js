module("test for DOM manipulation function");


// outerHTML for Firefox, inspired by http://d.hatena.ne.jp/amachang/20100531/1275270877

if ( ! ('outerHTML' in document.createElement('div')) ) {
  Object.defineProperty(HTMLElement.prototype, "outerHTML", {
    get: function() {
      return this.ownerDocument.createElement("div").appendChild(this.cloneNode(true)).parentNode.innerHTML;
    }
  });
}


is = strictEqual;

test("r.fn.html - get", function() {
  var div = r(".div1");
  is( div.html(), "div", "innerHTML of div is div");

  var li = r("#list1 li");
  li.html().forEach(function(html) {
    is( html, "item", "innerHTML of li is item");
  });
});

test("r.fn.html - set with string", function() {

  var li = r("#list1 li");
  li.html("hoge");

  li.html().forEach(function(html) {
    is( html, "hoge", "innerHTML of li is hoge");
  });
});

test("r.fn.html - set with HTMLElement", function() {

  var li = r("#list2 li");
  li.html(r(".div2")[0]);

  li.forEach(function(el) {
    is ( el.children[0].nodeName, "DIV", "div element is inserted");
  });
});

test("r.fn.html - set with NodeArray", function() {

  var li = r("#list3 li");
  li.html(r("#list4insert"));

  li.forEach(function(el) {
    is ( el.children[0].nodeName, "UL", "ul element is inserted");

    Array.prototype.slice.call(el.children[0].children).forEach(function(item) {
      is ( item.nodeName, "LI", "li element is included in ul");
    });
  });
});
