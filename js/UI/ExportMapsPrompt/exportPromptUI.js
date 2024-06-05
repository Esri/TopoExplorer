import { removeExportParam } from '../../support/HashParams.jsv=0.03';
import { createWebMapExportDefinition } from '../ExportMaps/ExportMapsPrompt.jsv=0.03';

const exportForm = document.querySelector('.export-prompt');
const promptBox = document.querySelector('.prompt-box');
const closeBtn = document.querySelector('.export-prompt .close-btn');
const exportBtnContainer = document.querySelector('.exportBtnContainer');
const indicator = document.querySelector('.processing-indicator');

const successMessage = 'Webmap successfully created!';
const failMessage = `Failed to export webmap. 
Your login session may have expired`;

const webBtnClass = 'goToWebMap-btn';
const promptBtnsClass = 'prompt-btns';

const exportText = {};
let webMapURL;

let accountURL;

const setUserContentURL = (urlKey, urlBase, url) => {
	//NOTE: this conditional is set to determine if the user has logged in, and if a url for an exported webmap needs to be parsed. I think I could come up with a different answer other than using this conditional?
	// if (!urlBase) {
	// 	return;
	// }

	if (!urlKey || !urlBase) {
		accountURL = `${url}`;
		return;
	}

	accountURL = `https://${urlKey}.${urlBase}`;
};

const setWebMapURL = (itemID) => {
	webMapURL = `${accountURL}/home/item.html?id=${itemID}`;
};

const exportFields = `
<form>
  <div class='form-element'>
    <label> ArcGIS Online Web Map Name* </label>
    <br>
    <textarea class='title' type='text' contenteditable='true'></textarea>
  </div>
  <div class='form-element'>
    <label>Tags</label>
    <br>
    <textarea class='tags' type='text' contenteditable='true'></textarea>
  </div>
  <div class='form-element'>
    <label>Summary</label>
    <br>
    <textarea class='summary' type='text' contenteditable='true'></textarea>
  </div>
  <div class='exportBtnContainer flex'>
    <div class='${promptBtnsClass}'>CANCEL</div>
    <div class='${promptBtnsClass} export'>CREATE WEB MAP</div>
  </div>

</form>`;

const fillTextFields = () => {
	const exportTitleField = promptBox.querySelector('.title');
	const exportTagsField = promptBox.querySelector('.tags');
	const exportSummaryField = promptBox.querySelector('.summary');

	exportTitleField.value = exportText.title;
	exportTagsField.value = exportText.tags;
	exportSummaryField.value = exportText.summary;
};

const goToWebMapBtn = `
  <div class='export-response'>
  ${successMessage}
    <div class='${webBtnClass}'>
      Open webmap
    </div>
  </div>`;

const closeExport = `
  <div class='export-response'>
  ${failMessage}
    <div class='${promptBtnsClass}'>
      CLOSE
    </div>
  </div>`;

const successMessagePrompt = () => {
	document.querySelector('.prompt-box').innerHTML = goToWebMapBtn;
};

const failureMessagePrompt = () => {
	document.querySelector('.prompt-box').innerHTML = closeExport;
};

const openExportPrompt = () => {
	exportForm.classList.remove('invisible');
	exportForm.classList.add('flex');
	closeBtn.classList.remove('invisible');
};

const closeExportPrompt = () => {
	removeExportParam();
	exportOver();
	exportForm.classList.remove('flex');
	exportForm.classList.add('invisible');
	document.querySelector('.prompt-box').innerHTML = exportFields;
};

//NOTE: these two functions should be combined into one?
const exportOver = () => {
	indicator.classList.add('invisible');
	promptBox.classList.remove('transparency');
};

const exportInProgress = () => {
	indicator.classList.remove('invisible');
	promptBox.classList.add('transparency');
};

const addProcessingIndicator = () => {
	indicator.classList.remove('invisible');
};

const addPrmoptBoxTransparency = () => {
	promptBox.classList.add('transparency');
};

const removeExportBtn = () => {
	exportBtnContainer.classList.add('invisible');
	exportBtnContainer.classList.remove('flex');
};

const addExportBtn = () => {
	exportBtnContainer.classList.remove('invisible');
	exportBtnContainer.classList.add('flex');
};

promptBox.addEventListener('click', (event) => {
	event.preventDefault();
	if (!event.target.classList.contains(webBtnClass)) {
		return;
	}

	window.open(webMapURL, '_blank');
	closeExportPrompt();
});

promptBox.addEventListener('click', (event) => {
	if (event.target.innerHTML.trim() === 'CANCEL') {
		closeExportPrompt();
	}

	if (event.target.innerHTML.trim() === 'CLOSE') {
		closeExportPrompt();
	}

	if (event.target.innerHTML.trim() === 'CREATE WEB MAP') {
		if (document.querySelector('.export-prompt textarea').value.trim() === '') {
			return;
		}

		createWebMapExportDefinition();
		removeExportBtn();
		exportInProgress();
		addPrmoptBoxTransparency();
	}
});

closeBtn.addEventListener('click', (event) => {
	closeExportPrompt();
});

const exportTitleQC = () => {
	promptBox
		.querySelector('.export-prompt textarea')
		.addEventListener('input', (event) => {
			event.preventDefault();
			if (
				promptBox.querySelector('.export-prompt textarea').value.trim() === ''
			) {
				promptBox
					.querySelector(`.${promptBtnsClass}.export`)
					.classList.add('transparency');
			} else {
				promptBox
					.querySelector(`.${promptBtnsClass}.export`)
					.classList.remove('transparency');
			}
		});
};

export {
	successMessagePrompt,
	failureMessagePrompt,
	setUserContentURL,
	setWebMapURL,
	closeExportPrompt,
	exportOver,
	fillTextFields,
	exportTitleQC,
	addExportBtn,
	openExportPrompt,
	exportText,
};
