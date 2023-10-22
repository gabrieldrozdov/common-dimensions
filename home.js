// Animate title questions
let questions = [
	'How can a chair be a quilt?',
	'Is a chair still a chair even if one cannot sit on it?',
	'Is a chair an object, a piece of art, or an extension of the human body?',
	'What’s the point of designing another chair?'
]
let homeQuestions = document.querySelector('.home-questions');
let currentQuestion = Math.floor(Math.random()*questions.length);
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
