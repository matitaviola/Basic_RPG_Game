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
const playerPixelTol = 5; //Player size pixel tolerance
const playerUpperImgHeithPx = 30;
const playerFrameSpeedIdle = 10; // 1 frame change every X executions
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
const playerImageBaseDown = new Image();
playerImageBaseDown.src = "./Assets/Player/playerDownLower.png";
const playerImageBaseUp = new Image();
playerImageBaseUp.src = "./Assets/Player/playerUpLower.png";
const playerImageBaseLeft = new Image();
playerImageBaseLeft.src = "./Assets/Player/playerLeftLower.png";
const playerImageBaseRight = new Image();
playerImageBaseRight.src = "./Assets/Player/playerRightLower.png";
const playerSpriteBase = new Sprite({
	image: playerImageBaseDown,
	frames: {max:4, frameSpeed:playerFrameSpeedIdle},
	position: {x: canvas.width/2, y:canvas.height/2},
	pixelTolerance: playerPixelTol,
	spriteImgs:{
		down: playerImageBaseDown,
		up: playerImageBaseUp,
		left:playerImageBaseLeft,
		right: playerImageBaseRight
	}
});

const playerImageUpperDown = new Image();
playerImageUpperDown.src = "./Assets/Player/playerDownUpper.png";
const playerImageUpperUp = new Image();
playerImageUpperUp.src = "./Assets/Player/playerUpUpper.png";
const playerImageUpperLeft = new Image();
playerImageUpperLeft.src = "./Assets/Player/playerLeftUpper.png";
const playerImageUpperRight = new Image();
playerImageUpperRight.src = "./Assets/Player/playerRightUpper.png";
const playerSpriteUpper = new Sprite({
	image: playerImageUpperDown,
	frames: {max:4, frameSpeed:playerFrameSpeedIdle},
	position: {x: canvas.width/2, y:canvas.height/2 - playerUpperImgHeithPx},
	spriteImgs:{
		down: playerImageUpperDown,
		up: playerImageUpperUp,
		left:playerImageUpperLeft,
		right: playerImageUpperRight
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

/* Animation function */
const testColl = new Collision({position:{x:canvas.width/2 - 100, y:canvas.height/2}, height:60, width:60})
const moveWithMapObjs = [mapBackground, mapForeground, ...collisionTiles];
function animateLoop(){
	let moveEn = true; //This should be actually given by the speed;
	window.requestAnimationFrame(animateLoop); //Recursive calling, to keep moving
	
	//Draws the map once the asset is loaded in memory
	mapBackground.draw(context);
	
	//Draw collision Tiles
	collisionTiles.forEach((coll) => {
		coll.draw(context);
	});
	
	
	//Draws the player after the map
	playerSpriteBase.draw(context);
	playerSpriteUpper.draw(context);
		
	//Draws the upper layers once the asset is loaded in memory
	mapForeground.draw(context);

	//Next position
	playerSpriteBase.isMoving = false;
	playerSpriteUpper.isMoving = false;
	if(keys.w.pressed && lastKey == 'w'){
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSpriteBase,{x: 0, y: 3}))
				{
				moveEn = false;
				break;
			}
		}
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.y += 3;
		  })
		  
		playerSpriteBase.isMoving = true;
		playerSpriteBase.image = playerSpriteBase.spriteImgs.up;
		playerSpriteUpper.isMoving = true;
		playerSpriteUpper.image = playerSpriteUpper.spriteImgs.up;
		
	}
	else if(keys.a.pressed && lastKey == 'a'){
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSpriteBase,{x: 3, y: 0}))
			{
				moveEn = false;
				break;
			}
		}
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.x += 3;
		  })
		
		playerSpriteBase.isMoving = true;
		playerSpriteBase.image = playerSpriteBase.spriteImgs.left;
		playerSpriteUpper.isMoving = true;
		playerSpriteUpper.image = playerSpriteUpper.spriteImgs.left;
	}
	else if(keys.s.pressed && lastKey == 's'){
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSpriteBase,{x: 0, y: -3}))
				{
				moveEn = false;
				break;
			}
		}
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.y -= 3;
		  })
		  
		playerSpriteBase.isMoving = true;
		playerSpriteBase.image = playerSpriteBase.spriteImgs.down;
		playerSpriteUpper.isMoving = true;
		playerSpriteUpper.image = playerSpriteUpper.spriteImgs.down;
	}
	else if(keys.d.pressed && lastKey == 'd'){
		for(let i = 0; i < collisionTiles.length; i++){
			const coll = collisionTiles[i];
			if(coll.checkCollision(playerSpriteBase,{x: -3, y: 0}))
			{
				moveEn = false;
				break;
			}
		}
		if (moveEn)
		  moveWithMapObjs.forEach((mov) => {
			mov.position.x -= 3;
		  })
		  
		playerSpriteBase.isMoving = true;
		playerSpriteBase.image = playerSpriteBase.spriteImgs.right;
		playerSpriteUpper.isMoving = true;
		playerSpriteUpper.image = playerSpriteUpper.spriteImgs.right;

	}
}
animateLoop(); //First call


