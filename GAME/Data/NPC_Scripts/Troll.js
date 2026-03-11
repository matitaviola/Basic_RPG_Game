/* troll */
const trollImageUp = new Image();
trollImageUp.src = "./Assets/Player/henchmenUp.png";

const troll = new Character({
	imageSrc: trollImageUp.src,
	frames: { max: 2, frameSpeed: 20},
	position: {x: 76*TILE_WIDTH + STARTING_POINT_X, y:53*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: trollImageUp
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		showDialog([
				"Troll: BUH! Sono il troll del ponte, e mi dovete pagare il pedaggio.",
				"Troll: Come dite? Non è un ponte ma un acquedotto?",
				"Troll: ...",
				"Troll: Non mi piacciono i saputelli! >:["
		], () => {
			initBattle({random: false, chosenEnemies: [enemiesBestiary.Sgherro], initCallback: function(){troll.hideSelf();}});
		})
	}
});
/* */