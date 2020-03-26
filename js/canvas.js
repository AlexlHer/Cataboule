// Auteur : Alexandre l'Heritier

// Classe gérant le canvas.
class Canvas {
	/**
	 * Constructeur de Canvas.
	 * @param {HTMLElement} docElem L'élément html canvas de la page.
	 */
	constructor(docElem){
		this.canvas = docElem;

		// On récupère le context.
		this.ctx = this.canvas.getContext("2d");

		// On récupère la taille du canvas.
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		// L'origine du canvas est placé au centre de celui-ci.
		// C'est notre point (0, 0), pouvant être déplacé avec la souris.
		this.origineCanvas = new Vector(this.width / 2, this.height / 2);

		// L'origine du canvas avant déplacement (permet de réaliser le déplacement avec la souris).
		this.oldOrigine = Object.create(this.origineCanvas);
	}

	/**
	 * Méthode permettant de redimentionner correctement le canvas.
	 * @param {Integer} width Nouveau width, après redimentionnement de la fenètre.
	 * @param {Integer} height Nouveau width, après redimentionnement de la fenètre.
	 */
	set_size_canvas(width, height){

		// On met à jour le style (taille "visible").
		if (width !== -1) {
			this.canvas.setAttribute('style', "width: " + width.toString() + "px");
		}

		if (height !== -1) {
			this.canvas.setAttribute('style', "height: " + height.toString() + "px");
		}

		// Comme on a mis "width: 100%" dans le css, on recupère la taille du canvas (idem height).
		// On est forcé de faire ça pour éviter de faire un zoom sur le canvas.
		this.canvas.setAttribute('width', (this.canvas.clientWidth).toString() + "px");
		this.canvas.setAttribute('height', (this.canvas.clientHeight).toString() + "px");

		// On actualise la taille.
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		// On recharge le canvas pour réafficher les éléments qui etaient dessus.
		this.resize();
	}

	resize(){}

	/**
	 * Méthode permettant d'afficher le repère.
	 */
	sol() {
		this.ctx.strokeStyle = "white";
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.origineCanvas.y);
		this.ctx.lineTo(this.width, this.origineCanvas.y);
		this.ctx.stroke();
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.moveTo(this.origineCanvas.x, 0);
		this.ctx.lineTo(this.origineCanvas.x, this.height);
		this.ctx.stroke();
		this.ctx.closePath();
	}
}