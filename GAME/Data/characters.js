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
	frames: { max: 2, frameSpeed: 15 },
	animate: true,
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
		showDialog([
				"Sally: Meow! *Buondì, piccola artista!*",
				"Sally: Meow *Presta molta attenzione, questo posto è più pericoloso di quanto sembri.*",
				"Sally: Meoow! *Qualcuno ha persino rapito il tuo ragazzo!*",
				"Sally: Meow... *Se vuoi, ti darò una zampa a ritrovarlo...*",
				"Sally: Meow! *...anche perchè sembra stiano per arrivare dei guai!*"
			], 
			() => {
				this.hideSelf();
				drawObjs.splice(drawObjs.length-3, 0, Sally); //From the bottom, skips foreground and playersprite
				const tl = gsap.timeline({ onComplete: () => {
					hunchmanSally.hideSelf();
					initBattle({random:true});
				} });
				
				//move huncheman
				tl.to(hunchmanSally.position,{
				x: sallyEvent.position.x,
				y: sallyEvent.position.y,
				duration: 1.5,
				onUpdate: () => {
					hunchmanSally.draw(context);
				}});
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
	frames: { max: 3, frameSpeed: 10},
	animate: true,
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
				
				const tl = gsap.timeline({ onComplete: () => {
					hunchmanNala.hideSelf();
					initBattle({random:true});
				} });
				
				//move huncheman
				hunchmanNala.image = hunchmanNala.spriteImgs.left;
				hunchmanNala.showSelf();
				tl.to(hunchmanNala.position,{
				x: nalaEvent.position.x,
				y: nalaEvent.position.y,
				duration: 1.5,
				onUpdate: () => {
					hunchmanNala.draw(context);
				}});
			}
		);

	}
});
/* */

/* hunchmanSally */
const hunchmanSallyImageUp = new Image();
hunchmanSallyImageUp.src = "./Assets/Player/hunchmenUp.png";

const hunchmanSally = new Character({
	imageSrc: hunchmanSallyImageUp.src,
	frames: { max: 2, frameSpeed: 20},
	animate: true,
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:32*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: hunchmanSallyImageUp
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
	}
});
/* */

/* hunchmanNala */
const hunchmanNalaImageLeft = new Image();
hunchmanNalaImageLeft.src = "./Assets/Player/hunchmenLeft.png";

const hunchmanNala = new Character({
	imageSrc: hunchmanSallyImageUp.src,
	frames: { max: 2, frameSpeed: 20},
	animate: true,
	visible: false,
	interactable: false,
	position: {x: 19*TILE_WIDTH + STARTING_POINT_X, y:55*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		left: hunchmanNalaImageLeft
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
	}
});
/* */

const characters = [sallyEvent, nalaEvent, hunchmanSally, hunchmanNala];