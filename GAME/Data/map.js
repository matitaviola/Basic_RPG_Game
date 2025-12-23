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
const drawObjs = [mapBackground, ...collisionTiles, playerSprite, mapForeground];

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
	
	//Next position
	if(keys.w.pressed && lastKey == 'w'){
		
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: 0, y: 3}, playerSpriteTolerance)){
				moveEn = false;
				break;
			}
		}
		
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.y += 3;
		  })
		  
		playerSprite.animate = true;
		playerSprite.image = playerSprite.spriteImgs.up;

	}
	else if(keys.a.pressed && lastKey == 'a'){
		
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: 3, y: 0}, playerSpriteTolerance)){
				moveEn = false;
				break;
			}
		}
		
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.x += 3;
		  })
		
		playerSprite.animate = true;
		playerSprite.image = playerSprite.spriteImgs.left;

	}
	else if(keys.s.pressed && lastKey == 's'){
		
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: 0, y: -3}, playerSpriteTolerance)){
				moveEn = false;
				break;
			}
		}
		
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.y -= 3;
		  })
		  
		playerSprite.animate = true;
		playerSprite.image = playerSprite.spriteImgs.down;

	}
	else if(keys.d.pressed && lastKey == 'd'){
		
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: -3, y: 0}, playerSpriteTolerance)){
				moveEn = false;
				break;
			}
		}
		
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.x -= 3;
		  })
		  
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