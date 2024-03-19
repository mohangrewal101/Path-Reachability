function example(a: boolean, b: boolean) {
	if (a) {
		// do something
	} else {
		// do something else
	}

	if (b) {
		// do something
		const c: boolean = false;
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
