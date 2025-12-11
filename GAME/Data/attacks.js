/* Used sprites*/
const atkImg_Fireball = new Image();
atkImg_Fireball.src = "./Assets/Battle/Sprites/Attacks/fireball.png";
const atkSprite_Fireball = new Sprite ({
	image: atkImg_Fireball,
	frames: {max:4, frameSpeed:10},
	position: {x: 0, y:0},
	animate: true,
	rotation:1
});
/* Sprites to be rendered */
let atkSpritesToRender = [];
/* Reused logics */
// Base damaging move
directDamageMove = function(enemy) {
	enemy.currHp -= this.damage;
	if(enemy.currHp < 0) enemy.currHp = 0;
};

/* Exported attacks */
const attacks = { 
	Tackle: new Attack({
		name: 'Tackle', 
		type: 'physical', 
		damage: 10,
		effectCbk: directDamageMove,
		animationCbk: function(attacker, target, targetBarId, onComplete){
			const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
			const atkSpr = attacker.sprite;
			const tgtSpr = target.sprite; 
			
			tl.to(atkSpr.position, {
				x: atkSpr.position.x -20
			}).to(atkSpr.position, {
				x: atkSpr.position.x + 40
			}).to(atkSpr.position, {
				x: atkSpr.position.x,
				duration: 0.1
			}).to(atkSpr.position, {
				x: tgtSpr.position.x - tgtSpr.width/2,
				y: tgtSpr.position.y,
				duration: 0.5,
				onComplete: () => {
					gsap.to(tgtSpr.position, {
						x: tgtSpr.position.x + 40,
						yoyo: true,
						duration: 0.1,
						repeat: 3
					})
					gsap.to(tgtSpr, {
						opacity: 0,
						yoyo: true,
						duration: 0.1,
						repeat: 3
					})
					
					this.effectCbk(target); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
					
					gsap.to(targetBarId, {
						width: (target.currHp/target.maxHp)*100 +'%',
						duration: 0.5
					});
				}
			}).to(atkSpr.position, {
				x: atkSpr.position.x,
				y: atkSpr.position.y,
				duration: 0.4
			})
		}
	}),
	Fireball: new Attack({
		name: 'Fireball', 
		type: 'magic', 
		damage: 15,
		effectCbk: function(enemy) {
			enemy.currHp -= this.damage;
			if(enemy.currHp < 0) enemy.currHp = 0;
		},
		animationCbk: function(attacker, target, targetBarId, sprite, onComplete){
			const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
			const atkSpr = attacker.sprite;
			const tgtSpr = target.sprite; 
			//Draw fireball upon player
			atkSprite_Fireball.position.x = atkSpr.position.x;
			atkSprite_Fireball.position.y = atkSpr.position.y;
			//Add sprite to the ones to be rendered
			atkSpritesToRender.push(atkSprite_Fireball);
			
			if(targetBarId === "#healthBarPg") //if the attack comes from an enemy
				atkSprite_Fireball.rotation = -2.1;
				
			tl.to(atkSprite_Fireball.position, {
				x: tgtSpr.position.x,
				y: tgtSpr.position.y,
				duration: 0.8,
				onComplete: () => {
					atkSpritesToRender.pop();
					
					gsap.to(tgtSpr.position, {
						x: tgtSpr.position.x + 40,
						yoyo: true,
						duration: 0.1,
						repeat: 3
					})
					gsap.to(tgtSpr, {
						opacity: 0,
						yoyo: true,
						duration: 0.1,
						repeat: 3
					})
					
					this.effectCbk(target); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
					
					gsap.to(targetBarId, {
						width: (target.currHp/target.maxHp)*100 +'%',
						duration: 0.5
					});
				}
			})
		}
	})
};

