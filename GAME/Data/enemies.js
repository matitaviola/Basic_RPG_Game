const normalFrameSpeed = 20;

/* Drake */
const drakeImg = new Image();
drakeImg.src = "Assets/Battle/Sprites/drakeSprite.png";
const drakeSpriteInfo = {
	image: drakeImg,
	frames: {max:4, frameSpeed:normalFrameSpeed},
	position: {x: 800, y:100},
	animate: true
};
const drakeSprite = new Sprite ({...drakeSpriteInfo});
drakeAttacks = ['Tackle', 'Fireball'];
/* Enemy Image List */
const enemiesImages = [drakeImg];
/* Enemy List */
const enemiesList = [
	{name: 'Drake', sprite: drakeSprite, maxHp: 50, attackNames: drakeAttacks, spriteInfo: drakeSpriteInfo}
];
