module("test for event-binding functions");

var events = ["click", "focus", "blur", "scroll", "select", "change"];

is = strictEqual;

function emit(el, eventName, callback) {
  var event = document.createEvent("Event");
  event.initEvent(eventName, true, true);
  ( el.__proto__ === r.fn ) ? el[0].dispatchEvent(event) : el.dispatchEvent(event);
}

function testBind(wrapped, eventName, callback) {
  var spy = sinon.spy(function(e) {
    ok ( e.target === wrapped[0], "event target original element");
    ok ( e.type === eventName, "event type should be " + eventName);
  });
  wrapped.bind(eventName, spy);
  emit(wrapped, eventName);
  ok( spy.calledOnce, eventName + " emitted and callback function called successfully");
}

function testUnbind(wrapped, eventName, callback) {
  var spy = sinon.spy(function(e) {});
  wrapped.bind(eventName, spy);
  wrapped.unbind(eventName);

  emit(wrapped, eventName);
  ok( ! spy.called, eventName + " emitted but callback function not called");
}

function testShortCut(wrapped, eventName, callback) {
  var spy = sinon.spy(function(e) {
    ok ( e.target === wrapped[0], "event target original element");
    ok ( e.type === eventName, "event type should be " + eventName);
  });
  wrapped[eventName](spy);
  emit(wrapped, eventName);
  ok( spy.calledOnce, eventName + " emitted and callback function called successfully");
}

test("r.fn.bind", function() {
  var button = r("#button1");

  events.forEach(function(event) {
    testBind(button, event);
  });
});

test("r.fn.unbind", function() {
  var button = r("#button2");

  events.forEach(function(event) {
    testUnbind(button, event);
  });
});


// test for shofthand methods

test("r.fn.[\"eventName\"]", function() {
  var button = r("#button3");

  events.forEach(function(event) {
    testShortCut(button, event);
  });
});
