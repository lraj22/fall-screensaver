// main.js - runs the main logic for fall screensaver

TweenLite.set("#container", {
	"perspective": 600,
});
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
const colors = [
	"#ba6e58",
	"#ff7f00",
	"#c68139",
	"#f7ab77",
	"#8000ff",
	"#aa6b6a",
	"#a26b55",
	"#ffb3f6",
	"#7aa0ff",
	"#333333",
];

class Particle {
	constructor (x, y, opts) {
		this.x = x;
		this.y = y;
		this.radius = Math.random() * 2 + 1;
		this.speed = Math.random() * 3 + 1;
		this.angle = Math.random() * Math.PI * 2; 
		this.vx = Math.cos(this.angle) * this.speed;
		this.vy = Math.sin(this.angle) * this.speed;
		this.opacity = 1;
		this.shape = opts.shape;
		if (opts.color) {
			this.color = ((opts.color === true) ? colors[Math.floor(Math.random() * colors.length)] : opts.color); // if true, pick any random color, otherwise the color has been specified already
		} else {
			this.color = "#ffffff";
		}
	}

	update () {
		this.x += this.vx;
		this.y += this.vy;
		this.opacity -= 0.01;
	}

	draw () {
		if (this.shape === "none") return;
		
		ctx.beginPath();
		let opacityInHex = Math.floor(Math.max(0, this.opacity) * 255).toString(16);
		
		if (this.shape === "star") {
			// adapted from markE's answer; thanks! credit: https://stackoverflow.com/a/25840319/14469685
			let cx = this.x, cy = this.y, spikes = 5, outerRadius = this.radius, innerRadius = this.radius * 2;
			
			let rot = Math.PI / 2 * 3;
			let x = cx;
			let y = cy;
			let step = Math.PI/spikes;

			ctx.moveTo(cx, cy - outerRadius);
			for (let i = 0; i < spikes; i++) {
				x = cx + Math.cos(rot) * outerRadius;
				y = cy + Math.sin(rot) * outerRadius;
				ctx.lineTo(x, y);
				rot += step;

				x = cx + Math.cos(rot) * innerRadius;
				y = cy + Math.sin(rot) * innerRadius;
				ctx.lineTo(x,y);
				rot += step;
			}
			ctx.lineTo(cx, cy - outerRadius);
		} else { // circle by default
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		}
		
		ctx.fillStyle = this.color + opacityInHex;
		ctx.fill();
		ctx.closePath();
	}
}

function createExplosion (x, y, opts) {
	for (let i = 0; i < opts.count; i++) {
		particles.push(new Particle(x, y, opts));
	}
}

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

function animate (leaf){
	// TODO: add real wind?
	
	// falling
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

window.addEventListener("resize", function () {
	console.log("resizing & reanimating");
	w = window.innerWidth;
	h = window.innerHeight;
	[...document.getElementsByClassName("dot")].forEach(leaf => {
		leaf.style.width = ((Math.random() * 30) + (Math.min(w, h) / 20)) + "px";
		gsap.set(leaf, {
			"attr": {
				"class": "dot",
			},
			"x": random(-w / 2, w / 2),
			"y": random(-150, -100),
			"z": random(-300, 200), // distance from viewer (viewer is 600px away)
		});
		animate(leaf);
	});
	
	particleCanvas.width = w;
	particleCanvas.height = h;
});

let container = document.getElementById("container");

function recreateLeaves () {
	console.log(leavesCount);
	document.querySelectorAll(".dot").forEach(leaf => leaf.remove());
	for (let i = 0; i < leavesCount; i++) {
		let leaf = document.createElement("img");
		leaf.src = "https://www.clipartqueen.com/image-files/red-lobed-fall-clipart-leaf.png"; // leaf png
		leaf.alt = "leaf";
		leaf.style.width = ((Math.random() * 30) + (Math.min(w, h) / 20)) + "px";
		leaf.id = "leaf-" + i;
		leaf.draggable = false;
		gsap.set(leaf, {
			"attr": {
				"class": "dot",
			},
			"x": random(-w / 2, w / 2),
			"y": random(-150, -100),
			"z": random(-300, 200),
		});
		
		leaf.addEventListener("click", function (e) {
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
	// just circles
	createExplosion(e.clientX, e.clientY, {
		"count": 50,
		"color": false,
	});
});

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

console.log("ready!");
