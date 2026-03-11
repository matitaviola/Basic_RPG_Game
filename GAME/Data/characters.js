//This function should be called once all the characters 'modules' have been imported
function charactersLoaded(){
	characters.push(sallyEvent, nalaEvent, henchmanSally, henchmanNala, custode, prince, dragon, triste, arrabbiato, privato, ponte, troll, cura1, cura2, cura3);
	moveWithMapObjs.splice(1, 0, ...characters); //Insert in pos 1 removing 0 elements, all the contents of characters
	drawObjs.splice(1, 0,...characters);
	console.log("All characters loaded");
}

//List of the various files used for the npc scripts 
const sourcesNPC = [
	"./Data/NPC_Scripts/Sally.js",
	"./Data/NPC_Scripts/Nala.js",
	"./Data/NPC_Scripts/Prince.js",
	"./Data/NPC_Scripts/Citizens.js",
	"./Data/NPC_Scripts/Troll.js",
	"./Data/NPC_Scripts/Healers.js"
];

//Call to 'import' the 
loadSequentially(sourcesNPC, charactersLoaded);

