function startGame(){
	
	document.getElementById('introDiv').style.display = 'none';
	//Set the new gamestate
	gamestate = G_S.MAP;

	//Start map
	animateMain();
}

function initGame(){
	document.getElementById('introButton').addEventListener('click', () => {
		if(gamestate == G_S.INTRO){
			changeMap(0);
			startGame();
		}
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

	//Set the new gamestate
	gamestate = G_S.INTRO;

}