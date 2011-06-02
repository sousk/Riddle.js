var r = (function(doc, toArray, enc) {

  var listeners = {}, nodeId = 1,
      events = ["click", "submit", "focus", "blur", "scroll", "select", "change"],
      touchEvents = ["swipeLeft", "swipeRight", "tap"],
      touch = { x1: 0, x2: 0 },
      domLoaded = false,
      readyErr = "r(callback) and r(selector) are only allowed.";

/**
 * <p> Select HTMLElements, wait DOMContentLoaded or wrap HTMLElement with r.fn <br /> Usages are:
 * <ul>
 * <li>Select and wrap HTML Elements with r(selector: String, [context: HTMLElement]).
 * <li>Wait DOMContentLoaded with r(func: Function). <br/>
 * <li>Just to wrap HTMLElement with r(elem: HTMLElement)
 * <ul/>
 * @name r
 * @function
 * @param first {(string|function|HTMLElement)}
 * @param second {?HTMLElement}
 * @throws {Error} If arguments not correct
 * @return {NodeArray} On Selector or wrapper usage
 * @example
 * var elementsById = r("#id");
 * var elementsByClass = r(".class");
 * var elementsByTag = r("tag");
 * @example
 * r(function() {
 *   // put initialization process here, which you want to run after DOMContentLoaded event
 * });
 * @example
 * r("#id").bind(function(e) {
 *   var wrapped = r(e.target);
 * });
 */
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

 /**
  * Base class of HTMLElement Array collected by selector.
  * @name r.fn
  * @class base class of HTMLElement Array collected by selector.
  */
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

/**
 * Get the first Element which returns true with given predicate
 * @name detect
 * @function
 * @nosideeffects
 * @param pred {function}
 * @return {HTMLElement} HTMLElement if found
 * @example
 * var apple = r("select#fruits option").detect(function(option) { return option.value === "apple"; });
 */
  function detect(pred) {
    return this.filter(pred)[0];
  }

/**
 * Invoke function for each element and produce result Array
 * @name invoke
 * @function
 * @memberOf r.fn
 * @param functionName {string}
 * @return {Array} Array of produced results
 */
  function invoke() {
    var args = toArray.call(arguments), func = args.shift();
    return this.map(function(item) {
      return item[func].apply(item, args);
    });
  }

/**
 * Collect properties of all elements with given key
 * @name pluck
 * @function
 * @nosideeffects
 * @memberOf r.fn
 * @param key {string}
 * @return {Array} Array of properties
 * @example
 * var values = r("select#fruits option").pluck("value");
 */
  function pluck(key) {
    return this.map(function(item) { return item[key]; });
  }


// DOM

/**
 * <p> Get/Set innerHTML of elements </p>
 * <ul>
 * <li> html(): returns html: String if selector has just one element
 * <li> html(): returns htmls: Array[String] if selector has more than two elements
 * <li> html(str): set string as innerHTML for all elements
 * <li> html(elem): set HTMLElement as innerHTML for all elements
 * <li> html(nodeArray): set NodeArray as innerHTML for all elements
 * <ul/>
 * @name html
 * @function
 * @memberOf r.fn
 * @param html {(string|HTMLElement|NodeArray)}
 * @return {(string|Array.<string>)}
 * @example
 * var story = r("p#story").html();
 * @example
 * var colors = r("li.colors").html();
 * @example
 * r("li.colors").html("black");
 * @example
 * r("li.colors").html(document.getElementById("#my-color"));
 * @example
 * r("#story").html(r("li#stories"));
 */
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

/**
 * Remove elements from document tree
 * @name remove
 * @function
 * @memberOf r.fn
 * @example
 * r("#mami .head").remove();
 */
  function remove() {
    this.forEach(function(elem) { elem.parentNode.removeChild(elem) });
  }

/**
 * append elements to selected NodeArray
 * @name add
 * @function
 * @memberOf r.fn
 * @param elem {(HTMLElement|NodeArray)}
 * @example
 * r(".magical-girl").add(document.getElementById("#madoka"));
 * @example
 * r(".magical-girl").add(r("#madoka, #homura"));
 */
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

/**
 * <p> Get/Set attribute(s) of elements </p>
 * <ul>
 * <li> attr(name): returns attribute: String if selector has just one element
 * <li> attr(name): returns attributes: Array[String] if selector has more than two elements
 * <li> attr(name, value): set value to element's attribute
 * <li> attr(hash): set values to element's attribute
 * <ul/>
 * @name attr
 * @function
 * @memberOf r.fn
 * @param name {(string|Object)}
 * @param value {?string}
 * @return {(string|Array.<string>)}
 * @example
 * var value = r("#age").attr("value");
 * @example
 * var values = r("option.age").attr("value");
 * @example
 * r(".links-change").attr("href", "http://example.com");
 * @example
 * r(".links-change").attr( { href: "http://example.com", target: "_blank" } );
 */
  function attr(name, value) {
    if ( typeof name === "string" ) {
      if ( typeof value === "undefined" ) {
        if ( this.length === 1 ) {
          return this[0].getAttribute(name);
        }
        else {
          return this.invoke("getAttribute", name);
        }
      }
      else {
        this.invoke("setAttribute", name, String(value));
      }
    }
    else if ( typeof name === "object" ) {
      this.forEach(function(elem) {
        for ( var k in name ) {
          elem.setAttribute(k, String(name[k]));
        }
      });
    }
  }

/**
 * <p> Get/Set css property(properties) of elements </p>
 * <ul>
 * <li> css(key): returns css style value: String if selector has just one element
 * <li> css(key): returns css style values: Array[String] if selector has more than two elements
 * <li> css(key, value): set css style value
 * <li> css(hash): set css style values
 * <ul/>
 * @name css
 * @function
 * @memberOf r.fn
 * @param key {(string|Object)}
 * @param value {?string}
 * @return {(string|Array.<string>)}
 * @example
 * var bodyHeight = r("body").css("height");
 * @example
 * var listHeights = r("li.familiar").css("height");
 * @example
 * r("#hyde").css("height", "156px");
 * @example
 * r(".monster").css( { visibility: "visible", background-color: "red" } );
 */
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
        this.forEach(function(elem) {
          elem.style.cssText += ";" + cssPair(param);
        });
      }
    }
    else if ( typeof key === "object" ) {
      this.forEach(function(elem) {
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

/**
 * set class to elements
 * @name addClass
 * @function
 * @memberOf r.fn
 * @param className {string}
 */
  function addClass(name) {
    this.forEach(function(elem) {
      elem.className += " " + name;
    });
  }

/**
 * remove class from elements
 * @name removeClass
 * @function
 * @memberOf r.fn
 * @param className {string}
 */
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

/**
 * bind callback function to elements
 * @name bind
 * @function
 * @memberOf r.fn
 * @param event {string}
 * @param callback {function(e: Object)}
 * @param useCapture {?boolean}
 * @example
 * r("#button").bind("click", function(e) {
 *   alert("button clicked on" + e.target.tagName);
 * });
 */
  function bind(event, callback, useCapture) {
    this.forEach(function(elem) {
      var id = getNodeId(elem),
          bounds = listeners[id] || (listeners[id] = []);
      bounds.push( { event: event, callback: callback, index: bounds.length } );
      elem.addEventListener(event, callback, useCapture || false);
    });
  }

/**
 * unbind alreaedy-bound callback function from elements
 * @name unbind
 * @function
 * @memberOf r.fn
 * @param event {string}
 * @example
 * r("#button").unbind("click");
 */
  function unbind(event) {
    this.forEach(function(elem) {
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

/**
 * send XMLHttpRequest to given URL to get data
 * @name ajax
 * @function
 * @nosideeffects
 * @memberOf r
 * @param url {string}
 * @param success {function(string, Object)}
 * @param error {?function(Object)}
 * @param options {?{method: string, header: Object, ctype: string, data: Object}}
 * @example
 * r.ajax("http://example.com/people/get", function(data, xhr) {
 *   r("#people").html(data);
 * });
 * @example
 * r.ajax("http://example.com/articles", function(data, xhr) {
 *   r("#article").html(data.result);
 * }, function(xhr) {
 *   r("#article").html("Oops! Something is wrong!");
 *   console.dir(xhr);
 * }, {
 *   method: "POST",
 *   data: {
 *     foo: "bar",
 *     bar: "baz",
 *   },
 *   header: {
 *     "X-FooBar": "baz"
 *   },
 * });
 */
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

/**
 * select a element by id and wrap it as NodeArray
 * @name id
 * @function
 * @memberOf r
 * @param identifier {string}
 * @param context [HTMLElement]
 * @return NodeArray
 */
  function id(identifier, context) {
    return wrap(id._[identifier] || (id._[identifier] = (context || doc).getElementById(identifier)));
  }

/**
 * select elements by class and wrap it as NodeArray
 * @name cls
 * @function
 * @memberOf r
 * @param name {string}
 * @param context [HTMLElement]
 * @return NodeArray
 */
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
