console.log('Olà, bellezza');

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
		case 'Enter':
			keys.enter.pressed = true;
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
		case 'Enter':
			keys.enter.pressed = true;
		break;
		default:
		break;
	}
}); //Player response upon key releasing

addEventListener('click', () => {
	if(!clicked4AudioStart){
		audio.mapBGM.play();
		clicked4AudioStart = true;
	}
});
/* */

// Starting call
//initGame();
initBattle({random: true});


