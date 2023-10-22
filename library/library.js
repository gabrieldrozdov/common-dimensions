// Fetch and build library + filters
let libraryData;
fetch('/library.json')
	.then((response) => response.json())
	.then((json) => {
		libraryData = json;
		buildLibrary();
	})

let filters = [];
function buildLibrary() {
	let libraryContent = document.querySelector('.library-content');
	let index = 0;

	// Randomize order of images
	let shuffledOrder = shuffle(Object.keys(libraryData));

	// Build library items and collect tags
	for (let key of shuffledOrder) {
		let tags = '';
		let dataTags = libraryData[key]['tags'].split(',');
		let trimmedTags = '';
		let tagIndex = 0;
		for (let tag of dataTags) {
			let trimmedTag = tag.trim();
			trimmedTags += ","+trimmedTag;
			if (!filters.includes(trimmedTag)) {
				filters.push(trimmedTag);
			}
			tags += trimmedTag;
			if (tagIndex < dataTags.length-1) {
				tags += " + ";
			}
			tagIndex++;
		}
		let libraryItem = document.createElement('button');
		libraryItem.dataset.index = index;
		libraryItem.dataset.filters = trimmedTags;
		libraryItem.classList.add('library-item');
		libraryItem.innerHTML = `
			<img src="/assets/library/${libraryData[key]['image']}">
			<h3>${libraryData[key]['title']}</h3>
			<p>${libraryData[key]['description']}</p>
			<p class='library-item-tags'>${tags}</p>
		`
		libraryItem.addEventListener('click', () => {openLightbox(libraryData[key]['image'])});
		libraryContent.appendChild(libraryItem);
		index++;
	}

	// Build filters
	let libraryFilters = document.querySelector('.library-filters');
	filters = filters.sort();
	for (let filter of filters) {
		let filterButton = document.createElement('button');
		filterButton.dataset.active = 0;
		filterButton.dataset.filter = filter;
		filterButton.classList.add('library-filter');
		filterButton.innerText = filter;
		filterButton.addEventListener('click', () => {toggleFilter(filter)});
		libraryFilters.appendChild(filterButton);
	}

	refreshHoverEffects();
	libraryMasonry();
	window.addEventListener('resize', libraryMasonry);
}

// Add or remove filters
let activeFilters = [];
function addFilter(filter) {
	if (!activeFilters.includes(filter)) {
		activeFilters.push(filter);
	}
	let filterButton = document.querySelector(`.library-filter[data-filter="${filter}"]`);
	filterButton.dataset.active = 1;
	highlightItems();
}
function removeFilter(filter) {
	activeFilters = activeFilters.filter((i) => i != filter);
	let filterButton = document.querySelector(`.library-filter[data-filter="${filter}"]`);
	filterButton.dataset.active = 0;
	highlightItems();
}
function toggleFilter(filter) {
	if (!activeFilters.includes(filter)) {
		addFilter(filter);
	} else {
		removeFilter(filter);
	}
}
function clearFilters() {
	for (let libraryFilter of document.querySelectorAll('.library-filter')) {
		libraryFilter.dataset.active = 0;
	}
	for (let libraryItem of document.querySelectorAll('.library-item')) {
		libraryItem.dataset.highlight = 0;
	}
	activeFilters = [];
}
function highlightItems() {
	for (let libraryItem of document.querySelectorAll('.library-item')) {
		libraryItem.dataset.highlight = 0;
		let tags = libraryItem.dataset.filters.slice(',');
		for (let filter of activeFilters) {
			if (tags.includes(filter)) {
				libraryItem.dataset.highlight = 1;
				break
			}
		}
	}
}

// Create masonry grid
let reposition;
function libraryMasonry() {
	clearTimeout(reposition);
	let libraryContent = document.querySelector('.library-content');
	let libraryItems = document.querySelectorAll('.library-item');
	libraryContent.style.height = '';
	for (let libraryItem of libraryItems) {
		libraryItem.dataset.show = 0;
		libraryItem.style.transform = `unset`;
		libraryItem.style.transitionDelay = '';
	}

	// Adjust for screen size
	let cols = 1;
	if (window.innerWidth < 600) {
		cols = 1;
	} else if (window.innerWidth < 800) {
		cols = 2;
	} else if (window.innerWidth < 1000) {
		cols = 3;
	} else if (window.innerWidth < 1200) {
		cols = 4;
	} else {
		cols = 5;
	}

	reposition = setTimeout(() => {
		let i = 0;
		for (let libraryItem of libraryItems) {
			let index = parseInt(libraryItem.dataset.index);
			let elementAbove = document.querySelector(`[data-index="${index-cols}"]`);
			if (elementAbove != undefined && elementAbove != null) {
				let aboveBottom = elementAbove.getBoundingClientRect().bottom;
				let currentTop = libraryItem.getBoundingClientRect().top;
				let delta = currentTop-aboveBottom;
				libraryItem.style.transform = `translateY(-${delta-20}px)`;
			}
			i += 100;
			setTimeout(() => {
				libraryItem.dataset.show = 1;
			}, i)
		}
	}, 250)

	// Remove space at the bottom of the grid
	let lowestPoint = 0;
	setTimeout(() => {
		for (let i=libraryItems.length-1; i > libraryItems.length-6; i--) {
			let lowPoint = libraryItems[i].getBoundingClientRect().bottom;
			if (lowPoint > lowestPoint) {
				lowestPoint = lowPoint;
			}
		}
		let bottom = libraryContent.getBoundingClientRect().bottom;
		libraryContent.style.height = libraryContent.offsetHeight-(bottom-lowestPoint-20) + "px";
	}, 500)
}

// Lightbox
function openLightbox(img) {
	let lightbox = document.querySelector('.lightbox');
	let lightboxImage = lightbox.querySelector('img');
	lightboxImage.src = '/assets/library/' + img;
	lightbox.dataset.active = 1;
	setTimeout(() => {
		document.addEventListener('click', closeLightbox);
	}, 50)
}
function closeLightbox() {
	let lightbox = document.querySelector('.lightbox');
	lightbox.dataset.active = 0;
	document.removeEventListener('click', closeLightbox);
}

// Helper: shuffle array
function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}