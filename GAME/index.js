console.log('Olà, bellezza');

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
	image: playerImageDown,
	frames: {max:4, frameSpeed:playerFrameSpeedIdle},
	position: {x: canvas.width/2, y:canvas.height/2},
	spriteImgs:{
		down: playerImageDown,
		up: playerImageUp,
		left:playerImageLeft,
		right: playerImageRight
	}
});

window.addEventListener('keydown', (ev) => {
	switch(ev.key){
		case 'w':
			keys.w.pressed = true;
		break;
		case 'a':
			keys.a.pressed = true;
		break;
		case 's':
			keys.s.pressed = true;
		break;
		case 'd':
			keys.d.pressed = true;
		break;
		default:
			console.log("Wrong button");
		break;
	}
	lastKey = ev.key;
}); //Player response upon key pressing, 'ev' is the event to read the key
window.addEventListener('keyup', (ev) => {
	switch(ev.key){
		case 'w':
			keys.w.pressed = false;
		break;
		case 'a':
			keys.a.pressed = false;
		break;
		case 's':
			keys.s.pressed = false;
		break;
		case 'd':
			keys.d.pressed = false;
		break;
		default:
		break;
	}
}); //Player response upon key releasing
/* */

initBattle({random:  true});


