/* Player sprite file */
/* Render Player*/
const playerImageDown = new Image();
playerImageDown.src = "./Assets/Player/playerDown.png";

const playerImageUp = new Image();
playerImageUp.src = "./Assets/Player/playerUp.png";

const playerImageLeft = new Image();
playerImageLeft.src = "./Assets/Player/playerLeft.png";

const playerImageRight = new Image();
playerImageRight.src = "./Assets/Player/playerRight.png";

const playerSprite = new Sprite({
	imageSrc: playerImageDown.src,
	frames: {
		max:4, 
		frameSpeed: PLAYER_FRAME_SPEED_IDLE
	},
	position: {
		x: canvas.width/2, 
		y:canvas.height/2
	},
	spriteImgs:{
		down: playerImageDown,
		up: playerImageUp,
		left:playerImageLeft,
		right: playerImageRight
	}
});
/* */