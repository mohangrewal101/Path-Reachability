function testProgram1(a: boolean, b: boolean, c: boolean) {
  if (a) {
    // do something
  } else {
    // do something else
  }

  if (b) {
    // do something
    if (c) {
      // do something
    } else {
      // do something else
    }
  } else {
    if (a) {
      // do something
    } else {
      // do something else
    }
  }
}
