/* cura1 */
const cura1ImageUp = new Image();
cura1ImageUp.src = "./Assets/Player/curaUp.png";
const cura1ImageDown = new Image();
cura1ImageDown.src = "./Assets/Player/curaDown.png";
const cura1ImageLeft = new Image();
cura1ImageLeft.src = "./Assets/Player/curaLeft.png";
const cura1ImageRight = new Image();
cura1ImageRight.src = "./Assets/Player/curaRight.png";

const cura1 = new Character({
	imageSrc: cura1ImageDown.src,
	frames: { max: 1, frameSpeed: 20},
	position: {x: 70*TILE_WIDTH + STARTING_POINT_X, y:40*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: cura1ImageUp,
		down: cura1ImageDown,
		left: cura1ImageLeft,
		right: cura1ImageRight
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection);
		showDialog([
				"Paesana: Ciao piccolini, cosa ci fate qua in giro? È un luogo pericoloso, sapete?",
				"Paesana: Come come? Il vostro amico è stato rapito dal drago?",
				"Paesana: Giusto cielo! Dovete sbrigarvi, allora. Il drago è noto per il suo appetito.",
				"Paesana: Mi spiace non potervi accompagnare, ma non credo di avere il vostro coraggio.",
				"Paesana: Pensate che ancora non sono riuscita ad andare a trovare mia sorella, che vive dall'altra parte rispetto al castello.",
				"Paesana: Però il vostro coraggio va premiato, voglio darvi comunque una mano!",
				"LA SQUADRA È STATA RIMESSA IN SESTO",
				"Paesana: Se per caso incontrerete mia sorella sono certa che vi aiuterà anche lei.",
				"Paesana: Buona fortuna."
		], () => {
			pgBattler.currHp = pgBattler.maxHp;
		})
	}
});
/* */

/* cura2 */
const cura2ImageUp = new Image();
cura2ImageUp.src = "./Assets/Player/curaUp.png";
const cura2ImageDown = new Image();
cura2ImageDown.src = "./Assets/Player/curaDown.png";
const cura2ImageLeft = new Image();
cura2ImageLeft.src = "./Assets/Player/curaLeft.png";
const cura2ImageRight = new Image();
cura2ImageRight.src = "./Assets/Player/curaRight.png";

const cura2 = new Character({
	imageSrc: cura2ImageDown.src,
	frames: { max: 1, frameSpeed: 20},
	position: {x: 25*TILE_WIDTH + STARTING_POINT_X, y:63*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: cura2ImageUp,
		down: cura2ImageDown,
		left: cura2ImageLeft,
		right: cura2ImageRight
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection);
		showDialog([
				"Paesana: Ciao piccolini, cosa ci fate qua in giro? è un luogo pericoloso, sapete?",
				"Paesana: Come come? Ti sembra di aver già sentito questa frase?",
				"Paesana: Magari avete parlato con mia sorella!",
				"Paesana: Spero davvero stia bene, quella fifona. Quasi quasi domani andrò a vedere come sta.",
				"Paesana: Come? Avete intenzione di affrontare il drago? Mmmh... temo che in due non ce la fareste.",
				"Paesana: Per vostra fortuna, ho sentito che c'è una gattina da queste parti che sta proteggendo l'ultimo grande albero rimasto.",
				"Paesana: Forse potrebbe darvi una mano. Nel fattempo ci penso io.",
				"LA SQUADRA È STATA RIMESSA IN SESTO",
				"Paesana: Tornate pure da me dopo che avrete parlato con l'altra gattina.",
				"Paesana: Buona fortuna."
		], () => {
			pgBattler.currHp = pgBattler.maxHp;
		})
	}
});
/* */

/* cura3 */
const cura3ImageUp = new Image();
cura3ImageUp.src = "./Assets/Player/curaUp.png";
const cura3ImageDown = new Image();
cura3ImageDown.src = "./Assets/Player/curaDown.png";
const cura3ImageLeft = new Image();
cura3ImageLeft.src = "./Assets/Player/curaLeft.png";
const cura3ImageRight = new Image();
cura3ImageRight.src = "./Assets/Player/curaRight.png";

const cura3 = new Character({
	imageSrc: cura3ImageDown.src,
	frames: { max: 1, frameSpeed: 20},
	position: {x: 25*TILE_WIDTH + STARTING_POINT_X, y:63*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: cura3ImageUp,
		down: cura3ImageDown,
		left: cura3ImageLeft,
		right: cura3ImageRight
	},
	visible: false,
	interactable: false,
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection);
		showDialog([
				"Paesana: Vedo che la squadra è al completo!",
				"LA SQUADRA È STATA RIMESSA IN SESTO",
				"Paesana: Ci siete quasi, che la fortuna vi assista!",
		], () => {
			pgBattler.currHp = pgBattler.maxHp;
		})
	}
});
/* */