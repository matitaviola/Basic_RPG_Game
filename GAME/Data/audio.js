const audio = {
	mapBGM: new Howl({
		src: './Assets/Audio/map.wav',
		html5: true,
		volume: 0.5,
		loop: true
	}),
	battleIntro: new Howl({
		src: './Assets/Audio/initBattle.wav',
		html5: true,
		volume: 0.1
	}),
	battleBGM: new Howl({
		src: './Assets/Audio/battle.mp3',
		html5: true,
		volume: 0.1,
		loop: true
	}),
	victory: new Howl({
		src: './Assets/Audio/victory.wav',
		html5: true,
		volume: 1
	}),
	attackSound:{
		tackleHit: new Howl({
			src: './Assets/Audio/tackleHit.wav',
			html5: true,
			volume: 0.2
		}), 
		
		fireballInit: new Howl({
			src: './Assets/Audio/initFireball.wav',
			html5: true,
			volume: 0.2
		}),
		
		fireballHit: new Howl({
			src: './Assets/Audio/fireballHit.wav',
			html5: true,
			volume: 0.2
		})
	}
}