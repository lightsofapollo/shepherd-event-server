suite('binary json', function() {
  var subject = require('./binary_json');

  test('roundtrip', function() {
    var object = {
      wow: true,
      array: [1, 2, 3]
    };

    var result = subject.decode(subject.encode(object));
    assert.deepEqual(result, object);
  });
});
