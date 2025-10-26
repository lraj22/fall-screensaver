// main.js - runs the main logic for fall screensaver

document.querySelector("img").addEventListener("animationiteration", function () {
	this.style.left = (Math.random() * window.innerWidth - 50) + "px";
});

console.log("ready!");
