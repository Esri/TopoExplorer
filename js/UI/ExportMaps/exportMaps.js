const exportForm = document.querySelector('.export-prompt');
const promptBox = document.querySelector('.prompt-box');
const closeBtn = document.querySelector('.export-prompt .close-btn');
const exportBtnContainer = document.querySelector('.exportBtnContainer');
const indicator = document.querySelector('.processing-indicator');
// const exportBtns = document.querySelectorAll('.prompt-box .prompt-btns');

const closeExportPrompt = () => {
	exportForm.classList.remove('flex');
	exportForm.classList.add('invisible');
};

const openExportPromt = () => {
	exportForm.classList.remove('invisible');
	exportForm.classList.add('flex');
	closeBtn.classList.remove('invisible');
};

const removeExportBtn = () => {
	exportBtnContainer.classList.add('invisible');
	exportBtnContainer.classList.remove('flex');
};

const addExportBtn = () => {
	exportBtnContainer.classList.remove('invisible');
	exportBtnContainer.classList.add('flex');
};

const toggleProcessingIndicator = () => {
	indicator.classList.toggle('invisible');
};

const singleMapExportProcess = (mapDetails) => {
	console.log(mapDetails);

	// const mapName = mapDetails.querySelector('.name').innerHTML;
	// const mapYear = mapDetails.querySelector('.year').innerHTML;
	// const mapScale = mapDetails.querySelector('.scale').innerHTML;

	openExportPromt();
	addExportBtn();

	document.querySelector('.prompt-box .mapName').value =
		'Historical Topo Map Explorer export';

	document.querySelector('.prompt-box .tags').value =
		'Living Atlas, USGS, Topographic, Topo, Quad';

	const mapDetailSummary = mapDetails
		.map((mapDetail) => {
			console.log(mapDetail);
			const mapName = mapDetail.querySelector('.name').innerHTML;
			const mapYear = mapDetail.querySelector('.year').innerHTML;
			const mapScale = mapDetail.querySelector('.scale').innerHTML;

			return `${mapYear} ${mapName} ${mapScale}`;
		})
		.join(';');

	console.log(mapDetailSummary);

	const summaryText = `An extract of ${mapDetails.length} USGS topographic map${
		mapDetails.length > 1 ? `s` : ``
	}, accessed via the Living Atlas Historical Topo Map Explorer. ${mapDetailSummary}`;

	document.querySelector('.prompt-box .summary').value = summaryText;

	openExportPromt();
	addExportBtn();

	document.querySelector('.prompt-box .mapName').value =
		'Historical Topo Map Explorer export';

	document.querySelector('.prompt-box .tags').value =
		'Living Atlas, USGS, Topographic, Topo, Quad';

	document.querySelector('.prompt-box .summary').value = summaryText;

	closeBtn.addEventListener('click', (event) => {
		console.log('close');
		closeExportPrompt();
	});
};

document.querySelector('.prompt-box').addEventListener('click', (event) => {
	console.log(event);
	console.log(event.target);
	console.log(event.target.innerHTML);
	if (event.target.innerHTML.trim() === 'CANCEL') {
		closeExportPrompt();
	}
	if (event.target.innerHTML.trim() === 'CREATE WEB MAP') {
		promptBox.classList.add('transparency');
		closeBtn.classList.add('invisible');
		removeExportBtn();
		toggleProcessingIndicator();
	}
});

export { singleMapExportProcess };
