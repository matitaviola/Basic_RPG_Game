/*--------------- Constants & Enums ----------------*/
//Game state enum
const G_S = {
	INTRO: 'INTRO',
	MENU: 'MENU',
	DIALOG: 'DIALOG',
	MAP: 'MAP',
	BATTLE: 'BATTLE',
	OVER: 'GAME_OVER',
	END: 'HAPPY_ENDING'
};

// Canvas info
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

//Map sizes
const TILE_MAP_WIDTH = 85; //Number of tile block of the map on Tiled
const TILE_MAP_HEIGHT = 85;
const TILE_WIDTH = 16*4; //Tile size pixel * zoom%
const TILE_HEIGHT = 16*4;
const BATTLE_TRIGGER_AREA = 100; // Size of overlapping area on grass to trigger battle [pixels^2]

//Map positions and movements
const MOVEMENT_PIXELS = 3; // number of pixels in single movement
const STARTING_POINT_X = -715; //col 19 della mappa
const STARTING_POINT_Y = -615; //row 14 della mappa

//Player sprite
const PLAYER_FRAME_SPEED_IDLE = 10; // 1 frame change every X executions
const PLAYER_PIXEL_TOL_X = 4; //Player size pixel tolerance on X axys

//Follower-related
const FOLLOW_DISTANCE = 64; // one tile behind / beside player
const FOLLOW_TIME_NALA = 0.4; // Sally time to catch up (lower == faster catch-up)
const FOLLOW_TIME_SALLY = 0.6; // Nala time to catch up (lower == faster catch-up)
const FOLLOWER_PIXEL_TOL_X = 20; //Follower size pixel tolerance on X axys

//Player Battle position
const PG_SPRITE_X = 290;
const PG_SPRITE_Y = 270;

// Battle 
const NORMAL_BATTLER_FRAME_SPEED = 20;

//Dialog Typing speed
const TYPING_SPEED = 25;
/* */

/*--------------- Variables ----------------*/

/* Game state */
let gamestate = G_S.INTRO;
/* */

/* Key Event*/
let keys = {
	w: {pressed: false},
	a: {pressed: false},
	s: {pressed: false},
	d: {pressed: false},
	enter: {pressed: false},
	space: { pressed: false }
}
let lastKey;
/* */

/* Audio Events */
let clicked4AudioStart = false;
let musicVolume = 0.7;
let sfxVolume = 0.2;
/* */

/* Intro variables */
let introAnimationId;
/* */

/* Map variables */
let mapAnimationId;
let moveWithMapObjs = [];
let collisionBlocks = [];
let drawObjs = [];
let playerDirection = 'down';
let mapMovedPos = {x:0, y:0};
/* */

/* Battle variables */
let battleAnimationId;
let enemies = [];
let battleDragon = false; //Mark the final battle
/* */

/* Attacks */
let attacks = {};
let actionsQueue = [];
let atkSpritesToRender = [];
/* */

/* Dialog */
let dialogQueue = [];
let currentText = '';
let charIndex = 0;
let isTyping = false;
/* */

/* Characters */
let characters = [];
/* */