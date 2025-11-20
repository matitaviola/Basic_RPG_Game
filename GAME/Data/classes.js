/* Classes */
class Sprite {
	static position;
	
	constructor({image, position, frames = {max: 1, cropFactHeight:1, cropFactX:0, cropFactY:0}, velocity, pixelTolerance = 0}) {
		this.position = position;
		this.image = image;
		this.frames = frames;
		this.image.onload = () => {
			this.width = this.image.width/this.frames.max - pixelTolerance - this.image.width * this.frames.cropFactX;
			this.height = this.image.height - pixelTolerance - this.image.height * this.frames.cropFactY;
			this.position.x += this.image.width * this.frames.cropFactX;
			this.position.y += this.image.height * this.frames.cropFactY;
		};
	}
	
	draw(context) {
	//Image obj, X to start cropping, Y to start cropping, x crop width, y crop height, x, y, rendered image width, rendered image height) 
		context.drawImage(this.image, 
						this.image.width * this.frames.cropFactX,
						this.image.height * this.frames.cropFactY,
						this.image.width/ this.frames.max,
						this.image.height * this.frames.cropFactHeight,
						this.position.x, 
						this.position.y, 
						this.image.width/ this.frames.max,
						this.image.height * this.frames.cropFactHeight); 
	}
	
	setCropValues(cropStartX, cropStartY) {
		this.cropStartX = cropStartX;
		this.cropStartY = cropStartY;
		this.width -= cropStartX;
		this.height -= cropStartY;
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
	
	checkCollision(sprite, offset = {x: 0, y: 0}) {
		return (
			sprite.position.x + sprite.width >= this.position.x + offset.x &&
			sprite.position.x <= this.position.x + this.width + offset.x &&
			sprite.position.y <= this.position.y + this.height + offset.y &&
			sprite.position.y + sprite.height >= this.position.y + offset.y
		 )
				
	}
	
}
/* */