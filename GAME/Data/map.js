/* Render map */
const mapBackground = new Sprite({
	imageSrc: "./Assets/Maps/Test_map.png",
	position: {x: STARTING_POINT_X, y: STARTING_POINT_Y}
});

const mapForeground = new Sprite({
	imageSrc: "./Assets/Maps/Test_map_upper_layers.png",
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

/* Render Follower */
const followerOneImageDown = new Image();
followerOneImageDown.src = "./Assets/Player/catOneDown.png";

const followerOneImageUp = new Image();
followerOneImageUp.src = "./Assets/Player/catOneUp.png";

const followerOneImageLeft = new Image();
followerOneImageLeft.src = "./Assets/Player/catOneLeft.png";

const followerOneImageRight = new Image();
followerOneImageRight.src = "./Assets/Player/catOneRight.png";

const followerOne = new Follower({
	imageSrc: followerOneImageDown.src,
	frames: {
		max: 3,
		frameSpeed: PLAYER_FRAME_SPEED_IDLE
	},
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2 - 64 // starts behind player
	},
	spriteImgs: {
		down: followerOneImageDown,
		up: followerOneImageUp,
		left: followerOneImageLeft,
		right: followerOneImageRight
	},
	followTime: FOLLOW_TIME_NALA
});
/* */

/* Render Follower */
const followerTwoImageDown = new Image();
followerTwoImageDown.src = "./Assets/Player/catTwoDown.png";

const followerTwoImageUp = new Image();
followerTwoImageUp.src = "./Assets/Player/catTwoUp.png";

const followerTwoImageLeft = new Image();
followerTwoImageLeft.src = "./Assets/Player/catTwoLeft.png";

const followerTwoImageRight = new Image();
followerTwoImageRight.src = "./Assets/Player/catTwoRight.png";

const followerTwo = new Follower({
	imageSrc: followerTwoImageDown.src,
	frames: {
		max: 2,
		frameSpeed: PLAYER_FRAME_SPEED_IDLE
	},
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2 - 2*64 // starts behind player
	},
	spriteImgs: {
		down: followerTwoImageDown,
		up: followerTwoImageUp,
		left: followerTwoImageLeft,
		right: followerTwoImageRight
	},
	followTime: FOLLOW_TIME_SALLY
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

/* Grass */
const grassMap = [];
for (let i = 0; i <= (grass.length - TILE_MAP_WIDTH); i += TILE_MAP_WIDTH){
	grassMap.push(grass.slice(i, i+TILE_MAP_WIDTH));
}

const grassTiles = []
grassMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if(symbol != 0)
			grassTiles.push(
				new Collision({
					position:{x: j*TILE_WIDTH + STARTING_POINT_X, y:i*TILE_HEIGHT + STARTING_POINT_Y}, 
					width: TILE_WIDTH, 
					height:TILE_HEIGHT})
		);
	})
});
/* */

/* Main Scene Animation function */
moveWithMapObjs.push(mapBackground, mapForeground, ...collisionBlocks, ...grassTiles, ...characters );
const drawObjs = [mapBackground, ...collisionBlocks, followerTwo, followerOne, ...characters, playerSprite, mapForeground];

function animateMain(){
	mapAnimationId = window.requestAnimationFrame(animateMain); //Recursive calling, to keep moving
	
	//Draw everything
	
	drawObjs.forEach((drawObj) => {
		drawObj.draw(context);
	});
	
	let playerSpriteTolerance = {u:playerSprite.height*2/3, d:0, l:PLAYER_PIXEL_TOL_X, r:PLAYER_PIXEL_TOL_X}; //Put it here to allow computations after image load
	
	//Exit if here but we're in battle or dialog
	if(gamestate == G_S.BATTLE) return;

	
	let moveEn = true; 
	playerSprite.animate = false;
	followerOne.animate = false;
	followerTwo.animate = false;
	
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
				followerOne.updateFollower('up', playerSprite);
				followerTwo.updateFollower('up', followerOne);
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
				followerOne.updateFollower('left', playerSprite);
				followerTwo.updateFollower('left', followerOne);
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
				followerOne.updateFollower('down', playerSprite);
				followerTwo.updateFollower('down', followerOne);
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
				followerOne.updateFollower('right', playerSprite);
				followerTwo.updateFollower('right', followerOne);
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

		//Add check for grass battle, only if we moved
		if(playerSprite.animate){
			for(let i = 0; i < grassTiles.length; i++){
				const patch = grassTiles[i];
				if(patch.checkCollision(playerSprite,{x: 0, y: 0}, playerSpriteTolerance) &&
					patch.checkOverlapArea(playerSprite) > BATTLE_TRIGGER_AREA
					&& Math.random() < 0.01) //Add randomicity to encounter
				{
					console.log('Battle!');
					
					window.cancelAnimationFrame(mapAnimationId); //Stops current loop
					
					audio.mapBGM.stop(); //Stop map's music
					audio.battleIntro.play(); //start battle into
					audio.battleBGM.play(); //battle backgroun music into
					
					gsap.to('.battle-overlap',{
						opacity: 1,
						repeat:3,
						yoyo: true,
						duration: 0.5,
						onComplete() {
								initBattle({random: true});
							}
						});
					break;
				}
			}
		}
	}
}