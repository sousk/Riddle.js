r(function() {

  var body = document.body,
      touchEvents = ["swipeLeft", "swipeRight"],
      touch = { x1: 0, x2: 0 };

  function search(node) {
    return 'tagName' in node ? node : node.parentNode;
  }

  function trigger(elem, event) {
    var e = document.createEvent("Event");
    e.initEvent(event, true, true);
    elem.dispatchEvent(e);
  }

  r(body).bind("touchstart", function(e) {
    touch.target = search(e.touches[0].target);
    touch.x1 = e.touches[0].pageX;
    //console.dir(e);
  });

  r(body).bind("touchmove", function(e) {
    touch.x2 = e.touches[0].pageX;
    //console.dir(e);
  });

  r(body).bind("touchend", function(e) {
    var delta = touch.x1 - touch.x2;

    if ( touch.x1 && touch.x2 && Math.abs(delta) > 30 ) {
      if ( delta > 0 ) {
        trigger(touch.target, "swipeLeft");
      }
      else {
        trigger(touch.target, "swipeRight");
      }
    }

    touch.target = null;
    touch.x1 = touch.x2 = 0;
  });

  touchEvents.forEach(function(event) {
    r.fn[event] = function(callback, useCapture) {
      this.bind(event, callback, useCapture);
    };
  });

});
