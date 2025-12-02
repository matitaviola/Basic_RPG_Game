/* Classes */
class Sprite {
	static position;
	
	constructor({image, position, frames = {max: 1, frameSpeed:1}, velocity, spriteImgs}) {
		this.position = position;
		this.image = image;
		this.spriteImgs = spriteImgs;
		this.isMoving = false;
		this.frames = {...frames, currFrame:0, elapsed:0};
		this.image.onload = () => {
			this.width = this.image.width/this.frames.max;
			this.height = this.image.height;
		};
	}
	
	draw(context) {
	//Image obj, X to start cropping, Y to start cropping, x crop width, y crop height, x, y, rendered image width, rendered image height) 
		context.drawImage(this.image, 
						this.frames.currFrame * (this.width),
						0,
						this.image.width/ this.frames.max,
						this.image.height,
						this.position.x, 
						this.position.y, 
						this.image.width/ this.frames.max,
						this.image.height); 
		
		if(!this.isMoving){
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