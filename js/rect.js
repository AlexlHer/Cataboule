// Auteur : Kim Nguyen

class Rect {
	constructor(emplacement, width, height) {
		this.origin = emplacement;
		this.width = width;
		this.height = height;
	}

	move (v) {
		this.origin = this.origin.add(v);
	}

	mDiff (r) {
		let orig = new Vector(r.origin.x - this.origin.x - this.width,
			r.origin.y - this.origin.y -  r.height);
		return new Rect(orig, this.width + r.width, this.height + r.height);
	}

	hasOrigin () {
		return (this.origin.x < 0 && this.origin.x + this.width > 0)
			&& (this.origin.y < 0 && this.origin.y + this.height > 0);
	}
}
