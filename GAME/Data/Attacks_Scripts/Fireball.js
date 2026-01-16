/* Used sprites*/
const atkSpriteInfo_Fireball ={
	imageSrc: "./Assets/Battle/Sprites/Attacks/fireball.png",
	frames: {max:4, frameSpeed:10},
	position: {x: 0, y:0},
	animate: true,
	rotation:1
};
/* */

const atkFireball = new Attack({
	name: 'Fireball', 
	type: 'magic', 
	info: 'The user throws a flaming ball to the target',
	damage: 20,
	effectCbk: directDamageMove,
	animationCbk: function({attacker, target, targetBarId, sprite, onComplete}){
		const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
		const atkSpr = attacker.sprite;
		const tgtSpr = target.sprite; 
		//Draw fireball upon player
		let atkSprite_Fireball = new Sprite({...atkSpriteInfo_Fireball});
		atkSprite_Fireball.position.x = atkSpr.position.x;
		atkSprite_Fireball.position.y = atkSpr.position.y;
		//Add sprite to the ones to be rendered
		atkSpritesToRender.push(atkSprite_Fireball);
		
		if(targetBarId === "#healthBarPg") //if the attack comes from an enemy
			atkSprite_Fireball.rotation = -2.1;
			
		//Show box and set text
		document.querySelector('#diagBoxBattle').style.display = 'block';
		document.querySelector('#diagBoxBattle').innerHTML = attacker.name + ' throws a fireball to ' + target.name;
		
		//Effect
		this.effectCbk(target); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
		
		//SFX
		audio.attackSound.fireballInit.play();
				
		// Animation
		tl.to(atkSprite_Fireball.position, {
		  x: tgtSpr.position.x,
		  y: tgtSpr.position.y,
		  duration: 0.8
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