/* Battler */
const emberImg = new Image();
emberImg.src = "Assets/Battle/Sprites/emberSprite.png";
const emberSprite = new Sprite ({
	image: emberImg,
	frames: {max:4, frameSpeed:playerFrameSpeedIdle},
	position: {x: 290, y:320},
	animate: true
});

/*	Battle Scene Animation function */
const battleBackgroundImg = new Image();
battleBackgroundImg.src = "./Assets/Battle/Backgrounds/battleBackground.png";
const battleBackground = new Sprite({
	image: battleBackgroundImg,
	frames: {max:1},
	position: {x: 0, y:0}
});
function animateBattle(){
	const animationId = window.requestAnimationFrame(animateBattle); //Recursive calling, to keep moving
	
	battleBackground.draw(context);
	emberSprite.draw(context);
	enemySprites[0].draw(context);
}