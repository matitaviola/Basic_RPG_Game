const normalFrameSpeed = 20;

/* Drake */
const drakeImg = new Image();
drakeImg.src = "Assets/Battle/Sprites/drakeSprite.png";
const drake = new Sprite ({
	image: drakeImg,
	frames: {max:4, frameSpeed:normalFrameSpeed},
	position: {x: 800, y:100},
	animate: true
});
/* Enemy Sprite List */
const enemySprites = [
	drake
];