//TODO
function startGame(){
	if(!clicked4AudioStart){
		audio.mapBGM.play();
		clicked4AudioStart = true;
	}
		
	document.getElementById('introDiv').style.display = 'none';
	window.cancelAnimationFrame(introAnimationId); //Stops current loop
	
	//Set the new gamestate
	gamestate = G_S.MAP;

	//Start map
	animateMain();
}

function initGame(){
	document.getElementById('introButton').addEventListener('click', () => {
		if(gamestate == G_S.INTRO)
			startGame();
	});
	
	document.getElementById('loadStateBtn').addEventListener('click', () => {
		document.getElementById("fileInput").click();
	});
	
	document.getElementById("fileInput").addEventListener("change", (e) => {
		if(gamestate == G_S.INTRO){
			const file = e.target.files[0];
			if (!file) return;
			
			loadSaveFile(file);
			
			startGame();
		}
	});
	
	//Fill object arrays
	moveWithMapObjs.push(mapBackground, mapForeground, ...collisionBlocks);
	drawObjs.push(mapBackground, playerSprite, mapForeground);
	
	//Set the new gamestate
	gamestate = G_S.INTRO;

}