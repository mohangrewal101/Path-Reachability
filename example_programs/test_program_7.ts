function example_7(a: number, b: number, c: number) {
  b = 10;
  a = 2;
  a = a + b;

  if (c < a) {
    b = 2;
  } else {
    b = 20;
  }

  if (b < 10) {
    // do something
  } else {
    // something else
  }
}
