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
		gsap.to('.battle-overlap',{
			opacity: 1,
			repeat:3,
			yoyo: true,
			duration: 0.5,
			onComplete() {
					animateMain();
					console.log('in main');
				}
			});
	});
	/* show div */
	animateIntro();
}