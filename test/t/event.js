module("test for event-binding functions");

var events = ["click", "focus", "blur", "scroll", "select", "change"];

is = strictEqual;
isnt = notStrictEqual;

function emit(el, event, callback) {
  var e = document.createEvent("Event");
  e.initEvent(event, true, true);
  el.dispatchEvent(e);

  if ( callback ) {
    // this is not good manner for async operations, but this time it's ok.
    callback(e, el);
  }
}

function testEvent(event, expectTimes) {
  testEvent.times || (testEvent.times = {});
  testEvent.times[event] || (testEvent.times[event] = 0);

  test("r.fn." + event, function() {
    var button = r("#button");

    button[event](function(e) {
      ok( e.target === button[0], "event target is button" );
      ok( e.type === event, "event type is " + event );
      testEvent.times[event]++;
    });
  
    emit(button[0], event, function() {
      is( testEvent.times[event], expectTimes, event + " bound function called");
    });
  });
}


test("r.fn.bind and r.fn.unbind", function() {
  var button = r("#button"),
      clickTimes = 0,
      blurTimes = 0;

  button.bind("click", function(e) {
    ok( e.target === button[0], "event target is clicked button" );
    ok( e.type === "click", "event type is click" );
    clickTimes++;
  });

  button.bind("blur", function(e) {
    ok( e.target === button[0], "event target is clicked button" );
    ok( e.type === "blur", "event type is blur" );
    blurTimes++;
  });

  emit(button[0], "click", function() {
    is( clickTimes, 1, "click bound function called");
    is( blurTimes, 0, "blur bound function not called");
  });

  emit(button[0], "blur", function() {
    is( clickTimes, 1, "click bound function not called");
    is( blurTimes, 1, "blur bound function called");
  });

  button.unbind("click");

  emit(button[0], "click", function() {
    is( clickTimes, 1, "click bound function unbound");
  });

  emit(button[0], "blur", function() {
    is( blurTimes, 2, "blur bound function not unbound");
  });
});


// test for shofthand methods

events.forEach(function(event) {
  testEvent(event, 1);
});
