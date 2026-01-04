/* sallyEvent */
const sallyEventImageDown = new Image();
sallyEventImageDown.src = "./Assets/Player/sallyDown.png";
const sallyEventImageUp = new Image();
sallyEventImageUp.src = "./Assets/Player/sallyUp.png";
const sallyEventImageLeft = new Image();
sallyEventImageLeft.src = "./Assets/Player/sallyLeft.png";
const sallyEventImageRight = new Image();
sallyEventImageRight.src = "./Assets/Player/sallyRight.png";

const sallyEvent = new Character({
	imageSrc: sallyEventImageDown.src,
	frames: { max: 2, frameSpeed: 15 },
	animate: true,
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:28*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: sallyEventImageUp,
		down: sallyEventImageDown,
		left: sallyEventImageLeft,
		right: sallyEventImageRight
	},
	collisionOffset: { x: 0, y: 20},
	interactionOffset: { x: 10, y: 20},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection);
		showDialog([
				"Sally: Meow! *Buondì, piccola artista!*",
				"Sally: Meow *Presta molta attenzione, questo posto è più pericoloso di quanto sembri.*",
				"Sally: Meoow! *Qualcuno ha persino rapito il tuo ragazzo!*",
				"Sally: Meow... *Se vuoi, ti darò una zampa a ritrovarlo...*",
				"Sally: Meow! *...anche perchè sembra stiano per arrivare dei guai!*"
			], 
			() => {
				const tl = gsap.timeline({ onComplete: () => {
					initBattle({random: false, chosenEnemies: [enemiesBestiary.Sgherro], initCallback: function(){
						sallyEvent.hideSelf();
						hunchmanSally.hideSelf();
						drawObjs.splice(drawObjs.length-3, 0, Sally); //From the bottom, skips foreground and playersprite
					}});
				} });
				
				//move huncheman
				tl.to(hunchmanSally.position,{
				x: sallyEvent.position.x,
				y: sallyEvent.position.y + sallyEvent.height,
				duration: 2,
				onUpdate: () => {
					hunchmanSally.draw(context);
				}});
			}
		);

	}
});
/* */

/* nalaEvent */
const nalaEventImageDown = new Image();
nalaEventImageDown.src = "./Assets/Player/nalaDown.png";
const nalaEventImageUp = new Image();
nalaEventImageUp.src = "./Assets/Player/nalaUp.png";
const nalaEventImageLeft = new Image();
nalaEventImageLeft.src = "./Assets/Player/nalaLeft.png";
const nalaEventImageRight = new Image();
nalaEventImageRight.src = "./Assets/Player/nalaRight.png";

const nalaEvent = new Character({
	imageSrc: nalaEventImageDown.src,
	frames: { max: 3, frameSpeed: 10},
	animate: true,
	position: {x: 15.5*TILE_WIDTH + STARTING_POINT_X, y:54*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: nalaEventImageUp,
		down: nalaEventImageDown,
		left: nalaEventImageLeft,
		right: nalaEventImageRight
	},
	collisionOffset: { x: 0, y: 20},
	interactionOffset: { x: 10, y: 20},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection);
		showDialog([
				"Nala: Meow? *Oh, state andando all'avventura?*",
				"Nala: Meeow?? *Come dite? Un drago?*",
				"Nala: Meoow *Adoro le lucertole, sono deliziose...",
				"Nala: Meooow *...e questa viene già col fuoco per cuocerla!*",
				"Nala: Meow! *Penso proprio che mi unirò a voi!*",
			], 
			() => {

				const tl = gsap.timeline({ onComplete: () => {
					initBattle({random: false, chosenEnemies: [enemiesBestiary.Sgherro], initCallback: function(){
						nalaEvent.hideSelf();
						hunchmanNala.hideSelf();
						//Rimuovi custode, ora siete abbastanza nel party
						custode.hideSelf();
						//Change helaer event
						cura2.deleteSelf();
						cura3.showSelf();
						//add follower
						drawObjs.splice(drawObjs.length-4, 0, Nala); //From the bottom, skips foreground and playersprite
					}});
				} });
				
				//move huncheman
				hunchmanNala.showSelf();
				tl.to(hunchmanNala.position,{
				x: nalaEvent.position.x + TILE_WIDTH/2,
				y: nalaEvent.position.y,
				duration: 1.5
				});
			}
		);

	}
});
/* */

/* Prince */
const princeImageDown = new Image();
princeImageDown.src = "./Assets/Player/princeDown.png";

const princeImageUp = new Image();
princeImageUp.src = "./Assets/Player/princeUp.png";

const princeImageLeft = new Image();
princeImageLeft.src = "./Assets/Player/princeLeft.png";

const princeImageRight = new Image();
princeImageRight.src = "./Assets/Player/princeRight.png";

const prince = new Character({
	imageSrc: princeImageUp.src,
	frames: { max: 1, frameSpeed: 20},
	animate: false,
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:60*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		down: princeImageDown,
		up: princeImageUp,
		left:princeImageLeft,
		right: princeImageRight
	},
	collisionOffset: { x: 0, y: 20},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		if(battleDragon)
			return;
		battleDragon = true;
		this.rotateToFaceCaller(playerDirection)
		showDialog([
				"Mattia: Bellezza?!",
				"Mattia: Come sei arrivata qui?",
				"Mattia: Anzi, non importa, devi andartene, c'è un...",
				"Drago: ROOOOOOOOOOOAR!!!"
			], 
			() => {
				const tl = gsap.timeline({ onComplete: () => {
					showDialog([
						"Mattia: Eccolo, prepariamoci alla battaglia!",
						"Drago: ROOOOOOOOOOOAR!"
					], ()=>{
						//Remove player and folowers from the moving objects
						moveWithMapObjs.pop();
						moveWithMapObjs.pop();
						moveWithMapObjs.pop();
						
						gsap.to('.battle-overlap',{
						opacity: 1,
						repeat:3,
						yoyo: true,
						duration: 0.5,
						onComplete: () => {initBattle({random: false, chosenEnemies: [enemiesBestiary.Drago], initCallback: function(){dragon.hideSelf();}})}
						});
					})
				} });
				
				//move DRAGON
				dragon.showSelf();
				audio.finalBattle.play();
				this.rotateToFaceCaller('down');
				moveWithMapObjs.push(Nala, Sally, playerSprite);
				tl.to(moveWithMapObjs.map(m => m.position), {
						y: `+=${MOVEMENT_PIXELS * 120}`,
						duration:2,
						repeat:1,
						yoyo: true
						
					})
				.to(playerSprite.position,{ 
					x: canvas.width/2, 
					y:canvas.height/2 
				})
				.to(dragon.position,{ 
					y: prince.position.y - dragon.height,
					duration: 2,
					onUpdate: () => { dragon.draw(context); }
				}).to(prince.position,{
					x: prince.position.x - TILE_WIDTH,
					duration: 0.5,
				}).to(playerSprite.position, {
						y: playerSprite.position.y - TILE_HEIGHT + prince.collisionOffset.y/2,
						duration:1
				});	
			}
		)
	}
});
/* */

/* hunchmanSally */
const hunchmanSallyImageUp = new Image();
hunchmanSallyImageUp.src = "./Assets/Player/hunchmenUp.png";

const hunchmanSally = new Character({
	imageSrc: hunchmanSallyImageUp.src,
	frames: { max: 2, frameSpeed: 20},
	animate: true,
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:32*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: hunchmanSallyImageUp
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
	}
});
/* */

/* hunchmanNala */
const hunchmanNalaImageLeft = new Image();
hunchmanNalaImageLeft.src = "./Assets/Player/hunchmenLeft.png";

const hunchmanNala = new Character({
	imageSrc: hunchmanNalaImageLeft.src,
	frames: { max: 2, frameSpeed: 20},
	animate: true,
	visible: false,
	interactable: false,
	position: {x: 24*TILE_WIDTH + STARTING_POINT_X, y:53.8*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		left: hunchmanNalaImageLeft
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
	}
});
/* */

/* dragon */
const dragonImageDown = new Image();
dragonImageDown.src = "./Assets/Player/dragonDown.png";

const dragon = new Character({
	imageSrc: dragonImageDown.src,
	frames: { max: 2, frameSpeed: 20},
	animate: true,
	visible: false,
	interactable: false,
	position: {x: 35*TILE_WIDTH + STARTING_POINT_X, y:51*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		down: dragonImageDown
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
	}
});
/* */

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
				"Custode: Tornate quando sarete un po' di più"
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
				y: mov.position.y + MOVEMENT_PIXELS*15});
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

/* troll */
const trollImageUp = new Image();
trollImageUp.src = "./Assets/Player/hunchmenUp.png";

const troll = new Character({
	imageSrc: trollImageUp.src,
	frames: { max: 2, frameSpeed: 20},
	position: {x: 76*TILE_WIDTH + STARTING_POINT_X, y:53*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: trollImageUp
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		showDialog([
				"Troll: BUH! Sono il troll del ponte, e mi dovete pagare il pedaggio.",
				"Troll: Come dite? Non è un ponte ma un acquedotto?",
				"Troll: ...",
				"Troll: Non mi piacciono i saputelli! >:["
		], () => {
			initBattle({random: false, chosenEnemies: [enemiesBestiary.Sgherro]});
		})
	}
});
/* */

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
				"Paesana: Spero davvero stia bene, quella fifona. Magari domani andrò a vedere come sta.",
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

const characters = [sallyEvent, nalaEvent, hunchmanSally, hunchmanNala, custode, prince, dragon, triste, arrabbiato, privato, ponte, troll, cura1, cura2, cura3];