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
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection)
		showDialog([
				"Sally: Meow! *Buondì, piccola artista!*",
				"Sally: Meow *Presta molta attenzione, questo posto è più pericoloso di quanto sembri.*",
				"Sally: Meoow! *Qualcuno ha persino rapito il tuo ragazzo!*",
				"Sally: Meow... *Se vuoi, ti darò una zampa a ritrovarlo...*",
				"Sally: Meow! *...anche perchè sembra stiano per arrivare dei guai!*"
			], 
			() => {
				this.hideSelf();
				drawObjs.splice(drawObjs.length-3, 0, Sally); //From the bottom, skips foreground and playersprite
				const tl = gsap.timeline({ onComplete: () => {
					hunchmanSally.hideSelf();
					initBattle({random:true});
				} });
				
				//move huncheman
				tl.to(hunchmanSally.position,{
				x: sallyEvent.position.x,
				y: sallyEvent.position.y,
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
	position: {x: 15*TILE_WIDTH + STARTING_POINT_X, y:55*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		up: nalaEventImageUp,
		down: nalaEventImageDown,
		left: nalaEventImageLeft,
		right: nalaEventImageRight
	},
	collisionOffset: { x: 0, y: 0},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
		this.rotateToFaceCaller(playerDirection)
		showDialog([
				"Nala: Meow? *Oh, state andando all'avventura?*",
				"Nala: Meeow?? *Come dite? Un drago?*",
				"Nala: Meoow *Adoro le lucertole, sono deliziose...",
				"Nala: Meooow *...e questa viene già col fuoco per cuocerla!*",
				"Nala: Meow! *Penso proprio che mi unirò a voi!*",
			], 
			() => {
				this.hideSelf();
				//Rimuovi custode, ora siete abbastanza nel party
				custode.hideSelf();
				drawObjs.splice(drawObjs.length-4, 0, Nala); //From the bottom, skips foreground and playersprite
				
				const tl = gsap.timeline({ onComplete: () => {
					hunchmanNala.hideSelf();
					initBattle({random:true});
				} });
				
				//move huncheman
				hunchmanNala.showSelf();
				tl.to(hunchmanNala.position,{
				x: nalaEvent.position.x + TILE_WIDTH/2,
				y: nalaEvent.position.y,
				duration: 1.5,
				onUpdate: () => {
					hunchmanNala.draw(context);
				}});
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
	frames: { max: 4, frameSpeed: 20},
	animate: false,
	position: {x: 36*TILE_WIDTH + STARTING_POINT_X, y:60*TILE_HEIGHT + STARTING_POINT_Y},
	spriteImgs: {
		down: princeImageDown,
		up: princeImageUp,
		left:princeImageLeft,
		right: princeImageRight
	},
	collisionOffset: { x: 0, y: 10},
	interactionOffset: { x: 10, y: 10},
	interactCbk: function(){
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
						onComplete: () => {initBattle({random: true, initCallback: function(){dragon.hideSelf();}})}
						});
					})
				} });
				
				//move DRAGON
				dragon.showSelf();
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
	position: {x: 19*TILE_WIDTH + STARTING_POINT_X, y:55*TILE_HEIGHT + STARTING_POINT_Y},
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

const characters = [sallyEvent, nalaEvent, hunchmanSally, hunchmanNala, custode, prince, dragon];