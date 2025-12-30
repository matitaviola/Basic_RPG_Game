/* Functions */
function showDialog(textBlocks) {
	//Set the new gamestate
	gamestate = G_S.DIALOG;
	
	dialogQueue = [...textBlocks];
	diagBox.classList.add('visible');
	nextDialogBlock();
}

function nextDialogBlock() {
	currentText = dialogQueue.shift();
	charIndex = 0;
	diagBox.firstChild.textContent = '';
	diagArrow.classList.add('hidden');
	typeNextChar();
}

function typeNextChar() {
	isTyping = true;

	if (charIndex < currentText.length) {
		diagBox.firstChild.textContent += currentText[charIndex];
		charIndex++;
		setTimeout(typeNextChar, TYPING_SPEED);
	} else {
		isTyping = false;

		if (dialogQueue.length > 0) {
			diagArrow.classList.remove('hidden');
		}
	}
}

function advanceDialog() {
	//If text is still typing, finish it instantly
	if (isTyping) {
		diagBox.firstChild.textContent = currentText;
		isTyping = false;

		if (dialogQueue.length > 0) {
			diagArrow.classList.remove('hidden');
		}
		return;
	}

	//If more dialog blocks exist, go to next
	if (dialogQueue.length > 0) {
		nextDialogBlock();
		return;
	}

	//When there's no text left we close the dialog
	closeDialog();
}


function closeDialog() {
	diagBox.classList.remove('visible');
	diagArrow.classList.add('hidden');
	dialogQueue = [];
	
	//Set the new gamestate
	gamestate = G_S.MAP;
}

/* Constants and event listeners */
const diagBox = document.getElementById('diagBox');
const diagArrow = document.getElementById('diagArrow');
diagBox.addEventListener('click', advanceDialog);

