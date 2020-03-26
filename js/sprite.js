// Auteur : Alexandre l'Heritier

// Classe représentant un rectangle.
class Carre extends Body {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {Number} width La largeur de l'objet.
	 * @param {Number} height La hauteur de l'objet.
	 * @param {Number} masse La masse de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Boolean} isDeco Considération des collision ou non.
	 * @param {Number} pointsDeVie Le nombre de point de vie de l'objet.
	 * @param {Number} friable Le nombre de coup avant destruction de l'objet.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, width, height, masse, ctx, isDeco, pointsDeVie, friable, deplacDef) {
		super(emplacement, width, height, masse, isDeco, pointsDeVie, friable, deplacDef);
		this.ctx = ctx;
	}

	/**
	 * Méthode permettant de dessiner le rectangle dans le canvas.
	 * @param {Vector} origineCanvas L'emplacement de l'origine du canvas.
	 * @param {Number} zoom Le niveau de zoom du canvas.
	 */
	draw (origineCanvas, zoom) {
		// On passe du repère perso au repère du canvas.
		let x = origineCanvas.x + this.origin.x * zoom;
		let y = origineCanvas.y - this.origin.y * zoom;

		// On colore l'objet en rouge s'il y a collision.
		if (this.hasCollision) {
			this.ctx.fillStyle = "red";
			this.setCollision(false);
		} else {
			this.ctx.fillStyle = "white";
		}

		// On dessine le rond.
		this.ctx.fillRect(x, y, this.width * zoom, this.height * zoom);
	}
}

// Classe représentant un rond.
class Rond extends Body {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {Number} width Le diamètre de l'objet.
	 * @param {Number} height Le diamètre de l'objet.
	 * @param {Number} masse La masse de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Boolean} isDeco Considération des collision ou non.
	 * @param {Number} pointsDeVie Le nombre de point de vie de l'objet.
	 * @param {Number} friable Le nombre de coup avant destruction de l'objet.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, width, height, masse, ctx, isDeco, pointsDeVie, friable, deplacDef) {

		// On garde width et height pour que la construction d'un carré soit pareil que la construction d'un rond.
		super(emplacement, width, height, masse, isDeco, pointsDeVie, friable, deplacDef);

		// On garde le max entre width et height.
		this.width = Math.max(width, height);
		this.height = Math.max(width, height);

		// On calcule la taille du rayon.
		this.rayon = this.width / 2

		this.ctx = ctx;
	}

	/**
	 * Méthode permettant de dessiner le rond dans le canvas.
	 * @param {Vector} origineCanvas L'emplacement de l'origine du canvas.
	 * @param {Number} zoom Le niveau de zoom du canvas.
	 */
	draw(origineCanvas, zoom) {

		// On passe du repère perso au repère du canvas.
		// Les xy de arc() sont centrés donc on centre x et y.
		let x = origineCanvas.x + (this.origin.x + this.rayon) * zoom;
		let y = origineCanvas.y - (this.origin.y - this.rayon) * zoom;

		// On colore l'objet en rouge s'il y a collision.
		if (this.hasCollision) {
			this.ctx.fillStyle = "red";
			this.setCollision(false);
		} else {
			this.ctx.fillStyle = "white";
		}
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.rayon * zoom, 0, 2 * Math.PI);
		this.ctx.closePath();
		this.ctx.fill();
	}
}
