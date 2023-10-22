// Popups
function openPopup(target) {
	for (let popup of document.querySelectorAll('.interview-popup')) {
		popup.dataset.active = 0;
	}
	let popup = document.querySelector('#'+target);
	popup.dataset.active = 1;
}
function closePopup(e) {
	e.parentElement.dataset.active = 0;
}

// Dual scrolling
let interviewImages = document.querySelector('.interview-images');
let interviewText = document.querySelector('.interview-text');
interviewImages.addEventListener('wheel', scrollText);
interviewText.addEventListener('wheel', scrollImages);
function scrollText() {
	if (window.innerWidth <= 800) {
		return;
	}
	let imageScrollPercent = calculateScroll(interviewImages);
	interviewText.scrollTop = (interviewText.scrollHeight-interviewText.offsetHeight)*imageScrollPercent;
}
function scrollImages() {
	if (window.innerWidth <= 800) {
		return;
	}
	let imageScrollPercent = calculateScroll(interviewText);
	interviewImages.scrollTop = (interviewImages.scrollHeight-interviewImages.offsetHeight)*imageScrollPercent;
}
function calculateScroll(element) {
	return element.scrollTop / (element.scrollHeight - element.offsetHeight);
}