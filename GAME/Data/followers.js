/* Render Follower */
const SallyImageDown = new Image();
SallyImageDown.src = "./Assets/Player/sallyDown.png";

const SallyImageUp = new Image();
SallyImageUp.src = "./Assets/Player/sallyUp.png";

const SallyImageLeft = new Image();
SallyImageLeft.src = "./Assets/Player/sallyLeft.png";

const SallyImageRight = new Image();
SallyImageRight.src = "./Assets/Player/sallyRight.png";

const Sally = new Follower({
	imageSrc: SallyImageDown.src,
	frames: {
		max: 2,
		frameSpeed: PLAYER_FRAME_SPEED_IDLE
	},
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2 - 64 // starts behind player
	},
	spriteImgs: {
		down: SallyImageDown,
		up: SallyImageUp,
		left: SallyImageLeft,
		right: SallyImageRight
	},
	followTime: FOLLOW_TIME_NALA
});
/* */

/* Render Follower */
const NalaImageDown = new Image();
NalaImageDown.src = "./Assets/Player/nalaDown.png";

const NalaImageUp = new Image();
NalaImageUp.src = "./Assets/Player/nalaUp.png";

const NalaImageLeft = new Image();
NalaImageLeft.src = "./Assets/Player/nalaLeft.png";

const NalaImageRight = new Image();
NalaImageRight.src = "./Assets/Player/nalaRight.png";

const Nala = new Follower({
	imageSrc: NalaImageDown.src,
	frames: {
		max: 3,
		frameSpeed: PLAYER_FRAME_SPEED_IDLE
	},
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2 - 2*64 // starts behind player
	},
	spriteImgs: {
		down: NalaImageDown,
		up: NalaImageUp,
		left: NalaImageLeft,
		right: NalaImageRight
	},
	followTime: FOLLOW_TIME_SALLY
});
/* */