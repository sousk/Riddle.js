module("test for touch event");

is = strictEqual;
isnt = notStrictEqual;

function emit(el, eventName, callback, touches) {
  var event = document.createEvent("Event");
  event.initEvent(eventName, true, true);
  event.touches = touches;
  console.dir(touches);
  console.dir(event);
  ( el.__proto__ === r.fn ) ? el[0].dispatchEvent(event) : el.dispatchEvent(event);

  if ( typeof callback === "function" ) {
    callback();
  }
}

function testBind(wrapped, eventName) {
  var spy = sinon.spy(function(e) {
    ok ( e.target === wrapped[0], "event target original element");
    ok ( e.type === eventName, "event type should be " + eventName);
  });
  wrapped.bind(eventName, spy);
  emit(wrapped, eventName);
  ok( spy.calledOnce, eventName + " emitted and callback function called successfully");
}

test("touch events", function() {
  var button = r("#button");

  ["touchStart", "touchmove", "touchend"].forEach(function(event) {
    testBind(button, event);
  });
});


test("swipe event", function() {
  var button = r("#button"),
      startTouches = [ { target: button[0], pageX: 100 } ],
      moveTouchesLeft = [ { target: document.body, pageX: 50 } ],
      moveTouchesRight = [ { target: document.body, pageX: 150 } ],
      spyLeft, spyRight;

  spyLeft = sinon.spy(function(e) {
    ok( e.target === button[0], "event target is touched button" );
    ok( e.type === "swipeLeft", "event type is swipeLeft" );
  });

  button.bind("swipeLeft", spyLeft);

  emit(button[0], "touchstart", function() {
    emit(document.body, "touchmove", function() {
      emit(document.body,  "touchend", function() {
          ok( spyLeft.calledOnce, "swipeLeft happens" );
      });
    }, moveTouchesLeft);
  }, startTouches);

  spyRight = sinon.spy(function(e) {
    ok( e.target === button[0], "event target is touched button" );
    ok( e.type === "swipeRight", "event type is swipeRight" );
  });

  button.bind("swipeRight", spyRight);

  emit(button[0], "touchstart", function() {
    emit(document.body, "touchmove", function() {
      emit(document.body,  "touchend", function() {
          ok( spyRight.calledOnce, "swipeRight happens" );
      });
    }, moveTouchesRight);
  }, startTouches);

  button.unbind("swipeLeft");
  button.unbind("swipeRight");
});
