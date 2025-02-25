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

import {
	animationStart,
	animationEnd,
} from '../Animation/AnimationControl.js?v=0.03';
import { preventingMapInteractions } from '../EventsAndSelectors/EventsAndSelectors.js?v=0.03';
import {
	animationLoadingHTML,
	closeAnimationBtnHTML,
	animationDownloadAspectRatioPreviewElement,
	creatingDownloadHTML,
	downloadCancelMessageHTML,
	downloadAbortMessage,
} from './animationOptionsUI.js?v=0.03';
import {
	addAnimateStatusHashParam,
	removeAnimationStatusHashParam,
} from '../../support/HashParams.js?v=0.03';

//this variable is used to determine if the button events are disabled during animation
let isAnimating = false;
let isLoading = false;

//not a helpful function name when there's two functions with basically the same name.
const beginAnimation = () => {
	isAnimating = true;
	disableAnimationSpeedSlider();
	setLoadingStatus();
	togglePlayPause();
	adjustUIForAnimation();
	preventingMapInteractions();
	addDownloadAspectRatioPreviewLayer();
	addMapAnimationOverlay();
	addAnimationLoading();
	disableOpacitySlider();
	addAnimateStatusHashParam();
	animationStart();
};

const endAnimation = () => {
	isAnimating = false;
	removeMapAnimationOverlay();
	removeDownloadPreview();
	togglePlayPause();
	removeMapCardUnavailableStatus();
	resetUIAfterAnimation();
	hideAnimateCheckboxVisibility();
	enableOpacitySlider();
	resetAnimateCheckbox();
	removeAnimationStatusHashParam();
	animationEnd();
};

const cardCheckStatus = (mapIdIndex) => {
	return mapIdIndex
		.querySelector('.animate.checkbox .checkmark')
		.classList.contains('hidden');
};

const checkToposAvailableForAnimation = () => {
	const arrayOfPossibleTopos = document.querySelectorAll(
		'#pinnedList .animate.checkbox .checkmark'
	);

	const arrayOfHiddenTopos = document.querySelectorAll(
		'#pinnedList .animate.checkbox .checkmark.hidden'
	);

	if (arrayOfPossibleTopos.length === arrayOfHiddenTopos.length) {
		return true;
	}

	return false;
};

const setLoadingStatus = () => {
	isLoading ? (isLoading = false) : (isLoading = true);
};

const disableAnimationSpeedSlider = () => {
	document
		.querySelector('.animation-speed-value')
		.setAttribute('disabled', true);
};

const enableAnimationSpeedSlider = () => {
	document.querySelector('.animation-speed-value').removeAttribute('disabled');
};

const addCancelTextToAnimationLoading = () => {
	document.querySelector(
		'.animationWaitText'
	).innerHTML = `Cancelling Animation...`;
};
const addAnimationLoading = () => {
	const animationLoading = document.createElement('div');
	animationLoading.classList.add('animationLoading');
	animationLoading.innerHTML = animationLoadingHTML;

	document.querySelector('.mapAnimationOverlay').prepend(animationLoading);
};

const addAnimationCloseBtn = (isCancelled) => {
	if (isCancelled) {
		endAnimation();
		return;
	}
	const animationClose = document.createElement('div');
	animationClose.classList.add('animationClose');
	animationClose.innerHTML = closeAnimationBtnHTML;
	document.querySelector('.mapAnimationOverlay').append(animationClose);
};

const removeAnimationLoadingDiv = () => {
	if (document.querySelector('.animationLoading')) {
		document.querySelector('.animationLoading').remove();
	}
};

const removeCloseAnimationBtn = (event) => {
	if (event.target.closest('.animationLoadClose')) {
		event.target.closest('.animationLoadClose').remove();
	}
};

const togglePlayPause = () => {
	document
		.querySelector('.icon .play-pause .play')
		.classList.toggle('invisible');

	document
		.querySelector('.icon .play-pause .pause')
		.classList.toggle('invisible');
};

const addDownloadAspectRatioPreviewLayer = () => {
	const downloadPreview = document.createElement('div');
	downloadPreview.innerHTML = animationDownloadAspectRatioPreviewElement;
	document.querySelector('#viewDiv').prepend(downloadPreview);
};

const removeDownloadPreview = () => {
	document.querySelector('.downloadPreview').parentElement.remove();
};

const addMapAnimationOverlay = () => {
	const closeDivOverlay = document.createElement('div');
	closeDivOverlay.className = 'mapAnimationOverlay';
	closeDivOverlay.style = `position: absolute; z-index: 3;  width:500px;
  height: 500px;
  background: linear-gradient(135deg, rgba(241,244,245,1) 20%, rgba(241,244,245,0) 50%);`;

	document.querySelector('#viewDiv').prepend(closeDivOverlay);
};

const addDownloadingNotification = () => {
	document.querySelector('.mapAnimationOverlay').innerHTML =
		creatingDownloadHTML;
};

const removeDownloadIndicator = () => {
	document.querySelector('.mapAnimationOverlay div').remove();
};

const addDownloadCancel = () => {
	document
		.querySelector('.mapAnimationOverlay a')
		.classList.remove('invisible');
};

const addDownloadCancelMessage = () => {
	document.querySelector('.mapAnimationOverlay .downloadIndicator').innerHTML =
		downloadCancelMessageHTML;
};

const addDownloadAbortMessage = () => {
	document.querySelector('.mapAnimationOverlay .downloadIndicator').innerHTML =
		downloadAbortMessage;
};

const addDownloadErrorMessage = (errorMessage) => {
	document.querySelector('.mapAnimationOverlay .downloadIndicator').innerHTML =
		errorMessage;
};

const removeMapAnimationOverlay = () => {
	document.querySelector('.mapAnimationOverlay').remove();
};

const removeHighlight = () => {
	if (document.querySelector('.animating')) {
		document.querySelector('.animating').classList.remove('animating');
	}
};

const enableOpacitySlider = () => {
	document.querySelectorAll('#pinnedList .opacity-slider').forEach((slider) => {
		slider.disabled = false;
	});
};

const disableOpacitySlider = () => {
	document.querySelectorAll('#pinnedList .opacity-slider').forEach((slider) => {
		slider.disabled = true;
	});
};

const showAnimateCheckboxVisibility = () => {
	document
		.querySelectorAll('#pinnedList .animate.checkbox.hidden')
		.forEach((box) => {
			box.classList.remove('hidden');
		});
};

const hideAnimateCheckboxVisibility = () => {
	document.querySelectorAll('#pinnedList .animate.checkbox').forEach((box) => {
		box.classList.add('hidden');
	});
};

const showAvailableTopoCheckbox = (oid) => {
	const mapCard = document.querySelector(
		`#pinnedList .map-list-item[oid="${oid}"]`
	);
	const mapCardCheckbox = mapCard.querySelector('.checkbox');

	mapCardCheckbox.classList.remove('hidden');
};

const hideUnavailableTopoCheckbox = (oid) => {
	document.querySelector(`#pinnedList .map-list-item[oid="${oid}"]`);
	const mapCard = document.querySelector(
		`#pinnedList .map-list-item[oid="${oid}"]`
	);
};

const uncheckMapCard = (oid) => {
	document.querySelector(`#pinnedList .map-list-item[oid="${oid}"]`);
	const mapCard = document.querySelector(
		`#pinnedList .map-list-item[oid="${oid}"]`
	);
	const mapCardCheckmark = mapCard.querySelector('.checkmark');
	mapCardCheckmark.classList.add('hidden');
};

const resetAnimateCheckbox = () => {
	document.querySelectorAll('#pinnedList .animate.checkbox').forEach((box) => {
		box.querySelector('.checkmark').classList.remove('hidden');
	});
};

const setMapCardUnavailableStatus = (oid) => {
	const mapCard = document.querySelector(
		`#pinnedList .map-list-item[oid="${oid}"]`
	);

	mapCard.classList.add('transparency');
};

const removeMapCardUnavailableStatus = () => {
	document.querySelectorAll('#pinnedList .map-list-item').forEach((card) => {
		card.classList.remove('transparency');
	});
};

const toggleIconAndBtnTransparency = () => {
	//add transparency to the explorer mode button
	document
		.querySelector('.mode.explorer-mode-btn')
		.classList.toggle('transparency');

	//all map-card-action-item icons are made transparent
	document.querySelectorAll('#pinnedList .icon').forEach((icon) => {
		icon.classList.toggle('transparency');
	});

	//add transparency to the top-level icon-functions
	document
		.querySelectorAll('.pinned-mode-options .pin-management .icon')
		.forEach((icon) => {
			icon.classList.toggle('transparency');
		});

	//remove the search/zoom/login widgets from view
	document
		.querySelector('.esri-ui-top-right.esri-ui-corner')
		.classList.toggle('invisible');

	document.querySelectorAll('#pinnedList .mapCard-slider').forEach((slider) => {
		slider.classList.toggle('transparency');
	});
};

const adjustUIForAnimation = () => {
	toggleIconAndBtnTransparency();
};

const resetUIAfterAnimation = () => {
	toggleIconAndBtnTransparency();
};

export {
	beginAnimation,
	endAnimation,
	setLoadingStatus,
	enableAnimationSpeedSlider,
	hideUnavailableTopoCheckbox,
	uncheckMapCard,
	showAvailableTopoCheckbox,
	checkToposAvailableForAnimation,
	showAnimateCheckboxVisibility,
	setMapCardUnavailableStatus,
	removeAnimationLoadingDiv,
	removeCloseAnimationBtn,
	cardCheckStatus,
	addCancelTextToAnimationLoading,
	addAnimationCloseBtn,
	addDownloadingNotification,
	addDownloadCancel,
	addDownloadErrorMessage,
	addDownloadCancelMessage,
	addDownloadAbortMessage,
	removeDownloadIndicator,
	resetUIAfterAnimation,
	removeHighlight,
	isAnimating,
	isLoading,
};
