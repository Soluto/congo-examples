var congoProxy = require("congo-proxy");

var CongoAndroidWebViewInvoker = require("congo-android-webview-js").congoAndroidWebViewInvoker;
var invoker = new CongoAndroidWebViewInvoker("bridge");

var proxy = congoProxy("myService", invoker);
proxy.registerMethod("someMethod");
proxy.registerObservable("streamThatNeverEnds");
proxy.registerObservable("streamThatEnds");

var myService = proxy.build();

myService.someMethod().then(function(result) {
    console.log(result);
})

myService.streamThatNeverEnds()
 .take(5)
 .doOnNext(function(result) {
    console.log(result);
 })
 .doOnCompleted(function() {
     console.log("streamThatNeverEnds: completed");
 })
 .subscribe();

myService.streamThatEnds()
  .doOnNext(function(result) {
     console.log(result);
  })
  .doOnCompleted(function() {
      console.log("streamThatEnds: completed");
  })
  .subscribe();