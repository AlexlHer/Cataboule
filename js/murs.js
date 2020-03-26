// Auteur : Alexandre l'Heritier

// Classe représentant un mur invisible.
class MurInvisible extends Carre {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {Number} width La largeur de l'objet.
	 * @param {Number} height La hauteur de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 */
	constructor(emplacement, width, height, ctx) {
		super(emplacement, width, height, Infinity, ctx);
	}
	draw(origineCanvas, zoom) {
		if(!Constants.debugMode) return;
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

// Classe représentant un mur visible.
class Mur extends Carre{

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {Number} width La largeur de l'objet.
	 * @param {Number} height La hauteur de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image]} images Les deux images représentant la case du dessus et celle du dessous.
	 * @param {Boolean} avecDessus Pour savoir si on doit dessiner l'herbe.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, width, height, ctx, images, avecDessus, elasticity, deplacDef){
		super(emplacement, width, height, Infinity, ctx, false, false, false, deplacDef);
		this.images = images;
		this.avecDessus = avecDessus;

		// Si pas d'élasticité, on garde celle d'origine.
		this.elasticity = elasticity || this.elasticity;
	}

	/**
	 * Méthode permettant de dessiner le mur dans le canvas.
	 * @param {Vector} origineCanvas L'emplacement de l'origine du canvas.
	 * @param {Number} zoom Le niveau de zoom du canvas.
	 */
	draw(origineCanvas, zoom) {

		// Fonctions permettant d'avoir le x et le y pour chaque image.
		let x = (a) => {
			return origineCanvas.x + (this.origin.x + a) * zoom;
		};
		let y = (a) => {
			return origineCanvas.y - (this.origin.y - a) * zoom;
		};

		// On regarde si on peut mettre des cases de 60px².
		let max = (this.width >= 60 && this.height >= 60 ? 60 : 30);
		
		// On calcule la taille des images selon le zoom.
		// +1 pour éviter le découpage entre les cases.
		let taille = max * zoom + 1;

		// On dessine tout le mur.
		for (let i = 0; i < this.width / max; i++){
			for (let j = 0; j < this.height / max; j++) {
				this.ctx.drawImage(
					
					// Si on veut de l'herbe, on l'a dessine au-dessus.
					this.images[j == 0 && this.avecDessus ? 0 : 1],
					x(i * max),
					y(j * max),
					taille,
					taille
				);
			}
		}
	}
}