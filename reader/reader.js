let readerData;
fetch('reader.json')
	.then((response) => response.json())
	.then((data) => {
		readerData = data;
		populateContent();
	})

function populateContent() {	
	let keywords = [];
	let articles = [];
	let results = {};
	for (let key of Object.keys(readerData)) {
		let entry = readerData[key];

		// Add keyword to array if not already in it
		if (!keywords.includes(entry['keyword'])) {
			keywords.push(entry['keyword']);
			results[entry['keyword']] = [];
		}

		// Add article to array if not already in it
		if (!articles.includes(entry['article'])) {
			articles.push(entry['article']);
		}

		// Build out result string
		let result = `
			<li class="reader-result">
				<p class="reader-result-citation">${entry['citation']}</p>
				<p class="reader-result-quote">${entry['quote']}</p>
				<button class="reader-result-button" onclick="openArticle('${entry['article']}', '${entry['keyword']}', this)">READ</button>
			</li>
		`;
		results[entry['keyword']].push(result);
	}

	// Build keywords string based on collected data
	keywords.sort();
	let keywordsTemp = '';
	for (let keyword of keywords) {
		keywordsTemp += `
			<li class="reader-keyword hover" data-keyword="${keyword}" onclick="toggleKeyword('${keyword}')">
				<div class="reader-keyword-check"></div>
				<span class="reader-keyword-word">${keyword}</span>
			</li>
		`;
	}

	// Add keywords list to DOM
	const keywordsList = document.querySelector('.reader-keywords-list');
	keywordsList.innerHTML = keywordsTemp;

	// Build out all results and hide for toggling later
	let resultsTemp = '';
	for (let key of Object.keys(results).sort()) {
		resultsTemp += `
			<div class="reader-results-group" data-keyword="${key}" data-active="0">
				<p class="reader-results-keyword">
					KEYWORD: <span>${key}</span>
				</p>
				<ol class="reader-results-list">
		`;
		for (let result of results[key]) {
			resultsTemp += result;
		}
		resultsTemp += "</ol></div>";
	}

	// Add results to DOM
	const resultsDOM = document.querySelector('.reader-results');
	resultsDOM.innerHTML += resultsTemp;
}

function toggleKeyword(keyword) {
	let resultsGroup = document.querySelector(`.reader-results-group[data-keyword="${keyword}"]`);
	let keywordButton = document.querySelector(`.reader-keyword[data-keyword="${keyword}"]`);
	if (parseInt(resultsGroup.dataset.active) == 1) {
		resultsGroup.dataset.active = 0;
		keywordButton.dataset.active = 0;
	} else {
		resultsGroup.dataset.active = 1;
		keywordButton.dataset.active = 1;
	}

	handlePlaceholder();
}

// Adjust placeholder image
function handlePlaceholder() {
	const placeholder = document.querySelector('.reader-placeholder');
	if (parseInt(placeholder.dataset.state) != 2) {
		placeholder.dataset.state = parseInt(placeholder.dataset.state) + 1;
	}
	if (parseInt(placeholder.dataset.state) == 1) {
		const readerKeywords = document.querySelector('.reader-keywords');
		const readerResults = document.querySelector('.reader-results');
		readerKeywords.dataset.init = 0;
		readerResults.dataset.active = 1;
	} else {
		const readerArticles = document.querySelector('.reader-articles');
		readerArticles.dataset.active = 1;
	}
}

let activeArticle = 'Lever';
let activeKeyword = 'Lever';
function openArticle(article, keyword, button) {
	const articles = document.querySelector('.reader-articles');

	// Set correct active button
	for (let button of document.querySelectorAll('.reader-result-button')) {
		button.dataset.active = 0;
	}
	button.dataset.active = 1;

	// Check if article already open
	if (activeArticle != article) {
		activeArticle = article;

		// Remove any previous article
		articles.innerHTML = '';

		// Fetch article if not already open
		fetch('articles/'+article)
			.then((response) => response.text())
			.then((data) => {
				articles.innerHTML = data;

				// Highlight keyword in article
				for (let keywordInstance of articles.querySelectorAll(`[data-keyword="${keyword}"]`)) {
					keywordInstance.dataset.highlight = 1;
				}
			})
	} else {
		// Remove all previous highlights
		for (let keywordInstance of articles.querySelectorAll('[data-keyword]')) {
			keywordInstance.dataset.highlight = 0;
		}

		// Highlight keyword in article
		for (let keywordInstance of articles.querySelectorAll(`[data-keyword="${keyword}"]`)) {
			keywordInstance.dataset.highlight = 1;
		}
	}

	handlePlaceholder();
}