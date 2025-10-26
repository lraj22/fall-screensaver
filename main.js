// main.js - runs the main logic for fall screensaver

let total = 10;

for (let i = 0; i < total; i++) {
	let img = document.createElement("img");
	img.src = "https://www.clipartqueen.com/image-files/red-lobed-fall-clipart-leaf.png";
	img.alt = "leaf";
	document.body.appendChild(img);
	img.style.animationDuration = ((Math.random () * 3) + 2) + "s";
	img.style.left = ((Math.random() * window.innerWidth) - 50) + "px";
	
	img.addEventListener("animationiteration", function () {
		this.style.left = ((Math.random() * window.innerWidth) - 50) + "px";
		this.style.top = "-100px";
	});
}

console.log("ready!");
