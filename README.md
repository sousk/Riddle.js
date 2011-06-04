Riddle.js
=======

Riddle.js is simple and stupid selector-based JavaScript library mainly for iPhone and Android devices ( currently alpha-quality )

* riddle.js (14k) -> original Riddle.js source code, for development
* riddle.min.js (3.9k) -> Riddle.js minified with Closure Compiler, for production
* riddle-all.min.js (4.5k) -> Riddle.js and all included plugins combined and minified with Closure Compiler


Riddle.js is:
-------

* to be thin
* to be simple
* to be small


Riddle.js is not:
-------

* to do all for you
* willing to kick you to library lock-in
* for people who like to dream eternally in comfortable DSL


Features
-------

* wait DOMContentLoaded with r({fucntion})
* jQuery-like selector with r({string})
* DOM manipulation ( html, add, remove ) for selector result
* Attribute modifier ( attr, css, addClass, removeClass ) for selector result
* Event bindings ( bind, unbind, click, sunmit, focus, ... ) for selector result
* Array++ functions ( detect, invoke, pluck ) for selector result
* xhr wrapper with r.ajax
* select with id or class ( r.id, r.cls )


More
-------

* Riddle uses selector backend for document.querySelectorAll. document.querySelectorAll is flxible DOM interface but not so fast. So please use r.id or r.cls if you want the speed. They uses more specialized functions like document.getElementById and document.getElementsByClassName internally.
* To extend selector result, add function to r.fn. Get access the results with "this".
* Riddle caches all DOM query results currently. This feature might be change in the future.


Included Plugins
-------

* touch.js ( Currently supports swipeLeft and swipeRight only )


FNAQ ( Frequently but Never Asked Questions )
-------

* Why Riddle doesn't support method chain? -> Because that is nothing.
* Why Riddle doesn't give me target element as "this" for event handlers? -> I'm just thinking about it.
* I want "foobar" feature. -> Give me message or pull request. I'll implement or merge if reasonable.
