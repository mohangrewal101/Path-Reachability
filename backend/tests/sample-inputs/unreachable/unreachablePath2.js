function unreachablePath2(a: boolean, b: boolean) {
  if (a) {
    // do something
  } else {
    // do something else
  }

  if (b) {
    // do something
    if (!b) {
      // do something
    }
  }
}
