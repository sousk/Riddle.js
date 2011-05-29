module("test for r.ajax: only about status code");

is = strictEqual;

Deferred.define();

var spy = sinon.spy(r.ajax);


// helper functions
function simpleServer() {
  var server = sinon.fakeServer.create();
  server.respondWith("GET", "test.html", [200, { "Content-Type": "text/html" }, 'test']);
  server.respondWith("POST", "test.html", [200, { "Content-Type": "text/html" }, 'test']);
  return server;
}

function testDefaults(server) {
  is( server.requests[0].requestHeaders["X-Requested-With"], "XMLHttpRequest" );
  is( server.requests[0].async, true );
}

function testOption(option, addtionalTest) {
  var server = simpleServer();

  r.ajax("test.html", function(data, xhr) {
    is( data, "test", "response data is test" );
    testDefaults(server);

    if ( typeof addtionalTest === "function" ) {
      addtionalTest(server);
    }
    start();

  }, function() {}, option);

  server.respond();
}

function testCode(code, success) {
  var server = sinon.fakeServer.create();

  server.respondWith("GET", code + ".html", [code, { "Content-Type": "text/html" }, String(code)]);

  asyncTest("test with " + code, function() {
    if ( success ) {
      r.ajax(code + ".html", function(data, xhr) {
        is( data, String(code), "response data is " + code );
        is( xhr.status, code, "response status is " + code );
        testDefaults(server);
        start();
      });
    }
    else {
      r.ajax(code + ".html", function() {}, function(xhr) {
        is( xhr.status, code, "response status is " + code );
        testDefaults(server);
        start();
      });
    }

    server.respond();
  });
}


// tests

next(function() {
  testCode(200, true);
  return wait(0.5);
}).
next(function() {
  testCode(201, true);
  return wait(0.5);
}).
next(function() {
  testCode(207, true);
  return wait(0.5);
}).
next(function() {
  testCode(401, false);
  return wait(0.5);
}).
next(function() {
  testCode(404, false);
  return wait(0.5);
}).
next(function() {
  testCode(500, false);
  return wait(0.5);
});


module("test for r.ajax with additional header");

next(function() {
  asyncTest("test with additional header", function() {
    var header = {
      "Content-Type": "application/json",
      "Something": 10
    };

    testOption( { header: header }, function(server) {
      is( server.requests[0].requestHeaders["Content-Type"], "application/json" );
      is( server.requests[0].requestHeaders["Something"], 10 );
    });
  });
});

next(function() {
  asyncTest("test with application/x-www-form-urlencoded POST body", function() {
    var data = {
      foo: "bar",
      bar: "baz",
      multibyte: "ほむほむ"
    };

    testOption( { data: data, method: "POST" }, function(server) {
      var encoded = server.requests[0].requestBody.slice(1), original = {};

      encoded.split("&").forEach(function(kv) {
        var ary = kv.split("="), k = ary[0], v = ary[1];
        original[decodeURIComponent(k)] = decodeURIComponent(v);
      });

      is( original.foo, "bar" );
      is( original.bar, "baz" );
      is( original.multibyte, "ほむほむ" );
    });
  });
});

next(function() {
  asyncTest("test with ctype option", function() {

    testOption( { ctype: "application/json" }, function(server) {
      is( server.requests[0].requestHeaders["Content-Type"], "application/json" );
    });

  });
});
