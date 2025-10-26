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
		"duration": random(6,15),
		"y": h + 100 - 150,
		"ease": Linear.easeNone,
		"repeat": -1,
		"delay": -15,
		"onRepeat": function () {
			currentIteration[leaf.id.split("-")[1]] = Date.now();
		},
	});
	gsap.to(leaf, {
		"duration": random(4,8),
		"x": "+=100",
		"rotationZ": random(0,180),
		"repeat": -1,
		"yoyo": true,
		"ease": Sine.easeInOut,
	});
	gsap.to(leaf, {
		"duration": random(2,8),
		"rotationX": random(0,360),
		"rotationY": random(0,360),
		"repeat": -1,
		"yoyo": true,
		"ease": Sine.easeInOut,
		"delay": -5,
	});
}

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
		"x": random(0, w),
		"y": random(-150, -100),
		"z": random(-200, 200),
	});
	
	leaf.onclick = function () {
		console.log("You clicked on " + leaf.id);
		alert(quotes[currentIteration[i] % quotes.length]);
	};
	
	document.body.appendChild(leaf);
	animate(leaf);
}

console.log("ready!");
