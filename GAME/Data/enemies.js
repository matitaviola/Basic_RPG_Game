/* Sgherro */
const sgherroSpriteInfo = {
	imageSrc: "Assets/Battle/Sprites/henchmanSprite.png",
	frames: {max:4, frameSpeed:NORMAL_BATTLER_FRAME_SPEED},
	position: {x: 800, y:100},
	animate: true
};
sgherroAttacks = ['Tackle', 'Fireball'];

/* Drago */
const dragoSpriteInfo = {
	imageSrc: "Assets/Battle/Sprites/DragoSprite.png",
	frames: {max:2, frameSpeed:NORMAL_BATTLER_FRAME_SPEED},
	position: {x: 650, y:-10},
	animate: true
};
dragoAttacks = ['GigaFlare'];

/* Enemy List */
const enemiesBestiary = {
	Sgherro: {name: 'Sgherro', spriteInfo: sgherroSpriteInfo, maxHp: 30, attackNames: sgherroAttacks},
	Drago: {name: 'Drago', spriteInfo: dragoSpriteInfo, maxHp: 120, attackNames: dragoAttacks}
}
const enemiesList = [
	enemiesBestiary.Sgherro,
	enemiesBestiary.Drago
];


