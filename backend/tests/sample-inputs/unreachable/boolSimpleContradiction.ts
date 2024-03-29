function simpleContradiction(a: boolean) {
  if (a) {
    // do something
    if (!a) {
      // Do something else
    }
  }
}
