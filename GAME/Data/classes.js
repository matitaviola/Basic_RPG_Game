/* Classes */
class Sprite {
	static position;
	
	constructor({image, position, frames = {max: 1}, velocity, pixelTolerance = 0}) {
		this.position = position;
		this.image = image;
		this.frames = frames;
		this.image.onload = () => {
			this.width = this.image.width/this.frames.max - pixelTolerance;
			this.height = this.image.height - pixelTolerance;
		};
	}
	
	draw(context) {
	//Image obj, X to start cropping, Y to start cropping, x crop width, y crop width, x, y, rendered image width, rendered image height) 
		context.drawImage(this.image, 
						0,
						0,
						this.image.width/ this.frames.max,
						this.image.height,
						this.position.x, 
						this.position.y, 
						this.image.width/ this.frames.max,
						this.image.height); 
	}
	
	setSizes(newWidth, newHeight){
		this.width = newWidth;
		this.height = newHeight;
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
	
	checkCollision(sprite, offset) {
		return (
			sprite.position.x + sprite.width >= this.position.x + offset.x &&
			sprite.position.x <= this.position.x + this.width + offset.x &&
			sprite.position.y <= this.position.y + this.height + offset.y &&
			sprite.position.y + sprite.height >= this.position.y + offset.y
		 )
				
	}
	
}
/* */