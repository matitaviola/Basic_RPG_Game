/* Render map */
const mapBackground = new Sprite({
	imageSrc: "./Assets/Maps/Test_map.png",
	position: {x: startingPoint.x, y: startingPoint.y}
});

const mapForeground = new Sprite({
	imageSrc: "./Assets/Maps/Test_map_upper_layers.png",
	position: {x: startingPoint.x, y: startingPoint.y}
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
		frameSpeed: playerFrameSpeedIdle
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
const followerImageDown = new Image();
followerImageDown.src = "./Assets/Player/playerDown.png";

const followerImageUp = new Image();
followerImageUp.src = "./Assets/Player/playerUp.png";

const followerImageLeft = new Image();
followerImageLeft.src = "./Assets/Player/playerLeft.png";

const followerImageRight = new Image();
followerImageRight.src = "./Assets/Player/playerRight.png";

const followerSprite = new Sprite({
	imageSrc: followerImageDown.src,
	frames: {
		max: 4,
		frameSpeed: playerFrameSpeedIdle
	},
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2 - 64 // starts behind player
	},
	spriteImgs: {
		down: followerImageDown,
		up: followerImageUp,
		left: followerImageLeft,
		right: followerImageRight
	}
});
const FOLLOW_DISTANCE = 64; // one tile behind / beside player

function updateFollower(direction, moveDelta) {
	// Save current position and direction image
	const oldPos = {
		x: followerSprite.position.x,
		y: followerSprite.position.y
	};
	const oldImg = followerSprite.image ;

	let newPos = { x: 0, y: 0 };
	console.log('Starting here:', followerSprite.position);

	switch (direction) {
		case 'up':
			newPos.x = playerSprite.position.x;
			newPos.y = playerSprite.position.y + FOLLOW_DISTANCE;
			followerSprite.image = followerSprite.spriteImgs.up;
			break;
		case 'down':
			newPos.x = playerSprite.position.x;
			newPos.y = playerSprite.position.y - FOLLOW_DISTANCE;
			followerSprite.image = followerSprite.spriteImgs.down;
			break;
		case 'right':
			newPos.x = playerSprite.position.x - FOLLOW_DISTANCE;
			newPos.y = playerSprite.position.y;
			followerSprite.image = followerSprite.spriteImgs.right;
			break;
		case 'left':
			newPos.x = playerSprite.position.x + FOLLOW_DISTANCE;
			newPos.y = playerSprite.position.y;
			followerSprite.image = followerSprite.spriteImgs.left;
			break;
	}

	
	// Temporarily move follower to future position
	followerSprite.position = newPos;
	
	//Compute tolerance 
	let followerSpriteTolerance = {u:followerSprite.height*2/3, d:0, l:playerPixelTolX, r:playerPixelTolX};
	
	// Collision check
	for (let i = 0; i < collisionTiles.length; i++) {
		const coll = collisionTiles[i];

		if (coll.checkCollision(followerSprite, {x:0, y:0}, followerSpriteTolerance)) {
			console.log('i should stay here:', oldPos);

			// Restore old position
			followerSprite.position = oldPos;
			followerSprite.image = oldImg;
			return;
		}
	}

	// Valid move → keep new position
	followerSprite.animate = true;
	console.log('Ending here:', followerSprite.position);
}


/* */


/* Collisions */
const collisionMap = [];
for (let i = 0; i <= (collisions.length - tileMapWidth); i += tileMapWidth){
	collisionMap.push(collisions.slice(i, i+tileMapWidth));
}

const collisionTiles = []
collisionMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if(symbol != 0)
			collisionTiles.push(
				new Collision({
					position:{x: j*tileWidth + startingPoint.x, y:i*tileHeight + startingPoint.y}, 
					width: tileWidth, 
					height: tileHeight})
		);
	})
});
/* */

/* Grass */
const grassMap = [];
for (let i = 0; i <= (grass.length - tileMapWidth); i += tileMapWidth){
	grassMap.push(grass.slice(i, i+tileMapWidth));
}

const grassTiles = []
grassMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if(symbol != 0)
			grassTiles.push(
				new Collision({
					position:{x: j*tileWidth + startingPoint.x, y:i*tileHeight + startingPoint.y}, 
					width: tileWidth, 
					height:tileHeight})
		);
	})
});
/* */

/* Main Scene Animation function */
const moveWithMapObjs = [mapBackground, mapForeground, ...collisionTiles, ...grassTiles];
const drawObjs = [mapBackground, ...collisionTiles, followerSprite, playerSprite, mapForeground];

function animateMain(){
	mapAnimationId = window.requestAnimationFrame(animateMain); //Recursive calling, to keep moving
	
	//Draw everything
	drawObjs.forEach((drawObj) => {
		drawObj.draw(context);
	});
	
	let playerSpriteTolerance = {u:playerSprite.height*2/3, d:0, l:playerPixelTolX, r:playerPixelTolX}; //Put it here to allow computations after image load
	
	//Exit if here but we're in battle
	if(isInBattle) return;
	
	let moveEn = true; 
	playerSprite.animate = false;
	followerSprite.animate = false;
	
	//Next position
	if(keys.w.pressed && (lastKey == 'w' || lastKey == 'ArrowUp')){
		
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: 0, y: 3}, playerSpriteTolerance)){
				moveEn = false;
				break;
			}
		}
		
		if (moveEn) {
			moveWithMapObjs.forEach(mov => {
				mov.position.y += 3;
			});
			updateFollower('up');
		}

		  
		playerSprite.animate = true;
		playerSprite.image = playerSprite.spriteImgs.up;

	}
	else if(keys.a.pressed && (lastKey == 'a' || lastKey == 'ArrowLeft')){
		
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: 3, y: 0}, playerSpriteTolerance)){
				moveEn = false;
				break;
			}
		}
		
		if (moveEn) {
			moveWithMapObjs.forEach(mov => {
				mov.position.x += 3;
			});
			updateFollower('left');
		}

		playerSprite.animate = true;
		playerSprite.image = playerSprite.spriteImgs.left;

	}
	else if(keys.s.pressed && (lastKey == 's' || lastKey == 'ArrowDown')){
		
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: 0, y: -3}, playerSpriteTolerance)){
				moveEn = false;
				break;
			}
		}
		
		if (moveEn) {
			moveWithMapObjs.forEach(mov => {
				mov.position.y -= 3;
			});
			updateFollower('down');
		}
		  
		playerSprite.animate = true;
		playerSprite.image = playerSprite.spriteImgs.down;

	}
	else if(keys.d.pressed && (lastKey == 'd' || lastKey == 'ArrowRight')){
		
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: -3, y: 0}, playerSpriteTolerance)){
				moveEn = false;
				break;
			}
		}
		
		if (moveEn) {
			moveWithMapObjs.forEach(mov => {
				mov.position.x -= 3;
			});
			updateFollower('right');
		}
		  
		playerSprite.animate = true;
		playerSprite.image = playerSprite.spriteImgs.right;
	}
	
	//Add check for grass battle, only if we moved
	if(playerSprite.animate){
		for(let i = 0; i < grassTiles.length; i++){
			const patch = grassTiles[i];
			if(patch.checkCollision(playerSprite,{x: 0, y: 0}, playerSpriteTolerance) &&
				patch.checkOverlapArea(playerSprite) > battleTriggerArea
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