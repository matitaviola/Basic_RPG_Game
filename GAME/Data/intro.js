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
		//TODO: rimetti questo e togli battle animateMain();
		initBattle({random: true});
		console.log('in main');
	});
	/* show div */
	animateIntro();
}