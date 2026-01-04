/* Player's Battler */
const pgSpriteInfo = {
	imageSrc: "Assets/Battle/Sprites/MarikaSprite.png",
	frames: {max:2, frameSpeed:PLAYER_FRAME_SPEED_IDLE*5},
	position: {x: PG_SPRITE_X, y:PG_SPRITE_Y},
	animate: true
};
const pgBattler = new Battler({name: 'Marika', sprite: new Sprite({...pgSpriteInfo}), maxHp: 60, attackNames: ['Fireball', 'Tackle']});
/* */

/*	Battle Background */
const battleBackground = new Sprite({
	imageSrc: "./Assets/Battle/Backgrounds/battleBackground.png",
	frames: {max:1},
	position: {x: 0, y:0}
});
/* */

/* Button and diagBoxBattle enabling/disabling */
function disableButtons() {
  document.querySelectorAll('button').forEach(btn => btn.disabled = true);
}
function enableButtons() {
  document.querySelectorAll('button').forEach(btn => btn.disabled = false);
}
function disablediagBoxBattle() {
  document.querySelector('#diagBoxBattle').style.pointerEvents = 'none';
}
function enablediagBoxBattle() {
  document.querySelector('#diagBoxBattle').style.pointerEvents = 'auto';
}
/* */

/* Queue next action */
function queueNextAction() {
  if (actionsQueue.length > 0) {
    actionsQueue.shift()();
  } else {
    document.querySelector('#diagBoxBattle').style.display = 'none';
    enableButtons();
  }
  enablediagBoxBattle();
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
	//TODO: improve check for whether we won or the opponent did, to play victory or defeat audio
	if(pgBattler.currHp > 0){
		if(battleDragon){
			audio.victory.play();
			gsap.to('.battle-overlap',{
				opacity: 1,
				onComplete: () => {
					enemies.length = 0;
					
					cancelAnimationFrame(battleAnimationId);
					animateMain();
					
					document.querySelector('#battleGUI').style.display = 'none';
					gsap.to('.battle-overlap',{
						opacity: 0
					});
					
					audio.finalBattle.stop();
					audio.mapBGM.play();
				
					//Set the new gamestate
					gamestate = G_S.END;
					
				}
			});
		}
		else{
			audio.victory.play();
			gsap.to('.battle-overlap',{
				opacity: 1,
				onComplete: () => {
					enemies.length = 0;
					
					cancelAnimationFrame(battleAnimationId);
					animateMain();
					
					document.querySelector('#battleGUI').style.display = 'none';
					gsap.to('.battle-overlap',{
						opacity: 0
					});
					
					audio.battleBGM.stop();
					audio.mapBGM.play();
				
					//Set the new gamestate
					gamestate = G_S.MAP;
					
				}
			});
		}
	}
	else{
		//GAME OVER
		audio.battleBGM.stop();
		
		document.querySelector('#diagBoxBattle').innerHTML = 'GAME OVER :(';
		document.querySelectorAll('.battle-overlap').forEach(el => {
			el.innerHTML = '<h1>GAME OVER</h1>'
		});
		gamestate = G_S.OVER;
		
		gsap.to('.battle-overlap',{
			opacity: 1,
			repeat: 2,
			yoyo: true,
			duration: 2,
			onComplete: () => {				
				//Reload page
				location.reload();
				
			}
		});
		
	}
}
/* */

/* Battle Initialization */
function initBattle({ random = true, chosenEnemies = [], initCallback} = {}){
	window.cancelAnimationFrame(mapAnimationId);
	
	if(initCallback)
		initCallback();
	//Set the new gamestate
	gamestate = G_S.BATTLE;
	
	//Play Music
	audio.mapBGM.stop(); //Stop map's music
	if(battleDragon){
		//audio.finalBattle.play();
	}
	else{
		audio.battleIntro.play(); //start battle into
		audio.battleBGM.play(); //battle backgroun music into
	}					
	//Find enemies
	if(random){
		const randomEnemy = enemiesList[Math.floor(Math.random() * enemiesList.length)];
		enemies.push(new Battler({...randomEnemy, sprite: new Sprite({...randomEnemy.spriteInfo})}));
	}else{
		chosenEnemies.forEach(e => {
		  enemies.push(new Battler({ ...e, sprite: new Sprite({...e.spriteInfo}) }));
		});
	}
	
	document.querySelector('.health-bar-pg h1').textContent = pgBattler.name;
	document.querySelector('.health-bar-enemy h1').textContent = enemies[0].name;
	
	//Reset player sprite  
	pgBattler.sprite.position = {x: PG_SPRITE_X, y:PG_SPRITE_Y};
	
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
					document.querySelector('#diagBoxBattle').style.display = 'none';

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
	document.querySelectorAll('.battle-attacks-buttons button').forEach(oldButton => {
		//Remove all previous listeners by cloning
		const button = oldButton.cloneNode(true);
		oldButton.replaceWith(button);
  
		//Change attack names
		if(atkIdx < pgBattler.attackNames.length){
			button.textContent = pgBattler.attackNames[atkIdx];
			atkIdx++;
		}else{
			button.hidden = true;
		}
		
		// Attack chosen
		button.addEventListener('click', (e) => {
			//Stop from selecting other Attacks
			disableButtons();
			disablediagBoxBattle();
			
			let attackName = e.currentTarget.innerHTML;	
			
			//Todo: implement real logic to choose opponent's move and action order
			//Attacks 
			attacks[attackName].animationCbk({attacker:pgBattler, target:enemies[0], targetBarId:'#healthBarEnemy', onComplete: () => {
				//Check if opponent is K.O.
				if(enemies[0].currHp <= 0){
					actionsQueue.push(() => enemies[0].faint());
					actionsQueue.push(() => exitBattle());
					queueNextAction();
				}
				else{
					//Select random attack from the ones the enemy knows
					attackName = enemies[0].attackNames[Math.floor(Math.random() * enemies[0].attackNames.length)];
					//Add it to the queue
					
						attacks[attackName].animationCbk({attacker:enemies[0], target:pgBattler, targetBarId:'#healthBarPg', onComplete: () => {
							//Player's K.O. check
							if(pgBattler.currHp <= 0){
								actionsQueue.push(() => pgBattler.faint());
								actionsQueue.push(() => exitBattle());
								queueNextAction();
							}else{enableButtons(); enablediagBoxBattle();}
						}});
						
					
				}
			}});
			
		});
		
		// Show info
		button.addEventListener('mouseenter', (e) => {
			const selectedAttack = attacks[e.currentTarget.innerHTML];
			document.querySelector('#battleAttackInfo').innerHTML = selectedAttack.info;
		});
	});
	
	//Attack resolution
	document.querySelector('#diagBoxBattle').addEventListener('click', queueNextAction);
}
/* */ 