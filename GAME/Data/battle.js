/* Battler */
const emberImg = new Image();
emberImg.src = "Assets/Battle/Sprites/emberSprite.png";
const emberSprite = new Sprite ({
	image: emberImg,
	frames: {max:4, frameSpeed:playerFrameSpeedIdle},
	position: {x: 290, y:320},
	animate: true
});
const pgBattler = new Battler({name: 'Pg', sprite: emberSprite, maxHp: 60});

/*	Battle Scene Animation function */
const battleBackgroundImg = new Image();
battleBackgroundImg.src = "./Assets/Battle/Backgrounds/battleBackground.png";
const battleBackground = new Sprite({
	image: battleBackgroundImg,
	frames: {max:1},
	position: {x: 0, y:0}
});

/* Battle Animation */
function animateBattle(){
	const animationId = window.requestAnimationFrame(animateBattle); //Recursive calling, to keep moving
	
	battleBackground.draw(context);
	enemies[0].sprite.draw(context);
	pgBattler.sprite.draw(context);
}

const Tackle = new Attack({
	name: 'pino', 
	type: 'gino', 
	damage: 10,
	effectCbk: function(enemy) {
		enemy.currHp -= this.damage;
		if(enemy.currHp < 0) enemy.currHp = 0;
	},
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
})


/* Battle Initialization */
function initBattle(){
	isInBattle = true;
	//make battle bars visible
	gsap.to('.battle-overlap', {
		opacity: 1, 
		duration: 0.2,
		onComplete(){
			gsap.to('.battle-overlap', {
				opacity: 0, 
				duration: 0.2,
				onComplete() {
					gsap.to('.battle-attacks-bar', {
						opacity: 1
					})
					gsap.to('.health-bar-enemy', {
						opacity: 1
					})
					gsap.to('.health-bar-pg', {
						opacity: 1
					})
				}
			})
		}
	});
	
	document.querySelectorAll('button').forEach(button => {
		button.addEventListener('click', () => {
			//Todo: implement real logic to choose opponent's move and action order
			//Atm: calling the second attack on the resolution of the first timeline, but as it's written, the player will always attack first
			Tackle.animationCbk(pgBattler, enemies[0], '#healthBarEnemy', () => {
				Tackle.animationCbk(enemies[0], pgBattler,  '#healthBarPg')
			});
		})
	});
	
	
	animateBattle();
}