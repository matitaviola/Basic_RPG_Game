console.log('Olà, bellezza');

/* Constants */
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const tileMapWidth = 40; //Number of tile block of the map on Tiled
const tileMapHeight = 40;
const tileWidth = 16*4; //Tile size pixel * zoom%
const tileHeight = 16*4;
const startingPoint = {x:-1475, y:-350};
const playerPixelTolX = 4; //Player size pixel tolerance on X axys
const playerFrameSpeedIdle = 10; // 1 frame change every X executions
const battleTriggerArea = 100; // Size of overlapping area on grass to trigegr battle
/* */

/* Render map */
const mapImage = new Image();
mapImage.src = "./Assets/Maps/Test_map.png";
const mapBackground = new Sprite({
	image: mapImage,
	position: {x: startingPoint.x, y: startingPoint.y}
});

const upperLayers = new Image();
upperLayers.src = "./Assets/Maps/Test_map_upper_layers.png";
const mapForeground = new Sprite({
	image: upperLayers,
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
	image: playerImageDown,
	frames: {max:4, frameSpeed:playerFrameSpeedIdle},
	position: {x: canvas.width/2, y:canvas.height/2},
	spriteImgs:{
		down: playerImageDown,
		up: playerImageUp,
		left:playerImageLeft,
		right: playerImageRight
	}
});


/* */

/* Collisions */
//Load collision points
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
					height:tileHeight})
		);
	})
});

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

/* Key Event*/
let keys = {
	w: {pressed: false},
	a: {pressed: false},
	s: {pressed: false},
	d: {pressed: false}
}
let lastKey;

window.addEventListener('keydown', (ev) => {
	switch(ev.key){
		case 'w':
			keys.w.pressed = true;
		break;
		case 'a':
			keys.a.pressed = true;
		break;
		case 's':
			keys.s.pressed = true;
		break;
		case 'd':
			keys.d.pressed = true;
		break;
		default:
			console.log("Wrong button");
		break;
	}
	lastKey = ev.key;
}); //Player response upon key pressing, 'ev' is the event to read the key
window.addEventListener('keyup', (ev) => {
	switch(ev.key){
		case 'w':
			keys.w.pressed = false;
		break;
		case 'a':
			keys.a.pressed = false;
		break;
		case 's':
			keys.s.pressed = false;
		break;
		case 'd':
			keys.d.pressed = false;
		break;
		default:
		break;
	}
}); //Player response upon key releasing
/* */

/* Main Scene Animation function */
const testColl = new Collision({position:{x:canvas.width/2 - 100, y:canvas.height/2}, height:60, width:60})
const moveWithMapObjs = [mapBackground, mapForeground, ...collisionTiles, ...grassTiles];
function animateMain(){
	let moveEn = true; //This should be actually given by the speed;
	let playerSpriteTolerance = {u:playerSprite.height*2/3, d:0, l:playerPixelTolX, r:playerPixelTolX}; //Put it here to allow computations after image load
	const animationId = window.requestAnimationFrame(animateMain); //Recursive calling, to keep moving
	
	//Draws the map once the asset is loaded in memory
	mapBackground.draw(context);
	
	//Draw collision Tiles
	collisionTiles.forEach((coll) => {
		coll.draw(context);
	});
	
	
	//Draws the player after the map
	playerSprite.draw(context);
	
	//Draws the upper layers once the asset is loaded in memory
	mapForeground.draw(context);

	//Next position
	playerSprite.isMoving = false;
	if(keys.w.pressed && lastKey == 'w'){
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: 0, y: 3}, playerSpriteTolerance))
				{
				moveEn = false;
				break;
			}
		}
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.y += 3;
		  })
		  
		playerSprite.isMoving = true;
		playerSprite.image = playerSprite.spriteImgs.up;

	}
	else if(keys.a.pressed && lastKey == 'a'){
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: 3, y: 0}, playerSpriteTolerance))
			{
				moveEn = false;
				break;
			}
		}
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.x += 3;
		  })
		
		playerSprite.isMoving = true;
		playerSprite.image = playerSprite.spriteImgs.left;

	}
	else if(keys.s.pressed && lastKey == 's'){
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: 0, y: -3}, playerSpriteTolerance))
				{
				moveEn = false;
				break;
			}
		}
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.y -= 3;
		  })
		  
		playerSprite.isMoving = true;
		playerSprite.image = playerSprite.spriteImgs.down;

	}
	else if(keys.d.pressed && lastKey == 'd'){
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSprite,{x: -3, y: 0}, playerSpriteTolerance))
			{
				moveEn = false;
				break;
			}
		}
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.x -= 3;
		  })
		  
		playerSprite.isMoving = true;
		playerSprite.image = playerSprite.spriteImgs.right;
	}
	
	//Add check for grass battle, only if we moved
	if(playerSprite.isMoving){
		for(let i = 0; i < grassTiles.length; i++){
			const patch = grassTiles[i];
			if(patch.checkCollision(playerSprite,{x: 0, y: 0}, playerSpriteTolerance) &&
				patch.checkOverlapArea(playerSprite) > battleTriggerArea
				&& Math.random() < 0.1) //Add randomicity to encounter
			{
				console.log('Battle!');
				window.cancelAnimationFrame(animationId); //Stops current loop
				gsap.to('#battleOverlap',{
					opacity: 1,
					repeat:3,
					yoyo: true,
					duration: 0.5,
					onComplete() {
						gsap.to('#battleOverlap', {
							opacity: 1, 
							duration: 0.2,
							onComplete(){
								animateBattle();
								}
							});
					}
					});
				break;
			}
		}
	}
}
animateMain(); //First call

/*	Battle Scene Animation function */
function animateBattle(){
	const animationId = window.requestAnimationFrame(animateBattle); //Recursive calling, to keep moving
	console.log('Battling!');
}