/* npcOne */
const npcImageDown = new Image();
npcImageDown.src = "./Assets/Player/playerDown.png";
const npcImageUp = new Image();
npcImageUp.src = "./Assets/Player/playerUp.png";
const npcImageLeft = new Image();
npcImageLeft.src = "./Assets/Player/playerLeft.png";
const npcImageRight = new Image();
npcImageRight.src = "./Assets/Player/playerRight.png";

const npcOne = new Character({
	imageSrc: npcImageDown.src,
	frames: { max: 4 },
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2 + 96
	},
	spriteImgs: {
		up: npcImageUp,
		down: npcImageDown,
		left: npcImageLeft,
		right: npcImageRight
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection)
		console.log('We are number one!');
		showDialog([
			"Hey there, traveler!",
			"This world is more dangerous than it looks...",
			"Make sure you're prepared before leaving town."
		]);
	}
});
/* */
const characters = [npcOne];