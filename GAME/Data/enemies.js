const normalFrameSpeed = 20;

/* Drake */
const drakeSpriteInfo = {
	imageSrc: "Assets/Battle/Sprites/drakeSprite.png",
	frames: {max:4, frameSpeed:normalFrameSpeed},
	position: {x: 800, y:100},
	animate: true
};
drakeAttacks = ['Tackle', 'Fireball'];
/* Enemy List */
const enemiesList = [
	{name: 'Drake', spriteInfo: drakeSpriteInfo, maxHp: 50, attackNames: drakeAttacks}
];
