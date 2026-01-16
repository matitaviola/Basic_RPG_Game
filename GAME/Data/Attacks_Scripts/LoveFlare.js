/* Used sprites*/
const atkSpriteInfo_LoveFlare ={
	imageSrc: "./Assets/Battle/Sprites/Attacks/loveflare.png",
	frames: {max:4, frameSpeed:10},
	position: {x: 0, y:0},
	animate: true,
	rotation:1
};
const atkSpriteInfo_Ashened ={
	imageSrc: "./Assets/Battle/Sprites/Attacks/ashened.png",
	frames: {max:6, frameSpeed:10},
	position: {x: 0, y:0},
	animate: true,
	rotation:0
};
/* */

const atkLoveFlare = new Attack({
	name: 'Love Flare', 
	type: 'magic', 
	info: 'The users throw a passion-flaming ball to the target',
	damage: 255,
	effectCbk: directDamageMove,
	animationCbk: function({attacker, target, targetBarId, sprite, onComplete}){
		const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
		const atkSpr = attacker.sprite;
		const tgtSpr = target.sprite; 
		
		//Draw ashened upon player
		let atkSprite_Ashened = new Sprite({...atkSpriteInfo_Ashened});
		atkSprite_Ashened.position.x = 650;
		atkSprite_Ashened.position.y = -10;
		atkSprite_Ashened.opacity = 0;
		atkSpritesToRender.push(atkSprite_Ashened);

		//Draw fireball upon player
		let atkSprite_LoveFlare = new Sprite({...atkSpriteInfo_LoveFlare});
		atkSprite_LoveFlare.position.x = atkSpr.position.x;
		atkSprite_LoveFlare.position.y = atkSpr.position.y;
		//Add sprite to the ones to be rendered
		atkSpritesToRender.push(atkSprite_LoveFlare);
		
		
		//Show box and set text
		document.querySelector('#diagBoxBattle').style.display = 'block';
		document.querySelector('#diagBoxBattle').innerHTML = attacker.name + ' and Mattia  throw their flaming-passion energy to ' + target.name;
		
		//Effect
		this.effectCbk(target); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
		
		//SFX
		audio.attackSound.fireballInit.play();
				
		// Animation
		tl/*.to(atkSprite_LoveFlare.position, {
		  x: tgtSpr.position.x,
		  y: tgtSpr.position.y,
		  duration: 0.8
		})*/.to(atkSprite_Ashened, {
			opacity: 1,
			repeat:1,
			yoyo:true,
			duration: 0.5,
		}).to(atkSprite_LoveFlare.position, {
		  x: tgtSpr.position.x,
		  y: tgtSpr.position.y,
		  duration: 0.8
		},'<')
		.call(() => {
		  atkSpritesToRender.pop();
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