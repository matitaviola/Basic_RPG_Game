const optionsInfo = [
	'<p><i>Movements:</i><br><br>WASD / ↑←↓→: overworld movements<br>SPACEBAR: interact with the other characters</p><p><i>Dialogs:</i><br><br>SPACEBAR: next dialog line</p><p><i>In Battle:</i><br><br>MOUSE: point and click to select the attack</p>', /*Controls*/
	`
	<div id="musicSetting">
		<span>Music</span>
			<input type="range" min="0" max="1" step="0.01" value="${musicVolume}"
			oninput="setMusicVolume(this.value)">
	</div>

	<div id="sfxSetting">
		<span>SFX</span>
		<input type="range" min="0" max="1" step="0.01" value="${sfxVolume}"
			oninput="setSFXVolume(this.value)">
	</div>
	`, /*Settings*/
	'<p>Creato con amore per il primo anniversario di Marika e Mattia</p><span>♥️</span>', /*Info*/
	'<p>Concept, Story, Mapping, Implementation: <i>Matitaviola</i></p><p>Tileset: <i>Magiscarf</i></p><p>Overworld sprite base: <i>The Pokemon Company</i></p>', /*Credits*/
	`
	<div>
		<button id="saveStateBtn">Save State</button>
		<p>
		</p>
		<button id="loadStateBtn">Load State</button>
		<input type="file" id="fileInput" accept=".json" hidden>
	</div>
	`/* Saves */
]; 

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

document.getElementById("optionInfo").addEventListener("click", (e) => {
  if (e.target.id === "saveStateBtn") {
    const json = JSON.stringify(storeSaveData(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
	
	const fileName = "MarikaSaveFile.json";
	const today = new Date().toISOString().slice(0, 10);
	fileName.replace(/\.json$/i, `_${today}.json`);
	
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }
});

document.getElementById("optionInfo").addEventListener("click", (e) => {
  if (e.target.id === "loadStateBtn") {
    document.getElementById("fileInput").click();
	document.getElementById('menuExit').click();
  }
});

document.getElementById("optionInfo").addEventListener("change", (e) => {
  if (e.target.id === "fileInput") {
    const file = e.target.files[0];
    if (!file) return;

    loadSaveFile(file);
  }
});
