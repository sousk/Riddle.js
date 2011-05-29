var r = (function(doc, toArray, enc) {

  var listeners = {}, nodeId = 1,
      events = ["click", "submit", "focus", "blur", "scroll", "select", "change"],
      touchEvents = ["swipeLeft", "swipeRight", "tap"],
      touch = { x1: 0, x2: 0 },
      domLoaded = false,
      readyErr = "r(callback) and r(selector) are only allowed.";


  function R(first, second) {
    if ( typeof first === "string" ) {
      if ( typeof second === "undefined" || second instanceof HTMLElement ) {
        return $(first, second);
      }
      else {
        throw new Error(readyErr);
      }
    }
    else if ( first instanceof HTMLElement ) {
      return wrap(first);
    }
    else if ( typeof first === "function" ) {
      if ( domLoaded ) {
        first(r);
      }
      else {
        doc.addEventListener("DOMContentLoaded", function() {
          first(r);
        }, false);
      }
    }
    else {
      throw new Error(readyErr);
    }
  }

  function $(selector, context) {
    var ctxt = context || doc, nodeArray = toArray.call(query(selector, ctxt));
    return wrap(nodeArray);
  }

  function wrap(nodeArray) {
    var ary = nodeArray;
    if ( ! Array.isArray(ary) ) {
      ary = [ary];
    }
    ary.__proto__ = R.fn;
    return ary;
  }

  R.fn = {
    // Array++
    detect: detect,
    invoke: invoke,
    pluck: pluck,

    // DOM
    html: html,
    add: add,
    remove: remove,

    // attribute
    attr: attr,
    css: css,

    // event
    bind: bind,
    unbind: unbind
  };


  // event initialization

  function search(node) {
    return 'tagName' in node ? node : node.parentNode;
  }

  doc.addEventListener("DOMContentLoaded", function(e) {
    domLoaded = true;

    doc.body.addEventListener("touchstart", function(e) {
      touch.target = search(e.touches[0].target);
      touch.x1 = e.touches[0].pageX;
    }, false);

    doc.body.addEventListener("touchmove", function(e) {
      touch.x2 = e.touches[0].pageX;
    }, false);

    doc.body.addEventListener("touchend", function(e) {
      var delta = touch.x1 - touch.x2;

      if ( touch.x1 && touch.x2 && Math.abs(delta) > 30 ) {
        if ( delta > 0 ) {
          // swipeLeft
          trigger(touch.target, "swipeLeft");
        }
        else {
          // swipeRight
          trigger(touch.target, "swipeRight");
        }
      }
      else {
        // tap
        trigger(touch.target, "tap");
      }

      touch.target = null;
      touch.x1 = touch.x2 = 0;
    }, false);

  }, false);


  events.concat(touchEvents).forEach(function(event) {
    R.fn[event] = function(callback, useCapture) {
      this.bind(event, callback, useCapture);
    };
  });

  R.fn.__proto__ = Array.prototype;


  // Array++

  function detect(pred) {
    return this.filter(pred)[0];
  }

  function invoke() {
    var args = toArray.call(arguments), func = args.shift();
    return this.map(function(item) {
      return item[func].apply(item, args);
    });
  }

  function pluck(key) {
    return this.map(function(item) { return item[key]; });
  }


  // DOM

  function html(item) {
    if ( typeof item === "undefined" ) {
      if ( this.length === 1 ) {
        return this[0].innerHTML.trim();
      }
      else {
        return this.pluck("innerHTML").map(function(html) { return html.trim() });
      }
    }
    else {
      if ( typeof item === "string" ) {
        this.forEach(function(elem) { elem.innerHTML = item; });
      }
      else if ( item instanceof HTMLElement ) {
        this.forEach(function(elem) { elem.innerHTML = item.outerHTML; });
      }
      else if ( item.__proto__ === r.fn ) {
        this.forEach(function(elem) {
          elem.innerHTML = item.map(function(el) { return el.outerHTML }).join("");
        });
      }
    }
  }

  function remove() {
    this.forEach(function(elem) { elem.parentNode.removeChild(elem) });
  }

  function add(item) {
    if ( item.__proto__ === r.fn ) {
      this.forEach(function(elem) {
        item.forEach(function(el) {
          elem.appendChild(el);
        });
      });
    }
    else if ( item instanceof HTMLElement ) {
      this.forEach(function(elem) {
        elem.appendChild(item);
      });
    }
  }


  // attributes

  function isNormalNode(elem) {
    var type = elem.nodeType;
    return !(type === 3 || type === 8 || type === 2);
  }

  function attr(key, value) {
    if ( typeof key === "string" ) {
      if ( typeof value === "undefined" ) {
        if ( this.length === 1 ) {
          return this[0].getAttribute(key);
        }
        else {
          return this.invoke("getAttribute", key);
        }
      }
      else {
        this.invoke("setAttribute", key, String(value));
      }
    }
    else if ( typeof key === "object" ) {
      this.filter(isNormalNode).forEach(function(elem) {
        for ( var k in key ) {
          elem.setAttribute(k, String(key[k]));
        }
      });
    }
  }

  function css(key, value) {
    if ( typeof key === "string" ) {
      if ( typeof value === "undefined" ) {
        if ( this.length === 1 ) {
          return getComputedStyle(this[0], "").getPropertyValue(key);
        }
        else {
          return this.map(function(elem) {
            return getComputedStyle(elem, "").getPropertyValue(key);
          });
        }
      }
      else {
        var param = {};
        param[key] = value;
        this.filter(isNormalNode).forEach(function(elem) {
          elem.style.cssText += ";" + cssPair(param);
        });
      }
    }
    else if ( typeof key === "object" ) {
      this.filter(isNormalNode).forEach(function(elem) {
        elem.style.cssText += ";" + cssPair(key);
      });
    }
  }

  function cssPair(param) {
    var css = "", key;
    for ( key in param ) {
      css += key + ":" + param[key] + ";";
    }
    return css;
  }

  function addClass(name) {
    this.forEach(function(elem) {
      elem.className += " " + name;
    });
  }

  function removeClass(name) {
    this.forEach(function(elem) {
      elem.className = elem.className.replace(name, " ");
    });
  }


  // event handling

  function getNodeId(elem) {
    return elem.nid || (elem.nid = nodeId++);
  }

  function findBoundsByEvent(bounds, event) {
    return bounds.filter(function(bound) { return bound.event === event });
  }

  function bind(event, callback, useCapture) {
    this.filter(isNormalNode).forEach(function(elem) {
      var id = getNodeId(elem),
          bounds = listeners[id] || (listeners[id] = []);
      bounds.push( { event: event, callback: callback, index: bounds.length } );
      elem.addEventListener(event, callback, useCapture || false);
    });
  }

  function unbind(event) {
    this.filter(isNormalNode).forEach(function(elem) {
      var id = getNodeId(elem),
          bounds = listeners[id];
      findBoundsByEvent(bounds, event).forEach(function(bound) {
        delete bounds[bound.index];
        elem.removeEventListener(event, bound.callback, false);
      });
    });
  }

  function trigger(elem, event) {
    var e = doc.createEvent("Event");
    e.initEvent(event, true, true);
    elem.dispatchEvent(e);
  }




  // ajax

  function encode(obj) {
    var result = "?", set = [], key;

    for ( key in obj ) {
      set.push(enc(key) + "=" + enc(obj[key]));
    }

    return result + set.join("&");
  }

  function ajax(url, success, error, options) {
    var xhr = new XMLHttpRequest(),
        options = options || {},
        error = error || function() {},
        header = options.header || {},
        ctype = options.ctype || (( options.method === "POST" ) ? "application/x-www-form-urlencoded" : ""),
        data = options.data || "",
        key;

    xhr.onreadystatechange = function() {
      if ( xhr.readyState === 4 ) {
        if ( xhr.status >= 200 && xhr.status < 300 ) {
          success(xhr.responseText, xhr);
        } else {
          error(xhr);
        }
      }
    };

    if ( typeof data === "object" ) {
      data = encode(data);
    }

    xhr.open(options.method || "GET", url, true);

    if ( ctype ) {
      xhr.setRequestHeader("Content-Type", ctype);
    }
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    for ( key in header ) {
      xhr.setRequestHeader(key, header[key]);
    }

    xhr.send(data);
  }


  // elements with cache

  function id(identifier, context) {
    return wrap(id._[identifier] || (id._[identifier] = (context || doc).getElementById(identifier)));
  }

  function cls(name, context) {
    return wrap(cls._[name] || (cls._[name] = (context || doc).getElementsByClassName(name)));
  }

  function query(selector, context) {
    return query._[selector] || (query._[selector] = (context || doc).querySelectorAll(selector));
  }

  id._ = {};
  cls._ = {};
  query._ = {};


  // add public method to R

  R.id = id;
  R.cls = cls;
  R.ajax = ajax;

  return R;

})(document, Array.prototype.slice, encodeURIComponent);
