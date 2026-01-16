/* Used sprites*/
const atkSpriteInfo_Brush ={
	imageSrc: "./Assets/Battle/Sprites/Attacks/brush.png",
	frames: {max:4, frameSpeed:15},
	position: {x: 0, y:0},
	animate: true,
	rotation:1
};
/* */
const atkBrushStroke = new Attack({
	name: 'Brush Stroke', 
	type: 'physical', 
	info: 'The user hits the opponents with their trusty paintbrush',
	damage: 15,
	effectCbk: directDamageMove,
	animationCbk: function({attacker, target, targetBarId, sprite, onComplete}){
		const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
		const atkSpr = attacker.sprite;
		const tgtSpr = target.sprite; 
		//Draw fireball upon player
		let atkSprite_Brush = new Sprite({...atkSpriteInfo_Brush});
		atkSprite_Brush.position.x = tgtSpr.position.x;
		atkSprite_Brush.position.y = tgtSpr.position.y;
		atkSprite_Brush.rotation = -0.5;
		//Add sprite to the ones to be rendered
		atkSpritesToRender.push(atkSprite_Brush);
		
		//Show box and set text
		document.querySelector('#diagBoxBattle').style.display = 'block';
		document.querySelector('#diagBoxBattle').innerHTML = attacker.name + ' brushes ' + target.name + ' away.';
		
		//Effect
		this.effectCbk(target); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
		
		//SFX
		audio.attackSound.fireballInit.play();
				
		// Animation
		tl.to(atkSprite_Brush.position, {
		  x: tgtSpr.position.x,
		  y: tgtSpr.position.y,
		  duration: 1.5
		})
		.call(() => {
		  atkSpritesToRender.pop();
		  audio.attackSound.fireballHit.play();
		})
		.to(tgtSpr.position, {
		  x: "+=40",
		  yoyo: true,
		  repeat: 3,
		  duration: 0.1
		})
		.to(tgtSpr, {
		  opacity: 0,
		  yoyo: true,
		  repeat: 3,
		  duration: 0.1
		}, "<") // run at the same time as the shake
		.to(targetBarId, {
		  width: (target.currHp / target.maxHp) * 100 + '%',
		  duration: 0.5
		});
	}
});