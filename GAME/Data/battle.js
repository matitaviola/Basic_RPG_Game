/* Player's Battler */
const emberSpriteInfo = {
	imageSrc: "Assets/Battle/Sprites/emberSprite.png",
	frames: {max:4, frameSpeed:playerFrameSpeedIdle},
	position: {x: pgSpriteX, y:pgSpriteY},
	animate: true
};
const pgBattler = new Battler({name: 'Pg', sprite: new Sprite({...emberSpriteInfo}), maxHp: 60, attackNames: ['Tackle', 'Fireball']});


/*	Battle Background */
const battleBackground = new Sprite({
	imageSrc: "./Assets/Battle/Backgrounds/battleBackground.png",
	frames: {max:1},
	position: {x: 0, y:0}
});

/* Button's enabling/disabling */
function disableButtons() {
  document.querySelectorAll('button').forEach(btn => btn.disabled = true);
}
function enableButtons() {
  document.querySelectorAll('button').forEach(btn => btn.disabled = false);
  console.log('done')
}


/* Battle Animation */
function animateBattle(){
	battleAnimationId = window.requestAnimationFrame(animateBattle); //Recursive calling, to keep moving
	
	battleBackground.draw(context);
	enemies[0].sprite.draw(context);
	atkSpritesToRender.forEach((sprite) => {sprite.draw(context)});
	pgBattler.sprite.draw(context);
}

/* Battle exit */
function exitBattle(){
	//TODO: add check for whether we won or the opponent did, to play victory or defeat audio
	audio.victory.play();
	
	gsap.to('.battle-overlap',{
		opacity: 1,
		onComplete: () => {
			enemies.length = 0;
			cancelAnimationFrame(battleAnimationId);
			isInBattle = false;
			
			animateMain();
			
			document.querySelector('#battleGUI').style.display = 'none';
			
			gsap.to('.battle-overlap',{
				opacity: 0
			});
			
			audio.battleBGM.stop();
			audio.mapBGM.play();
		}
	});
}
/* Battle Initialization */
function initBattle({ random = true, chosenEnemies = []} = {}){
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
					document.querySelector('#battleGUI').style.display = 'block';
					gsap.to('.battle-attacks-bar', {
						opacity: 1
					})
					gsap.to('.health-bar-enemy', {
						opacity: 1
					})
					gsap.to('.health-bar-pg', {
						opacity: 1
					})
					gsap.to(pgBattler.sprite, {
						opacity: 1
					})
					
					//Reset health bars
					document.querySelector('#healthBarEnemy').style.width = '100%';
					document.querySelector('#healthBarPg').style.width = (pgBattler.currHp/pgBattler.maxHp)*100 +'%';
					document.querySelector('#diagBox').style.display = 'none';
					
					//Reset player sprite  
					pgBattler.sprite.position = {x: pgSpriteX, y:pgSpriteY};
					
					//Find enemies
					if(random){
						const randomEnemy = enemiesList[Math.floor(Math.random() * enemiesList.length)];
						enemies.push(new Battler({...randomEnemy, sprite: new Sprite({...randomEnemy.spriteInfo})}));
					}else{
						chosenEnemies.forEach(e => {
						  enemies.push(new Battler({ ...e, sprite: new Sprite({...e.spriteInfo}) }));
						});
					}
					
					// Enable buttons if left disbaled 
					enableButtons();
					
					//Start animating the Battle
					animateBattle();
				}
			})
		}
	});
	
	let atkIdx = 0;
	
	//Attack selection
	document.querySelectorAll('.battle-attacks-buttons button').forEach(button => {
		if(atkIdx < pgBattler.attackNames.length){
			button.textContent = pgBattler.attackNames[atkIdx];
			atkIdx++;
		}else{
			button.hidden = true;
		}
		
		// Show info
		button.addEventListener('mouseenter', (e) => {
			const selectedAttack = attacks[e.currentTarget.innerHTML];
			document.querySelector('#battleAttackInfo').innerHTML = selectedAttack.info;
		});
		
		// Attack chosen
		button.addEventListener('click', (e) => {
			let attackName = e.currentTarget.innerHTML;	
			
			//Stop from selecting other Attacks
			disableButtons();
			
			//Todo: implement real logic to choose opponent's move and action order
			//Attacks 
			attacks[attackName].animationCbk({attacker:pgBattler, target:enemies[0], targetBarId:'#healthBarEnemy'});
			//Check if opponent is K.O.
			if(enemies[0].currHp <= 0){
				actionsQueue.push(() => enemies[0].faint());
				actionsQueue.push(() => exitBattle());
			}
			else{
				//Select random attack from the ones the enemy knows
				attackName = enemies[0].attackNames[Math.floor(Math.random() * enemies[0].attackNames.length)];
				//Add it to the queue
				actionsQueue.push(() => {
					attacks[attackName].animationCbk({attacker:enemies[0], target:pgBattler, targetBarId:'#healthBarPg', onComplete:enableButtons});
					//Player's K.O. check
					if(pgBattler.currHp <= 0){
						actionsQueue.push(() => pgBattler.faint());
						actionsQueue.push(() => exitBattle());
					}
				});
			}
		})
	});
	
	//Attack resolution
	document.querySelector('#diagBox').addEventListener('click', (e) => {
		//Next move, pop from queue
		if(actionsQueue.length > 0){
			actionsQueue[0]();
			actionsQueue.shift();
		}
		else{
			// Remove dialog box
			document.querySelector('#diagBox').style.display = 'none';
		}
	});
}