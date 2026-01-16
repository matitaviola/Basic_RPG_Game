const atkHeal = new Attack({
	name: 'Heal', 
	type: 'status',
	info: 'The user heals itself',		
	damage: 0,
	effectCbk: healMove,
	animationCbk: function({attacker, target, targetBarId, onComplete}){
		const tl = gsap.timeline({ onComplete }); //The onComplete is executed only when the timeline is terminated
		const atkSpr = attacker.sprite;
		
		//Show box and set text
		document.querySelector('#diagBoxBattle').style.display = 'block';
		document.querySelector('#diagBoxBattle').innerHTML = attacker.name + ' healed themselves';
		
		//Effect
		this.effectCbk(attacker, attacker.maxHp/3); //For 'this.' to work and refer to the attack, the 'onComplete' must use an arrow function.
				
		// Animation
		if(targetBarId == '#healthBarPg')
			targetBarId = '#healthBarEnemy';
		else
			targetBarId = '#healthBarPg';
		
		tl.call(() => {
		  audio.attackSound.tackleHit.play();
		})
		.to(targetBarId, {
		  width: (attacker.currHp / attacker.maxHp) * 100 + '%',
		  duration: 0.5
		});
	}
});