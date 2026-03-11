/* Prince */
const princeImageDown = new Image();
princeImageDown.src = "./Assets/Player/princeDown.png";

const princeImageUp = new Image();
princeImageUp.src = "./Assets/Player/princeUp.png";

const princeImageLeft = new Image();
princeImageLeft.src = "./Assets/Player/princeLeft.png";

const princeImageRight = new Image();
princeImageRight.src = "./Assets/Player/princeRight.png";

const prince = new Character({
	imageSrc: princeImageUp.src,
	frames: { max: 1, frameSpeed: 20},
	animate: false,
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:60*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		down: princeImageDown,
		up: princeImageUp,
		left:princeImageLeft,
		right: princeImageRight
	},
	collisionOffset: { x: 0, y: 30},
	interactionOffset: { x: 10, y: 20},
	interactCbk: function(){
		if(battleDragon)
			return;
		battleDragon = true;
		this.rotateToFaceCaller(playerDirection)
		showDialog([
				"Mattia: Bellezza?!",
				"Mattia: Come sei arrivata qui?",
				"Mattia: Anzi, non importa, devi andartene, c'è un...",
				"Drago: ROOOOOOOOOOOAR!!!"
			], 
			() => {
				const tl = gsap.timeline({ onComplete: () => {
					showDialog([
						"Mattia: Eccolo, prepariamoci alla battaglia!",
						"Drago: ROOOOOOOOOOOAR!"
					], ()=>{
						//Remove player and folowers from the moving objects
						moveWithMapObjs.pop();
						moveWithMapObjs.pop();
						moveWithMapObjs.pop();
						
						gsap.to('.battle-overlap',{
						opacity: 1,
						repeat:3,
						yoyo: true,
						duration: 0.5,
						onComplete: () => {initBattle({random: false, chosenEnemies: [enemiesBestiary.Drago], initCallback: function(){dragon.hideSelf();}})}
						});
					})
				} });
				
				//Unlock new attack
				pgBattler.attackNames.push('LoveFlare');
				
				//Music
				audio.mapBGM.stop();
				audio.finalBattle.play();
				audio.finalBattle.fade(0, musicVolume, 3000);
				
				//move DRAGON
				dragon.showSelf();
				this.rotateToFaceCaller('down');
				moveWithMapObjs.push(Nala, Sally, playerSprite);
				tl.to(moveWithMapObjs.map(m => m.position), {
						y: `+=${MOVEMENT_PIXELS * 120}`,
						duration:2,
						repeat:1,
						yoyo: true
						
					})
				.to(playerSprite.position,{ 
					x: canvas.width/2, 
					y:canvas.height/2 
				})
				.to(dragon.position,{ 
					y: prince.position.y - dragon.height,
					duration: 2,
					onUpdate: () => { dragon.draw(context); }
				}).to(prince.position,{
					x: prince.position.x - TILE_WIDTH,
					duration: 0.5,
				}).to(playerSprite.position, {
						y: playerSprite.position.y - TILE_HEIGHT + prince.collisionOffset.y,
						duration:1
				});	
			}
		)
	}
});
/* */

/* dragon */
const dragonImageDown = new Image();
dragonImageDown.src = "./Assets/Player/dragonDown.png";

const dragon = new Character({
	imageSrc: dragonImageDown.src,
	frames: { max: 2, frameSpeed: 20},
	animate: true,
	visible: false,
	interactable: false,
	position: {x: 35*TILE_WIDTH + STARTING_POINT_X, y:51*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		down: dragonImageDown
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
	}
});
/* */