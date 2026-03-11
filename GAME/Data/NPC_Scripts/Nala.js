/* nalaEvent */
const nalaEventImageDown = new Image();
nalaEventImageDown.src = "./Assets/Player/nalaEvDown.png";
const nalaEventImageUp = new Image();
nalaEventImageUp.src = "./Assets/Player/nalaEvUp.png";
const nalaEventImageLeft = new Image();
nalaEventImageLeft.src = "./Assets/Player/nalaEvLeft.png";
const nalaEventImageRight = new Image();
nalaEventImageRight.src = "./Assets/Player/nalaEvRight.png";

const nalaEvent = new Character({
	imageSrc: nalaEventImageDown.src,
	frames: { max: 1, frameSpeed: 10},
	animate: true,
	position: {x: 15.5*TILE_WIDTH + STARTING_POINT_X, y:54*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: nalaEventImageUp,
		down: nalaEventImageDown,
		left: nalaEventImageLeft,
		right: nalaEventImageRight
	},
	collisionOffset: { x: 20, y: 20},
	interactionOffset: { x: 25, y: 25},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection);
		showDialog([
				"Nala: Meow? *Oh, state andando all'avventura?*",
				"Nala: Meeow?? *Come dite? Un drago?*",
				"Nala: Meoow *Adoro le lucertole, sono deliziose...",
				"Nala: Meooow *...e questa viene già col fuoco per cuocerla!*",
				"Nala: Meow! *Penso proprio che mi unirò a voi!*",
			], 
			() => {

				const tl = gsap.timeline({ onComplete: () => {
					initBattle({random: false, chosenEnemies: [enemiesBestiary.Sgherro], initCallback: function(){
						nalaEvent.hideSelf();
						henchmanNala.hideSelf();
						//Rimuovi custode, ora siete abbastanza nel party
						custode.hideSelf();
						//Change helaer event
						cura2.deleteSelf();
						cura3.showSelf();
						//add follower
						drawObjs.splice(drawObjs.length-4, 0, Nala); //From the bottom, skips foreground and playersprite
					}});
				} });
				
				//Unlock new attack
				pgBattler.attackNames.push('Fireball');
				
				//move hencheman
				henchmanNala.showSelf();		
				tl.to(henchmanNala.position,{
				x: nalaEvent.position.x + TILE_WIDTH/2,
				y: nalaEvent.position.y,
				duration: 1.5
				});
			}
		);

	}
});
/* */

/* henchmanNala */
const henchmanNalaImageLeft = new Image();
henchmanNalaImageLeft.src = "./Assets/Player/henchmenLeft.png";

const henchmanNala = new Character({
	imageSrc: henchmanNalaImageLeft.src,
	frames: { max: 2, frameSpeed: 20},
	animate: true,
	visible: false,
	interactable: false,
	position: {x: 24*TILE_WIDTH + STARTING_POINT_X, y:53.8*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		left: henchmanNalaImageLeft
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
	}
});
/* */