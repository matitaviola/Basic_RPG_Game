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
		],
	connections:[
		{dir:'sx', map:'coast', off:2} //off:2 significa che la mappa verrà diseganta 2 tiles più in alto di quella corrente se sx/dx, 2 più verso destra se in up/dw
		...
	]
} 
*/

/* Change Map */
function changeMap(mapId, mapRepositioning, loadedCbk){
	
	let loadedMap = loadedMaps.get(mapId);
	
	if(loadedMap != null){
		currentMap = loadedMap;
		
		//Load neighbouring maps, but not their objects
		if(currentMap.connections.length > 0){
			currentMap.connections.forEach(c => {
				if(loadedMaps.get(c.map) == null){
					scriptSrc = "./Data/Maps/" + c.map +'_map.js';
					loadScript(scriptSrc, () => {
						let mapObj = eval(c.map + "_map");
						loadedMaps.set(c.map, mapObj);
					});
				}
			});
		}
		
		//fresh map objects		
		freshMap(mapId, mapRepositioning);
		
		if(loadedCbk != null)
			loadedCbk();
	}
	else{
		let scriptSrc = "./Data/Maps/" + mapId +'_map.js';
		loadScript(scriptSrc, () => {
			currentMap = eval(mapId + "_map");
			loadedMaps.set(mapId, currentMap);
			
			//Load neighbouring maps, but not their objects
			if(currentMap.connections.length > 0){
				currentMap.connections.forEach(c => {
					if(loadedMaps.get(c.map) == null){
						scriptSrc = "./Data/Maps/" + c.map +'_map.js';
						loadScript(scriptSrc, () => {
							let mapObj = eval(c.map + "_map");
							loadedMaps.set(c.map, mapObj);
						});
					}
				});
			}
			//fresh map objects
			freshMap(mapId, mapRepositioning);
			
			if(loadedCbk != null)
				loadedCbk();
		});
	}
}

/* LoadFromSave*/
function mapFromSave(mapId, deltaPos){
	let scriptSrc = "./Data/Maps/" + mapId +'_map.js';
	loadScript(scriptSrc, () => {
		
		currentMap = eval(mapId + "_map");
		loadedMaps.set(mapId, currentMap);
		
		//Load neighbouring maps, but not their objects
		if(currentMap.connections.length > 0){
			currentMap.connections.forEach(c => {
				if(loadedMaps.get(c.map) == null){
					scriptSrc = "./Data/Maps/" + c.map +'_map.js';
					loadScript(scriptSrc, () => {
						let mapObj = eval(c.map + "_map");
						loadedMaps.set(c.map, mapObj);
					});
				}
			});
		}
			
		//fresh map objects
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
	let connectedMaps = [];
	
	//Sx
	if(moveX > 0){
		let sx = currentMap.connections.find(o => o.dir == 'sx');
		if(sx != null){					
					
			let mapSx = loadedMaps.get(sx.map);
			if(mapSx){
				context.drawImage(
					mapSx.base.image, 
					moveX - mapSx.base.image.width, 
					moveY - sx.off*TILE_HEIGHT
				);
				context.drawImage(
					mapSx.upper.image, 
					moveX - mapSx.upper.image.width, 
					moveY - sx.off*TILE_HEIGHT
				);
				
				//Add to list for the out-of-border fill
				connectedMaps.push({
					x: moveX - mapSx.base.image.width, //start x
					y: moveY - sx.off*TILE_HEIGHT, //start y
					w: mapSx.base.image.width,
					h: mapSx.base.image.height
				});
				//Check to change the Map
				if(moveX > canW/2){
					changeMap(sx.map, {x:moveX - mapSx.upper.image.width, y: moveY - sx.off*TILE_HEIGHT});
				}
			}
		}
		
	}
	//Dx
	if(canW > mapW + moveX){
		let dx = currentMap.connections.find(o => o.dir == 'dx');
		if(dx != null){
			
			let mapDx = loadedMaps.get(dx.map);
			if(mapDx){
				context.drawImage(
					mapDx.base.image, 
					mapW + moveX, 
					moveY - dx.off*TILE_HEIGHT
				);
				context.drawImage(
					mapDx.upper.image, 
					mapW + moveX, 
					moveY - dx.off*TILE_HEIGHT
				);
				connectedMaps.push({
					x: mapW + moveX,
					y: moveY - dx.off * TILE_HEIGHT,
					w: mapDx.base.image.width,
					h: mapDx.base.image.height
				});
				if(canW/2 > mapW + moveX){
					changeMap(dx.map, {x:mapW + moveX, 
					y:moveY - dx.off*TILE_HEIGHT});
				}
			}
		}
		
	}
	//Up
	if(moveY > 0){
		let up = currentMap.connections.find(o => o.dir == 'up');
		if(up != null){
			
			let mapUp = loadedMaps.get(up.map);
			if(mapUp){
				context.drawImage(
					mapUp.base.image, 
					moveX + up.off*TILE_WIDTH, 
					moveY - mapUp.base.image.height, 
				);
				context.drawImage(
					mapUp.upper.image, 
					moveX + up.off*TILE_WIDTH, 
					moveY - mapUp.upper.image.height, 
				);
				connectedMaps.push({
					x: moveX + up.off * TILE_WIDTH,
					y: moveY - mapUp.base.image.height,
					w: mapUp.base.image.width,
					h: mapUp.base.image.height
				});
				
				//Check to change the Map
				if(moveY > canH/2){
					changeMap(up.map, {x: moveX + up.off*TILE_WIDTH, y: moveY - mapUp.upper.image.height});
				}
			}
		}
		
	}
	//Dw
	if(canH > mapH + moveY){
		let dw = currentMap.connections.find(o => o.dir == 'dw');
		if(dw != null){
			
			let mapDw = loadedMaps.get(dw.map);
			if(mapDw){
				context.drawImage(
					mapDw.base.image, 
					moveX + dw.off*TILE_WIDTH, 
					mapH + moveY
				);
				context.drawImage(
					mapDw.upper.image, 
					moveX + dw.off*TILE_WIDTH, 
					mapH + moveY
				);
				connectedMaps.push({
					x: moveX + dw.off * TILE_WIDTH,
					y: mapH + moveY,
					w: mapDw.base.image.width,
					h: mapDw.base.image.height
				});
				
				//Check to change the Map
				if(canH/2 > mapH + moveY){
					changeMap(dw.map, {x: moveX + dw.off*TILE_WIDTH, y: mapH + moveY});
				}
			}
		}
		
	}
	
	//fill the out-of-map 
	fillBorder(canW,canH,moveX,moveY,mapW,mapH,connectedMaps);
		
}

function fillBorder(canW, canH, moveX, moveY, mapW, mapH, connectedMaps){
	//Fill the following regions
	/*
	Screen:
	1|	2 	|3
	----------
	4| Map	|5
	----------
	6|	7	|8
	*/
	const regions = [
		{x:0, y:0, w:moveX, h:moveY}, //1
		{x:moveX, y:0, w:mapW, h:moveY}, //2
        {x:moveX+mapW, y:0, w:canW-(moveX+mapW), h:moveY},  //3
        {x:0, y:moveY, w:moveX, h:mapH},  //4
        {x:moveX+mapW, y:moveY, w:canW-(moveX+mapW), h:mapH},  //5
        {x:0, y:moveY+mapH, w:moveX, h:canH-(moveY+mapH)},  //6
        {x:moveX, y:moveY+mapH, w:mapW, h:canH-(moveY+mapH)},  //7
        {x:moveX+mapW, y:moveY+mapH, w:canW-(moveX+mapW), h:canH-(moveY+mapH)} //8
	]
	
	//For each region, divide the region into parts, depending on the maps' parts appearing in the region
	regions.forEach(r =>{
		
		let parts = [r]; //Start with the whole region;
		
		connectedMaps.forEach(cm => {
			let newParts = [];
			
			//remove from the part every bit that is occupied by a map
			parts.forEach(p => {
				newParts.push(...subtractRect(p, cm));
			});
			
			//store the newfound parts
			parts = newParts;
		});
		
		//Fill evary found part
		parts.forEach(p => fillWithColor("white",p.x,p.y,p.w,p.h));
	});
}

//Returns the subrectangles of a given part minus the intersection with a Map
function subtractRect(region, overlapper){
	const iR = intersectRect(region, overlapper); //intersected rectangle
	
	if (!iR)
		return [region]; //if no intersection has been found, the whole area will be returned and filled
	
	const parts = [];
	
	//Top 
	if(iR.y > region.y)
		parts.push({
			x: region.x,
			y: region.y,
			w: region.w,
			h: iR.y - region.y
		});
		
	//Bottom
	if(iR.y + iR.h < region.y + region.h)
		parts.push({
			x: region.x,
			y: iR.y + iR.h,
			w: region.w,
			h: region.y + region.h - (iR.y+iR.h)
		});
		
	//Left
	if(iR.x > region.x)
		parts.push({
			x: region.x,
			y: iR.y,
			w: iR.x - region.x,
			h: iR.h
		});
	
	//Left
	if(iR.x + iR.w < region.x + region.w)
		parts.push({
			x: iR.x + iR.w,
			y: iR.y,
			w: region.x + region.w - (iR.x + iR.w),
			h: iR.h
		});
		
	return parts;
}

//Returns the rectangle that is the intersection of the two passed
function intersectRect(rect1, rect2){
	const x = Math.max(rect1.x, rect2.x); //X più grande
	const y = Math.max(rect1.y, rect2.y);
	const k = Math.min(rect1.x + rect1.w, rect2.x + rect2.w); //minima X+length raggiunta
	const j = Math.min(rect1.y + rect1.h, rect2.y + rect2.h);
	
	if(k <= x || j <= y) //se la minima x/y+length non arriva alla max, vuol dire che non ho intersezioni
		return null;
	
	return {x: x, y: y, w: k-x, h: j-y};
	
}

//Fill a rectangle with the given colour
function fillWithColor(color, x,y,width, height){
	context.fillStyle = color;
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
	
	
	//Draw everything
	mapConnectionMngr();
	drawObjs.forEach((drawObj) => {
		drawObj.draw(context);
	});
	
	/* TODO: remove, only for testing purposes
	warpsList.forEach((w) => {
		w.drawColor(context, 'purple');
	});
	*/
	collisionBlocks.forEach((w) => {
		w.drawColor(context, 'red');
	});
	/**/
	
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