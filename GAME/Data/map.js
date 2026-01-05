/* Render map */
const mapBackground = new Sprite({
	imageSrc: "./Assets/Maps/Map_base.png",
	position: {x: STARTING_POINT_X, y: STARTING_POINT_Y}
});

const mapForeground = new Sprite({
	imageSrc: "./Assets/Maps/Map_upper.png",
	position: {x: STARTING_POINT_X, y: STARTING_POINT_Y}
});
/* */

/* Render Player*/
const playerImageDown = new Image();
playerImageDown.src = "./Assets/Player/playerDown.png";

const playerImageUp = new Image();
playerImageUp.src = "./Assets/Player/playerUp.png";

const playerImageLeft = new Image();
playerImageLeft.src = "./Assets/Player/playerLeft.png";

const playerImageRight = new Image();
playerImageRight.src = "./Assets/Player/playerRight.png";

const playerSprite = new Sprite({
	imageSrc: playerImageDown.src,
	frames: {
		max:4, 
		frameSpeed: PLAYER_FRAME_SPEED_IDLE
	},
	position: {
		x: canvas.width/2, 
		y:canvas.height/2
	},
	spriteImgs:{
		down: playerImageDown,
		up: playerImageUp,
		left:playerImageLeft,
		right: playerImageRight
	}
});
/* */

/* Collisions */
const collisionMap = [];
for (let i = 0; i <= (collisions.length - TILE_MAP_WIDTH); i += TILE_MAP_WIDTH){
	collisionMap.push(collisions.slice(i, i+TILE_MAP_WIDTH));
}

collisionMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if(symbol != 0)
			collisionBlocks.push(
				new Collision({
					position:{x: j*TILE_WIDTH + STARTING_POINT_X, y:i*TILE_HEIGHT + STARTING_POINT_Y}, 
					width: TILE_WIDTH, 
					height: TILE_HEIGHT})
		);
	})
});

/* */

/* Main Scene Animation function */
moveWithMapObjs.push(mapBackground, mapForeground, ...collisionBlocks, ...characters );
drawObjs.push(mapBackground, ...characters, playerSprite, mapForeground);

function animateMain(){
	mapAnimationId = window.requestAnimationFrame(animateMain); //Recursive calling, to keep moving
	
	//Draw everything	
	drawObjs.forEach((drawObj) => {
		drawObj.draw(context);
	});
	
	let playerSpriteTolerance = {u:playerSprite.height*2/3, d:0, l:PLAYER_PIXEL_TOL_X, r:PLAYER_PIXEL_TOL_X}; //Put it here to allow computations after image load
	
	//Exit if here but we're in battle or dialog
	if(gamestate == G_S.BATTLE) 
		return;
	
	if(gamestate == G_S.END)
		goodEndingScene();
	
	let moveEn = true; 
	playerSprite.animate = false;
	Sally.animate = false;
	Nala.animate = false;
	
	//Check for 'enter' for menu
	if(gamestate == G_S.DIALOG){
		if (keys.space.pressed) {
			//If we're already speaking.
			if (diagBox.classList.contains('visible')) {
				advanceDialog();
				//'Consume' the key, for debouncing
				keys.space.pressed = false;
				return;
			}
		}
	}
	else if(gamestate == G_S.MAP){
		//Next position
		if(keys.w.pressed && (lastKey == 'w' || lastKey == 'ArrowUp')){
			
			for(let i = 0; i < collisionBlocks.length; i++){
				const coll = collisionBlocks[i];
				if(coll.checkCollision(playerSprite,{x: 0, y: MOVEMENT_PIXELS}, playerSpriteTolerance)){
					moveEn = false;
					break;
				}
			}
			
			if (moveEn) {
				moveWithMapObjs.forEach(mov => {
					mov.position.y += MOVEMENT_PIXELS;
				});
				Sally.updateFollower('up', playerSprite);
				Nala.updateFollower('up', Sally);
			}

			//Update player sprite and direction 
			playerSprite.animate = true;
			playerSprite.image = playerSprite.spriteImgs.up;
			playerDirection = 'up';

		}
		else if(keys.a.pressed && (lastKey == 'a' || lastKey == 'ArrowLeft')){
			
			for(let i = 0; i < collisionBlocks.length; i++){
				const coll = collisionBlocks[i];
				if(coll.checkCollision(playerSprite,{x: MOVEMENT_PIXELS, y: 0}, playerSpriteTolerance)){
					moveEn = false;
					break;
				}
			}
			
			if (moveEn) {
				moveWithMapObjs.forEach(mov => {
					mov.position.x += MOVEMENT_PIXELS;
				});
				Sally.updateFollower('left', playerSprite);
				Nala.updateFollower('left', Sally);
			}

			playerSprite.animate = true;
			playerSprite.image = playerSprite.spriteImgs.left;
			playerDirection = 'left';

		}
		else if(keys.s.pressed && (lastKey == 's' || lastKey == 'ArrowDown')){
			
			for(let i = 0; i < collisionBlocks.length; i++){
				const coll = collisionBlocks[i];
				if(coll.checkCollision(playerSprite,{x: 0, y: -MOVEMENT_PIXELS}, playerSpriteTolerance)){
					moveEn = false;
					break;
				}
			}
			
			if (moveEn) {
				moveWithMapObjs.forEach(mov => {
					mov.position.y -= MOVEMENT_PIXELS;
				});
				Sally.updateFollower('down', playerSprite);
				Nala.updateFollower('down', Sally);
			}
			  
			playerSprite.animate = true;
			playerSprite.image = playerSprite.spriteImgs.down;
			playerDirection = 'down';

		}
		else if(keys.d.pressed && (lastKey == 'd' || lastKey == 'ArrowRight')){
			
			for(let i = 0; i < collisionBlocks.length; i++){
				const coll = collisionBlocks[i];
				if(coll.checkCollision(playerSprite,{x: -MOVEMENT_PIXELS, y: 0}, playerSpriteTolerance)){
					moveEn = false;
					break;
				}
			}
			
			if (moveEn) {
				moveWithMapObjs.forEach(mov => {
					mov.position.x -= MOVEMENT_PIXELS;
				});
				Sally.updateFollower('right', playerSprite);
				Nala.updateFollower('right', Sally);
			}
			  
			playerSprite.animate = true;
			playerSprite.image = playerSprite.spriteImgs.right;
			playerDirection = 'right';
		}
		else if (keys.space.pressed) {
			//Interact with characters
			for (let i = 0; i < characters.length; i++) {
				const npc = characters[i];
				if (npc.canInteract(playerSprite)) {
					npc.interact();

					//'Consume' the key, for debouncing
					keys.space.pressed = false;
					break;
				}
			}
		}

	}
}

/* Good Ending Scene */
function goodEndingScene(){
	playerSprite.image = playerSprite.spriteImgs.left;
	prince.rotateToFaceCaller('left');
	showDialog([
		"Mattia: Grazie bellezza, mi hai davvero salvato!",
		"Mattia: Non pensavo che sarei mai uscito da questa situazione, ma grazie a te posso guardare al futuro con il sorriso.",
		"Mattia: Pronta ad affrontare altre avventure, insieme?",
		"Mattia: Hehe, ma prima..."
	], () => {
		
		showDialog(["SMOOOCH"], 
			() => {
		});
		
		const cuoreOverlap = document.querySelector('#cuore-overlap');
		const overlap = document.querySelector('.battle-overlap');
		const cuore = document.querySelector('#cuore');
		overlap.innerHTML = '<h1>Buon primo anniversario,</h1><h1>Amore</h1>';
		
		audio.mapBGM.stop();
		
		gsap.timeline()
		.to(prince.position, {
			x: prince.position.x + MOVEMENT_PIXELS*6,
			duration: 1,
			onComplete: () => {window.cancelAnimationFrame(mapAnimationId);}
		})
		.to(cuore, {
			width: 1000,
			height: 1000,
			duration: 2.5
		}).to(overlap, {
			opacity: 1,
			duration: 2.5,
		}, "<");
	});			
}