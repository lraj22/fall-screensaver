// main.js - runs the main logic for fall screensaver

TweenLite.set("#container", {
	"perspective": 600,
});
let total = 20;
let w = window.innerWidth;
let h = window.innerHeight;

function random(min,max) {return min+Math.random()*(max-min)};

function animate (leaf){
	gsap.to(leaf, {
		"duration": random(6,15),
		"y": h+100,
		"ease": Linear.easeNone,
		"repeat": -1,
		"delay": -15
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
	let img = document.createElement("img");
	img.src = "https://www.clipartqueen.com/image-files/red-lobed-fall-clipart-leaf.png";
	img.alt = "leaf";
	img.style.width = ((Math.random() * 30) + 70) + "px";
	gsap.set(img, {
		"attr": {
			"class": "dot",
		},
		"x": random(0, w),
		"y": random(-200, -150),
		"z": random(-200, 200),
	});
	
	document.body.appendChild(img);
	animate(img);
}

console.log("ready!");
