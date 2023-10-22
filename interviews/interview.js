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