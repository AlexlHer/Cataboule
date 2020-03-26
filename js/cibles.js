// Auteur : Alexandre l'Heritier

// Classe représentant une cible.
class Cible extends Carre {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement La position de la cible.
	 * @param {Number} taille Le diamètre de la cible.
	 * @param {Number} masse La masse de la cible.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Image} image L'image de la cible.
	 * @param {Number} pv Le nombre de point de vie de la cible.
	 * @param {Number} type Le type de cible.
	 */
	constructor(emplacement, taille, masse, ctx, image, pv, type) {
		super(emplacement, taille, taille, masse, ctx, false, pv);
		this.image = image;
		this.type = type;
	}

	/**
	 * Méthode permettant de dessiner la cible dans le canvas.
	 * @param {Vector} origineCanvas L'emplacement de l'origine du canvas.
	 * @param {Number} zoom Le niveau de zoom du canvas.
	 */
	draw(origineCanvas, zoom) {

		// On passe du repère perso au repère du canvas.
		let x = origineCanvas.x + this.origin.x * zoom;
		let y = origineCanvas.y - this.origin.y * zoom;

		// On dessine l'image.
		this.ctx.drawImage(
			this.image,
			x,
			y,
			this.width * zoom,
			this.height * zoom
		);

		// On dessine le nombre de point de vie.
		// On calcule la taille du texte selon la taille de la cible.
		this.ctx.font = "bold " + (this.width/2 * zoom) + "px Arial";

		// Selon le niveau de PV, on met une couleur differente.
		this.ctx.fillStyle = this.pointsDeVie > 50 ? "green" : this.pointsDeVie > 25 ? "orange" : "red";

		// On dessine le texte au-dessus de la cible.
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = this.zoom;

		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center";

		this.ctx.fillText(Math.floor(this.pointsDeVie),
			x + this.width * zoom / 2,
			y
		);

		this.ctx.strokeText(Math.floor(this.pointsDeVie),
			x + this.width * zoom / 2,
			y
		);
	}
}

// Classe représentant une cible0.
class Cible0 extends Cible {
	
	/**
	 * Constructeur.
	 * @param {Vector} emplacement La position de la cible.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Image} image L'image de la cible.
	 */
	constructor(emplacement, ctx, image) {
		super(emplacement, 70, 70, ctx, image, 50, 0);
	}
}

// Classe représentant une cible1.
class Cible1 extends Cible {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement La position de la cible.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Image} image L'image de la cible.
	 */
	constructor(emplacement, ctx, image) {
		super(emplacement, 40, 40, ctx, image, 100, 1);
	}
}

// Classe représentant une cible2.
class Cible2 extends Cible {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement La position de la cible.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Image} image L'image de la cible.
	 */
	constructor(emplacement, ctx, image) {
		super(emplacement, 40, 50, ctx, image, 80, 2);
	}
}

// Classe représentant une cible3.
class Cible3 extends Cible {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement La position de la cible.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Image} image L'image de la cible.
	 */
	constructor(emplacement, ctx, image) {
		super(emplacement, 60, 50, ctx, image, 40, 3);
	}
}