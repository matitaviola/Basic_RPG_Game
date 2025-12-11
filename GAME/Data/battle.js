/* Battler */
const emberImg = new Image();
emberImg.src = "Assets/Battle/Sprites/emberSprite.png";
const emberSprite = new Sprite ({
	image: emberImg,
	frames: {max:4, frameSpeed:playerFrameSpeedIdle},
	position: {x: 290, y:320},
	animate: true
});
const pgBattler = new Battler({name: 'Pg', sprite: emberSprite, maxHp: 60, attackNames: ['Tackle', 'Fireball', 'Heal', 'Protect']});

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
	atkSpritesToRender.forEach((sprite) => {sprite.draw(context)});
	pgBattler.sprite.draw(context);
}

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
	
	let atkIdx = 0;
	
	document.querySelectorAll('button').forEach(button => {
		if(atkIdx < pgBattler.attackNames.length){
			button.textContent = pgBattler.attackNames[atkIdx];
			atkIdx++;
		}else{
			button.hidden = true;
		}
		
		button.addEventListener('click', (e) => {
			const attackName = e.currentTarget.innerHTML;
			//Todo: implement real logic to choose opponent's move and action order
			//Atm: calling the second attack on the resolution of the first timeline, but as it's written, the player will always attack first
			attacks[attackName].animationCbk(pgBattler, enemies[0], '#healthBarEnemy', () => {
				attacks[attackName].animationCbk(enemies[0], pgBattler,  '#healthBarPg')
			});
		})
	});
	
	
	animateBattle();
}