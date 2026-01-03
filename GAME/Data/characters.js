/* sallyEvent */
const sallyEventImageDown = new Image();
sallyEventImageDown.src = "./Assets/Player/sallyDown.png";
const sallyEventImageUp = new Image();
sallyEventImageUp.src = "./Assets/Player/sallyUp.png";
const sallyEventImageLeft = new Image();
sallyEventImageLeft.src = "./Assets/Player/sallyLeft.png";
const sallyEventImageRight = new Image();
sallyEventImageRight.src = "./Assets/Player/sallyRight.png";

const sallyEvent = new Character({
	imageSrc: sallyEventImageDown.src,
	frames: { max: 2 },
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:28*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: sallyEventImageUp,
		down: sallyEventImageDown,
		left: sallyEventImageLeft,
		right: sallyEventImageRight
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection)
		console.log('We are number one!');
		showDialog([
				"Sally: Meow! *Buondì, piccola artista!*",
				"Sally: Meow *Presta molta attenzione, questo posto è più pericoloso di quanto sembri.*",
				"Sally: Meoow! *Qualcuno ha persino rapito il tuo ragazzo!*",
				"Sally: Meow... *Se vuoi, ti darò una zampa a ritrovarlo...*",
			], 
			() => {
				this.hideSelf();
				drawObjs.splice(drawObjs.length-3, 0, Sally); //From the bottom, skips foreground and playersprite
			}
		);

	}
});
/* */

/* nalaEvent */
const nalaEventImageDown = new Image();
nalaEventImageDown.src = "./Assets/Player/nalaDown.png";
const nalaEventImageUp = new Image();
nalaEventImageUp.src = "./Assets/Player/nalaUp.png";
const nalaEventImageLeft = new Image();
nalaEventImageLeft.src = "./Assets/Player/nalaLeft.png";
const nalaEventImageRight = new Image();
nalaEventImageRight.src = "./Assets/Player/nalaRight.png";

const nalaEvent = new Character({
	imageSrc: nalaEventImageDown.src,
	frames: { max: 3 },
	position: {x: 15*TILE_WIDTH + STARTING_POINT_X, y:55*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: nalaEventImageUp,
		down: nalaEventImageDown,
		left: nalaEventImageLeft,
		right: nalaEventImageRight
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection)
		console.log('We are number one!');
		showDialog([
				"Nala: Meow? *Oh, state andando all'avventura?*",
				"Nala: Meeow?? *Come dite? Un drago?*",
				"Nala: Meoow *Adoro le lucertole, sono deliziose...",
				"Nala: Meooow *...e questa viene già col fuoco per cuocerla!*",
				"Nala: Meow! *Penso proprio che mi unirò a voi!*",
			], 
			() => {
				this.hideSelf();
				drawObjs.splice(drawObjs.length-4, 0, Nala); //From the bottom, skips foreground and playersprite
			}
		);

	}
});
/* */
const characters = [sallyEvent, nalaEvent];