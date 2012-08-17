var PUBNUB, channel, history_test, nodeunit, publish_dummy, publish_test, pubnub, subscribe_test, time_test, uuid_test;

PUBNUB = require('../pubnub');

nodeunit = require('nodeunit');

channel = 'unit-test-pubnub-nodejs';

pubnub = PUBNUB.init({
  publish_key: 'demo',
  subscribe_key: 'demo'
});

publish_dummy = function(channel, callback) {
  if (callback === null) {
    callback = function() {};
  }
  return pubnub.publish({
    channel: channel,
    message: {
      test: "test"
    },
    callback: callback
  });
};

publish_test = function(test) {
  test.expect(2);
  return publish_dummy(channel, function(response) {
    test.ok(response[0] === 1);
    test.ok(response[1] === "Sent");
    test.done();
  });
};

time_test = function(test) {
  test.expect(1);
  return pubnub.time(function(time) {
    test.ok(time);
    test.done();
  });
};

uuid_test = function(test) {
  test.expect(1);
  return pubnub.time(function(uuid) {
    test.ok(uuid);
    test.done();
  });
};

history_test = function(test) {
  test.expect(2);
  console.log('history test');
  return pubnub.history({
    limit: 1,
    channel: channel,
    callback: function(messages) {
      test.ok(messages);
      test.ok(messages[0].test === "test");
      test.done();
    }
  });
};

subscribe_test = function(test) {
  var test_channel;
  test_channel = 'channel-' + PUBNUB.unique();
  test.expect(2);
  return pubnub.subscribe({
    channel: test_channel,
    connect: function() {
      return publish_dummy(test_channel);
    },
    message: {
      test: "test"
    },
    callback: function(message) {
      test.ok(message);
      test.ok(message.test === "test");
      test.done();
      return true;
    }
  });
};

module.exports = {
  "Publish Test": publish_test,
  "History Test": history_test,
  "Time Test": time_test,
  "UUID Test": uuid_test,
  "Subscribe Test": subscribe_test
};