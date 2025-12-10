/* Constants */
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const tileMapWidth = 40; //Number of tile block of the map on Tiled
const tileMapHeight = 40;
const tileWidth = 16*4; //Tile size pixel * zoom%
const tileHeight = 16*4;
const startingPoint = {x:-1475, y:-350};
const playerPixelTolX = 4; //Player size pixel tolerance on X axys
const playerFrameSpeedIdle = 10; // 1 frame change every X executions
const battleTriggerArea = 100; // Size of overlapping area on grass to trigegr battle
/* */

/* Key Event*/
let keys = {
	w: {pressed: false},
	a: {pressed: false},
	s: {pressed: false},
	d: {pressed: false}
}
let lastKey;
/* */