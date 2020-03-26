// Auteur : Alexandre l'Heritier

// Fichier main : Initialise le jeu et met en place la boucle infinie.

// On crée le moteur de jeu, permettant de gérer les éléments du jeu.
let engine = new Engine(document.getElementById("canvas"));

// On crée le système de gestion, permettant de gérer le déroulement du jeu.
let jeu = new Jeu();

// On lie les deux objets pour qu'ils puissent communiquer.
engine.lierJeu(jeu);
jeu.lierEngine(engine);

// Si la fenètre est redimentionnée, on appel Canvas::set_size_canvas() 
// qui s'occupe de redimentionner le canvas.
// L'espace au dessus et en dessous du canvas est environ de 250px.
let dessusdessous = 250;

window.onresize = () => { engine.set_size_canvas(-1, window.innerHeight - dessusdessous); };

// On l'appel une fois pour initialiser la taille du canvas.
engine.set_size_canvas(-1, window.innerHeight - dessusdessous);

// On place l'origine au centre (qui ne l'ai plus à cause du redimentionnement).
engine.origine_au_centre();

// On lance l'initialisation du jeu (chargement des differents éléments).
jeu.initAll();

// Deux variables pour compter les fps :
// - fps qui comptabilise le nombre d'itération de setInterval.
// - fps2 qui est le nombre de fps enregistré en un intervel de temps.
let fps = 0;
let fps2 = 0;


let print_fps;
print_fps = setInterval(() => {
	// *2 car on affiche le nombre de fps deux fois par secondes.
	fps2 = fps*2;

	// On remet à zero le compteur.
	fps = 0;
// On actualise toutes les demi-secondes.
}, 500);

// Boucle principale.
let interval;
interval = setInterval(function () {
	try {
		// On update le moteur de jeu.
		engine.update(1000 / 75);

		// On met à jour le compteur de fps.
		jeu.fps.updateTexte(fps2 + " IPS");

		// On compte une image de plus.
		fps++;

	} catch (e) {
		// Si bug, on ne boucle plus.
		clearInterval(interval);
		throw (e);
	}

// On cible les 75 fps.
}, 1000 / 75);

// On lie la souris et ces differents events aux méthodes conçu pour.
engine.canvas.onmousemove = (e) => engine.deplace_souris(e);
engine.canvas.onmousedown = (e) => engine.mouseDown(e);
engine.canvas.onmouseup = () => engine.mouseUp();
engine.canvas.onwheel = (e) => engine.molette(e);

// let interval = function (tps) {
// 	// On update le moteur de jeu.
// 	engine.update(tps);

// 	// On met à jour le compteur de fps.
// 	jeu.fps.updateTexte(fps2 + " IPS");

// 	// On compte une image de plus.
// 	fps++;

// 	requestAnimationFrame(interval);
// };
// requestAnimationFrame(interval);