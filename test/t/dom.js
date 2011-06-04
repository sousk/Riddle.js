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
  is( div.html().trim(), "div", "innerHTML of div is div");

  var li = r("#list1 li");
  li.html().forEach(function(html) {
    is( html.trim(), "item", "innerHTML of li is item");
  });
});

test("r.fn.html - set with string", function() {

  var li = r("#list1 li");
  li.html("hoge");

  li.html().forEach(function(html) {
    is( html.trim(), "hoge", "innerHTML of li is hoge");
  });
});

test("r.fn.html - set with HTMLElement", function() {

  var li = r("#list2 li");
  li.html(r(".div2")[0]);

  is ( r("#list2 li div").length, 3, "dev inserted to each list item" );
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

test("r.fn.remove", function() {

  var li = r("#remove1 li");
  var removed = li.remove();

  removed.forEach(function(el) {
    is ( el.parentNode, null, "elements removed from DOM tree" );
  });
});

test("r.fn.add - add NodeArray", function() {

  var ul = r("#addto1");
  var lis = r("#addfrom1 li");

  ul.add(lis);

  is ( r("#addto1 li").length, 3, "elements added" );
  is ( r("#addfrom1 li").length, 3, "original elements cloned ( not removed )" );
});

test("r.fn.add - add HTMLElement", function() {

  var ul = r("#addto2");
  var li = r("#addfrom2 li")[0];

  ul.add(li);

  is ( r("#addto2 li").length, 1, "element added" );
  is ( r("#addfrom2 li").length, 3, "original element cloned ( not removed )" );
});

test("r.fn.add - add text", function() {

  var ul = r("#addto3");

  ul.add("fuga");

  ok ( r("#addto3").html().match(/hoge\s*fuga/), "fuga inserted to last" );

  ul.add("piyo", "first");

  ok ( r("#addto3").html().match(/piyo\s*hoge\s*fuga/), "piyo inserted to first" );

  ul.add("madoka", "prev");
  ul.add("homura", "next");
});
