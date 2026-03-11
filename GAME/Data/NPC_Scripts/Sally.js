/* sallyEvent */
const sallyEventImageDown = new Image();
sallyEventImageDown.src = "./Assets/Player/sallyEvDown.png";
const sallyEventImageUp = new Image();
sallyEventImageUp.src = "./Assets/Player/sallyEvUp.png";
const sallyEventImageLeft = new Image();
sallyEventImageLeft.src = "./Assets/Player/sallyEvLeft.png";
const sallyEventImageRight = new Image();
sallyEventImageRight.src = "./Assets/Player/sallyEvRight.png";

const sallyEvent = new Character({
	imageSrc: sallyEventImageDown.src,
	frames: { max: 1, frameSpeed: 15 },
	animate: true,
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:28*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: sallyEventImageUp,
		down: sallyEventImageDown,
		left: sallyEventImageLeft,
		right: sallyEventImageRight
	},
	collisionOffset: { x: 15, y: 15},
	interactionOffset: { x: 20, y: 20},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection);
		showDialog([
				"Sally: Meow! *Buondì, piccola artista!*",
				"Sally: Meow *Presta molta attenzione, questo posto è più pericoloso di quanto sembri.*",
				"Sally: Meoow! *Qualcuno ha persino rapito il tuo ragazzo!*",
				"Sally: Meow... *Se vuoi, ti darò una zampa a ritrovarlo...*",
				"Sally: Meow! *...anche perchè sembra stiano per arrivare dei guai!*"
			], 
			() => {
				const tl = gsap.timeline({ onComplete: () => {
					initBattle({random: false, chosenEnemies: [enemiesBestiary.Sgherro], initCallback: function(){
						sallyEvent.hideSelf();
						henchmanSally.hideSelf();
						drawObjs.splice(drawObjs.length-3, 0, Sally); //From the bottom, skips foreground and playersprite
					}});
				} });
				
				//move hencheman
				tl.to(henchmanSally.position,{
				x: sallyEvent.position.x,
				y: sallyEvent.position.y + sallyEvent.height,
				duration: 2,
				onUpdate: () => {
					henchmanSally.draw(context);
				}});
			}
		);

	}
});
/* */

/* henchmanSally */
const henchmanSallyImageUp = new Image();
henchmanSallyImageUp.src = "./Assets/Player/henchmenUp.png";

const henchmanSally = new Character({
	imageSrc: henchmanSallyImageUp.src,
	frames: { max: 2, frameSpeed: 20},
	animate: true,
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:32*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: henchmanSallyImageUp
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
	}
});
/* */