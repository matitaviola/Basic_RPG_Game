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
	playerSprite.animate = false;
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
		  
		playerSprite.animate = true;
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
		
		playerSprite.animate = true;
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
		  
		playerSprite.animate = true;
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
		  
		playerSprite.animate = true;
		playerSprite.image = playerSprite.spriteImgs.right;
	}
	
	//Add check for grass battle, only if we moved
	if(playerSprite.animate){
		for(let i = 0; i < grassTiles.length; i++){
			const patch = grassTiles[i];
			if(patch.checkCollision(playerSprite,{x: 0, y: 0}, playerSpriteTolerance) &&
				patch.checkOverlapArea(playerSprite) > battleTriggerArea
				&& Math.random() < 0.1) //Add randomicity to encounter
			{
				console.log('Battle!');
				window.cancelAnimationFrame(animationId); //Stops current loop
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