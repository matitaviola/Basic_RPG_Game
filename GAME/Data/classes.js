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
		this.frames = {...frames, currFrame:0, elapsed:0};
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
	constructor({imageSrc, position, frames = {max: 1, frameSpeed:1}, velocity, spriteImgs, animate=false, rotation}){
		super({imageSrc, position, frames, velocity, spriteImgs, animate, rotation});
		this.finishedMoving = true;
		this.lastDirection = 'down';
	}
	
	updateFollower(direction, targetSprite) {
		// Save current position and direction image
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
		let thisTolerance = {u:this.height*2/3, d:0, l:followerPixelTolX, r:followerPixelTolX};
		
		// Collision check
		for (let i = 0; i < collisionTiles.length; i++) {
			const coll = collisionTiles[i];

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

		this.animate = true;
	}

}
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
		document.querySelector('#diagBox').innerHTML = this.name+' is K.O.';
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
