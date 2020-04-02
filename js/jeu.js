// Auteur : Alexandre l'Heritier

// Classe representant une partie de jeu.
class Jeu {
	constructor() {
		// Variable contenant le moteur de jeu.
		// Utilisé pour accéder aux attributs et méthodes du moteur de jeu.
		this.engine = null;

		// Identifiant de l'interface.
		// -1 = Interface de jeu
		//  0 = Interface Accueil.
		//  1 = Interface Pause.
		//  2 = Interface Win (Lorsque le joueur à terminer un niveau).
		//  3 = Interface End (Lorsque le joueur à terminer tous les niveaux).
		//  4 = Interface choixNiveau.
		//  5 = Interface Wait (Lors d'un chargement).
		//  6 = Interface Erreur.
		this.idInterfaceFS = 0;

		// Identifiant du niveau en cours.
		this.idLevelEnCours = 0;

		// Variable nécessaire pour choixNiveau, pour ne pas modifier idLevelEnCours.
		this.oldIdLevelEnCours = 0;

		// Identifiant du niveau maximum atteint par le joueur, enregistré dans les cookies.
		this.idLevelMaxCookie = 0;

		// Objet contenant le niveau en cours.
		this.levelEnCours = {};

		// Objet contenant le niveau suivant.
		this.levelSuivant = {};

		// Liste contenant le nombre de boules dispo pour le joueur.
		// On ne modifie pas l'objet "levelEnCours" pour pouvoir recharger le niveau si le joueur le veut.
		this.boules = [];

		// Variable contenant l'id de la boule que le joueur à sélectionné (pour pouvoir la
		// retirer de la liste des boules lors de son lancement).
		this.typeBouleSelec = 0;

		// Variable contenant le nombre de niveau disponible.
		this.nbLevel = 1;

		// Vector contenant la position de la souris. Actualisé par le moteur de jeu
		// lors du déplacement de la souris.
		this.sourisOn = new Vector(0, 0);

		// Objet contenant les images de présentation de niveau du menu choixNiveau.
		this.images = {};

		// Liste contenant tous les Boutons de l'interface actuellement affiché.
		this.boutonsInterface = [];

		// Liste contenant tous les Textes de l'interface actuellement affiché.
		this.textesInterface = [];

		// Liste contenant tous les Textes devant être mis à jour lors des update.
		// Contient principalement les Textes donnant le nombre de boules restantes mais
		// aussi le Texte donnant le niveau séléctionné dans le menu choixNiveau.
		this.textesBoulesInterface = [];

		// Liste contenant toutes les Images de l'interface actuellement affiché.
		this.imagesInterface = [];

		// Liste contenant toutes les Images du fond des interfaces plein écran.
		// Généré par creationBgInterface().
		this.imagesBgInterface = [];

		// Variable qui contient le Texte donnant les fps.
		this.fps = null;

		// Booléen perettant de savoir s'il faut afficher les Paramètres de l'interface de jeu.
		this.affichageParam = false;

		// Booléen permettant de savoir s'il faut afficher les fps.
		this.affichageFps = true;

		// Booléen permettant de savoir s'il faut suivre la boule lorsqu'elle est lancée.
		this.suiviCam = true;

		// Booléen permettant de savoir si le chargement initial est terminé.
		this.isLoaded = false;
	}

	/**
	 * Méthode permettant de lier le moteur de jeu et d'initialiser le compteur de FPS.
	 * @param {Engine} e Le moteur de jeu à lier.
	 */
	lierEngine(e) {
		this.engine = e;
		this.fps = new Texte(
			this.engine.ctx,
			10,
			20,
			16,
			"0 IPS",
			"left",
			"bottom"
		);
	}

	/**
	 * Méthode permettant de créer le fond des interfaces plein écran.
	 */
	creationBgInterface() {

		// On vide la liste pour éviter de trop remplir la liste dans le cas d'un redimentionnement.
		this.imagesBgInterface = [];

		// On ajoute le fond initial, qui est juste un BG du jeu mais étendu (pas de calculs comme le moteur de jeu).
		this.imagesBgInterface.push(
			new Imagee(
				this.engine.ctx,
				0,
				0,
				this.engine.width,
				this.engine.height,
				this.engine.images
				["background0" + Math.floor(Math.random() * Math.floor(4))],
				false
			)
		);

		let i = 0;
		let j = 0;
		let r1;
		let w;
		let h;

		// On rempli colonne par colonne (ça permet d'avoir plus d'éléments différents sur l'écran, 
		// vu qu'on utilise un affichage plus long que haut).
		// Tant qu'on n'a pas rempli la longueur du canvas.
		while (j < this.engine.width) {
			i = 0;
			// On choisi une forme parmis les 9 dispo (voir doc).
			r1 = Math.floor(Math.random() * Math.floor(9));

			// On récupère la taille de la forme qu'on a récupéré.
			w = this.engine.images["case0" + r1][0].width;
			h = this.engine.images["case0" + r1][0].height;

			// Tant qu'on n'a pas rempli la largeur du canvas.
			while (i < this.engine.height) {

				// On ajoute une image. Cette image est de la forme choisi plus haut mais
				// d'un materiau et d'un niveau de friabilité aléatoire.
				this.imagesBgInterface.push(
					new Imagee(
						this.engine.ctx,
						j,
						i,
						w,
						h,
						this.engine.images
						[("case" + Math.floor(Math.random() * Math.floor(4))) + r1]
						[Math.floor(Math.random() * Math.floor(3))],
						false
					)
				);
				// On ajoute height avec un espace de 10px pour voir un peu le fond.
				i += h + 10;
			}
			// Pareil pour width.
			j += w + 10;
		}
	}

	/**
	 * Méthode permettant de charger toutes les images de présentation des niveaux.
	 */
	async chargementImageNiveau() {
		for (let i = 1; i < this.nbLevel + 1; i++) {
			this.images["level" + i] = await this.engine.loadImage("levels/level" + i + ".webp");
		}
	}

	/**
	 * Méthode permettant de compter le nombre de boule total.
	 */
	boulesRestantes() {
		let compt = 0;
		for (let i = 0; i < this.nb_boule.length; i++) {
			compt += this.nb_boule[i];
		}
		return compt;
	}

	/**
	 * Méthode permettant de dessiner les éléments communs aux interfaces.
	 */
	draw() {
		for (let i = 0; i < this.boutonsInterface.length; i++) {
			this.boutonsInterface[i].draw(this.sourisOn.x, this.sourisOn.y);
		}
		for (let i = 0; i < this.textesInterface.length; i++) {
			this.textesInterface[i].draw();
		}
		for (let i = 0; i < this.imagesInterface.length; i++) {
			this.imagesInterface[i].draw();
		}
	}

	/**
	 * Méthode permettant de dessiner l'interface.
	 */
	update() {

		// Si l'interface n'est pas l'interface de jeu (donc une interface plein écran).
		if (this.idInterfaceFS !== -1) {

			// On dessine le fond.
			for (let i = 0; i < this.imagesBgInterface.length; i++) {
				this.imagesBgInterface[i].draw();
			}
		}

		// On dessine les éléments que les interfaces ont en commun.
		this.draw();

		// Si l'interface à dessiner est l'interface de jeu.
		if (this.idInterfaceFS === -1) {

			// On update et dessine les compteurs de boules.
			for (let i = 0; i < this.textesBoulesInterface.length; i++) {
				this.textesBoulesInterface[i].updateTexte(this.boules[i]);
				this.textesBoulesInterface[i].draw();
			}

			// Si l'affichage des fps est demandé, on dessine le compteur fps.
			if (this.affichageFps) {
				this.engine.ctx.fillStyle = "#0005";

				this.engine.ctx.fillRect(
					0,
					0,
					this.fps.width + 20,
					25
				);

				this.fps.draw();
			}

			// S'il n'y a plus de cible, on a gagné.
			if (this.engine.cibles.length === 0) {
				// Si un niveau perso a été chargé.
				if (this.idLevelEnCours === 0) {
					// On met le menu win() sans bouton recommencer.
					this.win(true);
					// On remet l'ancien idLevel et on charge le niveau adéquat.
					this.idLevelEnCours = this.oldIdLevelEnCours - 1;
					this.getLevel(this.idLevelEnCours);
				}
				else this.win();
			}
		}

		// Si l'interface est choixNiveau.
		if (this.idInterfaceFS === 4) {
			// On dessine l'image correspondant au niveau séléctionné par l'utilisateur.
			this.engine.ctx.drawImage(
				this.images["level" + this.oldIdLevelEnCours],
				this.engine.width / 4,
				this.engine.height / 4,
				this.engine.width / 2,
				this.engine.height / 2
			);

			// On met à jour l'id du niveau affiché.
			this.textesBoulesInterface[0].updateTexte(this.oldIdLevelEnCours);
			this.textesBoulesInterface[0].draw();
		}
	}

	/**
	 * Méthode permettant d'appeler la fonction du bouton si la souris est sur ce bouton.
	 * @param {Integer} x La position x du click.
	 * @param {Integer} y La position y du click.
	 */
	click(x, y) {

		// Pour tous les boutons.
		for (let i = 0; i < this.boutonsInterface.length; i++) {
			// Si la souris est sur le bouton.
			if (this.boutonsInterface[i].isOn(x, y)) {
				// On execute la fonction et on return ce qu'elle rend.
				return this.boutonsInterface[i].fonction();
			}
		}
		// On return false pour dire que le click concerne engine.
		return false;
	}

	/**
	 * Méthode permettant d'enregistrer la position de la souris (pour la coloration des boutons par exemple).
	 * @param {Integer} x La position x de la souris.
	 * @param {Integer} y La position y de la souris.
	 */
	move(x, y) {
		this.sourisOn = new Vector(x, y);
	}

	/**
	 * Méthode permettant de retirer la boule du compte lors de son lancement.
	 */
	lancementBoule() {
		this.boules[this.typeBouleSelec]--;
	}

	/**
	 * Méthode permettant de changer (ou mettre) la boule sur le lanceur.
	 * @param {Integer} newType Le type de la boule à mettre sur le lanceur.
	 */
	changementTypeBoule(newType) {
		// S'il ne reste plus de boule, on ne fait rien.
		if (this.boules[newType] <= 0) return;

		// On selectionne la nouvelle boule.
		this.typeBouleSelec = newType;

		// On retire la boule du lanceur.
		this.engine.removeBoule();

		// On récupère la position intiale de la boule.
		let eb = this.levelEnCours.emplacement_boule;

		// On ajoute la boule sur le lanceur.
		this.engine.addBoule(new Vector(eb[0], eb[1]), this.typeBouleSelec);
	}

	/**
	 * Méthode permettant de charger le niveau idLevelEnCours à partir de l'objet levelSuivant.
	 * @param {Boolean} reload Pour savoir si on charge un niveau (on charge donc le niveau prochain en avance) 
	 * ou on recharge un niveau (le niveau suivant est déjà chargé).
	 */
	loadLevel(reload = false) {
		if (Constants.debugMode) console.log("Niveau à charger : " + this.idLevelEnCours);

		// On met un écran d'attente.
		this.wait();

		// Si on détecte la fin.
		// S'il y a l'attribut end, c'est que le niveau suivant n'existe pas.
		// On fait !reload pour éviter de gagner le dernier niveau juste en faisant reload.
		if (this.levelSuivant.end != null && !reload) {
			// Si end = false, c'est que l'on a pas eu le temps de charger le niveau ou qu'il y a eu un problème avec ajax.
			if (this.levelSuivant.end === false) console.log("Bug de chargement de niveau !");

			// On affiche l'écran de fin.
			this.end();
			if (Constants.debugMode) console.log("End");

			// On return car pas besoin de charger le niveau.
			return;
		}

		// Si on ne demande pas un rechargement de niveau.
		if (!reload) {
			// On transfère le niveau suivant dans le niveau actuel.
			this.levelEnCours = Object.create(this.levelSuivant);

			// On commence le chargement du prochain niveau (async).
			this.getNextLevel();
		}

		// On efface tous ce qu'il y a dans le moteur.
		this.engine.clearAll();

		// On verifie qu'il y a bien l'emplacement boule dans la save.
		let eb = this.levelEnCours.emplacement_boule;
		if (eb === undefined || eb.length != 2) {
			this.erreur("Erreur de save : Il doit y avoir un emplacement de boule.");
			return;
		}

		// On verifie le tableau de boule.
		if (this.levelEnCours.nb_boule === undefined || this.levelEnCours.nb_boule.length != 4) {
			this.erreur("Erreur de save : Le tableau de nombre de boule doit faire une taille de 4.");
			return;
		}

		// On copie le tableau des boules dispo (pour pouvoir le modifier lors d'un lancé 
		// de boule tout en pouvant recharger le niveau si besoin).
		this.boules = Object.create(this.levelEnCours.nb_boule);
		if (Constants.debugMode) this.boules = [9999, 9999, 9999, 9999];

		// On séléctionne la première boule dispo.
		for (this.typeBouleSelec = 0; this.typeBouleSelec < this.boules.length; this.typeBouleSelec++) {
			// Si on a trouvé une boule, on break.
			if (this.boules[this.typeBouleSelec] > 0) {
				break;
			}
		}

		// Si le for à été jusqu'au bout, c'est qu'il n'y a pas de boules dispo donc bug.
		if (this.typeBouleSelec === this.boules.length) {
			this.erreur("Erreur de save : Il doit y avoir au moins une boule.");
			return;
		}

		// On ajoute la boule au lanceur de boule.
		this.engine.addBoule(new Vector(eb[0], eb[1]), this.typeBouleSelec);

		// On donne la position du lanceur à engine.
		this.engine.setEmplacementLanceur(new Vector(eb[0], eb[1]));


		// On verifie qu'il y a au moins une cible.
		eb = this.levelEnCours.type_emplacement_cibles;
		if (eb === undefined || eb.length == 0) {
			this.erreur("Erreur de save : Il doit y avoir au moins une cible.");
			return;
		}

		// On ajoute les cibles.
		eb.forEach((elem, i) => {
			if (elem.length != 3) {
				if (Constants.debugMode) console.log("Erreur de save : La cible " + i + " est incorrect.");
				// Le return concerne la fonction anonyme, pas la méthode.
				return;
			}
			this.engine.addCible(new Vector(elem[1], elem[2]), elem[0]);
		});


		// On verifie qu'il y a au moins une case.
		eb = this.levelEnCours.type_forme_emplacement_cases;
		if (eb === undefined || eb.length == 0) {
			this.erreur("Erreur de save : d'après les consignes, la cible doit être protégé par des cases.");
			return;
		}

		// On ajoute les cases.
		eb.forEach((elem, i) => {
			if (elem.length != 4 && elem.length != 5) {
				if (Constants.debugMode) console.log("Erreur de save : La case " + i + " est incorrect.");
				return;
			}
			this.engine.addCase(
				new Vector(elem[2], elem[3]),
				+elem[0],
				+elem[1],
				elem.length == 5 ? elem[4] : null
			);
		});

		// On ajoute les murs invisible.
		eb = this.levelEnCours.epaisseur_emplacement_murs_i;
		if (eb !== undefined && eb.length == 5) {

			// On calcule les 4 murs.
			this.engine.addBody(
				new MurInvisible(
					new Vector(eb[1] - eb[0], eb[2] + eb[0]),
					eb[0],
					eb[2] - eb[4] + eb[0] * 2,
					engine.ctx
				)
			);

			this.engine.addBody(
				new MurInvisible(
					new Vector(eb[1], eb[4]),
					eb[3] - eb[1],
					eb[0],
					engine.ctx
				)
			);

			this.engine.addBody(
				new MurInvisible(
					new Vector(eb[3], eb[2] + eb[0]),
					eb[0],
					eb[2] - eb[4] + eb[0] * 2,
					engine.ctx
				)
			);

			this.engine.addBody(
				new MurInvisible(
					new Vector(eb[1], eb[2] + eb[0]),
					eb[3] - eb[1],
					eb[0],
					engine.ctx
				)
			);
		}

		// S'il n'y a pas de mur invisible ni de mur visible, erreur.
		else {
			if (this.levelEnCours.type_emplacement_taille_murs_v === undefined
				|| this.levelEnCours.type_emplacement_taille_murs_v.length == 0) {
				this.erreur("Erreur de save : il doit y avoir au moins un mur !");
				return;
			}
		}

		// On ajoute les murs visibles.
		eb = this.levelEnCours.type_emplacement_taille_murs_v;
		if (eb !== undefined) {
			eb.forEach((elem, i) => {
				if (elem.length != 6 && elem.length != 7) {
					if (Constants.debugMode) console.log("Erreur de save : Le mur " + i + " est incorrect.");
					return;
				}
				this.engine.addMur(
					new Vector(elem[2], elem[3]),
					elem[4],
					elem[5],
					elem[0],
					elem[1],
					elem.length == 7 ? elem[6] : null
				);
			});
		}


		// On ajoute les cases mouvantes.
		eb = this.levelEnCours.type_forme_emplacement1_emplacement2_vitesse_cases_m;
		if (eb !== undefined) {
			eb.forEach((elem, i) => {
				if (elem.length != 7 && elem.length != 8) {
					if (Constants.debugMode) console.log("Erreur de save : La case mouvante " + i + " est incorrect.");
					return;
				}
				this.engine.addCase(
					new Vector(elem[2], elem[3]),
					+elem[0],
					+elem[1],
					elem.length == 8 ? elem[7] : null,
					[elem[6], new Vector(elem[4], elem[5])]
				);
			});
		}


		// On ajoute les murs mouvants.
		eb = this.levelEnCours.type_emplacement1_emplacement2_taille_vitesse_murs_m;
		if (eb !== undefined) {
			this.levelEnCours.type_emplacement1_emplacement2_taille_vitesse_murs_m.forEach((elem, i) => {
				if (elem.length != 9 && elem.length != 10) {
					if (Constants.debugMode) console.log("Erreur de save : Le mur mouvant " + i + " est incorrect.");
					return;
				}
				this.engine.addMur(
					new Vector(elem[2], elem[3]),
					elem[6],
					elem[7],
					elem[0],
					elem[1],
					elem.length == 10 ? elem[9] : null,
					[elem[8], new Vector(elem[4], elem[5])]
				);
			});
		}


		// On ajoute la déco.
		eb = this.levelEnCours.type_emplacement_deco;
		if (eb !== undefined)
			this.engine.decos = this.levelEnCours.type_emplacement_deco;


		// On ajoute les textes.
		eb = this.levelEnCours.emplacement_taille_textes;
		if (eb !== undefined)
			this.engine.textes = this.levelEnCours.emplacement_taille_textes;


		// On regarde le bg demandé.
		eb = this.levelEnCours.type_bg;
		if (eb !== undefined && eb.length == 2) {
			this.engine.typeBg = "" + eb[0] + eb[1];
			// eb[0] = 1 réunis tous les BG bleus.
			if (eb[0] == 1) this.engine.colorBg = "#c4edf0";
			else if (eb[1] == 0) this.engine.colorBg = "#a0db44";
			else if (eb[1] == 1) this.engine.colorBg = "#a0db44";
			else if (eb[1] == 2) this.engine.colorBg = "#e7dfc2";
			else if (eb[1] == 3) this.engine.colorBg = "#c58f5c";
		}
		// Si le Bg n'est pas spécifié ou incorrect, on met celui par défaut.
		else {
			this.engine.typeBg = "00";
			this.engine.colorBg = "#a0db44";
		}

		// On regarde s'il y a une spécification pour la gravité zéro dans la save.
		eb = this.levelEnCours.zeroGravity;
		if (eb === true)
			Constants.gravity = new Vector(0, 0);
		else
			Constants.gravity = new Vector(0, -.002);


		// On regarde s'il y a une spécification pour la force du lanceur dans la save.
		eb = this.levelEnCours.forceLanceur;
		if (eb !== undefined)
			this.engine.forceLanceur = eb;

		// On regarde s'il y a une spécification pour le niveau de zoom dans la save.
		eb = this.levelEnCours.zoomInitial;
		if (eb !== undefined)
			this.engine.zoom = eb;

		// On trie bodies pour que les objets ne vibrent pas.
		this.engine.trieBodies();

		// On donne la main à engine.
		this.engine.interfaceFS = false;
	}

	/**
	 * Méthode permettant de charger un niveau perso.
	 * @param {FileList} file Le json demandé.
	 */
	async chargementNiveauPerso(file) {
		// Fonction qui récupère le contenu du fichier.
		let read_file = (file) => {
			return new Promise((resolve) => {
				let read = new FileReader();
				read.onload = () => resolve(read.result);
				read.readAsText(file);
			});
		};

		// On met un écran de chargement.
		this.wait();

		// On récupère le résultat.
		try {
			this.levelEnCours = JSON.parse(await read_file(file[0]));
		}
		catch (e) {
			this.erreur("JSON non valide");
			return;
		}
		// On sauvegarde la progression dans un attribut ne servant pas ici.
		this.oldIdLevelEnCours = this.idLevelEnCours;

		// On met l'id 0.
		this.idLevelEnCours = 0;

		// On charge le niveau avec reload = true pour éviter de charger levelSuivant.
		this.loadLevel(true);
	}

	/**
	 * Méthode permettant de récupérer le prochain niveau.
	 */
	async getNextLevel() {
		await this.getLevel(this.idLevelEnCours + 1);
	}

	/**
	 * Méthode permettant de récupérer le dernier id niveau enregistré dans les cookies.
	 */
	async getProgression() {

		let ajax = () => {
			return new Promise((resolve) => {
				let req = new XMLHttpRequest();

				req.onload = () => {
					if (Constants.debugMode) console.log("Récuperation niveau cookie : " + req.responseText);
					resolve(+req.responseText);
				}

				req.onerror = () => {
					if (Constants.debugMode) console.log("Erreur récuperation niveau cookie : Progression par défaut (1)");
					resolve(1);
				}

				req.open("get", "php/getProgression.php", true);
				req.responseType = "text";
				req.send();
			});
		}

		// On récupère le dernier id niveau.
		let l = await ajax();

		// On met à jour les attributs.
		this.idLevelEnCours = l;
		this.idLevelMaxCookie = l;
	}

	/**
	 * Méthode permettant de récupérer le niveau demandé.
	 * @param {Integer} l L'id du niveau à récupérer.
	 * @param {Booléen} loadImm Pour afficher l'écran de chargement.
	 */
	async getLevel(l, loadImm = false) {
		if (Constants.debugMode) console.log("Niveau à récupérer : " + l);

		// Si demandé, on affiche l'interface de chargement.
		if (loadImm) this.wait();

		// Requete ajax.
		let ajax = (l) => {
			return new Promise((resolve) => {
				let req = new XMLHttpRequest();
				req.onload = () => {
					if (Constants.debugMode) console.log("Niveau récupéré.");
					resolve(req.response);
				}

				// Si erreur, json spécial.
				req.onerror = () => {
					if (Constants.debugMode) console.log("Erreur récupération niveau.");
					resolve({ end: false });
				}

				req.open("post", "php/getLevel.php", true);
				req.responseType = "json";
				req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

				// On donne le level l.
				req.send('level=' + l);
			});
		}

		this.levelSuivant = await ajax(l);

		// On affiche le niveau, si demandé.
		if (loadImm) this.loadLevel();
	}

	/**
	 * Méthode permettant de récupérer les paramètres enregistrés dans les cookies.
	 */
	async getParam() {
		if (Constants.debugMode) console.log("Get param");

		let ajax = () => {
			return new Promise((resolve) => {
				let req = new XMLHttpRequest();

				req.onload = () => {
					if (Constants.debugMode) console.log("Param récupéré.");
					resolve(req.response);
				}

				req.onerror = () => {
					if (Constants.debugMode) console.log("Erreur Récuperation param : Param par défaut.");
					resolve({ fps: true, suivi: true, invVis: true });
				}

				req.open("get", "php/getParam.php", true);
				req.responseType = "json";
				req.send();
			});
		}

		// On récupère les paramètres.
		let json = await ajax();

		// On met à jour les paramètres.
		this.affichageFps = json.fps;
		this.suiviCam = json.suivi;
		this.engine.inversionViseur = json.invVis;
	}

	/**
	 * Méthode permettant de récupérer le nombre de niveau disponible.
	 */
	async getNbTotalLevel() {

		let ajax = () => {
			return new Promise((resolve) => {
				let req = new XMLHttpRequest();

				req.onload = () => {
					if (Constants.debugMode) console.log("Nombre total de niveau récupéré.");
					resolve(+req.responseText);
				}

				req.onerror = () => {
					if (Constants.debugMode) console.log("Erreur récupération nombre total de niveau.");
					resolve(1);
				}

				req.open("get", "php/getNbLevelDispo.php", true);
				req.responseType = "text";
				req.send();
			});
		}

		this.nbLevel = await ajax();
	}

	/**
	 * Méthode permettant d'initialiser les attributs lors de l'ouverture du jeu.
	 */
	async initAll() {
		this.wait();
		this.engine.imageSecours = await this.engine.loadImage("images/secours.png");
		await this.getProgression();
		await this.getLevel(this.idLevelEnCours);
		await this.getNbTotalLevel();
		await this.getParam();
		await this.chargementImageNiveau();
		await this.engine.chargementImages();
		this.creationBgInterface();
		this.isLoaded = true;
		this.accueil();
		if (Constants.debugMode) console.log("Init Ok");
	}

	/**
	 * Méthode permettant de sauvegarder la progression du joueur dans les cookies.
	 * @param {Booléen} force Pour forcer la sauvegarde (si le joueur veut recommencer le jeu par exemple).
	 */
	async saveProgression(force = false) {
		let l = this.idLevelEnCours;
		if (Constants.debugMode) console.log("Niveau à enregistrer : " + l);

		// On récupère la progression enregistré dans les cookies.
		await this.getProgression();

		// On récupère la progression récupéré au dessus.
		let old = this.idLevelEnCours;

		// On remet l'id attribut.
		this.idLevelEnCours = l;

		// Si on ne force pas l'enregistrement et que le cookie est plus grand que l'id attribut, on return.
		if (!force && old >= l) return;

		// On enregistre.
		let ajax = (l) => {
			return new Promise((resolve) => {
				let req = new XMLHttpRequest();
				req.onload = () => {
					if (Constants.debugMode) console.log("Save progression OK : " + l);
					resolve(null);
				}

				req.onerror = () => {
					if (Constants.debugMode) console.log("Save progression Erreur");
					resolve(null);
				}

				req.open("post", "php/setProgression.php", true);
				req.responseType = "text";
				req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

				// On donne le level l.
				req.send('level=' + l);
			});
		}
		await ajax(l);
	}

	/**
	 * Méthode permettant de sauvegarder les paramètres de jeu.
	 */
	async saveParam() {

		let ajax = (fps, suivi, invVis) => {
			return new Promise((resolve) => {
				let req = new XMLHttpRequest();
				req.onload = () => {
					if (Constants.debugMode) console.log("Save param OK");
					resolve(null);
				}

				req.onerror = () => {
					if (Constants.debugMode) console.log("Save param Erreur");
					resolve(null);
				}

				req.open("post", "php/setParam.php", true);
				req.responseType = "text";
				req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

				// On donne le level l.
				req.send("fps=" + fps + "&suivi=" + suivi + "&invVis=" + invVis);
			});
		}

		await ajax(this.affichageFps, this.suiviCam, this.engine.inversionViseur);
	}

	/**
	 * Méthode permettant de regénérer les interfaces en cas de resize du canvas.
	 */
	resize() {
		if (!this.isLoaded) return;
		if (this.idInterfaceFS === -1) this.interfaceDeJeu();
		if (this.idInterfaceFS === 0) this.accueil();
		if (this.idInterfaceFS === 1) this.pause();
		if (this.idInterfaceFS === 2) this.win();
		if (this.idInterfaceFS === 3) this.end();
		if (this.idInterfaceFS === 4) this.choixNiveau();

		// On recrée le BG.
		this.creationBgInterface();
	}

	/**
	 * Méthode permettant de générer l'interface de jeu.
	 */
	interfaceDeJeu() {

		// On efface les anciens éléments d'interface.
		this.boutonsInterface = [];
		this.textesInterface = [];
		this.imagesInterface = [];
		this.textesBoulesInterface = [];

		// On donne l'id de l'interface (pour update et resize).
		this.idInterfaceFS = -1;

		// On ajoute les boutons en haut à droite.
		this.boutonsInterface.push(
			new Bouton(
				this.engine.ctx,
				this.engine.width - 55,
				5,
				50,
				50,
				"⏸",
				30,
				false,
				() => {
					if (Constants.debugMode) console.log("Clic Pause");
					this.pause();
					return true;
				},
				{
					offBg: "#0008",
					onBg: "red",
					offContour: "#5555",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				this.engine.width - 110,
				5,
				50,
				50,
				"🔄",
				30,
				false,
				() => {
					if (Constants.debugMode) console.log("Clic Reload");
					this.loadLevel(true);
					return true;
				},
				{
					offBg: "#0008",
					onBg: "orange",
					offContour: "#5555",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				this.engine.width - 165,
				5,
				50,
				50,
				(this.affichageParam ? "🔻" : "🛠"),
				30,
				false,
				() => {
					if (Constants.debugMode) console.log("Clic Setting");
					this.affichageParam = !this.affichageParam;
					this.interfaceDeJeu();
					return true;
				},
				(this.affichageParam ?
					{
						offBg: "#050",
						onBg: "#0f0",
						offContour: "#5555",
						onContour: "white",
						texte: "white"
					}
					:
					{
						offBg: "#0008",
						onBg: "green",
						offContour: "#5555",
						onContour: "white",
						texte: "white"
					}
				)
			)
		);

		// Si l'utilisateur a cliqué sur Paramètre, on ajoute les paramètres.
		if (this.affichageParam) {
			this.boutonsInterface.push(
				new Bouton(
					this.engine.ctx,
					this.engine.width - 165,
					60,
					160,
					50,
					(this.affichageFps ? "✔ " : "❌ ") + "Affichage des IPS",
					15,
					false,
					() => {
						if (Constants.debugMode) console.log("Clic FPS");
						this.affichageFps = !this.affichageFps;
						this.saveParam();
						this.interfaceDeJeu();
						return true;
					},
					(this.affichageFps ?
						{
							offBg: "#050",
							onBg: "#0f0",
							offContour: "grey",
							onContour: "white",
							texte: "white"
						}
						:
						{
							offBg: "#500",
							onBg: "#f00",
							offContour: "grey",
							onContour: "white",
							texte: "white"
						}
					)
				),

				new Bouton(
					this.engine.ctx,
					this.engine.width - 165,
					115,
					160,
					50,
					(this.engine.inFullScreen ? "✔ " : "❌ ") + "Plein écran",
					15,
					false,
					() => {
						if (Constants.debugMode) console.log("Clic FS");
						this.engine.fullScreen();
						return true;
					},
					(this.engine.inFullScreen ?
						{
							offBg: "#050",
							onBg: "#0f0",
							offContour: "grey",
							onContour: "white",
							texte: "white"
						}
						:
						{
							offBg: "#500",
							onBg: "#f00",
							offContour: "grey",
							onContour: "white",
							texte: "white"
						}
					)
				),

				new Bouton(
					this.engine.ctx,
					this.engine.width - 165,
					170,
					160,
					50,
					(this.suiviCam ? "✔ " : "❌ ") + "Suivi de la boule",
					15,
					false,
					() => {
						if (Constants.debugMode) console.log("Clic Cam");
						this.suiviCam = !this.suiviCam;
						this.saveParam();
						this.interfaceDeJeu();
						return true;
					},
					(this.suiviCam ?
						{
							offBg: "#050",
							onBg: "#0f0",
							offContour: "grey",
							onContour: "white",
							texte: "white"
						}
						:
						{
							offBg: "#500",
							onBg: "#f00",
							offContour: "grey",
							onContour: "white",
							texte: "white"
						}
					)
				),

				new Bouton(
					this.engine.ctx,
					this.engine.width - 165,
					225,
					160,
					50,
					(this.engine.inversionViseur ? "✔ " : "❌ ") + "Inversion de visée",
					15,
					false,
					() => {
						if (Constants.debugMode) console.log("Clic invVis");
						this.engine.inversionViseur = !this.engine.inversionViseur;
						this.saveParam();
						this.interfaceDeJeu();
						return true;
					},
					(this.engine.inversionViseur ?
						{
							offBg: "#050",
							onBg: "#0f0",
							offContour: "grey",
							onContour: "white",
							texte: "white"
						}
						:
						{
							offBg: "#500",
							onBg: "#f00",
							offContour: "grey",
							onContour: "white",
							texte: "white"
						}
					)
				)
			);
		}

		// On ajoute les boutons de séléction des boules.
		this.boutonsInterface.push(
			new Bouton(
				this.engine.ctx,
				195,
				this.engine.height - 85,
				70,
				85,
				"",
				30,
				false,
				() => {
					if (Constants.debugMode) console.log("Clic 0");
					this.changementTypeBoule(0);
					return true;
				},
				{
					offBg: "#6fc4a988",
					onBg: "#6fc4a9dd",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				275,
				this.engine.height - 85,
				70,
				85,
				"",
				30,
				false,
				() => {
					if (Constants.debugMode) console.log("Clic 1");
					this.changementTypeBoule(1);
					return true;
				},
				{
					offBg: "#f19cb788",
					onBg: "#f19cb7dd",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				355,
				this.engine.height - 85,
				70,
				85,
				"",
				30,
				false,
				() => {
					if (Constants.debugMode) console.log("Clic 2");
					this.changementTypeBoule(2);
					return true;
				},
				{
					offBg: "#e0d1af88",
					onBg: "#e0d1afdd",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				435,
				this.engine.height - 85,
				70,
				85,
				"",
				30,
				false,
				() => {
					if (Constants.debugMode) console.log("Clic 3");
					this.changementTypeBoule(3);
					return true;
				},
				{
					offBg: "#8db5e788",
					onBg: "#8db5e7dd",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			)
		);

		// On ajoute les images des boules.
		this.imagesInterface.push(
			new Imagee(
				this.engine.ctx,
				200,
				this.engine.height - 80,
				60,
				60,
				this.engine.images.boule0,
				false
			),

			new Imagee(
				this.engine.ctx,
				280,
				this.engine.height - 80,
				60,
				60,
				this.engine.images.boule1,
				false
			),

			new Imagee(
				this.engine.ctx,
				360,
				this.engine.height - 80,
				60,
				60,
				this.engine.images.boule2,
				false
			),

			new Imagee(
				this.engine.ctx,
				440,
				this.engine.height - 80,
				60,
				60,
				this.engine.images.boule3,
				false
			)
		);

		// On ajoute les décomptes des boules.
		this.textesBoulesInterface.push(
			new Texte(
				this.engine.ctx,
				230,
				this.engine.height,
				20,
				this.boules[0],
				"center", "bottom"
			),

			new Texte(
				this.engine.ctx,
				310,
				this.engine.height,
				20,
				this.boules[1],
				"center", "bottom"
			),

			new Texte(
				this.engine.ctx,
				390,
				this.engine.height,
				20,
				this.boules[2],
				"center", "bottom"
			),

			new Texte(
				this.engine.ctx,
				470,
				this.engine.height,
				20,
				this.boules[3],
				"center", "bottom"
			)
		);
	}

	/**
	 * Méthode permettant de générer l'interface Accueil.
	 */
	accueil() {

		// On efface les anciens éléments d'interface.
		this.boutonsInterface = [];
		this.textesInterface = [];
		this.imagesInterface = [];

		// On dit à engine qu'on veut prendre le controle du canvas.
		this.engine.interfaceFS = true;

		// On donne l'id de l'interface (pour update et resize).
		this.idInterfaceFS = 0;

		// On ajoute les boutons.
		this.boutonsInterface.push(

			new Bouton(
				this.engine.ctx,
				this.engine.width / 4,
				2 * this.engine.height / 3,
				this.engine.width / 3,
				this.engine.height / 4,
				"Continuer",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Continuer");
					this.loadLevel();
				},
				{
					offBg: "#000d",
					onBg: "#0a0d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				3 * this.engine.width / 4,
				2 * this.engine.height / 3,
				this.engine.width / 3,
				this.engine.height / 4,
				"Voir les niveaux",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Voir les niveaux");
					this.choixNiveau();
				},
				{
					offBg: "#000d",
					onBg: "#f50d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			)
		);

		// On ajoute les textes.
		this.textesInterface.push(

			new Texte(
				this.engine.ctx,
				this.engine.width / 2,
				this.engine.height / 4,
				this.engine.width / 10,
				"Cataboule",
				"center", "center",
				undefined,
				"#fff9",
				5, "black"
			),

			new Texte(
				this.engine.ctx,
				this.engine.width - 10,
				this.engine.height - 30,
				35,
				"Auteur : Alexandre l'Heritier",
				"right", "bottom",
				undefined,
				"white",
				1, "black"
			),

			new Texte(
				this.engine.ctx,
				this.engine.width - 10,
				this.engine.height,
				25,
				"Images : Kenney Vleugels (www.kenney.nl)",
				"right", "bottom",
				undefined,
				"white",
				1, "black"
			)
		);

	}

	/**
	 * Méthode permettant de générer l'interface Pause.
	 */
	pause() {

		// On efface les anciens éléments d'interface.
		this.boutonsInterface = [];
		this.textesInterface = [];
		this.imagesInterface = [];

		// On dit à engine qu'on veut prendre le controle du canvas.
		this.engine.interfaceFS = true;

		// On donne l'id de l'interface (pour update et resize).
		this.idInterfaceFS = 1;

		// On ajoute les boutons.
		this.boutonsInterface.push(
			new Bouton(
				this.engine.ctx,
				this.engine.width / 4,
				2 * this.engine.height / 3,
				this.engine.width / 3,
				this.engine.height / 4,
				"Reprendre la partie",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Retour");
					this.engine.interfaceFS = false;
				},
				{
					offBg: "#000d",
					onBg: "#f50d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				3 * this.engine.width / 4,
				2 * this.engine.height / 3,
				this.engine.width / 3,
				this.engine.height / 4,
				"Aller vers l'accueil",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Accueil");

					// Si un niveau perso a été chargé.
					if (this.idLevelEnCours === 0) {
						// On remet l'ancien idLevel.
						this.idLevelEnCours = this.oldIdLevelEnCours;
						this.getLevel(this.idLevelEnCours);
					}

					this.saveProgression();
					this.levelSuivant = Object.create(this.levelEnCours);
					this.engine.clearAll();
					this.accueil();
				},
				{
					offBg: "#000d",
					onBg: "#0a0d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			)
		);

		// On ajoute les textes.
		this.textesInterface.push(
			new Texte(
				this.engine.ctx,
				this.engine.width / 2,
				this.engine.height / 4,
				this.engine.width / 10,
				"Pause",
				"center", "center",
				undefined,
				"#fff9",
				5,
				"black"
			)
		);
	}

	/**
	 * Méthode permettant de générer l'interface de fin de niveau.
	 * @param {Booléen} perso Pour savoir si on a fini un niveau perso ou pas.
	 */
	win(perso = false) {

		// On efface les listes d'éléments.
		this.boutonsInterface = [];
		this.textesInterface = [];
		this.imagesInterface = [];

		// On prend la main et on enregistre le menu affiché.
		this.engine.interfaceFS = true;
		this.idInterfaceFS = 2;

		// Si perso, on ne peut pas continuer (vu qu'il y a qu'un niveau chargé).
		if (!perso) {
			this.boutonsInterface.push(
				new Bouton(
					this.engine.ctx,
					this.engine.width / 4,
					2 * this.engine.height / 3,
					this.engine.width / 3,
					this.engine.height / 4,
					"Niveau suivant",
					30,
					true,
					() => {
						if (Constants.debugMode) console.log("Clic Niveau Suivant");
						this.engine.interfaceFS = false;
						this.idLevelEnCours++;
						this.saveProgression();
						this.engine.clearAll();
						this.loadLevel();
					},
					{
						offBg: "#000d",
						onBg: "#0a0d",
						offContour: "grey",
						onContour: "white",
						texte: "white"
					}
				)
			);
		}

		this.boutonsInterface.push(
			new Bouton(
				this.engine.ctx,
				(perso ? 2 : 3) * this.engine.width / 4,
				2 * this.engine.height / 3,
				this.engine.width / (perso ? 2 : 3),
				this.engine.height / 4,
				"Aller vers l'accueil",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Accueil");
					if (!perso) {
						this.idLevelEnCours++;
						this.saveProgression();
					}
					this.engine.clearAll();
					this.accueil();
				},
				{
					offBg: "#000d",
					onBg: "#f50d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			)
		);

		this.textesInterface.push(
			new Texte(
				this.engine.ctx,
				this.engine.width / 2,
				this.engine.height / 4,
				this.engine.width / 10,
				"Niveau " + (perso ? "" : this.idLevelEnCours) + " : Terminé !",
				"center", "center",
				undefined,
				"#fff9",
				5,
				"black"
			)
		);
	}

	/**
	 * Méthode permettant de générer l'interface de fin de jeu.
	 */
	end() {

		// On efface toutes les listes d'éléments.
		this.boutonsInterface = [];
		this.textesInterface = [];
		this.imagesInterface = [];

		// On prend la main et on enregistre l'id de l'interface.
		this.engine.interfaceFS = true;
		this.idInterfaceFS = 3;

		// Boutons.
		this.boutonsInterface.push(
			new Bouton(
				this.engine.ctx,
				this.engine.width / 4,
				2 * this.engine.height / 3,
				this.engine.width / 3,
				this.engine.height / 4,
				"Recommencer le jeu !",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Recommencer");
					this.engine.interfaceFS = false;
					this.idLevelEnCours = 1;
					this.getLevel(1, true);
					this.saveProgression(true);
				},
				{
					offBg: "#000d",
					onBg: "#f50d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				3 * this.engine.width / 4,
				2 * this.engine.height / 3,
				this.engine.width / 3,
				this.engine.height / 4,
				"Aller vers l'accueil",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Accueil");
					this.saveProgression();
					this.accueil();
				},
				{
					offBg: "#000d",
					onBg: "#0a0d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			)
		);

		// Texte.
		this.textesInterface.push(
			new Texte(
				this.engine.ctx,
				this.engine.width / 2,
				this.engine.height / 4,
				this.engine.width / 10,
				"Fin !",
				"center", "center",
				undefined,
				"#fff9",
				5,
				"black"
			)
		);
	}

	/**
	 * Méthode permettant de générer l'interface choixNiveau.
	 */
	choixNiveau() {

		// On efface les anciens éléments d'interface.
		this.boutonsInterface = [];
		this.textesInterface = [];
		this.imagesInterface = [];
		this.textesBoulesInterface = [];

		// On dit à engine qu'on veut prendre le controle du canvas.
		this.engine.interfaceFS = true;

		// On donne l'id de l'interface (pour update et resize).
		this.idInterfaceFS = 4;

		// S'il y a un problème au niveau de l'id du niveau en cours.
		if (this.idLevelEnCours >= this.nbLevel) this.oldIdLevelEnCours = this.nbLevel;
		else this.oldIdLevelEnCours = this.idLevelEnCours;


		// On ajoute les boutons.
		this.boutonsInterface.push(
			new Bouton(
				this.engine.ctx,
				this.engine.width / 10,
				4 * this.engine.height / 10,
				this.engine.width / 10,
				this.engine.height / 10,
				"+1",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic +1");
					if (this.oldIdLevelEnCours == this.idLevelMaxCookie
						|| this.oldIdLevelEnCours == this.nbLevel) return;
					this.oldIdLevelEnCours += 1;
				},
				{
					offBg: "#040d",
					onBg: "#0a0d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				this.engine.width / 10,
				6 * this.engine.height / 10,
				this.engine.width / 10,
				this.engine.height / 10,
				"-1",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic -1");
					if (this.oldIdLevelEnCours <= 1) return;
					this.oldIdLevelEnCours -= 1;
				},
				{
					offBg: "#400d",
					onBg: "#a00d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				this.engine.width / 10,
				this.engine.height / 10,
				this.engine.width / 10,
				this.engine.height / 10,
				"Accueil",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Accueil");
					this.accueil();
				},
				{
					offBg: "#000a",
					onBg: "#000d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				this.engine.width / 10,
				2 * this.engine.height / 10 + 5,
				this.engine.width / 10,
				this.engine.height / 10,
				"Go",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Go");
					this.idLevelEnCours = this.oldIdLevelEnCours;
					this.getLevel(this.oldIdLevelEnCours, true);
				},
				{
					offBg: "#000a",
					onBg: "#000d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			),

			new Bouton(
				this.engine.ctx,
				this.engine.width / 2,
				this.engine.height - 40 - this.engine.height / 10,
				this.engine.width / 3,
				this.engine.height / 10,
				"Charger un niveau perso",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic niveau perso");
					document.getElementById("input_file").click();
				},
				{
					offBg: "#000a",
					onBg: "#000d",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			)
		);

		// On ajoute les textes.
		this.textesInterface.push(
			new Texte(
				this.engine.ctx,
				this.engine.width / 2,
				this.engine.height / 8,
				this.engine.width / 12,
				"Choix niveau",
				"center", "center",
				undefined,
				"#fff9",
				5, "black"
			)
		);
		this.textesBoulesInterface.push(
			new Texte(
				this.engine.ctx,
				this.engine.width / 10,
				this.engine.height / 2,
				this.engine.height / 10,
				this.oldIdLevelEnCours,
				"center", "center",
				undefined,
				"#fff9",
				5, "black"
			)
		);
	}

	/**
	 * Méthode permettant de générer l'interface de chargement.
	 */
	wait() {

		this.boutonsInterface = [];
		this.textesInterface = [];
		this.imagesInterface = [];

		this.engine.interfaceFS = true;
		this.idInterfaceFS = 5;

		this.textesInterface.push(
			new Texte(
				this.engine.ctx,
				this.engine.width / 2,
				this.engine.height / 2,
				this.engine.width / 12,
				"Chargement en cours...",
				"center", "center",
				undefined,
				"white",
				2,
				"black"
			)
		);
	}

	/**
	 * Méthode permettant de générer l'interface d'erreur.
	 * @param {String} message Le message à afficher.
	 */
	erreur(message) {

		// On efface les listes d'éléments.
		this.boutonsInterface = [];
		this.textesInterface = [];
		this.imagesInterface = [];

		// On prend la main et on enregistre le menu affiché.
		this.engine.interfaceFS = true;
		this.idInterfaceFS = 6;

		this.boutonsInterface.push(
			new Bouton(
				this.engine.ctx,
				2 * this.engine.width / 4,
				2 * this.engine.height / 3,
				this.engine.width / 2,
				this.engine.height / 4,
				"Aller vers l'accueil",
				30,
				true,
				() => {
					if (Constants.debugMode) console.log("Clic Accueil");
					this.engine.clearAll();
					this.accueil();
				},
				{
					offBg: "#00fa",
					onBg: "#00fe",
					offContour: "grey",
					onContour: "white",
					texte: "white"
				}
			)
		);

		this.textesInterface.push(
			new Texte(
				this.engine.ctx,
				this.engine.width / 2,
				this.engine.height / 4,
				this.engine.width / 25,
				message,
				"center", "center",
				this.engine.width,
				"white",
				2,
				"black"
			)
		);
	}
}