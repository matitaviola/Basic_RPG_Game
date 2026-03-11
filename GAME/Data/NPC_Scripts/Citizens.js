/* custode */
const custodeImageDown = new Image();
custodeImageDown.src = "./Assets/Player/custodeDown.png";

const custode = new Character({
	imageSrc: custodeImageDown.src,
	frames: { max: 1, frameSpeed: 100},
	animate: true,
	visible: true,
	interactable: true,
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:66*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		down: custodeImageDown
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		showDialog([
				"Custode: Mi spiace, ma temo che voi due da sole non sarete in grado di liberare il principe.",
				"Custode: Tornate quando sarete un po' di più."
		], () => {
			moveWithMapObjs.forEach(mov => {
				gsap.to(mov.position, {
				y: mov.position.y - MOVEMENT_PIXELS*15});
			});
			Sally.updateFollower('down', playerSprite);
			Nala.updateFollower('down', Sally);
			playerSprite.animate = true;
			playerSprite.image = playerSprite.spriteImgs.down;
			playerDirection = 'down';
		})
	}
});
/* */

/* triste */
const tristeImageLeft = new Image();
tristeImageLeft.src = "./Assets/Player/tristeLeft.png";

const triste = new Character({
	imageSrc: tristeImageLeft.src,
	frames: { max: 1, frameSpeed: 100},
	animate: true,
	visible: true,
	interactable: true,
	position: {x: 29*TILE_WIDTH + STARTING_POINT_X, y:36*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		left: tristeImageLeft
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		showDialog([
				"Paesano: I nostri poveri alberi...",
				"Paesano: ..."
		], () => {
			this.interactable = false;
		})
	}
});
/* */

/* arrabbiato */
const arrabbiatoImageAllAround = new Image();
arrabbiatoImageAllAround.src = "./Assets/Player/arrabbiatoAllAround.png";

const arrabbiato = new Character({
	imageSrc: arrabbiatoImageAllAround.src,
	frames: { max: 4, frameSpeed: 50},
	animate: true,
	visible: true,
	interactable: true,
	position: {x: 57*TILE_WIDTH + STARTING_POINT_X, y:27*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		down: arrabbiatoImageAllAround
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.animate = false;
		showDialog([
				"Paesano: Maledetto drago.",
				"Paesano: Distruggere i nostri alberi per farne stuzzicadenti per ripulirsi dalla sue prede.",
				"Paesano: Che ti andassero di traverso!"
		], () => {
			this.animate = true;
		})
	}
});
/* */

/* privato */
const privatoImageUp = new Image();
privatoImageUp.src = "./Assets/Player/privatoUp.png";

const privato = new Character({
	imageSrc: privatoImageUp.src,
	frames: { max: 1},
	visible: true,
	interactable: true,
	position: {x: 48*TILE_WIDTH + STARTING_POINT_X, y:39*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: privatoImageUp
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		showDialog([
				"Paesano: Questa è proprietà privata, sciò!",
				"Paesano: Voi farabutti non avrete mai la mia casa!",
				"Paesano: Come? Non sei con loro?",
				"Paesano: Perdonami, ma con gli anni vista e memoria non sono più dalla mia."
		], () => {
			moveWithMapObjs.forEach(mov => {
				gsap.to(mov.position, {
				y: mov.position.y + TILE_HEIGHT*2});
			});
			Sally.updateFollower('up', playerSprite);
			Nala.updateFollower('up', Sally);
			playerSprite.animate = true;
			playerSprite.image = playerSprite.spriteImgs.up;
			playerDirection = 'up';
		})
	}
});
/* */

/* ponte */
const ponteImageAllAround = new Image();
ponteImageAllAround.src = "./Assets/Player/ponteAllAround.png";

const ponte = new Character({
	imageSrc: ponteImageAllAround.src,
	frames: { max: 4, frameSpeed: 50},
	animate: true,
	visible: true,
	interactable: true,
	position: {x: 59*TILE_WIDTH + STARTING_POINT_X, y:56*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		down: ponteImageAllAround
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.animate = false;
		showDialog([
				"Paesano: Il vecchio ponte qui a sud è crollato da un po'.",
				"Paesano: Da quando il drago è apparso, legno e manodopera scarseggiano..."
		], () => {
			this.animate = true;
		})
	}
});
/* */