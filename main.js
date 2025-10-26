// main.js - runs the main logic for fall screensaver

TweenLite.set("#container", {
	"perspective": 600,
});
let total = 30;
let w = window.innerWidth;
let h = window.innerHeight;
let currentIteration = new Array(total).fill().map(_ => Math.floor(Math.random() * quotes.length));

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

// TODO: make this a star and not a circle all the time
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
		if (opts.color) {
			this.color = colors[Math.floor(Math.random() * colors.length)]; // Random color
		} else {
			this.color = "#ffffff";
		}
	}

	update () {
		this.x += this.vx;
		this.y += this.vy;
		this.opacity -= 0.01; // Fade out over time
	}

	draw () {
		ctx.beginPath();
		
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		let opacityInHex = Math.floor(Math.max(0, this.opacity) * 255).toString(16);
		ctx.fillStyle = this.color + opacityInHex;
		
		ctx.fill();
		ctx.closePath();
	}
}

function createExplosion (x, y, opts) {
	// stars vs circles? maybe add to opts
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
	
	leaf.addEventListener("click", function (e) {
		let chosenQuote = quotes[currentIteration[i] % quotes.length];
		document.getElementById("quoteBox").textContent = chosenQuote;
		
		// make leaf explode in STARS (still circles as of now)
		createExplosion(e.clientX, e.clientY, {
			"count": 75,
			"color": true,
		});
	});
	
	container.appendChild(leaf);
	animate(leaf);
}

// basic explosion when clicked anywhere on canvas (aka not on a leaf)
particleCanvas.addEventListener("click", function (e) {
	// just circles
	createExplosion(e.clientX, e.clientY, {
		"count": 50,
		"color": false,
	});
});

console.log("ready!");
