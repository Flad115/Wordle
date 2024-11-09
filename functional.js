function isEven(val) {
  return val % 2 == 0;
}

function negate(f) {
  return function () {
    return !f;
  };
}

var isOdd = negate(isEven);

console.log(isEven(2));

console.log(isOdd(2));
