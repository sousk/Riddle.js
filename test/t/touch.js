module("test for touch event");

is = strictEqual;
isnt = notStrictEqual;

function emit(el, event, callback, touches) {
  var e = document.createEvent("Event");
  e.initEvent(event, true, true);

  if ( touches ) {
    e.touches = touches;
  }

  el.dispatchEvent(e);

  if ( callback ) {
    // this is not good manner for async operations, but this time it's ok.
    callback(e, el);
  }
}


test("touch events", function() {
  var button = r("#button"),
      touchstartTimes = 0,
      touchmoveTimes = 0,
      touchendTimes = 0;

  button.bind("touchstart", function(e) {
    ok( e.target === button[0], "event target is touched button" );
    ok( e.type === "touchstart", "event type is touchstart" );
    touchstartTimes++;
  });

  button.bind("touchmove", function(e) {
    ok( e.target === button[0], "event target is touched button" );
    ok( e.type === "touchmove", "event type is touchmove" );
    touchmoveTimes++;
  });

  button.bind("touchend", function(e) {
    ok( e.target === button[0], "event target is touched button" );
    ok( e.type === "touchend", "event type is touchend" );
    touchendTimes++;
  });

  emit(button[0], "touchstart", function() {
    is( touchstartTimes, 1, "touchstart happens" );
  });

  emit(button[0], "touchmove", function() {
    is( touchmoveTimes, 1, "touchmove happens" );
  });

  emit(button[0], "touchend", function() {
    is( touchendTimes, 1, "touchend happens" );
  });

  ["touchstart", "touchmove", "touchend"].forEach(function(event) {
    button.unbind(event);
  });
});


test("tap event", function() {
  var button = r("#button"),
      tapTimes = 0;

  button.bind("tap", function(e) {
    ok( e.target === button[0], "event target is touched button" );
    ok( e.type === "tap", "event type is tap" );
    tapTimes++;
  });

  emit(button[0], "touchstart", function() {
    emit(button[0], "touchend", function() {
        is( tapTimes, 1, "tap happens" );
    });
  }, [ { target: button[0] } ] );

  button.unbind("tap");
});


test("swipe event", function() {
  var button = r("#button"),
      startTouches = [ { target: button[0], pageX: 100 } ],
      moveTouchesLeft = [ { target: document.body, pageX: 50 } ],
      moveTouchesRight = [ { target: document.body, pageX: 150 } ],
      swipeLeftTimes = 0,
      swipeRightTimes = 0;

  button.bind("swipeLeft", function(e) {
    ok( e.target === button[0], "event target is touched button" );
    ok( e.type === "swipeLeft", "event type is swipeLeft" );
    swipeLeftTimes++;
  });

  emit(button[0], "touchstart", function() {
    emit(document.body, "touchmove", function() {
      emit(document.body,  "touchend", function() {
          is( swipeLeftTimes, 1, "swipeLeft happens" );
      });
    }, moveTouchesLeft);
  }, startTouches);


  button.bind("swipeRight", function(e) {
    ok( e.target === button[0], "event target is touched button" );
    ok( e.type === "swipeRight", "event type is swipeRight" );
    swipeRightTimes++;
  });

  emit(button[0], "touchstart", function() {
    emit(document.body, "touchmove", function() {
      emit(document.body,  "touchend", function() {
          is( swipeRightTimes, 1, "swipeRight happens" );
      });
    }, moveTouchesRight);
  }, startTouches);

  button.unbind("swipeLeft");
  button.unbind("swipeRight");
});
