function loadScript(src, callback) {
  const s = document.createElement("script");
  s.src = src;
  s.onload = callback;
  document.head.appendChild(s);
}

//This function should be called once all the characters modules have been imported
function charactersLoaded(){
	characters.push(sallyEvent, nalaEvent, henchmanSally, henchmanNala, custode, prince, dragon, triste, arrabbiato, privato, ponte, troll, cura1, cura2, cura3);
	moveWithMapObjs.push(...characters);
	drawObjs.push(...characters);
	console.log("All characters loaded");
}

const sources = [
	"./Data/NPC_Scripts/Sally.js",
	"./Data/NPC_Scripts/Nala.js",
	"./Data/NPC_Scripts/Prince.js",
	"./Data/NPC_Scripts/Citizens.js",
	"./Data/NPC_Scripts/Troll.js",
	"./Data/NPC_Scripts/Healers.s"
];

function loadSequentially(sources, finalCallback) {
  let i = 0;

  function next() {
    if (i >= sources.length) {
      finalCallback();
      return;
    }

    const s = document.createElement("script");
    s.src = sources[i++];
    s.onload = next;
    document.head.appendChild(s);
  }

  next();
}

loadSequentially(sources, charactersLoaded);

