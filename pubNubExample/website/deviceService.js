var CongoPubNubInvoker = require('congo-pubnub-js').CongoPubNubInvoker;
var congoProxy = require('congo-proxy');

var pnConfiguration = {
    publishKey: "pub-c-4ccbfeff-cdb1-497a-a00c-2f01f367ff64",
    subscribeKey: "sub-c-ba17d4ee-2f0d-11e6-9327-02ee2ddab7fe"
};

var invoker = new CongoPubNubInvoker(pnConfiguration, "request_b4d5b93c-9a0a-4386-b1b4-0e7d6be4e7d2", "response_b4d5b93c-9a0a-4386-b1b4-0e7d6be4e7d2");

var proxy = congoProxy("someService", invoker);
proxy.registerObservable("getTime");
proxy.registerObservable("getRunningProcessesCount");
proxy.registerObservable("getLogs");

module.exports = proxy.build();
