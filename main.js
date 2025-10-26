// main.js - runs the main logic for fall screensaver

TweenLite.set("#container", {
	"perspective": 600,
});
let total = 30;
let w = window.innerWidth;
let h = window.innerHeight;
let currentIteration = new Array(total).fill().map(_ => Math.floor(Math.random() * quotes.length));

function animate (leaf){
	gsap.to(leaf, {
		"duration": random(6, 100),
		"y": h + 100 + Math.min(0, gsap.getProperty("#" + leaf.id, "z")) * (-10), // height of screen, PLUS a buffer zone, PLUS an adjustment for distance
		"ease": Linear.easeNone,
		"repeat": -1,
		"delay": -15,
		"onRepeat": function () {
			currentIteration[leaf.id.split("-")[1]] = Date.now(); // update the timestamp so that the program is aware that this is a new leaf
		},
	});
	
	// rotation
	gsap.to(leaf, {
		"duration": random(4, 8),
		"x": "+=" + (w / 2),
		"rotationZ": random(0, 180),
		"repeat": -1,
		"yoyo": true,
		"ease": Sine.easeInOut,
	});
	gsap.to(leaf, {
		"duration": random(2, 8),
		"rotationX": random(0, 360),
		"rotationY": random(0, 360),
		"repeat": -1,
		"yoyo": true,
		"ease": Sine.easeInOut,
		"delay": -5,
	});
}

let container = document.getElementById("container");

for (let i = 0; i < total; i++) {
	let leaf = document.createElement("img");
	leaf.src = "https://www.clipartqueen.com/image-files/red-lobed-fall-clipart-leaf.png"; // leaf png
	leaf.alt = "leaf";
	leaf.style.width = ((Math.random() * 30) + (Math.min(w, h) / 20)) + "px";
	leaf.id = "leaf-" + i;
	gsap.set(leaf, {
		"attr": {
			"class": "dot",
		},
		"x": random(-w / 2, w / 2),
		"y": random(-150, -100),
		"z": random(-300, 200),
	});
	
	leaf.onclick = function () {
		let chosenQuote = quotes[currentIteration[i] % quotes.length];
		document.getElementById("quoteBox").textContent = chosenQuote;
	};
	
	container.appendChild(leaf);
	animate(leaf);
}

console.log("ready!");
