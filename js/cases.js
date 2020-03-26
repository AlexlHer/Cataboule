// Auteur : Alexandre l'Heritier

// Classe représentant une case.
class Case extends Carre {
	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {Number} width Le diamètre de l'objet.
	 * @param {Number} height Le diamètre de l'objet.
	 * @param {Number} masse La masse de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} pv Le nombre de PV de la case.
	 * @param {Number} friable Le nombre de coup avant destruction.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, width, height, masse, ctx, images, pv, friable, deplacDef) {
		super(emplacement, width, height, masse, ctx, false, pv, friable, deplacDef);
		this.images = images;

		// On défini des paliers pour les niveaux de dégradations.
		this.palierF = friable / 3;
		this.palierP = pv / 3;
	}

	/**
	 * Méthode permettant de dessiner la case dans le canvas.
	 * @param {Vector} origineCanvas L'emplacement de l'origine du canvas.
	 * @param {Number} zoom Le niveau de zoom du canvas.
	 */
	draw(origineCanvas, zoom) {

		// On passe du repère perso au repère du canvas.
		let x = origineCanvas.x + this.origin.x * zoom;
		let y = origineCanvas.y - this.origin.y * zoom;

		// On choisi l'image qui correspond au niveau de vie le plus bas.
		let image = 2;
		if (this.friable < this.palierF * 2 || this.pointsDeVie < this.palierP * 2)
			image = 1;
		if (this.friable < this.palierF || this.pointsDeVie < this.palierP)
			image = 0;
		

		// On dessine l'image correspondant au niveau de vie.
		this.ctx.drawImage(
			this.images[image],
			x,
			y,
			this.width * zoom,
			this.height * zoom
		);

		if(Constants.debugMode){
			this.ctx.font = "bold " + (this.width / 2 * zoom) + "px Arial";
			this.ctx.fillStyle = "black";

			this.ctx.strokeStyle = "black";
			this.ctx.lineWidth = this.zoom;

			this.ctx.textBaseline = "middle";
			this.ctx.textAlign = "center";

			this.ctx.fillText(Math.floor(this.pointsDeVie) + " / " + this.friable,
				x + this.width * zoom / 2,
				y
			);

			this.ctx.strokeText(Math.floor(this.pointsDeVie) + " / " + this.friable,
				x + this.width * zoom / 2,
				y
			);
		}
	}
}

// Classe représentant une case0. (1x1)
class Case0 extends Rond{

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} type Le type de la case.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, ctx, images, type, elasticity, deplacDef) {
		super(
			emplacement, 

			// 1 UM = 70px
			70,
			70,

			// La masse, selon le matériau.
			type == 0 ? 80 : type == 1 ? 65 : type == 2 ? 100 : 50, 

			ctx,
			false,

			// Les points de vie, selon le matériau.
			type == 0 ? 500 : type == 1 ? 650 : type == 2 ? 1000 : 800,

			// La friabilité, selon le matériau.
			type == 0 ? 3 : type == 1 ? 6 : type == 2 ? 4 : 8,

			deplacDef
		);

		this.images = images;

		// Elasticité, personnalisée ou selon le matériau.
		this.elasticity = elasticity || (type == 0 ? .5 : type == 1 ? .6 : type == 2 ? .1 : .7);
	}

	/**
	 * Méthode permettant de dessiner la case dans le canvas.
	 * @param {Vector} origineCanvas L'emplacement de l'origine du canvas.
	 * @param {Number} zoom Le niveau de zoom du canvas.
	 */
	draw(origineCanvas, zoom) {

		// On passe du repère perso au repère du canvas.
		let x = origineCanvas.x + (this.origin.x + this.width / 2) * zoom;
		let y = origineCanvas.y - (this.origin.y - this.height / 2) * zoom;

		// On choisi l'image qui correspond au niveau de vie le plus bas.
		let image = 2;
		if (this.friable < this.palierF * 2 || this.pointsDeVie < this.palierP * 2)
			image = 1;
		if (this.friable < this.palierF || this.pointsDeVie < this.palierP)
			image = 0;


		// On dessine l'image correspondant au niveau de vie.
		this.ctx.drawImage(
			this.images[image],
			x - this.rayon * zoom,
			y - this.rayon * zoom,
			this.rayon * 2 * zoom,
			this.rayon * 2 * zoom
		);
	}
}

// Classe représentant une case1. (1x1)
class Case1 extends Case {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} type Le type de la case.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, ctx, images, type, elasticity, deplacDef) {
		super(
			emplacement,

			// 1 UM = 70px
			70,
			70,

			// La masse, selon le matériau.
			type == 0 ? 80 : type == 1 ? 65 : type == 2 ? 100 : 50,

			ctx,
			images,

			// Les points de vie, selon le matériau.
			type == 0 ? 500 : type == 1 ? 650 : type == 2 ? 1000 : 800, 

			// La friabilité, selon le matériau.
			type == 0 ? 3 : type == 1 ? 6 : type == 2 ? 4 : 8,

			deplacDef
		);

		// Elasticité, personnalisée ou selon le matériau.
		this.elasticity = elasticity || (type == 0 ? .5 : type == 1 ? .6 : type == 2 ? .1 : .7);
	}
}

// Classe représentant une case2. (2x2)
class Case2 extends Case {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} type Le type de la case.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, ctx, images, type, elasticity, deplacDef) {
		super(
			emplacement,

			// 1 UM = 70px
			140, // 2
			140, // 2


			// La masse, selon le matériau.
			type == 0 ? 320 : type == 1 ? 260 : type == 2 ? 400 : 200,

			ctx,
			images,

			// Les points de vie, selon le matériau.
			type == 0 ? 2000 : type == 1 ? 2600 : type == 2 ? 4000 : 3200,

			// La friabilité, selon le matériau.
			type == 0 ? 3 : type == 1 ? 6 : type == 2 ? 4 : 8,

			deplacDef
		);

		// Elasticité, personnalisée ou selon le matériau.
		this.elasticity = elasticity || (type == 0 ? .5 : type == 1 ? .6 : type == 2 ? .1 : .7);
	}
}

// Classe représentant une case3. (3x1)
class Case3 extends Case {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} type Le type de la case.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, ctx, images, type, elasticity, deplacDef) {
		super(
			emplacement,
			
			// 1 UM = 70px
			210, // 3
			70, // 1

			// La masse, selon le matériau.
			type == 0 ? 240 : type == 1 ? 195 : type == 2 ? 300 : 150,

			ctx,
			images,

			// Les points de vie, selon le matériau.
			type == 0 ? 1500 : type == 1 ? 1950 : type == 2 ? 3000 : 2400,

			// La friabilité, selon le matériau.
			type == 0 ? 3 : type == 1 ? 6 : type == 2 ? 4 : 8,

			deplacDef
		);

		// Elasticité, personnalisée ou selon le matériau.
		this.elasticity = elasticity || (type == 0 ? .5 : type == 1 ? .6 : type == 2 ? .1 : .7);
	}
}

// Classe représentant une case4. (2x1)
class Case4 extends Case {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} type Le type de la case.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, ctx, images, type, elasticity, deplacDef) {
		super(
			emplacement,

			// 1 UM = 70px
			140, // 2
			70, // 1

			// La masse, selon le matériau.
			type == 0 ? 160 : type == 1 ? 130 : type == 2 ? 200 : 100,

			ctx,
			images,

			// Les points de vie, selon le matériau.
			type == 0 ? 1000 : type == 1 ? 1300 : type == 2 ? 2000 : 1600,

			// La friabilité, selon le matériau.
			type == 0 ? 3 : type == 1 ? 6 : type == 2 ? 4 : 8,

			deplacDef
		);

		// Elasticité, personnalisée ou selon le matériau.
		this.elasticity = elasticity || (type == 0 ? .5 : type == 1 ? .6 : type == 2 ? .1 : .7);
	}
}

// Classe représentant une case5. (3x2)
class Case5 extends Case {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} type Le type de la case.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, ctx, images, type, elasticity, deplacDef) {
		super(
			emplacement,

			// 1 UM = 70px
			210, // 3
			140, // 2

			// La masse, selon le matériau.
			type == 0 ? 480 : type == 1 ? 390 : type == 2 ? 600 : 300,

			ctx,
			images,

			// Les points de vie, selon le matériau.
			type == 0 ? 3000 : type == 1 ? 3900 : type == 2 ? 6000 : 4800,

			// La friabilité, selon le matériau.
			type == 0 ? 3 : type == 1 ? 6 : type == 2 ? 4 : 8,

			deplacDef
		);

		// Elasticité, personnalisée ou selon le matériau.
		this.elasticity = elasticity || (type == 0 ? .5 : type == 1 ? .6 : type == 2 ? .1 : .7);
	}
}

// Classe représentant une case6. (1x3)
class Case6 extends Case {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} type Le type de la case.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, ctx, images, type, elasticity, deplacDef) {
		super(
			emplacement,

			// 1 UM = 70px
			70, // 1
			210, // 3

			// La masse, selon le matériau.
			type == 0 ? 240 : type == 1 ? 195 : type == 2 ? 300 : 150,

			ctx,
			images,

			// Les points de vie, selon le matériau.
			type == 0 ? 1500 : type == 1 ? 1950 : type == 2 ? 3000 : 2400,

			// La friabilité, selon le matériau.
			type == 0 ? 3 : type == 1 ? 6 : type == 2 ? 4 : 8,

			deplacDef
		);

		// Elasticité, personnalisée ou selon le matériau.
		this.elasticity = elasticity || (type == 0 ? .5 : type == 1 ? .6 : type == 2 ? .1 : .7);
	}
}

// Classe représentant une case7. (1x2)
class Case7 extends Case {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} type Le type de la case.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, ctx, images, type, elasticity, deplacDef) {
		super(
			emplacement,

			// 1 UM = 70px
			70, // 1
			140, // 2

			// La masse, selon le matériau.
			type == 0 ? 160 : type == 1 ? 130 : type == 2 ? 200 : 100,

			ctx,
			images,

			// Les points de vie, selon le matériau.
			type == 0 ? 1000 : type == 1 ? 1300 : type == 2 ? 2000 : 1600,

			// La friabilité, selon le matériau.
			type == 0 ? 3 : type == 1 ? 6 : type == 2 ? 4 : 8,

			deplacDef
		);

		// Elasticité, personnalisée ou selon le matériau.
		this.elasticity = elasticity || (type == 0 ? .5 : type == 1 ? .6 : type == 2 ? .1 : .7);
	}
}

// Classe représentant une case8. (2x3)
class Case8 extends Case {

	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {ContextCanvas} ctx Le context du canvas.
	 * @param {[Image, Image, Image]} images Les trois images représentant les trois niveaux de dégradation.
	 * @param {Number} type Le type de la case.
	 * @param {Number} elasticity L'élasticité.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, ctx, images, type, elasticity, deplacDef) {
		super(
			emplacement,

			// 1 UM = 70px
			140, // 2
			210, // 3

			// La masse, selon le matériau.
			type == 0 ? 480 : type == 1 ? 390 : type == 2 ? 600 : 300,

			ctx,
			images,

			// Les points de vie, selon le matériau.
			type == 0 ? 3000 : type == 1 ? 3900 : type == 2 ? 6000 : 4800,

			// La friabilité, selon le matériau.
			type == 0 ? 3 : type == 1 ? 6 : type == 2 ? 4 : 8,

			deplacDef
		);

		// Elasticité, personnalisée ou selon le matériau.
		this.elasticity = elasticity || (type == 0 ? .5 : type == 1 ? .6 : type == 2 ? .1 : .7);
	}
}