/* Sprites */
class Sprite {
	static position;
	
	constructor({imageSrc, position, frames = {max: 1, frameSpeed:1}, velocity, spriteImgs, animate=false, rotation}) {
		this.position = position;
		this.image = new Image;
		this.imageSrc = imageSrc;
		this.image.src = this.imageSrc;
		this.spriteImgs = spriteImgs;
		this.animate = animate;
		this.frames = {
		  max: frames.max ?? 1,
		  frameSpeed: frames.frameSpeed ?? PLAYER_FRAME_SPEED_IDLE,
		  currFrame: 0,
		  elapsed: 0
		};
		this.image.onload = () => {
			this.width = this.image.width/this.frames.max;
			this.height = this.image.height;
		};
		this.opacity = 1;
		this.rotation = rotation;
	}
	
	draw(context) {
	//Image obj, X to start cropping, Y to start cropping, x crop width, y crop height, x, y, rendered image width, rendered image height) 
		context.save();
		context.globalAlpha = this.opacity;
		context.translate(this.position.x + this.width/2, this.position.y + this.height/2); //rotation center
		context.rotate(this.rotation); //rotation (in radiants)
		context.translate(-(this.position.x + this.width/2), -(this.position.y + this.height/2)); //return to the original point
		context.drawImage(this.image, 
						this.frames.currFrame * (this.width),
						0,
						this.image.width/ this.frames.max,
						this.image.height,
						this.position.x, 
						this.position.y, 
						this.image.width/ this.frames.max,
						this.image.height); 
		context.restore();
		
		if(!this.animate){
			this.frames.currFrame = 0; //reset to original position
			return;
		}
		if(this.frames.max > 1)
			this.frames.elapsed++;
		if(this.frames.elapsed >= this.frames.frameSpeed){
			this.frames.currFrame = (this.frames.currFrame + 1) % this.frames.max;	
			this.frames.elapsed = 0;
		}
	}
}
/* */

/* Follower */
class Follower extends Sprite {
	constructor({imageSrc, position, frames = {max: 1, frameSpeed:1}, velocity, spriteImgs, animate=false, rotation, followTime}){
		super({imageSrc, position, frames, velocity, spriteImgs, animate, rotation});
		this.finishedMoving = true;
		this.followTime = followTime;
	}
	
	updateFollower(direction, targetSprite) {
		
		const oldPos = {
			x: this.position.x,
			y: this.position.y
		};
		const oldImg = this.image ;

		let newPos = { x: 0, y: 0 };

		switch (direction) {
			case 'up':
				newPos.x = targetSprite.position.x;
				newPos.y = targetSprite.position.y + FOLLOW_DISTANCE;
				this.image = this.spriteImgs.up;
				break;
			case 'down':
				newPos.x = targetSprite.position.x;
				newPos.y = targetSprite.position.y - FOLLOW_DISTANCE;
				this.image = this.spriteImgs.down;
				break;
			case 'right':
				newPos.x = targetSprite.position.x - FOLLOW_DISTANCE;
				newPos.y = targetSprite.position.y;
				this.image = this.spriteImgs.right;
				break;
			case 'left':
				newPos.x = targetSprite.position.x + FOLLOW_DISTANCE;
				newPos.y = targetSprite.position.y;
				this.image = this.spriteImgs.left;
				break;
			default:
				newPos.x = targetSprite.position.x;
				newPos.y = targetSprite.position.y;
			break;
		}

		
		// Temporarily move follower to future position
		this.position = newPos;
		
		//Compute tolerance 
		let thisTolerance = {u:this.height*2/3, d:0, l:FOLLOWER_PIXEL_TOL_X, r:FOLLOWER_PIXEL_TOL_X};
		
		// Collision check
		for (let i = 0; i < collisionBlocks.length; i++) {
			const coll = collisionBlocks[i];

			if (coll.checkCollision(this, {x:0, y:0}, thisTolerance)) {
				// Restore old position if invalid move, while taking into account the ofset that was given to the rest of the map
				switch(direction){
					case 'up':
						this.position = {x:oldPos.x, y:oldPos.y + MOVEMENT_PIXELS};
						break;
					case 'down':
						this.position = {x:oldPos.x, y:oldPos.y - MOVEMENT_PIXELS};
						break;
					case 'right':
						this.position = {x:oldPos.x - MOVEMENT_PIXELS, y:oldPos.y};
						break;
					case 'left':
						this.position = {x:oldPos.x + MOVEMENT_PIXELS, y:oldPos.y};
						break;
					default:
						this.position = oldPos;
					break;
				}
				this.image = oldImg;
				return;
			}
		}
		
		this.position = oldPos;
		gsap.to(this.position,{
			x: newPos.x,
			y: newPos.y,
			duration: this.followTime
		});
		this.animate = true;
	}

}
/* */

/* Collision */
class Collision {
	static position;
	static width;
	static height;
	
	constructor({position, width, height}) {
		this.position = position;
		this.width = width;
		this.height = height;
	}
	
	draw(context) {
		context.fillStyle = 'rgba(255, 0, 0, 0)';
		context.fillRect(this.position.x, this.position.y, this.width, this.height); 
	}
	
	drawColor(context, color) {
		context.fillStyle = color;
		context.fillRect(this.position.x, this.position.y, this.width, this.height); 
	}
	
	drawOffset(context, offset) {
		context.fillStyle = 'rgba(255, 0, 0, 0)';
		context.fillRect(this.position.x + offset.x, this.position.y + offset.y, this.width, this.height); 
	}
	
	checkCollision(sprite, offset = {x: 0, y: 0}, tolerance = { u:0, d:0, l:0, r:0}) {
		
		// Block bounds
		const bLeft = this.position.x + offset.x;
		const bRight = bLeft + this.width;
		const bTop = this.position.y + offset.y;
		const bBottom = bTop + this.height;

		// Sprite bounds
		const sLeft = sprite.position.x;
		const sRight = sLeft + sprite.width;
		const sTop = sprite.position.y;
		const sBottom = sTop + sprite.height;

		// Horizontal overlap considering left/right tolerance
		const xOverlap = (sRight - tolerance.l >= bLeft) && (sLeft + tolerance.r <= bRight);

		// Vertical overlap with top/bottom tolerance
		const yOverlap = (sBottom - tolerance.d >= bTop) && (sTop + tolerance.u <= bBottom);

		return xOverlap && yOverlap;

	}
	
	checkOverlapArea(sprite){
		const width = Math.max(this.position.x, sprite.position.x) - Math.min(this.position.x, sprite.position.x);
		const height = Math.max(this.position.y, sprite.position.y) - Math.min(this.position.y, sprite.position.y);
		return width*height;
	}
	
}
/* */

/* Battler */
class Battler{
	constructor({name, sprite, maxHp = 50, attackNames}){
		this.name = name;
		this.currHp = maxHp;
		this.maxHp = maxHp;
		this.attackNames = attackNames;
		this.sprite = sprite;
	}
	
	faint() {
		document.querySelector('#diagBoxBattle').innerHTML = this.name+' is K.O.';
		gsap.to(this.sprite.position, {
			y: this.sprite.position.y + 20
		});
		gsap.to(this.sprite, {
			opacity: 0
		})
	}
}
/* */
/* Attack */
class Attack{
	constructor({name, type, info, isDamage = false, damage = 0, isArea = false, animationCbk = () => {}, effectCbk = () => {} }) {
		this.name = name;
		this.type = type;
		this.info = info;
		this.isDamage = isDamage;
		this.damage = damage;
		this.isArea = isArea;
		this.animationCbk = animationCbk;
		this.effectCbk = effectCbk;
	}
}
/* */

/* Character */
class Character extends Sprite {
	constructor({
		imageSrc,
		position,
		frames = { max: 1, frameSpeed: 1 },
		spriteImgs,
		animate = false,
		rotation = 0,

		// Offsets relative to sprite.position
		collisionOffset = { x: 0, y: 0 },
		interactionOffset = { x: 0, y: 0 },
		interactionPadding = 12,
		interactCbk = ()=>{console.log('hello');},
		
		//Interactions
		interactable = true,
		visible = true
	}) {
		super({ imageSrc, position, frames, spriteImgs, animate, rotation });

		this.collisionOffset = collisionOffset;
		this.interactionOffset = interactionOffset;
		this.interactionPadding = interactionPadding;

		this.collision = null;
		this.interactionBox = null;
		
		this.visible = visible;
		this.interactable = interactable;
		this.interactCbk = interactCbk;
		
		this.image.onload = () => {
			this.width = this.image.width / this.frames.max;
			this.height = this.image.height;

			// Physical collision (shares sprite position)
			this.collision = new Collision({
				position: {x: this.position.x - collisionOffset.x/2, y: this.position.y - collisionOffset.y/2},
				width: this.width + collisionOffset.x,
				height: this.height + collisionOffset.y
			});
			//Push into collision list
			//TODO: think if it would be better to get the list as parameter instead of directly naming the constant
			moveWithMapObjs.push(this.collision);
			if(this.interactable = interactable)
				collisionBlocks.push(this.collision);
			
			// Interaction collision (shares sprite position)
			this.interactionBox = new Collision({
				position: {x: this.position.x - interactionOffset.x/2, y: this.position.y - interactionOffset.y/2},
				width: this.width + interactionOffset.x,
				height: this.height +interactionOffset.y
			});
			//Push into interaction list
			//TODO: think if it would be better to get the list as parameter instead of directly naming the constant
			moveWithMapObjs.push(this.interactionBox);
		};
	}

	draw(context) {
		if(this.visible)
			super.draw(context);
	}

	interact() {
		if(this.interactable)
			this.interactCbk();
	}

	canInteract(player, tolerance) {
		if (!this.interactionBox || !this.interactable) return false;

		return this.interactionBox.checkCollision(
			player,
			{
				x: 0,
				y: 0
			},
			tolerance
		);
	}
	
	rotateTo(directionToFace){
		switch(directionToFace){
			case 'up':
				if( this.spriteImgs.up != null){
					this.image = this.spriteImgs.up;
				}
			break;
			case 'down':
				if( this.spriteImgs.down != null){
					this.image = this.spriteImgs.down;
				}
			break;
			case 'left':
				if( this.spriteImgs.left != null){
					this.image = this.spriteImgs.left;
				}
			break;
			case 'right':
				if( this.spriteImgs.right != null){
					this.image = this.spriteImgs.right;
				}
			break;
			default:
			break;
		}
	}
	
	rotateToFaceCaller(callerDirection){
		switch(callerDirection){
			case 'down':
				if( this.spriteImgs.up != null){
					this.image = this.spriteImgs.up;
				}
			break;
			case 'up':
				if( this.spriteImgs.down != null){
					this.image = this.spriteImgs.down;
				}
			break;
			case 'right':
				if( this.spriteImgs.left != null){
					this.image = this.spriteImgs.left;
				}
			break;
			case 'left':
				if( this.spriteImgs.right != null){
					this.image = this.spriteImgs.right;
				}
			break;
			default:
			break;
		}
	}
	
	hideSelf(){
		//Remove from collision blocks
		let index = collisionBlocks.indexOf(this.collision);
		if (index > -1) { // only splice array when item is found
		  collisionBlocks.splice(index, 1); // the '1' parameter means remove one item only
		}
		
		//Set invisible
		this.visible = false;
		
		//Set to uninteractable
		this.interactable = false;
		
		console.log('puff');
	}
	
	showSelf(){
		//Add to collisions:
		collisionBlocks.push(this.collision);
		
		//Set visible
		this.visible = true;
		
		//Set to uninteractable
		this.interactable = true;
	}
	
	deleteSelf(){
		//Remove from collision blocks
		let index = collisionBlocks.indexOf(this.collision);
		if (index > -1) { // only splice array when item is found
		  collisionBlocks.splice(index, 1); // the '1' parameter means remove one item only
		}
		
		//Remove from moving with map blocks
		index = moveWithMapObjs.indexOf(this.collision);
		if (index > -1) { 
		  moveWithMapObjs.splice(index, 1);
		}
		
		index = moveWithMapObjs.indexOf(this.interactionBox);
		if (index > -1) { 
		  moveWithMapObjs.splice(index, 1); 
		}
		
		//Remove from visible sprites
		index = drawObjs.indexOf(this);
		if (index > -1) { 
		  drawObjs.splice(index, 1);
		}		
		
		//Remove from characters
		index = characters.indexOf(this);
		if (index > -1) { 
		  characters.splice(index, 1);
		}	
		
		console.log('goodbye');
	}
}

/* */