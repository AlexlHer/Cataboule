// Auteur : Alexandre l'Heritier

// Classe représentant une boule.
class Boule extends Rond {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement La position de la boule (centre).
	 * @param {Number} taille Le diamètre de la boule.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Number} type Le type de la boule.
	 * @param {Number} masseApresLancement La masse de la boule après son lancement.
	 * @param {Image} image Sprite de la boule.
	 */
	constructor(emplacement, taille, ctx, type, masseApresLancement, image) {

		// On donne une masse Infinity pour que la boule soit immobile.
		super(emplacement, taille, taille, Infinity, ctx);

		this.origin = new Vector(emplacement.x - this.rayon, emplacement.y + this.rayon)
		this.type = type;
		this.masseApresLancement = masseApresLancement;

		// On garde une trace de l'emplacement initial de la boule.
		this.emplacementInitBoule = Object.create(this.origin);

		this.image = image;

		// La boule est fixe au début.
		this.isFixe = true;
	}

	/**
	 * Méthode permettant de lancer la boule.
	 * @param {Vector} v La vitesse initial de la boule.
	 */
	fixeToDynamique(v) {
		// On réstitue la masse de la boule.
		this.mass = this.masseApresLancement;
		this.invMass = 1 / this.masseApresLancement;

		// On initialise sa vitesse.
		this.velocity = v;

		// La boule n'est plus fixe.
		this.isFixe = false;
	}

	/**
	 * Méthode permettant d'effectuer le pouvoir de la boule.
	 * @returns true si la boule a effectué son pouvoir, false sinon.
	 */
	pouvoir() { return false; }

	/**
	 * Méthode permettant de dessiner la boule dans le canvas.
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
	}
}

// Classe représentant la boule0, sans pouvoir.
class Boule0 extends Boule{
	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de la boule.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Image} image L'image de la boule.
	 */
	constructor(emplacement, ctx, image) {

		// La boule0 a un diamètre de 70 et une masse de 70.
		super(emplacement, 70, ctx, 0, 70, image);
	}
}

// Classe représentant la boule1, avec un pouvoir de grossissement.
class Boule1 extends Boule {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de la boule.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {Image} image L'image de la boule.
	 */
	constructor(emplacement, ctx, image) {
		// La boule1 a un diamètre initial de 40 et une masse initial de 40.
		super(emplacement, 40, ctx, 1, 40, image);

		// Son élasticité est faible.
		this.elasticity = .2;
	}

	/**
	 * Méthode permettant d'effectuer le pouvoir de la boule.
	 * @returns true si la boule a effectué son pouvoir, false sinon.
	 */
	pouvoir() {
		// Si la boule a été lancé et que son type n'est pas 0.
		if (!this.isFixe && this.type !== 0){

			// On donne une masse de 100.
			this.mass = 150;
			this.invMass = 1 / this.mass;

			// Sa taille est maintenant de 100.
			this.width = 100;
			this.height = 100;
			this.rayon = this.width / 2;

			// On divise sa vitesse de 2.
			let v = new Vector(this.velocity.x / 2, this.velocity.y / 2);
			this.velocity = v;

			// On transforme la boule en boule sans pouvoir.
			this.type = 0;

			// La boule à effectué son pouvoir.
			return true;
		}

		// La boule a déjà effectué son pouvoir.
		return false;
	}
}

// Classe représentant la boule2, avec un pouvoir de vitesse.
class Boule2 extends Boule {

	/**
	* Constructeur.
	* @param {Vector} emplacement L'emplacement initial de la boule.
	* @param {ContextCanvas} ctx Le context du canvas.
	* @param {Image} image L'image de la boule.
	*/
	constructor(emplacement, ctx, image) {

		// La boule2 a un diamètre initial de 30 et une masse initial de 50.
		super(emplacement, 30, ctx, 2, 50, image);

		// Son élasticité est élevé.
		this.elasticity = .7;
	}
	/**
	 * Méthode permettant d'effectuer le pouvoir de la boule.
	 * @param {Number} x La position x du clique de la souris.
	 * @param {Number} y La position y du clique de la souris.
	 * @returns true si la boule a effectué son pouvoir, false sinon.
	 */
	pouvoir(x, y) {
		// Si la boule a été lancé et que son type n'est pas 0.
		if (!this.isFixe && this.type !== 0) {

			// On crée un vecteur vitesse dirigé vers le clique de la souris, on donne une vitesse de 3.
			this.velocity = new Vector(
				(x - this.origin.x),
				(y - this.origin.y)
			).normalize().mult(3);

			// On transforme la boule en boule sans pouvoir.
			this.type = 0;

			// La boule à effectué son pouvoir.
			return true;
		}

		// La boule a déjà effectué son pouvoir.
		return false;
	}
}

// Classe représentant la boule1, avec un pouvoir de triplication.
class Boule3 extends Boule {
	
	/**
	* Constructeur.
	* @param {Vector} emplacement L'emplacement initial de la boule.
	* @param {ContextCanvas} ctx Le context du canvas.
	* @param {Image} image L'image de la boule.
	*/
	constructor(emplacement, ctx, image) {

		// La boule3 a un diamètre initial de 60 et une masse initial de 50.
		super(emplacement, 60, ctx, 3, 50, image);

		// Son élasticité est très élevé.
		this.elasticity = 1;
	}

	/**
	 * Méthode permettant d'effectuer le pouvoir de la boule.
	 * @returns true si la boule a effectué son pouvoir, false sinon.
	 */
	pouvoir() {

		// Si la boule a été lancé et que son type n'est pas 0.
		if (!this.isFixe && this.type !== 0) {

			// On diminue la masse de la boule.
			this.mass = 25;
			this.invMass = 1 / this.mass;

			// On divise sa taille en 3.
			this.width /= 3;
			this.height /= 3;
			this.rayon = this.width / 2;

			// On ne change pas son type, c'est à la fonction appelante de le faire, 
			// en même temps que de créer deux autres boule autour.
			// this.type = 0;
			
			// La boule à effectué son pouvoir.
			return true;
		}
		
		// La boule a déjà effectué son pouvoir.
		return false;
	}
}