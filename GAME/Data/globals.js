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
const FOLLOWER_STARTING_POINT_X = canvas.width / 2;
const FOLLOWER_STARTING_POINT_Y = canvas.height / 2 + 64;
const FOLLOW_DISTANCE = 64; // one tile behind / beside player
const playerPixelTolX = 4; //Player size pixel tolerance on X axys
const playerFrameSpeedIdle = 10; // 1 frame change every X executions
const battleTriggerArea = 100; // Size of overlapping area on grass to trigegr battle
/* */

/* Key Event*/
let keys = {
	w: {pressed: false},
	a: {pressed: false},
	s: {pressed: false},
	d: {pressed: false},
	enter: {pressed: false}
}
let lastKey;
/* */

/* Audio Events */
let clicked4AudioStart = false;
/* */

/* Intro variables */
let introAnimationId;
/* */

/* Map variables */
let mapAnimationId;
/* */

/* Battle variables */
let isInBattle = false;
let battleAnimationId;
const enemies = [];
const pgSpriteX = 290;
const pgSpriteY = 320;
/* */

/* Followers */
const followerMoves = [];
const FOLLOW_DELAY = 12; // distance behind player
/* */