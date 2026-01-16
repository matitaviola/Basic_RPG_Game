/* File State Management */

const saveStruct = {
    gameName: "RPG4Marika",
    version: 1,
    mapId: 1,
	position: {x:0, y:0},
	playerHp: 60,
	playerDirection: 'up'
	/* resto delle variabili globali e dei flag evento */
};

function storeSaveData(){
	saveStruct.mapId = 1; //Al momento abbiamo una sola mappa
	saveStruct.playerHp = pgBattler.currHp;
	saveStruct.playerDirection = playerDirection;
	
	//Return savestate
	return saveStruct;
}

function loadSaveFile(saveFile){
	const reader = new FileReader();

    reader.onload = (ev) => {
      try {
        const jsonSave = JSON.parse(ev.target.result);
        console.log("Loaded JSON:", jsonSave);
        //Function to read the variables and load them into the correct ones.
		loadSaveData(jsonSave);
      } catch (err) {
        console.error("Invalid JSON file", err);
      }
    };

    reader.readAsText(saveFile);
}

function loadSaveData(saveData){

	//The reverse of the storeSaveData
	//Map ID
	//saveData.mapId;
	
	//Hp
	pgBattler.currHp = saveData.playerHp;
	
	//Player Position
	playerDirection = saveData.playerDirection;
	switch(saveData.playerDirection){
		case 'up':
			playerSprite.image = playerSprite.spriteImgs.up;
		break;
		case 'down':
			playerSprite.image = playerSprite.spriteImgs.down;
		break;
		case 'left':
			playerSprite.image = playerSprite.spriteImgs.left;
		break;
		case 'right':
			playerSprite.image = playerSprite.spriteImgs.right;
		break;
		default:
			console.log('Impossible player position');
		break;
	};
	
}