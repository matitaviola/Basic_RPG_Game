//TODO
function animateIntro(){
	introAnimationId = window.requestAnimationFrame(animateIntro); //Recursive calling, to keep moving
	/*Show Menu */
		/* Animation */
		/* */
	/* */
}

function initGame(){
	document.getElementById('introDiv').addEventListener('click', () => {
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
	});
	//Set the new gamestate
	gamestate = G_S.INTRO;
	
	/* show div */
	animateIntro();
}