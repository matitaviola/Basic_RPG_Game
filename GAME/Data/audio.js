function setMusicVolume(value) {
	musicVolume = parseFloat(value) || 1;
	music.forEach(sound => sound.volume(value));
	//localStorage.setItem('musicVolume', value);
}

function setSFXVolume(value) {
	sfxVolume = parseFloat(value) || 1;
	sfx.forEach(sound => sound.volume(value));
	//localStorage.setItem('sfxVolume', value);
}

const audio = {
	mapBGM: new Howl({
		src: './Assets/Audio/map.wav',
		html5: true,
		volume: 1,
		loop: true
	}),
	battleIntro: new Howl({
		src: './Assets/Audio/initBattle.wav',
		html5: true,
		volume: 0.5
	}),
	battleBGM: new Howl({
		src: './Assets/Audio/battle.mp3',
		html5: true,
		volume: 0.5,
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
			volume: 0.5
		}), 
		
		fireballInit: new Howl({
			src: './Assets/Audio/initFireball.wav',
			html5: true,
			volume: 0.5
		}),
		
		fireballHit: new Howl({
			src: './Assets/Audio/fireballHit.wav',
			html5: true,
			volume: 0.5
		})
	},
	finalBattle:new Howl({
		src: './Assets/Audio/chains_of_destiny.mp3',
		html5: true,
		volume: 1,
		loop: true
	})
}

/* Audio separation for settings */
const music = [
	audio.mapBGM,
	audio.battleBGM,
	audio.finalBattle
];

const sfx = [
	audio.battleIntro,
	audio.victory,
	audio.attackSound.tackleHit,
	audio.attackSound.fireballInit,
	audio.attackSound.fireballHit
];
