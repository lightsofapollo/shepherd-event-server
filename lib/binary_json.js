function encode(object) {
  return new Buffer(JSON.stringify(object));
}

function decode(buffer) {
  return JSON.parse(buffer.toString());
}

module.exports = {
  MIME: 'application/json',
  encode: encode,
  decode: decode
};
