function example_8(a: boolean, b: boolean, c: boolean) {
  let d: number = 1;
  d = 2;
  d = 3;
  a = true;
  if (a == b) {
    d = 4;
    b = false;
  } else {
    d = 5;
    b = true;
  }

  if (b) {
    // do something
    if (c) {
      a = false;
    } else {
      a = true;
    }
  } else {
    if (a) {
      // do something
    } else {
      // do something else
    }
  }
}
