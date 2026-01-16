/* Reused logics */
// Base damaging move
directDamageMove = function(target) {
	target.currHp -= this.damage;
	if(target.currHp < 0) target.currHp = 0;
};
// Base healing move
healMove = function(target, amount){
	target.currHp += amount;
	if(target.currHp > target.maxHp)
		target.currHp = target.maxHp;
};
/* */ 

//This function should be called once all the characters 'modules' have been imported
function attacksLoaded(){
	attacks.Tackle = atkTackle,
	attacks.Fireball = atkFireball;
	attacks.BrushStroke = atkBrushStroke;
	attacks.Heal = atkHeal;
	attacks.GigaFlare = atkGigaFlare;
	attacks.LoveFlare = atkLoveFlare;	
	console.log("All attacks loaded");
}

//List of the various files used for the npc scripts 
const sourcesAtk = [
	"./Data/Attacks_Scripts/Tackle.js",
	"./Data/Attacks_Scripts/Fireball.js",
	"./Data/Attacks_Scripts/BrushStroke.js",
	"./Data/Attacks_Scripts/Heal.js",
	"./Data/Attacks_Scripts/GigaFlare.js",
	"./Data/Attacks_Scripts/LoveFlare.js"
];

//Call to 'import' the 
loadSequentially(sourcesAtk, attacksLoaded);



