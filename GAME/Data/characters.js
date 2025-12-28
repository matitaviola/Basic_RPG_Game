const npcImageDown = new Image();
npcImageDown.src = "./Assets/Player/playerDown.png";

const npcOne = new Character({
	imageSrc: npcImageDown.src,
	frames: { max: 4 },
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2 + 96
	},
	spriteImgs: {
		down: npcImageDown
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10}
});

const characters = [npcOne];