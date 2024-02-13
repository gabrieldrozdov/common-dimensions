// Fetch template structure and add to DOM
fetch('/template.html')
	.then((response) => response.text())
	.then((text) => {
		let template = document.querySelector('.template');
		template.innerHTML = text;
		document.addEventListener('mousemove', (e) => {setMousePos(e)});
		refreshHoverEffects();
		setActiveNav();
	})

// Get mouse position and move custom cursor if not in final position
let mousePos = [window.innerWidth/2, window.innerHeight/2];
let mouseLoop = false;
let initMouse = true;
function setMousePos(e) {
	if (initMouse) {
		initMouse = false;
		let mouseCircle = document.querySelector('.mouse-circle');
		let mouseCrosshair = document.querySelector('.mouse-crosshair');
		mouseCircle.style.left = e.clientX + "px";
		mouseCrosshair.style.left = e.clientX + "px";
		mouseCircle.style.top = e.clientY + "px";
		mouseCrosshair.style.top = e.clientY + "px";
	}
	let mouse = document.querySelector('.mouse');
	mouse.dataset.hide = 0;
	mousePos = [e.clientX, e.clientY];
	if (!mouseLoop) {
		moveCursor();
		mouseLoop = true;
	}
}

// Move custom mouse cursor
let repositionLoop;
function moveCursor() {
	repositionLoop = setInterval(() => {
		let mouseCircle = document.querySelector('.mouse-circle');
		let mouseCrosshair = document.querySelector('.mouse-crosshair');
		let circlePos = [parseFloat(mouseCircle.style.left), parseFloat(mouseCircle.style.top)];
		let crosshairPos = [parseFloat(mouseCrosshair.style.left), parseFloat(mouseCrosshair.style.top)];
		mouseCircle.style.left = (circlePos[0] - (circlePos[0]-mousePos[0])/10) + "px";
		mouseCircle.style.top = (circlePos[1] - (circlePos[1]-mousePos[1])/10) + "px";
		mouseCrosshair.style.left = (crosshairPos[0] - (crosshairPos[0]-circlePos[0])/5) + "px";
		mouseCrosshair.style.top = (crosshairPos[1] - (crosshairPos[1]-circlePos[1])/5) + "px";
	
		if (mousePos[0].toFixed(1) == circlePos[0].toFixed(1) && circlePos[0].toFixed(1) == crosshairPos[0].toFixed(1) && mousePos[1].toFixed(1) == circlePos[1].toFixed(1) && circlePos[1].toFixed(1) == crosshairPos[1].toFixed(1)) {
			clearInterval(repositionLoop);
			mouseLoop = false;
			console.log('cursor reached mouse')
		}
	}, 8) // 120fps
}

// Mouse cursor hover effect
function refreshHoverEffects() {
	for (let link of document.querySelectorAll('a')) {
		link.addEventListener('mouseenter', activateMouse);
		link.addEventListener('mouseleave', deactivateMouse);
	}
	for (let link of document.querySelectorAll('button')) {
		link.addEventListener('mouseenter', activateMouse);
		link.addEventListener('mouseleave', deactivateMouse);
	}
	for (let link of document.querySelectorAll('.hover')) {
		link.addEventListener('mouseenter', activateMouse);
		link.addEventListener('mouseleave', deactivateMouse);
	}
}
function activateMouse() {
	let mouse = document.querySelector('.mouse');
	mouse.dataset.active = 1;
}
function deactivateMouse() {
	let mouse = document.querySelector('.mouse');
	mouse.dataset.active = 0;
}

// Info panel
function openInfo() {
	let info = document.querySelector('.info');
	info.dataset.open = 1;
}
function closeInfo() {
	let info = document.querySelector('.info');
	info.dataset.open = 0;
}

// Detect active nav link
function setActiveNav() {
	let paths = window.location.pathname.split('/').filter(text => text.length > 0);
	if (paths.length > 0) {
		for (let path of paths) {
			let activeNavs = document.querySelectorAll(`[data-id="nav-${path}"]`);
			for (nav of activeNavs) {
				nav.dataset.active = 1;
			}
		}
	} else {
		let activeNavs = document.querySelectorAll("[data-id='nav-home']");
		for (nav of activeNavs) {
			nav.dataset.active = 1;
		}
	}
}

// Mobile nav menu
function toggleMenu() {
	let nav = document.querySelector('.nav');
	let navMobile = document.querySelector('.nav-mobile');
	if (parseInt(nav.dataset.active) == 1) {
		nav.dataset.active = 0;
		navMobile.dataset.active = 0;
	} else {
		nav.dataset.active = 1;
		navMobile.dataset.active = 1;
	}
}