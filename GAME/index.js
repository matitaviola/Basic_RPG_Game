console.log('Olà, bellezza');

window.addEventListener('keydown', (ev) => {
	switch(ev.key){
		case 'w':
		case 'ArrowUp':
			keys.w.pressed = true;
		break;
		case 'a':
		case 'ArrowLeft':
			keys.a.pressed = true;
		break;
		case 's':
		case 'ArrowDown':
			keys.s.pressed = true;
		break;
		case 'd':
		case 'ArrowRight':
			keys.d.pressed = true;
		break;
		case 'Enter':
			keys.enter.pressed = true;
			if(gamestate == G_S.MAP){
				gamestate = G_S.MENU;
				document.querySelector('.main-menu').style.display = 'flex';
			}
			else if(gamestate == G_S.MENU){
				gamestate = G_S.MAP;
				document.querySelector('.main-menu').style.display = 'none';
				resetMenu();
			}
		break;
		case ' ':
			keys.space.pressed = true;
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
		case 'ArrowUp':
			keys.w.pressed = false;
		break;
		case 'a':
		case 'ArrowLeft':
			keys.a.pressed = false;
		break;
		case 's':
		case 'ArrowDown':
			keys.s.pressed = false;
		break;
		case 'd':
		case 'ArrowRight':
		case 'z':
			keys.d.pressed = false;
		break;
		case 'Enter':
			keys.enter.pressed = false;
		break;
		case ' ':
			keys.space.pressed = false;
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
initGame();


