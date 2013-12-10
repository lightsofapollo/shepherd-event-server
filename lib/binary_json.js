function encode(object) {
  return new Buffer(JSON.stringify(object));
}

function decode(buffer) {
  return JSON.parse(buffer.toString());
}

module.exports = {
  encode: encode,
  decode: decode
};
