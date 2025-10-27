// main.js - runs the main logic for fall screensaver

// high utility variables
const baseLeaves = 30;
let leavesMultiplier = 1;
let leavesCount = baseLeaves * leavesMultiplier;
let w = window.innerWidth;
let h = window.innerHeight;
let currentIteration = new Array(leavesCount).fill().map(_ => Math.floor(Math.random() * leavesCount));

let particleCanvas = document.getElementById("particleCanvas");
let ctx = particleCanvas.getContext("2d");
particleCanvas.width = w;
particleCanvas.height = h;

let particles = [];

// this is the animation loop for the particle canvas
function particleAnimationLoop () {
	ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
	const maxParticles = 300;
	if (particles.length > maxParticles) {
		particles.splice(0, particles.length - maxParticles); // clear old particles if too many
	}

	for (let i = particles.length - 1; i >= 0; i--) {
		const p = particles[i];
		p.update();
		p.draw();

		if (p.opacity <= 0) {
			particles.splice(i, 1); // remove particle since it's already invisible
		}
	}

	requestAnimationFrame(particleAnimationLoop);
}
particleAnimationLoop();

function resetPos (leaf) {
	leaf.style.width = ((Math.random() * 30) + (Math.min(w, h) / 20)) + "px";
	gsap.set(leaf, {
		"attr": {
			"class": "leaf",
		},
		"x": random(0, w),
		"y": random(-150, -100),
	});
}

function animateFall (leaf) {
	// falling
	gsap.to(leaf, {
		"duration": random(10, 50),
		"y": h + 100, // height of screen, PLUS a buffer zone, PLUS an adjustment for distance
		"ease": Linear.easeNone,
		"onComplete": function () {
			// reset leaf to the top somewhere
			resetPos(leaf);
			animateFall(leaf);
		},
	});
	
}

function animate (leaf){
	// TODO: add real wind? see below line ("x": )
	// maybe use 'left' property to simulate wind - manually, not with gsap
	
	animateFall(leaf);
	
	// rotation
	gsap.to(leaf, {
		"duration": random(4, 8),
		"x": _ => "+=" + random(-w / 4, w / 4), // random drift for each leaf, not real wind but getting there
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

window.addEventListener("resize", function () {
	console.log("resizing & reanimating");
	w = window.innerWidth;
	h = window.innerHeight;
	document.querySelectorAll("leaf").forEach(leaf => {
		resetPos(leaf);
		animate(leaf);
	});
	
	particleCanvas.width = w;
	particleCanvas.height = h;
});

let container = document.getElementById("container");

function recreateLeaves () {
	console.log(leavesCount);
	document.querySelectorAll(".leaf").forEach(leaf => leaf.remove());
	for (let i = 0; i < leavesCount; i++) {
		let leaf = document.createElement("img");
		leaf.src = "https://www.clipartqueen.com/image-files/red-lobed-fall-clipart-leaf.png"; // leaf png
		leaf.alt = "leaf";
		leaf.id = "leaf-" + i;
		leaf.draggable = false;
		resetPos(leaf);
		
		leaf.addEventListener("click", function (e) {
			console.log("clicked", leaf.id);
			let chosenQuote = quotes[currentIteration[i] % quotes.length];
			document.getElementById("quoteBox").textContent = chosenQuote;
			
			// make leaf explode in STARS
			createExplosion(e.clientX, e.clientY, {
				"count": 25,
				"color": true,
				"shape": "star",
			});
		});
		
		container.appendChild(leaf);
		animate(leaf);
	}
}
recreateLeaves();

// basic explosion when clicked anywhere on canvas (aka not on a leaf)
particleCanvas.addEventListener("click", function (e) {
	// just circles (no shape specified defaults to circle)
	createExplosion(e.clientX, e.clientY, {
		"count": 50,
		"color": false,
	});
});

// settings functions
document.getElementById("settings").addEventListener("click", function () {
	document.getElementById("settingsPanel").classList.toggle("hidden");
});

document.getElementById("enableQuotes").addEventListener("click", function () {
	document.getElementById("quoteBox").classList.toggle("hidden", !this.checked);
});

document.getElementById("leavesAmount").addEventListener("change", function () {
	leavesMultiplier = this.value / 50;
	leavesCount = Math.floor(baseLeaves * leavesMultiplier);
	
	if (currentIteration.length < leavesCount) {
		currentIteration = new Array(leavesCount).fill().map((_, i) => currentIteration[i]);
	}
	
	recreateLeaves();
});

// all good to go!
console.log("ready!");
