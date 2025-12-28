/* Constants */
// Canvas info
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

//Map sizes
const TILE_MAP_WIDTH = 40; //Number of tile block of the map on Tiled
const TILE_MAP_HEIGHT = 40;
const TILE_WIDTH = 16*4; //Tile size pixel * zoom%
const TILE_HEIGHT = 16*4;
const BATTLE_TRIGGER_AREA = 100; // Size of overlapping area on grass to trigger battle [pixels^2]

//Map positions and movements
const MOVEMENT_PIXELS = 3; // number of pixels in single movement
const STARTING_POINT_X = -1475;
const STARTING_POINT_Y = -350;

//Player sprite
const PLAYER_FRAME_SPEED_IDLE = 10; // 1 frame change every X executions
const PLAYER_PIXEL_TOL_X = 4; //Player size pixel tolerance on X axys

//Follower-related
const FOLLOW_DISTANCE = 64; // one tile behind / beside player
const FOLLOW_TIME_NALA = 0.4; // FollowerOne time to catch up (lower == faster catch-up)
const FOLLOW_TIME_SALLY = 0.6; // FollowerTwo time to catch up (lower == faster catch-up)
const FOLLOWER_PIXEL_TOL_X = 20; //Follower size pixel tolerance on X axys

//Player Battle position
const PG_SPRITE_X = 290;
const PG_SPRITE_Y = 320;
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
/* Menu */
let menuOpen = false;
/* */

/* Audio Events */
let clicked4AudioStart = false;
/* */

/* Intro variables */
let introAnimationId;
/* */

/* Map variables */
let mapAnimationId;
let moveWithMapObjs = [];
/* */

/* Battle variables */
let isInBattle = false;
let battleAnimationId;
const enemies = [];
/* */
