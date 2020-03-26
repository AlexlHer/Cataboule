// Auteur : Kim Nguyen
// Modifié par : Alexandre l'Heritier

// Classe représentant un objet dans le canvas.
class Body extends Rect {
	/**
	 * Constructeur.
	 * @param {Vector} emplacement L'emplacement initial de l'objet.
	 * @param {Number} width La largeur de l'objet.
	 * @param {Number} height La hauteur de l'objet.
	 * @param {Number} masse La masse de l'objet.
	 * @param {Boolean} isDeco Considération des collision ou non.
	 * @param {Number} pointsDeVie Le nombre de point de vie de l'objet.
	 * @param {Number} friable Le nombre de coup avant destruction de l'objet.
	 * @param {[Number, Vector]} deplacDef Le déplacement défini de l'objet. [vitesse, pointVers]
	 */
	constructor(emplacement, width, height, masse, isDeco, pointsDeVie, friable, deplacDef) {
		super(emplacement, width, height);

		this.mass = masse;
		this.invMass = 1 / this.mass;
		this.velocity = Vector.ZERO;
		this.force = Vector.ZERO;

		// Booléen permettant de savoir si l'objet est en collision avec un autre.
		this.hasCollision = false;

		// Booléen permettant de savoir si l'objet doit avoir des collision ou non.
		this.isDeco = isDeco || false;

		// Variable permettant de savoir le nb de PV de l'objet (si false, alors invincible).
		this.pointsDeVie = pointsDeVie || false;

		// Variable permettant de savoir le niveau de friabilité de l'objet (si false alors non friable).
		// +1 car première collision avec le sol.
		this.friable = friable+1 || false;

		// Variable permettant d'avoir l'élactisité de l'objet.
		this.elasticity = .5;

		// Si on demande un déplacement défini (objet mouvant).
		// deplacDef : [vitesse = Number, pointB = Vector].
		if(deplacDef != null){

			// L'objet doit être indéplaçable par les autres objets.
			this.mass = Infinity;
			this.invMass = 0;

			// On défini les deux points où l'objet doit se rendre.
			this.posA = Object.create(emplacement);
			this.posB = deplacDef[1];

			// On calcule le vecteur AB (ça évite de le recalculer à chaque fois, vu qu'il ne change pas).
			this.vectorAB = this.posB.sub(this.posA);

			// On initialise un compteur pour faire demi-tour au bout d'un certain nombre de pas 
			// (pour éviter les interbloquages de blocs).
			this.nbPas = this.vectorAB.norm();
			this.nbPasEffectue = 0;
			
			// On calcule la direction vers laquelle l'objet doit aller (de A vers B au début).
			this.direction = this.vectorAB.normalize().mult(deplacDef[0]/20);

			// Si true alors A vers B, sinon B vers A.
			this.sens = true;
		}
	}

	/**
	 * Méthode permettant de faire le déplacement défini, s'il y en a un.
	 */
	deplacementDefini(){
		// On teste les deux, au cas où un jour l'objet mouvant puisse devenir non mouvant.
		if(!Number.isFinite(this.mass) && this.direction != null){

			// On déplace l'objet.
			this.velocity = this.direction;

			// On fait un pas.
			this.nbPasEffectue++;

			// On regarde si on doit inverser le sens.
			if(this.sens){
				// Si l'objet a dépassé le point B.
				// A.-----------.O->----------.B 		Si AO < AB, on continue.
				// A.-------------------------.B---.O-> Si AO >= AB, on fait demi-tour.
				if (this.origin.sub(this.posA).norm() >= this.vectorAB.norm()
				|| this.nbPasEffectue >= this.nbPas){

					// On fait demi-tour.
					this.direction = new Vector(-this.direction.x, -this.direction.y);
					this.sens = false;
					this.nbPasEffectue = 0;
				}
			}

			// Pareil, mais dans l'autre sens.
			else{
				if (this.origin.sub(this.posB).norm() >= this.vectorAB.norm()
				|| this.nbPasEffectue >= this.nbPas) {

					this.direction = new Vector(-this.direction.x, -this.direction.y);
					this.sens = true;
					this.nbPasEffectue = 0;
				}
			}
		}
	}

	/**
	 * Accesseur permettant de modifier hasCollision.
	 * @param {Booléen} b La nouvelle valeur de hasCollision
	 */
	setCollision(b) {
		this.hasCollision = b;
	}

	/* 
	Detection de collision entre l'objet courrant et l'objet b.

	Renvoie null si pas de collision, sinon renvoie les nouveaux vecteur vitesses
	pour l'objet courant et pour b.
	*/
	collision(b) {

		// Si un des deux objets est une déco, on ne considère pas la collision.
		if (this.isDeco) return null;
		if (b.isDeco) return null;
		
		// On applique l'algo de calcul des collisions décrit dans l'énoncé du TP2.
		// On calcule mdiff = b (-) this.
		let mdiff = this.mDiff(b);

		// Si this contient l'origine.
		if (mdiff.hasOrigin()) {

			// On prend le vector qui à la plus petite norme.
			let vectors = [new Vector(0, mdiff.origin.y),
			new Vector(0, mdiff.origin.y + mdiff.height),
			new Vector(mdiff.origin.x, 0),
			new Vector(mdiff.origin.x + mdiff.width, 0)];

			let n = vectors[0];

			for (let i = 1; i < vectors.length; i++) {
				if (vectors[i].norm() < n.norm())
					n = vectors[i];
			};

			// Rapport des vitesses entre b et this.
			let norm_v = this.velocity.norm();
			let norm_vb = b.velocity.norm();
			let kv = norm_v / (norm_v + norm_vb);
			let kvb = norm_vb / (norm_v + norm_vb);

			// Il faut prendre en compte ce cas pour les objets qui ont tous les deux des vitesses nul.
			// Exemple (que j'ai renconté) : gravité=0, un objet mouvant (on n'utilisait pas la vitesse 
			// pour son déplacement) qui rencontre un objet quelconque avec une vitesse=0.
			if (norm_v + norm_vb == 0) {
				kv = 0; 
				kvb = 0;
			}

			if (norm_v == 0 && norm_vb == 0) {
				if (this.invMass == 0 && b.invMass == 0)
					return null;
				else {
					if (this.mass <= b.mass)
						kv = 1;
					else
						kvb = 1
				}

			};
			
			// On sépare les objets.
			this.move(n.mult(kv));
			b.move(n.mult(-kvb));


			n = n.normalize();

			// (2) On calcule l'impulsion j.
			let v = this.velocity.sub(b.velocity);
			let e = (this.elasticity + b.elasticity) / 2; // pour les étudiants, juste faire let e = 1;

			let j = -(1 + e) * v.dot(n) / (this.invMass + b.invMass);

			// Selon vitesse.
			// if (this.pointsDeVie !== false 
			// 	&& (this.velocity.norm() > .5 || b.velocity.norm() > .5)) {
			// 	this.pointsDeVie -= j;
			// 	console.log(this.pointsDeVie);
			// }
			// if (b.pointsDeVie !== false
			// 	&& (this.velocity.norm() > .5 || b.velocity.norm() > .5)) {
			// 	b.pointsDeVie -= j;
			// 	console.log(b.pointsDeVie);
			// }

			// On prend la gravité * 1000.
			let g = Constants.gravity.norm() * 1000;

			// On ajuste j avec la masse de l'objet selon des observations faite.
			let jAjust = j - ((this.mass - 30) / 3.3);
			let jbAjust = j - ((b.mass - 30) / 3.3);

			// Si l'objet n'est pas invincible et si j ajusté est > à g et si la vitesse de this est > .5,
			// on effectue un dégat.
			if (this.pointsDeVie !== false && jAjust > g && v.norm() > .5) {
				this.pointsDeVie -= jAjust / 2;
			}
			if (b.pointsDeVie !== false && jbAjust > g && v.norm() > .5) {
				b.pointsDeVie -= jbAjust / 2;
			}

			// Pareil avec la friabilité.
			if (this.friable !== false && jAjust > g && v.norm() > .5) {
				this.friable -= 1;
			}
			if (b.friable !== false && jbAjust > g && v.norm() > .5) {
				b.friable -= 1;
			}

			let test3 = this.velocity.x;

			// (3) On calcule les nouvelles vitesse.
			let new_v = this.velocity.add(n.mult(j * this.invMass));
			let new_bv = b.velocity.sub(n.mult(j * b.invMass));

			b.setCollision(true);
			this.setCollision(true);

			// Pour éviter que deux objets avec masse infini disparaissent.
			if (isNaN(new_v.x)) {
				new_v = new Vector(0, 0);
			}

			if (isNaN(new_bv.x)) {
				new_bv = new Vector(0, 0);
			}

			return { velocity1: new_v, velocity2: new_bv };

		} else {
			return null;
		}
	}
}
