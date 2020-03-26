// Auteur : Alexandre l'Heritier

// Classe représentant le moteur de jeu.
class Engine extends Canvas {
	/**
	 * Constructeur de Engine.
	 * @param {HTMLElement} docElem L'élément html canvas de la page.
	 */
	constructor(docElem) {
		super(docElem);

		// Liste contenant tous les éléments à afficher.
		// - Modifiée par : addBody(), removeBody().
		// - Lu/Utilisée par : update().
		this.bodies = [];

		// Booléen permettant de savoir si on reste appuyer sur le clique de la souris.
		// - Modifié par : mouseUp(), mouseDown().
		// - Lu/Utilisé par : deplace_souris().
		this.click = false;

		// Origine permettant de calculer le déplacement. 
		// Represente le point où l'utilisateur à cliquer avant de déplacer la souris.
		// - Modifié par : deplace_souris(), mouseUp().
		// - Lu/Utilisé par : deplace_souris().
		this.origine_deplacement = new Vector(Number.MAX_VALUE, 0);

		// Flottant représentant le niveau de zoom actuel.
		// - Modifié par : zoom_plus(), zoom_moins(), clearAll().
		// - Lu/Utilisé par : addBoule(), deplacerCamLent(), mouseDown(), deplace_souris(),
		//   molette(), dessinBG(), update(), classe Jeu.
		this.zoom = .8;

		// Booléen permettant de savoir si l'utilisateur reste appuyé sur la boule (pour la lancer).
		// - Modifié par : isSurBoule(), lancementBoule().
		// - Lu/Utilisé par : deplace_souris(), update(), clearAll().
		this.surBoule = false;

		// Variable servant à contenir la boule à lancer.
		// - Modifiée par : addBoule(), removeBoule(), lancementBoule().
		// - Lu/Utilisée par : isSurBoule(), pouvoirDeBoule(), deplace_souris(), update(), clearAll().
		this.boule = null;

		// Booléen permettant de savoir si la caméra doit suivre la boule ou pas.
		// - Modifiée par : deplacerCamInst(), deplacerCamLent(), mouseDown(), lancementBoule().
		// - Lu/Utilisée par : update(), clearAll().
		this.suiviCam = false;

		// Liste contenant les cibles du niveau.
		// - Modifiée par : addCible(), removeCible(), clearAll().
		// - Lu/Utilisée par : classe Jeu.
		this.cibles = [];

		// Booléen permettant de savoir si on doit afficher les éléments du niveau ou laisser
		// Jeu gérer.
		// - Modifié par : classe Jeu.
		// - Lu/Utilisé par : mouseDown(), mouseUp(), deplace_souris(), update().
		this.interfaceFS = false;

		// Variable permettant de stocker l'objet Jeu qui gère la partie.
		// - Modifié par : lierJeu().
		// - Lu/Utilisé par : mouseDown(), deplace_souris(), update(), resize().
		this.gestion = null;

		// Objet permettant de stocker les images necessaire pour afficher des niveaux.
		// - Modifié par : chargementImages().
		// - Lu/Utilisé par : addMur(), addCible(), addBoule(), setEmplacementLanceur(), 
		//   dessinBG(), update().
		this.images = {};

		// Vector contenant la position du lanceur.
		// - Modifié par : setEmplacementLanceur().
		// - Lu/Utilisé par : update().
		this.emplacementLanceur = new Vector(0, 0);

		// String contenant l'ID du background à afficher.
		// - Modifiée par : classe Jeu.
		// - Lu/Utilisée par : dessinBG().
		this.typeBg = "00";

		// String contenant la couleur du bas du background à afficher.
		// - Modifiée par : classe Jeu.
		// - Lu/Utilisée par : dessinBG().
		this.colorBg = "#d0f4f7";

		// Liste contenant tous les décors à afficher.
		// - Modifiée par : classe Jeu.
		// - Lu/Utilisée par : dessinBG().
		this.decos = [];

		// Liste contenant tous les textes à afficher.
		// - Modifiée par : classe Jeu.
		// - Lu/Utilisée par : dessinBG().
		this.textes = [];

		// Liste contenant la position où aller ([Nb de pas restant à faire, Le pas à faire]).
		// - Modifié par : deplacerCamInst(), deplacerCamLent(), mouseDown(), origine_au_centre(), update().
		// - Lu/Utilisé par : update().
		this.deplacementCamVers = [];

		// Booléen pour savoir si on doit inverser la visé.
		// - Modifié par : classe Jeu.
		// - Lu/Utilisé par : deplace_souris().
		this.inversionViseur = true;

		// Integer donnant un coeff de force pour le lanceur.
		// - Modifié par : classe Jeu.
		// - Lu/Utilisé par : lancementBoule().
		this.forceLanceur = 1;

		this.inFullScreen = false;

		this.imageSecours;
	}

	/**
	 * Méthode permettant de lier un objet Jeu.
	 * @param {Jeu} j L'objet Jeu à utiliser.
	 */
	lierJeu(j){
		this.gestion = j;
	}

	/**
	 * Méthode async permettant de charger une image. Lorsque l'image est chargé, on résout la promesse.
	 * @param {String} url L'url de l'image à charger.
	 */
	async loadImage(url) {
		let imageSecours = this.imageSecours;
		return new Promise((resolve) => {
			let image = new Image();
			image.onload = () => resolve(image);
			image.onerror = () => resolve(imageSecours);
			image.src = url;
		});
	}

	/**
	 * Méthode permettant de charger les images necessaire.
	 */
	async chargementImages(){
		// Toutes les images de boules.
		this.images.boule0 = await this.loadImage("images/kenney_physicsAssets_v2/WEBP/Aliens/alienGreen_round.webp");
		this.images.boule1 = await this.loadImage("images/kenney_physicsAssets_v2/WEBP/Aliens/alienPink_round.webp");
		this.images.boule2 = await this.loadImage("images/kenney_physicsAssets_v2/WEBP/Aliens/alienBeige_round.webp");
		this.images.boule3 = await this.loadImage("images/kenney_physicsAssets_v2/WEBP/Aliens/alienBlue_round.webp");

		// Toutes les images de cibles.
		this.images.cible0 = await this.loadImage("images/kenney_physicsAssets_v2/WEBP/Aliens/alienGreen_suit.webp");
		this.images.cible1 = await this.loadImage("images/kenney_physicsAssets_v2/WEBP/Aliens/alienPink_suit.webp");
		this.images.cible2 = await this.loadImage("images/kenney_physicsAssets_v2/WEBP/Aliens/alienBeige_suit.webp");
		this.images.cible3 = await this.loadImage("images/kenney_physicsAssets_v2/WEBP/Aliens/alienBlue_suit.webp");

		// L'avant du lanceur.
		this.images.lanceurAv = await this.loadImage("images/lancePierre/lancePierreAv.webp");

		// L'arrière du lanceur.
		this.images.lanceurAr = await this.loadImage("images/lancePierre/lancePierreAr.webp");

		// Toutes les cases.
		// 4 Types.
		for(let i = 0; i < 4; i++){

			// 9 Formes.
			for(let j = 0; j < 9; j++){
				this.images[("case" + i) + j] = [];

				// 3 Qualités.
				for(let k = 0; k < 3; k++){
					this.images[("case" + i) + j].push(await this.loadImage(((("images/kenney_physicsAssets_v2/WEBP/Cases/" + i) + j) + k) + ".webp"));
				}
			}
		}

		// Tous les murs.
		// 5 Types de murs.
		for (let j = 0; j < 5; j++) {
			this.images["mur" + j] = [];

			// 2 Etat (dessus, dessous).
			for (let k = 0; k < 2; k++) {
				this.images["mur" + j].push(await this.loadImage((("images/kenney_physicsAssets_v2/WEBP/Murs/" + j) + k) + ".webp"));
			}
		}

		// Tous les BG.
		// 2 Types de BG.
		for (let j = 0; j < 2; j++) {

			// 4 Sous-Type.
			for (let k = 0; k < 4; k++) {
				this.images["background" + j + k] = await this.loadImage((("images/kenney_physicsAssets_v2/WEBP/Backgrounds/" + j) + k) + ".webp");
			}
		}

		// Toutes les décos.
		for (let k = 0; k < 8; k++) {
			this.images["deco" + k] = await this.loadImage(("images/kenney_physicsAssets_v2/WEBP/Decos/" + k) + ".webp");
		}
	}

	fullScreen(){
		if(this.inFullScreen){
			this.inFullScreen = false;
			try{
				document.exitFullscreen();
			}
			catch(e){}
		}
		
		else {
			this.inFullScreen = true;
			engine.canvas.requestFullscreen();
		}
	}

	/**
	 * Méthode permettant de créer un mur / un sol visible.
	 * @param {Vector} pos La position du mur (point haut/gauche).
	 * @param {Integer} w La longueur du mur.
	 * @param {Integer} h La hauteur du mur.
	 * @param {Integer} type Le type du mur (voir doc).
	 * @param {Boolean} avecBlocHerbe Si il doit y avoir de "l'herbe" sur le dessus (pour faire un sol par exemple).
	 * @param {Float} elasticity L'élasticité du mur.
	 * @param {[vitesse = Float, position = Vector]} deplacDeterm La position à laquelle le mur doit aller et revenir.
	 */
	addMur(pos, w, h, type = 0, avecBlocHerbe = false, elasticity, deplacDeterm = null){

		// Si le type n'existe pas, on met le mur 0.
		if (type < 0 || type > 4) type = 0;

		// On ajoute le mur.
		this.addBody(new Mur(pos, w, h, this.ctx, this.images["mur" + type], avecBlocHerbe, elasticity, deplacDeterm));
	}

	/**
	 * Méthode permettant de créer une cible.
	 * @param {Vecor} pos La position de la cible (point haut/gauche).
	 * @param {Integer} type Le type de cible (voir doc).
	 */
	addCible(pos, type = 0){
		let cible;

		// Selon le type, on crée une cible.
		switch (type) {
			case 1:
				cible = new Cible1(pos, this.ctx, this.images.cible1);
				break;
			case 2:
				cible = new Cible2(pos, this.ctx, this.images.cible2);
				break;
			case 3:
				cible = new Cible3(pos, this.ctx, this.images.cible3);
				break;
			default:
				cible = new Cible0(pos, this.ctx, this.images.cible0);
				break;
		}
		// On l'a met dans une liste de cible (qui permettera de déterminer si toutes les cibles ont été éliminé).
		this.cibles.push(cible);

		// On ajoute la cible dans la liste d'objet.
		this.addBody(cible);
	}

	/**
	 * Méthode permettant de créer une case.
	 * @param {Vector} pos La position de la case (point haut/gauche).
	 * @param {Integer} type Le type de case (voir doc).
	 * @param {Integer} forme La forme de la case (voir doc).
	 * @param {Float} elasticity L'élactisité de la case.
	 * @param {[Vitesse = Float, Position = Vector]} deplacDeterm Le point vers lequel la case doit aller et venir.
	 */
	addCase(pos, type = 0, forme = 1, elasticity, deplacDeterm = null) {
		let cases;
		switch (forme) {
			case 1:
				cases = new Case1(pos, this.ctx, this.images["case" + type + forme], type, elasticity, deplacDeterm);
				break;
			case 2:
				cases = new Case2(pos, this.ctx, this.images["case" + type + forme], type, elasticity, deplacDeterm);
				break;
			case 3:
				cases = new Case3(pos, this.ctx, this.images["case" + type + forme], type, elasticity, deplacDeterm);
				break;
			case 4:
				cases = new Case4(pos, this.ctx, this.images["case" + type + forme], type, elasticity, deplacDeterm);
				break;
			case 5:
				cases = new Case5(pos, this.ctx, this.images["case" + type + forme], type, elasticity, deplacDeterm);
				break;
			case 6:
				cases = new Case6(pos, this.ctx, this.images["case" + type + forme], type, elasticity, deplacDeterm);
				break;
			case 7:
				cases = new Case7(pos, this.ctx, this.images["case" + type + forme], type, elasticity, deplacDeterm);
				break;
			case 8:
				cases = new Case8(pos, this.ctx, this.images["case" + type + forme], type, elasticity, deplacDeterm);
				break;
			default:
				cases = new Case0(pos, this.ctx, this.images["case" + type + forme], type, elasticity, deplacDeterm);
				break;
		}
		// On ajoute la case dans la liste d'objet.
		this.addBody(cases);
	}

	/**
	 * Méthode permettant de mettre une boule sur le lanceur de boule.
	 * @param {Vector} pos La position de la boule (point centre).
	 * @param {Integer} type Le type de boule (voir doc).
	 */
	addBoule(pos, type = 0) {
		switch (type) {
			case 1:
				this.boule = new Boule1(pos, this.ctx, this.images.boule1);
				break;
			case 2:
				this.boule = new Boule2(pos, this.ctx, this.images.boule2);
				break;
			case 3:
				this.boule = new Boule3(pos, this.ctx, this.images.boule3);
				break;
			default:
				this.boule = new Boule0(pos, this.ctx, this.images.boule0);
				break;
		}

		// On ajout la boule dans la liste de boule.
		this.addBody(this.boule);

		// On déplace la caméra vers la boule, à une vitesse de 50.
		this.deplacerCamLent(pos.x + (this.width / 4) / this.zoom, pos.y, 50);
	}

	/**
	 * Méthode permettant de déplacer la caméra vers un endroit instantanément.
	 * @param {Integer} x La position x où se déplacer.
	 * @param {Integer} y La position y où se déplacer.
	 */
	deplacerCamInst(x, y){
		// On change les attributs qui définissent la caméra.
		this.origineCanvas = new Vector(this.width / 2 - x, this.height / 2 + y);
		this.oldOrigine = Object.create(this.origineCanvas);

		// On annule le déplacement lent.
		this.deplacementCamVers = [];

		// On annule le suivi de la boule.
		this.suiviCam = false;
	}

	/**
	 * Méthode permettant de déplacer la caméra avec une vitesse.
	 * @param {Integer} x La position x où il faut aller.
	 * @param {Integer} y La position y où il faut aller.
	 * @param {Integer} v La vitesse.
	 */
	deplacerCamLent(x, y, v) {
		// On doit déplacer le centre du canvas vers l'endroit demandé.
		let centreCanvas = new Vector(this.width / 2, this.height / 2);
		let dest = new Vector(this.origineCanvas.x + x * this.zoom, this.origineCanvas.y - y * this.zoom);

		// La liste de déplacement contient un déplacement à effectuer tous les pas et le nombre de pas à faire.
		this.deplacementCamVers = [
			centreCanvas.sub(dest).norm() / v - 1,
			centreCanvas.sub(dest).normalize().mult(v)
		];

		// On annule le suivi de la caméra.
		this.suiviCam = false;
	}

	/**
	 * Méthode permettant de retirer la boule.
	 */
	removeBoule(){
		// Si la boule est en déplacement (et donc lancé), trop tard.
		if (!this.boule.isFixe) return;

		// On retire la boule de la liste d'élement et on retire la boule.
		this.removeBody(this.boule);
		this.boule = null;
	}

	/**
	 * Méthode permettant de définir la position du lanceur selon la position de la boule.
	 * @param {Vector} v La position de la boule.
	 */
	setEmplacementLanceur(v){
		this.emplacementLanceur = new Vector(
			v.x - this.images.lanceurAv.width / 1.6,
			v.y + this.images.lanceurAv.height / 6);
	}

	/**
	 * Méthode permettant de voir si l'utilisateur est sur la boule.
	 * @param {Integer} x La position x à verifier.
	 * @param {Integer} y La position y à verifier.
	 */
	isSurBoule(x, y) {

		// On regarde si la boule est fixe (sinon inutile) et si la position donné est sur la boule.
		if (this.boule.isFixe 
			&& x < this.boule.origin.x + this.boule.width
			&& x > this.boule.origin.x
			&& y < this.boule.origin.y
			&& y > this.boule.origin.y - this.boule.height) {

			this.surBoule = true;
		}
	}

	/**
	 * Méthode permettant de déclencher le pouvoir de la boule.
	 * @param {Integer} x La position x où l'utilisateur à cliqué.
	 * @param {Integer} y La position y où l'utilisateur a cliqué.
	 */
	pouvoirDeBoule(x, y){

		// On demande à la boule de faire son pouvoir.
		// Le return sert à savoir si le suivi de la boule doit continuer.
		if (this.boule.type !== 3 || this.boule.isFixe)
			return this.boule.pouvoir(x, y);
		
		// Si la boule à été lancé et que son type est 3.
		// On est forcé de faire une partie du povoir ici car il y a création de boules.
		else {
			this.boule.pouvoir(x, y);
			// Le type de boule devient la boule 0 (la boule sans pouvoir).
			this.boule.type = 0;

			// On crée deux boules identiques.
			let boule2 = Object.create(this.boule);
			let boule3 = Object.create(this.boule);

			// On place les boules autour de la boule d'origine.
			boule2.origin = this.boule.origin.add(new Vector(
				-this.boule.velocity.y * 50,
				this.boule.velocity.x * 50
			));
			boule3.origin = this.boule.origin.add(new Vector(
				-this.boule.velocity.x * 50,
				-this.boule.velocity.y * 50
			));

			// On ajoute les boules.
			this.addBody(boule2);
			this.addBody(boule3);
			return true;
		}
	}

	/**
	 * Méthode appelé lors de l'appuie sur le clique gauche de la souris.
	 * @param {Event} e L'event souris.
	 */
	mouseDown(e) {
		// Si une interface plein écran est affiché, on laisse Jeu gérer.
		if (this.interfaceFS) {
			this.gestion.click(e.offsetX, e.offsetY);
			return;
		}

		// Si on clique sur un bouton de l'interface mais que cette 
		// interface n'est pas plein écran, on ne fait rien.
		if (this.gestion.click(e.offsetX, e.offsetY)){
			return;
		}

		// On dit que l'utilisateur est en train de cliquer.
		this.click = true;

		// On calcule la position selon l'origine et le zoom.
		let x = (e.offsetX - this.origineCanvas.x) / this.zoom;
		let y = (-e.offsetY + this.origineCanvas.y) / this.zoom;

		// Et on annule le déplacement de la caméra.
		this.deplacementCamVers = [];

		// Si on clique avec le clique droit, on deplace uniquement la caméra.
		if(e.button != 2){
			// On regarde si on clique sur la boule.
			this.isSurBoule(x, y);

			// On annule le suivi de la boule si le pouvoir à déjà été déclenché.
			// Sinon, on garde le suivi.
			this.suiviCam = this.pouvoirDeBoule(x, y);
		}
		else{
			this.suiviCam = false;
		}
	}

	/**
	 * Méthode permettant de lancer la boule.
	 */
	lancementBoule(){
		// Si on est pas sur la boule, on ne fait rien.
		if (this.surBoule) {
			// this.boule.mass = 1;
			// this.boule.invMass = 1;
			// this.boule.velocity = new Vector(-this.boule.origin.x, -this.boule.origin.y);

			// On calcule la vitesse initiale.
			let vitesseInit = new Vector(
				-(this.boule.origin.x - this.boule.emplacementInitBoule.x) / 100 * this.forceLanceur,
				-(this.boule.origin.y - this.boule.emplacementInitBoule.y) / 100 * this.forceLanceur
			);

			// On supprime la boule de la liste.
			this.removeBody(this.boule);

			// On rend dynamique la boule.
			this.boule.fixeToDynamique(vitesseInit);

			// On remet la boule dans la liste.
			this.addBody(this.boule);

			// On dit que la souris n'est plus sur la boule,
			// on accitve le suivi de la boule et on dit à Jeu qu'on a lancer la boule.
			this.surBoule = false;
			this.suiviCam = true;
			this.oldOrigine = this.boule.emplacementInitBoule.add(this.origineCanvas);
			this.gestion.lancementBoule();
		}
	}

	/**
	 * Méthode appelé lorsque le clique est retiré.
	 */
	mouseUp() {
		// Si on a une interface plein écran, on return (Jeu n'a pas besoin de savoir ça).
		if (this.interfaceFS) {
			return;
		}

		// On remet les max_int pour pouvoir savoir plus tard si c'est la première
		// fois que l'on a appelé deplace_souris().
		this.origine_deplacement = new Vector(Number.MAX_VALUE, 0);
		this.click = false;

		// On lance la boule (c'est lancementBoule qui gère le fait que la souris n'est pas sur la boule).
		this.lancementBoule();
	}

	/**
	 * Méthode appelé lorsque la souris est déplacé.
	 * @param {Event} e L'event souris.
	 */
	deplace_souris(e) {

		// On donne la nouvelle position à Jeu.
		this.gestion.move(e.offsetX, e.offsetY);

		// Si une interface plein écran est affiché, on ne fait rien.
		if (this.interfaceFS){
			return;
		}

		// Si la souris est déplacée dans le canvas mais que l'utilisateur ne clique
		// pas, on ne fait pas les calculs.
		if (this.click === false || this.suiviCam) return;

		// Si on ne clique pas sur la boule, c'est qu'on veut se déplacer.
		if (!this.surBoule) {
			// Si c'est la première fois que cette méthode est appelé.
			if (this.origine_deplacement.x == Number.MAX_VALUE) {
				// On enregistre l'emplacement du clique d'origine de l'utilisateur.
				this.origine_deplacement = new Vector(e.clientX, e.clientY);

				// On enregistre l'emplacement de l'origine d'origine pour pouvoir 
				// faire les calculs.
				this.oldOrigine = new Vector(this.origineCanvas.x, this.origineCanvas.y);
			}

			// La nouvelle origine est l'emplacement de l'origine d'origine + le déplacement
			// de la souris (si on n'enregistre pas l'origine d'origine, le déplacement va 
			// être exponentiel) - le placement de la souris d'origine (pour avoir un déplacement
			// de la souris correct).
			this.origineCanvas = new Vector(this.oldOrigine.x + e.clientX - this.origine_deplacement.x,
				this.oldOrigine.y + e.clientY - this.origine_deplacement.y);
		}

		// Si on clique sur la boule.
		else {
			// On calcule la position de la boule selon la position de la souris (on centre la boule sur le curseur de la souris).
			let posBouleCentre = new Vector(
				(e.offsetX - this.origineCanvas.x - this.boule.width / 2 * this.zoom) / this.zoom,
				(-e.offsetY + this.origineCanvas.y + this.boule.height / 2 * this.zoom) / this.zoom
			);

			let posBouleInit = this.boule.emplacementInitBoule;

			// On déplace la boule.
			if (posBouleCentre.sub(posBouleInit).norm() < 200){
				// Si on veut inverser la visé, on recalcule en inversant le vector.
				if(this.inversionViseur)
					this.boule.origin = posBouleCentre.sub(posBouleInit).inv().add(posBouleInit);
				else
					this.boule.origin = posBouleCentre;
			}

			// Si l'utilisateur tire trop, on ramène à 200 la taille de la corde.
			else{
				if (this.inversionViseur)
					this.boule.origin = posBouleCentre.sub(posBouleInit).normalize().mult(200).inv().add(posBouleInit);
				else
					this.boule.origin = posBouleCentre.sub(posBouleInit).normalize().mult(200).add(posBouleInit);

			}
		}
	}

	/**
	 * Méthode appelé lorsque la molette est utilisé.
	 * @param {Event} e L'event de la souris.
	 */
	molette(e) {
		// Si delta est > 0, on zoom, sinon on dézoom.
		if (e.deltaY > 0) this.zoom_moins(e);
		else this.zoom_plus(e);

		// On évite que la molette puisse descendre la page en même temps que le zoom.
		e.preventDefault();
	}

	/**
	 * Méthode permettant de zoomer.
	 */
	zoom_plus(e) {

		// La position du centre du canvas, relative à l'origine.
		let posCentre = new Vector(
			(this.width / 2 - this.origineCanvas.x) / this.zoom,
			(this.height / 2 - this.origineCanvas.y) / this.zoom
		);

		// La position du centre du canvas, avant le zoom, relative au repère canvas d'origine.
		let avant = new Vector(
			this.origineCanvas.x + posCentre.x * this.zoom,
			this.origineCanvas.y - posCentre.y * this.zoom
		);

		// On zoom.
		this.zoom += .1;

		// La position du centre du canvas, après le zoom, relative au repère canvas d'origine.
		let apres = new Vector(
			this.origineCanvas.x + posCentre.x * this.zoom,
			this.origineCanvas.y - posCentre.y * this.zoom
		);

		// On applique la difference pour zoomer par rapport au centre de l'écran.
		this.origineCanvas = new Vector(
			this.origineCanvas.x + avant.x - apres.x,
			this.origineCanvas.y - avant.y + apres.y
		);	
	}

	/**
	 * Méthode permettant de dézoomer.
	 */
	zoom_moins(e) {

		// La position du centre du canvas, relative à l'origine.
		let posCentre = new Vector(
			(this.width / 2 - this.origineCanvas.x) / this.zoom,
			(this.height / 2 - this.origineCanvas.y) / this.zoom
		);

		// La position du centre du canvas, avant le dézoom, relative au repère canvas d'origine.
		let avant = new Vector(
			this.origineCanvas.x + posCentre.x * this.zoom,
			this.origineCanvas.y - posCentre.y * this.zoom
		);

		// On dézoom.
		this.zoom -= .1;

		// On limite le dézoom à 1.
		if (this.zoom < .1) this.zoom = .1; 

		// La position du centre du canvas, après le dézoom, relative au repère canvas d'origine.
		let apres = new Vector(
			this.origineCanvas.x + posCentre.x * this.zoom,
			this.origineCanvas.y - posCentre.y * this.zoom
		);

		// On applique la difference pour dézoomer par rapport au centre de l'écran.
		this.origineCanvas = new Vector(
			this.origineCanvas.x + avant.x - apres.x,
			this.origineCanvas.y - avant.y + apres.y
		);
	}

	/**
	 * Méthode permettant de revenir a l'origine.
	 */
	origine_au_centre() {
		this.origineCanvas = new Vector(this.width / 2, this.height / 2);
		this.deplacementCamVers = [];
	}

	/**
	 * Méthode permettant de rajouter un objet dans la liste d'objet.
	 * @param {Body} b L'objet à ajouter.
	 */
	addBody(b) {
		this.bodies.push(b);
	}

	/**
	 * Méthode permettant de retirer un objet de la liste d'objet.
	 * @param {Body} b L'objet à retirer.
	 */
	removeBody(b) {
		let i = this.bodies.findIndex(function (e) { return e == b; });
		if (i >= 0)
			this.bodies.splice(i, 1);
	}

	/**
	 * Méthode permettant de retirer une cible de la liste de cible.
	 * @param {Body} b La cible à retirer.
	 */
	removeCible(b) {
		let i = this.cibles.findIndex(function (e) { return e == b; });
		if (i >= 0){
			this.cibles.splice(i, 1);

			// S'il reste encore d'autre cible (donc si le niveau n'est pas encore terminé).
			if(this.cibles.length > 0){

				// On crée une nouvelle boule correspondant au type de cible.
				let a;
				switch(b.type){
					case 0:
						a = new Boule0(b.origin, this.ctx, this.images.boule0);
						break;
					case 1:
						a = new Boule1(b.origin, this.ctx, this.images.boule1);
						break;
					case 2:
						a = new Boule2(b.origin, this.ctx, this.images.boule2);
						break;
					default:
						a = new Boule3(b.origin, this.ctx, this.images.boule3);
						break;
				}

				// On simule un lancé vers la première cible qui vient et un pouvoir.
				a.fixeToDynamique(this.cibles[0].origin.sub(b.origin).normalize().mult(1.5));
				a.pouvoir(this.cibles[0].origin.x, this.cibles[0].origin.y);

				// Si la boule est de type 3, on doit créer les deux autres boules (copier/coller 
				// des lignes de pouvoirDeBoule()).
				if(b.type == 3){
					a.type = 0;

					// On crée deux boules identiques.
					let boule2 = Object.create(a);
					let boule3 = Object.create(a);

					// On place les boules autour de la boule d'origine.
					boule2.origin = a.origin.add(new Vector(
						-a.velocity.y * 50,
						a.velocity.x * 50
					));
					boule3.origin = a.origin.add(new Vector(
						-a.velocity.x * 50,
						-a.velocity.y * 50
					));

					// On ajoute les boules.
					this.addBody(boule2);
					this.addBody(boule3);
				}

				// On ajoute notre boule.
				this.addBody(a);
			}
		}
	}

	/**
	 * Méthode permettant de dessiner le fond, avec décos et textes.
	 */
	dessinBG(){
		// On récupère le BG.
		let background = this.images["background" + this.typeBg];

		// On défini un zoom sur le fond (en plus du zoom global).
		let zoomImage = .4;

		// On défini un effet lors du déplacement (on désychronise pour faire un mini effet 3d).
		let bgEffet = 1.1;

		// On récupère la taille de l'image, avec le zoom global.
		let w = background.width * zoomImage;
		let h = background.height * zoomImage;

		// On défini le centre de l'image (permet de monter ou descendre l'image).
		let centreImageX = w / 2;
		let centreImageY = h/2+150;

		// On calcule l'emplacement de la première image.
		let x = this.origineCanvas.x - centreImageX * this.zoom;
		let y = this.origineCanvas.y - centreImageY * this.zoom;

		// On dessine la première image.
		this.ctx.drawImage(background, 
			x * bgEffet, 
			y, 
			w * this.zoom, 
			h * this.zoom
		);

		// On dessine toutes les images à gauche.
		while (x > 0){
			x -= (w * this.zoom - 1) / bgEffet;
			this.ctx.drawImage(background,
				x * bgEffet,
				y,
				w * this.zoom,
				h * this.zoom
			);
		}

		// On remet x à la position de la première image.
		x = this.origineCanvas.x - centreImageX * this.zoom;

		// On dessine toutes les images à droite.
		while (x < this.width) {
			x += (w * this.zoom - 1) / bgEffet;
			this.ctx.drawImage(background,
				x * bgEffet,
				y,
				w * this.zoom,
				h * this.zoom
			);
		}
		
		// On rempli le bas avec la couleur correspondant au BG (defini par Jeu).
		this.ctx.fillStyle = this.colorBg;
		this.ctx.fillRect(
			0, 
			y + h * this.zoom-1, 
			this.width, 
			this.height - y - 1
		);

		// On rempli le haut avec la couleur du ciel.
		this.ctx.fillStyle = "#d0f4f7";
		this.ctx.fillRect(
			0,
			0,
			this.width,
			y + 1
		);

		// On dessine les décos.
		this.decos.forEach(elem => {
			let image = this.images["deco" + elem[0]];
			this.ctx.drawImage(image,
				this.origineCanvas.x + (elem[1] - image.width / 2) * this.zoom,
				this.origineCanvas.y - (elem[2] + image.height) * this.zoom,
				image.width * this.zoom,
				image.height * this.zoom
			);
		});

		// On dessine les textes.
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 2 * this.zoom;
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center";

		this.textes.forEach(elem => {
			this.ctx.font = "bold " + (elem[2] * this.zoom) + "px Arial";

			this.ctx.fillText(elem[3],
				this.origineCanvas.x + elem[0] * this.zoom,
				this.origineCanvas.y - (elem[1] + elem[2]) * this.zoom);
			this.ctx.strokeText(elem[3],
				this.origineCanvas.x + elem[0] * this.zoom,
				this.origineCanvas.y - (elem[1] + elem[2]) * this.zoom);
		});
	}

	/**
	 * Méthode permettant de trier les objets du plus bas au plus haut.
	 * Cela permet d'éviter la vibration des objets.
	 */
	trieBodies(){
		this.bodies.sort((a, b) => {return a.origin.y - b.origin.y;} );
	}

	/**
	 * Méthode permettant de dessiner le tout.
	 * @param {Float} dt L'attente entre deux images.
	 */
	update(dt) {

		// On clear le canvas.
		this.ctx.clearRect(0, 0, this.width, this.height);

		// S'il y a une interface plein écran, on laisse Jeu faire.
		if(this.interfaceFS) {
			this.gestion.update();
			return;
		}

		// S'il n'y a pas d'interface plein écran mais que l'id n'est pas = -1,
		// c'est qu'on vient de passer d'une interface plein écran au jeu.
		// Donc on demande la génération de l'interface de jeu.
		if(this.gestion.idInterfaceFS != -1){
			this.gestion.interfaceDeJeu();
		}

		// On dessine le fond.
		this.dessinBG();

		// On calcule la position et la taille du lanceur.
		let w = this.images.lanceurAv.width * this.zoom;
		let h = this.images.lanceurAv.height * this.zoom;

		let x = this.origineCanvas.x + this.emplacementLanceur.x * this.zoom;
		let y = this.origineCanvas.y - this.emplacementLanceur.y * this.zoom;

		// On dessine l'arrière du lanceur.
		this.ctx.drawImage(this.images.lanceurAr,
			x,
			y,
			w,
			h);

		if (Constants.debugMode)
			this.sol();

		// Pour tous les objets.
		for (let i = 0; i < this.bodies.length; i++) {

			// On sélectionne le ieme objet.
			let body = this.bodies[i];


			// On regarde si avec une telle vitesse il peut y avoir collision avec les autres objets.
			for (let j = i + 1; j < this.bodies.length; j++) {

				let otherBody = this.bodies[j];

				let res = body.collision(otherBody);

				if (res != null) {

					// mise à jour des vitesses avec léger frôttement.
					body.velocity = res.velocity1.div(1.005);
					otherBody.velocity = res.velocity2.div(1.005);
				};

				// Si otherBody n'a plus de PV.
				if ((otherBody.pointsDeVie !== false && otherBody.pointsDeVie <= 0)
					||
					(otherBody.friable !== false && otherBody.friable <= 0)) {
					// On le retire.
					j--;
					this.removeBody(otherBody);
					this.removeCible(otherBody);
				}
			};

			/* begin extra */
			if (Number.isFinite(body.mass))
				body.force = body.force.add(Constants.gravity.mult(body.mass));

			/* end extra */

			// On calcule la nouvelle accéleration :
			let a = body.force.mult(body.invMass);
			body.force = Vector.ZERO;
			let delta_v = a.mult(dt);
			body.velocity = body.velocity.add(delta_v);

			// On met à jour la position.
			body.move(body.velocity.mult(dt));

			// On déplace l'objet selon son déplacement défini (s'il en a un).
			body.deplacementDefini();

			// Pareil qu'au dessus mais avec body.
			if ((body.pointsDeVie !== false && body.pointsDeVie <= 0) 
				||
				(body.friable !== false && body.friable <= 0)) {
				i--;
				this.removeBody(body);
				this.removeCible(body);
			}
		}

		// On dessine tous les objets.
		let oc = this.origineCanvas;
		let zoom = this.zoom;
		this.bodies.forEach(function (b) {
			b.draw(oc, zoom);
		});

		// Si on clique sur la boule.
		if(this.surBoule){
			// On dessine la corde.
			this.ctx.strokeStyle = "#311708";
			this.ctx.lineWidth = 20 * this.zoom;

			// Corde sur la branche gauche du lanceur.
			this.ctx.beginPath();

			// Position de la boule actuelle.
			this.ctx.moveTo(
				(this.origineCanvas.x + (this.boule.origin.x + this.boule.width / 2) * this.zoom),
				(this.origineCanvas.y - (this.boule.origin.y - this.boule.height / 2) * this.zoom));

			// Position de la boule d'origine (avant déplacement) - 30 (pour être sur la branche gauche).
			this.ctx.lineTo(
				(this.origineCanvas.x + (this.boule.emplacementInitBoule.x - 30 + this.boule.width / 2) * this.zoom),
				(this.origineCanvas.y - (this.boule.emplacementInitBoule.y - this.boule.height / 2) * this.zoom));

			this.ctx.stroke();
			this.ctx.closePath();

			// Corde sur la branche droite du lanceur.
			this.ctx.beginPath();

			this.ctx.moveTo(
				(this.origineCanvas.x + (this.boule.origin.x + this.boule.width / 2) * this.zoom),
				(this.origineCanvas.y - (this.boule.origin.y - this.boule.height / 2) * this.zoom));

			this.ctx.lineTo(
				(this.origineCanvas.x + (this.boule.emplacementInitBoule.x + 30 + this.boule.width / 2) * this.zoom),
				(this.origineCanvas.y - (this.boule.emplacementInitBoule.y - this.boule.height / 2) * this.zoom));

			this.ctx.stroke();
			this.ctx.closePath();
		}

		// On dessine le lanceur avant (on découpe en deux pour avoir l'impression que la boule est entre les deux branches).
		this.ctx.drawImage(this.images.lanceurAv,
			x,
			y,
			w,
			h);

		// Découpage en deux pour avoir la ligne rouge toujours visible.
		if (this.surBoule) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = "red";
			this.ctx.lineWidth = 2;

			// Position de la boule.
			this.ctx.moveTo(
				(this.origineCanvas.x + (this.boule.origin.x + this.boule.width / 2) * this.zoom),
				(this.origineCanvas.y - (this.boule.origin.y - this.boule.height / 2) * this.zoom));

			// Position au centre des deux branches.
			this.ctx.lineTo(
				(this.origineCanvas.x + (this.boule.emplacementInitBoule.x + this.boule.width / 2) * this.zoom),
				(this.origineCanvas.y - (this.boule.emplacementInitBoule.y - this.boule.height / 2) * this.zoom));

			this.ctx.stroke();
			this.ctx.closePath();
		}
		
		// Si on veut le suivi de la boule.
		if(this.suiviCam && this.gestion.suiviCam){
			this.origineCanvas = new Vector(this.oldOrigine.x - this.boule.origin.x * this.zoom, 
				this.origineCanvas.y);
		}

		// Si on demande un déplacement de la caméra lent.
		if(this.deplacementCamVers.length != 0){

			// Si >0 c'est qu'il reste des déplacements à faire.
			if (this.deplacementCamVers[0] > 0){
				// On fait le déplacement.
				this.origineCanvas = this.origineCanvas.add(this.deplacementCamVers[1]);
				this.deplacementCamVers[0]--;
			}
			// Si plus de déplacement à faire, on efface la liste.
			else{
				this.deplacementCamVers = [];
			}
		}

		// On met à jour l'interface de jeu.
		this.gestion.update();

	}

	/**
	 * Méthode permettant de remettre à zéro le moteur.
	 */
	clearAll(){
		this.bodies = [];
		this.origineCanvas = new Vector(this.width / 2, this.height / 2);
		this.oldOrigine = Object.create(this.origineCanvas);
		this.zoom = .8;
		this.surBoule = false;
		this.boule = null;
		this.bouleFutur = null;
		this.emplacementInitBoule = null;
		this.suiviCam = false;
		this.cibles = [];
		this.inAccueil = false;
	}

	/**
	 * Méthode appelé lorsque la fenètre est redimentionné.
	 */
	resize(){
		this.gestion.resize();
	}
}
