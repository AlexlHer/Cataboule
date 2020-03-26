// Auteur : Alexandre l'Heritier

// Classe représentant un bouton d'interface.
class Bouton {

	/**
	 * Constructeur.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Number} posX La position x du bouton.
	 * @param {Number} posY La position y du bouton.
	 * @param {Number} width La largeur du bouton.
	 * @param {Number} height La hauteur du bouton.
	 * @param {String} texte Le texte du bouton.
	 * @param {Number} tailleTexte La taille du texte.
	 * @param {Boolean} centre Si la position xy designe le centre du bouton (true) ou le point haut gauche (false).
	 * @param {Function} fonction Une fonction.
	 * @param {{offBg: String, onBg: String, offContour: String, onContour: String, texte: String}} couleur Un objet contenant les couleurs.
	 */
	constructor(ctx, posX, posY, width, height, texte, tailleTexte, centre, fonction, couleur){
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.pointAuCentre = centre;
		this.fonction = fonction;

		// On calcule les points xy1 et xy2.
		if (this.pointAuCentre) {
			this.x1 = posX - this.width / 2;
			this.y1 = posY - this.height / 2;
			this.x2 = posX + this.width / 2;
			this.y2 = posY + this.height / 2;
		}

		else {
			this.x1 = posX;
			this.y1 = posY;
			this.x2 = posX + this.width;
			this.y2 = posY + this.height;
		}

		this.color = couleur || {
			offBg: "#000",
			onBg: "gray",
			offContour: "grey",
			onContour: "white",
			texte: "white"
		};

		// On crée un Texte à placer dans le bouton.
		this.texte = new Texte(
			this.ctx, 
			this.x1 + this.width / 2,
			this.y1 + this.height / 2,
			tailleTexte,
			texte,
			"center",
			"center",
			this.width,
			this.color.texte
		);
	}

	/**
	 * Méthode permettant de dessiner le bouton et de le colorer si la souris est dessus.
	 * @param {Number} x La position x de la souris.
	 * @param {Number} y La position y de la souris.
	 */
	draw(x, y){

		this.ctx.beginPath();

		this.ctx.lineWidth = 2;

		// Si la souris est sur le bouton, on choisi les couleurs adéquats.
		if (this.isOn(x, y)) {
			this.ctx.strokeStyle = this.color.onContour;
			this.ctx.fillStyle = this.color.onBg;
		}
		else {
			this.ctx.strokeStyle = this.color.offContour;
			this.ctx.fillStyle = this.color.offBg;
		}

		this.ctx.rect(this.x1, this.y1, this.width, this.height);

		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.closePath();

		// On dessine le texte.
		this.texte.draw();

	}

	/**
	 * Méthode permettant de savoir si la souris est sur le bouton.
	 * @param {Number} x La position x de la souris.
	 * @param {Number} y La position y de la souris.
	 * @returns true si la souris est sur le bouton, false sinon.
	 */
	isOn(x, y) {
		return x > this.x1 && x < this.x2
			&& y > this.y1 && y < this.y2;
	}
	
}

// Classe representant un texte dans l'interface.
class Texte {

	/**
	 * Constructeur.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Number} posX La position x du texte.
	 * @param {Number} posY La position y du texte.
	 * @param {Number} size La taille du texte.
	 * @param {String} texte Le texte du bouton.
	 * @param {String} alignX L'alignement X (right, center, left).
	 * @param {String} alignY L'alignement Y (top, center, bottom).
	 * @param {Number} widthMax la largeur max du texte.
	 * @param {String} couleur La couleur du texte.
	 * @param {Number} tailleContour La taille du contour.
	 * @param {String} couleurContour La couleur du contour.
	 */
	constructor(ctx, posX, posY, size, texte, alignX, alignY, widthMax, couleur, tailleContour, couleurContour) {
		this.ctx = ctx;
		this.posX = posX;
		this.posY = posY;
		this.size = size;
		this.texte = texte;
		this.formatX = alignX;
		this.formatY = alignY;
		this.widthMax = widthMax || undefined;
		this.color = couleur || "white";
		this.sizeStroke = tailleContour || 0;
		this.colorStroke = couleurContour || "#000";

		// On mesure la taille du texte.
		let a = this.ctx.font;
		this.ctx.font = "bold " + this.size + "px Arial";
		this.width = this.ctx.measureText(this.texte).width;
		this.ctx.font = a;

		// On choisi l'alignement.
		switch (this.formatX) {
			case "center":
				this.textAlign = "center";
				break;

			case "right":
				this.textAlign = "right";
				break;

			default:
				this.textAlign = "left";
				break;
		}

		switch (this.formatY) {
			case "center":
				this.textBaseline = "middle";
				break;

			case "bottom":
				this.textBaseline = "bottom";
				break;

			default:
				this.textBaseline = "top";
				break;
		}
	}

	/**
	 * Méthode permettant de dessiner le texte.
	 */
	draw() {

		// On configure le dessin.
		this.ctx.font = "bold " + this.size + "px Arial";
		this.ctx.fillStyle = this.color;
		this.ctx.strokeStyle = this.colorStroke;
		this.ctx.lineWidth = this.sizeStroke;

		this.ctx.textBaseline = this.textBaseline;
		this.ctx.textAlign = this.textAlign;

		// On dessine.
		this.ctx.fillText(this.texte,
			this.posX,
			this.posY,
			this.widthMax
		);
		
		// Si la taille du contour est = 0, on ne fait rien.
		if (this.sizeStroke != 0){
			this.ctx.strokeText(this.texte,
				this.posX,
				this.posY,
				this.widthMax
			);
		}
	}

	/**
	 * Méthode permettant de changer le texte.
	 * @param {String} t Le nouveau texte.
	 */
	updateTexte(t){

		// Si c'est le même texte, on ne fait rien.
		if(t == this.texte) return;

		// On remplace le texte et on refait les mesures.
		this.texte = t;

		let a = this.ctx.font;
		this.ctx.font = "bold " + this.size + "px Arial";
		this.width = this.ctx.measureText(this.texte).width;
		this.ctx.font = a;
	}
}

// Classe représentant une image de l'interface.
class Imagee {

	/**
	 * Constructeur.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Number} posX La position x de l'image.
	 * @param {Number} posY La position y de l'image.
	 * @param {Number} width La largeur de l'image.
	 * @param {Number} height La hauteur de l'image.
	 * @param {Image} image L'image à dessiner.
	 * @param {Boolean} centre Si la position xy designe le centre de l'image (true) ou le point haut gauche (false).
	 */
	constructor(ctx, posX, posY, width, height, image, centre) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.image = image;
		this.pointAuCentre = centre;

		if (this.pointAuCentre) {
			this.posX = posX - this.width / 2;
			this.posY = posY - this.height / 2;
		}

		else {
			this.posX = posX;
			this.posY = posY;
		}
	}

	/**
	 * Méthode permettant de dessiner l'image.
	 */
	draw() {
		this.ctx.drawImage(
			this.image,
			this.posX,
			this.posY,
			this.width,
			this.height
		);
	}
}