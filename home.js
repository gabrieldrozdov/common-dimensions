// Animate title questions
let questions = [
	'How can a chair be a quilt?',
	'Is a chair still a chair even if one cannot sit on it?',
	'Is a chair an object, a piece of art, or an extension of the human body?',
	'What’s the point of designing another chair?'
]
let homeQuestions = document.querySelector('.home-questions');
// let currentQuestion = Math.floor(Math.random()*questions.length); // random order
let currentQuestion = 0;
let writeIn, writeOut;
function questionIn() {
	let remainingWords = questions[currentQuestion].split(' ');
	writeIn = setInterval(() => {
		let nextWord = remainingWords[0];
		homeQuestions.innerHTML += nextWord + " ";
		remainingWords.shift();
		if (remainingWords.length == 0) {
			clearInterval(writeIn);
			setTimeout(() => {
				questionOut();
			}, 5000)
		}
	}, 200)
}
questionIn();
function questionOut() {
	writeOut = setInterval(() => {
		homeQuestions.innerHTML = homeQuestions.innerText.substr(0, homeQuestions.innerText.lastIndexOf(' '));
		if (homeQuestions.innerText == '') {
			clearInterval(writeOut);
			setTimeout(() => {
				currentQuestion++;
				if (currentQuestion >= questions.length) {
					currentQuestion = 0;
				}
				questionIn();
			}, 500)
		}
	}, 100)
}

// Chair interactive
document.addEventListener('mousemove', (e) => {spinChair(e)});
function spinChair(e) {
	if (window.innerWidth >= 600) {
		let chair = document.querySelector('.home-chair-interactive');
		let percent = e.clientX/window.innerWidth;
		let chairNumber = Math.floor(percent*68);
		chair.src = `/assets/home/chair${chairNumber}.png`;
		let chairRotation = 30 + percent*-60;
		chair.style.transform = `rotate(${chairRotation}deg)`;
	
		let chairCaption = document.querySelector('.home-chair-caption');
		let chairCaptionPos = percent*5;
		chairCaption.style.transform = `translateX(${chairCaptionPos}vw)`;
	
		let chairClose = document.querySelector('.home-chair-close');
		let chairClosePos = percent*15-10;
		chairClose.style.transform = `translateX(${chairClosePos}vw)`;
	}
}
function closeChair() {
	let chair = document.querySelector('.home-chair-interactive');
	let chairCaption = document.querySelector('.home-chair-caption');
	let chairClose = document.querySelector('.home-chair-close');
	chair.dataset.active = 0;
	chairCaption.dataset.active = 0;
	chairClose.dataset.active = 0;
}

// Automate chair on mobile
let mobileLoop;
let mobileLoopActive = false;
let mobileLoopPercent = 0;
let mobileLoopDirection = 1;
function detectMobile() {
	if (window.innerWidth < 600 && mobileLoopActive == false) {
		mobileLoopActive = true;
		mobileLoop = setInterval(() => {
			let chair = document.querySelector('.home-chair-interactive');
			let chairCaption = document.querySelector('.home-chair-caption');
			let chairClose = document.querySelector('.home-chair-close');

			let chairNumber = Math.floor(mobileLoopPercent*19+1);
			chair.src = `/assets/home/chair${chairNumber}.png`;
			let chairRotation = 30 + mobileLoopPercent*-60;
			chair.style.transform = `rotate(${chairRotation}deg)`;

			let chairCaptionPos = mobileLoopPercent*5;
			chairCaption.style.transform = `translateX(${chairCaptionPos}vw)`;

			let chairClosePos = mobileLoopPercent*-20;
			chairClose.style.transform = `translateX(${chairClosePos}vw)`;

			mobileLoopPercent += .02*mobileLoopDirection;
			if (mobileLoopPercent >= 1-.02) {
				mobileLoopDirection = -1;
			} else if (mobileLoopPercent <= 0) {
				mobileLoopDirection = 1;
			}
		}, 50)
	} else if (window.innerWidth >= 600 && mobileLoopActive == true) {
		console.log()
		mobileLoopActive = false;
		clearInterval(mobileLoop);
	}
}
detectMobile();
window.addEventListener('resize', detectMobile);