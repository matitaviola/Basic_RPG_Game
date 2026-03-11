const atkTackle = new Attack({
	name: 'Tackle', 
	type: 'physical',
	info: 'The user tackles the opponent, albeit not with all its might',		
	damage: 10,
	effectCbk: directDamageMove,
	animationCbk: function({attacker, target, targetBarId, onComplete}){
		const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
		const atkSpr = attacker.sprite;
		const tgtSpr = target.sprite; 
		//Show box and set text
		document.querySelector('#diagBoxBattle').style.display = 'block';
		document.querySelector('#diagBoxBattle').innerHTML = attacker.name + ' tackles ' + target.name;
		
		//Effect
		this.effectCbk(target); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
				
		// Animation
		
		tl.to(atkSpr.position, {
		  x: "-=20",
		  duration: 0.1
		})
		.to(atkSpr.position, {
		  x: "+=40",
		  duration: 0.1
		})
		.to(atkSpr.position, {
		  x: atkSpr.position.x,
		  duration: 0.1
		})
		.to(atkSpr.position, {
		  x: tgtSpr.position.x - tgtSpr.width / 2,
		  y: tgtSpr.position.y,
		  duration: 0.5
		})
		.call(() => {
		  audio.attackSound.tackleHit.play();
		})
		.to(tgtSpr.position, {
		  x: "+=40",
		  yoyo: true,
		  repeat: 3,
		  duration: 0.1
		})
		.to(tgtSpr, {
		  opacity: 0,
		  yoyo: true,
		  repeat: 3,
		  duration: 0.1
		}, "<") // run alongside shake
		.to(targetBarId, {
		  width: (target.currHp / target.maxHp) * 100 + '%',
		  duration: 0.5
		})
		.to(atkSpr.position, {
		  x: atkSpr.position.x,
		  y: atkSpr.position.y,
		  duration: 0.4
		});
	}
});