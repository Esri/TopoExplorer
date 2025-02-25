/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { removeExportParam } from '../../support/HashParams.js?v=0.03';
import { createWebMapExportDefinition } from '../ExportMaps/ExportMapsPrompt.js?v=0.03';

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
	const exportTitleField = promptBox.querySelector('.title') || '';
	const exportTagsField = promptBox.querySelector('.tags') || '';
	const exportSummaryField = promptBox.querySelector('.summary') || '';

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
