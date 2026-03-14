/* Map Sources */
/*
The map files should be stored in the /Maps folder.
The data file should be named NAME_map, where NAME is the string put as an entry of the 'maps' const of this file.
The pre-warp function must return a gsap timeline.
The warp's dest-rep are the (col, row) coordinates of TILED's "landing" tile, multiplied by -TILE_WIDTH/HEIGHT
The data file should follow this struct:
cons NAME_map = {
	starting_point_x, //default starting point x
	starting_point_y, //default starting point y
	width,
	height,
	base: new Sprite({
		imageSrc: "./Assets/Maps/NAME_base.png",
		position: {x, y} //x and y must equal the position (respectively times -1*TILE_WIDTH -1*TILE_HEIGHT) of the first tile (upper-left) that has to show up on screen, not the desired player position
	}),
	upper: new Sprite({
		imageSrc: "./Assets/Maps/NAME_upper.png",
		position: {x, y}
	}),
	bgm,
	collisions: [...],
	warps:[
			//{position:, width:, height:, destMapid:, destRepos:, preWarpCbk:function(){...}, postWarpCbk:function(){...}}
			...
		]
} 
*/

/* Change Map */
function changeMap(mapId, mapRepositioning, loadedCbk){
	
	let loadedMap = loadedMaps.get(mapId);
	
	if(loadedMap != null){
		currentMap = loadedMap;
		freshMap(mapId, mapRepositioning);
		
		if(loadedCbk != null)
			loadedCbk();
	}
	else{
		const scriptSrc = "./Data/Maps/" + mapId +'_map.js';
		loadScript(scriptSrc, () => {
			currentMap = eval(mapId + "_map");
			loadedMaps.set(mapId, currentMap);
			
			freshMap(mapId, mapRepositioning);
			
			if(loadedCbk != null)
				loadedCbk();
		});
	}
}

/* LoadFromSave*/
function mapFromSave(mapId, deltaPos){
	const scriptSrc = "./Data/Maps/" + mapId +'_map.js';
	loadScript(scriptSrc, () => {
		currentMap = eval(mapId + "_map");
		loadedMaps.set(mapId, currentMap);
		
		let recompPos = {
			x: currentMap.starting_point_x - deltaPos.x,
			y: currentMap.starting_point_y - deltaPos.y
		}
		freshMap(mapId, recompPos);
	});
}

/* New fresh map */
function freshMap(mapId, mapRepositioning){

	//Reset map to default positions
	currentMap.base.position.x = currentMap.starting_point_x;
	currentMap.base.position.y = currentMap.starting_point_y;
	currentMap.upper.position.x = currentMap.starting_point_x;
	currentMap.upper.position.y = currentMap.starting_point_y;
	
	//Load collisions and warps
	createCollisions(currentMap);
	loadWarps(currentMap);
	
	//Clean and refill object arrays
	moveWithMapObjs.length = 0;
	moveWithMapObjs.push(currentMap.base, currentMap.upper, ...collisionBlocks, ...warpsList);
	drawObjs.length = 0;
	drawObjs.push(currentMap.base, playerSprite, currentMap.upper);
	
	//If the mapRepositioning info were passed:
	if(mapRepositioning){
		const delta_x = mapRepositioning.x - currentMap.starting_point_x;
		const delta_y = mapRepositioning.y - currentMap.starting_point_y;
		moveWithMapObjs.forEach(mov => {
			mov.position.x += delta_x;
			mov.position.y += delta_y;
		});
		mapMovedPos = {x: delta_x, y:delta_y};
	}
	else{
		mapMovedPos = {x:0, y:0};
	}
	
	//Update current map id:
	currMapId = mapId;
	
	//Play bgm
	const bgm = currentMap.bgm;
	eval('audio.' + bgm + '.play();');
}

/* Create collision for the new map*/
function createCollisions(map){
	//Clean collisionBlocks
	collisionBlocks.length = 0;
	
	const collisionMap = [];
	for (let i = 0; i <= (map.collisions.length - map.width); i += map.width){
		collisionMap.push(map.collisions.slice(i, i+map.width));
	}
	
	collisionMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if(symbol != 0)
			collisionBlocks.push(
				new Collision({
					position:{x: j*TILE_WIDTH + map.starting_point_x, y:i*TILE_HEIGHT + map.starting_point_y}, 
					width: TILE_WIDTH, 
					height: TILE_HEIGHT})
		);
	})
	
});
}

/* Load warps for the new map*/
function loadWarps(map){
	//Clean warps
	warpsList.length = 0;
	if (map.warps?.length <=0)
		return;
	map.warps.forEach((w) => {
			warpsList.push(
				new Warp({
					position:{x: w.position.x*TILE_WIDTH + map.starting_point_x, y:w.position.y*TILE_HEIGHT + map.starting_point_y}, 
					width: w.width, 
					height: w.height,
					destMapId: w.destMapId,
					destRepos: w.destRepos,
					preWarpCbk: w.preWarpCbk,
					postWarpCbk: w.postWarpCbk
				})
			)
	});
}

/* Manage map visual connection */
function mapConnectionMngr(){
	
	if(currentMap == null)
		return;
	
	let canW = canvas.width;
	let canH = canvas.height;
	let mapW = currentMap.width * TILE_WIDTH;
	let mapH = currentMap.height * TILE_HEIGHT;
	let moveX = currentMap.base.position.x;
	let moveY = currentMap.base.position.y;
	
	//Sx
	if(moveX > 0){
		console.log('out sx');
		fillBorder(0,0, moveX, canH);
	}
	//Dx
	if(canW > mapW + moveX){
		console.log('out dx')
		fillBorder(canW - (mapW + moveX),0, mapW + moveX, canH);
	}
	//Up
	if(moveY > 0){
		console.log('out up')
		fillBorder(0, 0, canW, moveY);
	}
	//Dw
	if(canH > mapH + moveY){
		console.log('out dw')
		fillBorder(0, canH - (mapH + moveY), canW, mapH + moveY);
	}
}

function fillBorder(x,y,width, height){
	context.fillStyle = 'black';
	context.fillRect(x, y, width, height);
}	
	
/* Function Movements */
function movePos(){
	
	let moveEn = true; 
	let warped = false;
	let playerSpriteTolerance = {u:playerSprite.height*2/3, d:0, l:PLAYER_PIXEL_TOL_X, r:PLAYER_PIXEL_TOL_X}; //Put it here to allow computations after image load
	
	//Next position
	if(keys.w.pressed && (lastKey == 'w' || lastKey == 'ArrowUp')){
		
		//First we check if we are going to warp:
		for(let i = 0; i < warpsList.length; i++ ){
			const w = warpsList[i];
			if(w.checkCollision(playerSprite, {x: 0, y: MOVEMENT_PIXELS}, playerSpriteTolerance)){
				warped = true;
				w.warp();
				break;
			}
		}
		
		if(!warped){
			for(let i = 0; i < collisionBlocks.length; i++){
				const coll = collisionBlocks[i];
				if(coll.checkCollision(playerSprite,{x: 0, y: MOVEMENT_PIXELS}, playerSpriteTolerance)){
					moveEn = false;
					break;
				}
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
		
		//Update global reposition to store in memory and reload
		mapMovedPos.y += MOVEMENT_PIXELS;

	}
	else if(keys.a.pressed && (lastKey == 'a' || lastKey == 'ArrowLeft')){
		
		//First we check if we are going to warp:
		for(let i = 0; i < warpsList.length; i++ ){
			const w = warpsList[i];
			if(w.checkCollision(playerSprite, {x: MOVEMENT_PIXELS, y: 0}, playerSpriteTolerance)){
				warped = true;
				w.warp();
				break;
			}
		}
		
		if(!warped){
			for(let i = 0; i < collisionBlocks.length; i++){
				const coll = collisionBlocks[i];
				if(coll.checkCollision(playerSprite,{x: MOVEMENT_PIXELS, y: 0}, playerSpriteTolerance)){
					moveEn = false;
					break;
				}
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
		
		//Update global reposition to store in memory and reload
		mapMovedPos.x += MOVEMENT_PIXELS;

	}
	else if(keys.s.pressed && (lastKey == 's' || lastKey == 'ArrowDown')){
		
		//First we check if we are going to warp:
		for(let i = 0; i < warpsList.length; i++ ){
			const w = warpsList[i];
			if(w.checkCollision(playerSprite, {x: 0, y: -MOVEMENT_PIXELS}, playerSpriteTolerance)){
				warped = true;
				w.warp();
				break;
			}
		}
		
		if(!warped){
			for(let i = 0; i < collisionBlocks.length; i++){
				const coll = collisionBlocks[i];
				if(coll.checkCollision(playerSprite,{x: 0, y: -MOVEMENT_PIXELS}, playerSpriteTolerance)){
					moveEn = false;
					break;
				}
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
		
		//Update global reposition to store in memory and reload
		mapMovedPos.y -= MOVEMENT_PIXELS;

	}
	else if(keys.d.pressed && (lastKey == 'd' || lastKey == 'ArrowRight')){
		
		//First we check if we are going to warp:
		for(let i = 0; i < warpsList.length; i++ ){
			const w = warpsList[i];
			if(w.checkCollision(playerSprite, {x: -MOVEMENT_PIXELS, y: 0}, playerSpriteTolerance)){
				warped = true;
				w.warp();
				break;
			}
		}
		
		if(!warped){
			for(let i = 0; i < collisionBlocks.length; i++){
				const coll = collisionBlocks[i];
				if(coll.checkCollision(playerSprite,{x: -MOVEMENT_PIXELS, y: 0}, playerSpriteTolerance)){
					moveEn = false;
					break;
				}
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
		
		//Update global reposition to store in memory and reload
		mapMovedPos.x -= MOVEMENT_PIXELS;
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
		overlap.innerHTML = '<h1>Buon primo anniversario,</h1><br><h1>Amore</h1>';
		
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

/* Main Scene Animation function */
function animateMain(){
	mapAnimationId = window.requestAnimationFrame(animateMain); //Recursive calling, to keep moving
	
	mapConnectionMngr();
	//Draw everything	
	drawObjs.forEach((drawObj) => {
		drawObj.draw(context);
	});
	
	/* TODO: remove, only for testing purposes
	warpsList.forEach((w) => {
		w.drawColor(context, 'purple');
	});
	
	collisionBlocks.forEach((w) => {
		w.drawColor(context, 'red');
	});
	*/
	
	//Exit if here but we're in battle or dialog
	if(gamestate == G_S.BATTLE) 
		return;
	
	if(gamestate == G_S.END)
		goodEndingScene();
	
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
		if (keys.space.pressed) {
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
		else {
			movePos();
		}
	}
}