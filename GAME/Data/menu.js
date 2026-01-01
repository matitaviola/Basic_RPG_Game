const optionsInfo = ['These are the controls', 'These are the settings', 'These are the Game Info', 'These are the credits due']; 

function resetMenu(){
	document.querySelectorAll('.main-menu h2').forEach(txt => txt.innerText = 'Select an option');
	document.querySelectorAll('.menu-buttons').forEach(obj => obj.style.display = 'grid');
	document.getElementById('menuExit').style.display = 'block';
	document.querySelectorAll('.menu-option').forEach(obj => {
		obj.style.display = 'none';
	});
}

document.querySelectorAll('.menu-buttons button').forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelectorAll('.main-menu h2').forEach(txt => txt.innerText = btn.innerText);
		document.querySelectorAll('.menu-buttons').forEach(obj => obj.style.display = 'none');
		document.getElementById('menuExit').style.display = 'none';
		document.querySelectorAll('.menu-option').forEach(obj => {
			obj.style.display = 'flex';
		});
		document.getElementById('optionInfo').innerHTML = optionsInfo[btn.dataset.index];
	});
});

document.getElementById('menuExit').addEventListener('click', () => {
	gamestate = G_S.MAP;
	document.querySelector('.main-menu').style.display = 'none';
});

document.getElementById('menuBack').addEventListener('click', () => {
	resetMenu();
});