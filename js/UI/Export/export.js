const mapExportProcess = (mapDetails) => {
	const exportForm = document.querySelector('.export-prompt');
	const closeBtn = document.querySelector('.export-prompt .close-btn');

	exportForm.classList.remove('invisible');
	exportForm.classList.add('flex');

	document.querySelector('.prompt-box .mapName').value =
		'Historical Topo Map Explorer Export';

	document.querySelector('.prompt-box .tags').value =
		'Living Atlas, USGS, Topographic, Topo, Quad';

	document.querySelector('.prompt-box .summary').value = `${
		mapDetails.querySelector('.name').innerHTML
	}`;

	closeBtn.addEventListener('click', (event) => {
		console.log('close');
		exportForm.classList.remove('flex');
		exportForm.classList.add('invisible');
	});
};

export { mapExportProcess };
