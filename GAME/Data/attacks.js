/* Attacks Queue */
const actionsQueue = [];

/* Used sprites*/
const atkSpriteInfo_Fireball ={
	imageSrc: "./Assets/Battle/Sprites/Attacks/fireball.png",
	frames: {max:4, frameSpeed:10},
	position: {x: 0, y:0},
	animate: true,
	rotation:1
};
const atkSpriteInfo_Brush ={
	imageSrc: "./Assets/Battle/Sprites/Attacks/brush.png",
	frames: {max:4, frameSpeed:15},
	position: {x: 0, y:0},
	animate: true,
	rotation:1
};
const atkSpriteInfo_GigaFlare ={
	imageSrc: "./Assets/Battle/Sprites/Attacks/gigaflare.png",
	frames: {max:4, frameSpeed:10},
	position: {x: 0, y:0},
	animate: true,
	rotation:1
};
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
/* Sprites to be rendered */
let atkSpritesToRender = [];

/* Reused logics */
// Base damaging move
directDamageMove = function(target) {
	target.currHp -= this.damage;
	if(target.currHp < 0) target.currHp = 0;
};
// Base helaing move
healMove = function(target, amount){
	target.currHp += amount;
	if(target.currHp > target.maxHp)
		target.currHp = target.maxHp;
};

/* Exported attacks */
const attacks = { 
	Tackle: new Attack({
		name: 'Tackle', 
		type: 'physical',
		info: 'The user tackles the opponent, albeit not with all its might',		
		damage: 10,
		effectCbk: directDamageMove,
		animationCbk: function({attacker, target, targetBarId, onComplete}){
			const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
			const atkSpr = attacker.sprite;
			const tgtSpr = target.sprite; 
			//Show box and set text
			document.querySelector('#diagBoxBattle').style.display = 'block';
			document.querySelector('#diagBoxBattle').innerHTML = attacker.name + ' tackles ' + target.name;
			
			//Effect
			this.effectCbk(target); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
					
			// Animation
			
			tl.to(atkSpr.position, {
			  x: "-=20",
			  duration: 0.1
			})
			.to(atkSpr.position, {
			  x: "+=40",
			  duration: 0.1
			})
			.to(atkSpr.position, {
			  x: atkSpr.position.x,
			  duration: 0.1
			})
			.to(atkSpr.position, {
			  x: tgtSpr.position.x - tgtSpr.width / 2,
			  y: tgtSpr.position.y,
			  duration: 0.5
			})
			.call(() => {
			  audio.attackSound.tackleHit.play();
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
			}, "<") // run alongside shake
			.to(targetBarId, {
			  width: (target.currHp / target.maxHp) * 100 + '%',
			  duration: 0.5
			})
			.to(atkSpr.position, {
			  x: atkSpr.position.x,
			  y: atkSpr.position.y,
			  duration: 0.4
			});
		}
	}),
	Fireball: new Attack({
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
	}),
	BrushStroke: new Attack({
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
	}),
	Heal: new Attack({
		name: 'Heal', 
		type: 'status',
		info: 'The user heals itself',		
		damage: 0,
		effectCbk: healMove,
		animationCbk: function({attacker, target, targetBarId, onComplete}){
			const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
			const atkSpr = attacker.sprite;
			
			//Show box and set text
			document.querySelector('#diagBoxBattle').style.display = 'block';
			document.querySelector('#diagBoxBattle').innerHTML = attacker.name + ' healed themselves';
			
			//Effect
			this.effectCbk(attacker, attacker.maxHp/3); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
					
			// Animation
			if(targetBarId == '#healthBarPg')
				targetBarId = '#healthBarEnemy';
			else
				targetBarId = '#healthBarPg';
			
			tl.call(() => {
			  audio.attackSound.tackleHit.play();
			})
			.to(targetBarId, {
			  width: (attacker.currHp / attacker.maxHp) * 100 + '%',
			  duration: 0.5
			});
		}
	}),
	GigaFlare: new Attack({
		name: 'Giga Flare', 
		type: 'magic', 
		info: 'The user throws a flaming ball to the target',
		damage: 50,
		effectCbk: directDamageMove,
		animationCbk: function({attacker, target, targetBarId, sprite, onComplete}){
			const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
			const atkSpr = attacker.sprite;
			const tgtSpr = target.sprite; 
			//Draw fireball upon player
			let atkSprite_GigaFlare = new Sprite({...atkSpriteInfo_GigaFlare});
			atkSprite_GigaFlare.position.x = atkSpr.position.x;
			atkSprite_GigaFlare.position.y = atkSpr.position.y;
			//Add sprite to the ones to be rendered
			atkSpritesToRender.push(atkSprite_GigaFlare);
			
			if(targetBarId === "#healthBarPg") //if the attack comes from an enemy
				atkSprite_GigaFlare.rotation = -2.1;
				
			//Show box and set text
			document.querySelector('#diagBoxBattle').style.display = 'block';
			document.querySelector('#diagBoxBattle').innerHTML = attacker.name + ' throws a gigantic fireball to ' + target.name;
			
			//Effect
			this.effectCbk(target); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
			
			//SFX
			audio.attackSound.fireballInit.play();
					
			// Animation
			tl.to(atkSprite_GigaFlare.position, {
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
	}),
	LoveFlare: new Attack({
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
	})
	
};

