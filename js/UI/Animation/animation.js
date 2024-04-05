import {
	animationStart,
	animationEnd,
	// setInitialDuration,
} from '../Animation/AnimatingLayers.js?v=0.01';
import { preventingMapInteractions } from '../EventsAndSelectors/EventsAndSelectors.js?v=0.01';
import {
	animationLoadingHTML,
	closeAnimationBtnHTML,
	animationDownloadAspectRatioPreviewElement,
	creatingDownloadHTML,
	downloadErrorMessageHTML,
} from './animationOptionsUI.js?v=0.01';
import {
	addAnimateStatusHashParam,
	removeAnimationStatusHashParam,
} from '../../support/HashParams.js?v=0.01';

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
	// toggleAnimateCheckboxVisibility();
	// showAnimateCheckboxVisibility()
	preventingMapInteractions();
	addDownloadAspectRatioPreviewLayer();
	addMapAnimationOverlay();
	addAnimationLoading();
	disableOpacitySlider();
	//this last function, it's not a good name. Write something clearer.
	addAnimateStatusHashParam();
	animationStart();
};

//this is also a terrible function name
const endAnimation = () => {
	isAnimating = false;
	removeMapAnimationOverlay();
	removeDownloadPreview();
	togglePlayPause();
	removeMapCardUnavailableStatus();
	resetUIAfterAnimation();
	// toggleAnimateCheckboxVisibility();
	hideAnimateCheckboxVisibility();
	enableOpacitySlider();
	resetAnimateCheckbox();
	//this last function, it's not a good name. Write something clearer.
	removeAnimationStatusHashParam();
	animationEnd();
};

const cardCheckStatus = (mapIdIndex) => {
	return mapIdIndex
		.querySelector('.animate.checkbox .checkmark')
		.classList.contains('hidden');
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

	// closeDivOverlay.innerHTML = closeBtn;
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

const addDownloadErrorMessage = () => {
	document.querySelector('.mapAnimationOverlay .downloadIndicator').innerHTML =
		downloadErrorMessageHTML;
};

const removeMapAnimationOverlay = () => {
	document.querySelector('.mapAnimationOverlay').remove();
	// document.querySelector('#viewDiv').remove(closeDivOverlay);
};

//thisneeds a better name it's highlighting the topo's card while the corresponding topo is visible during animation.
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

// const toggleAnimateCheckboxVisibility = () => {
// 	document.querySelectorAll('#pinnedList .animate.checkbox').forEach((box) => {
// 		box.classList.toggle('hidden');
// 	});
// };

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
	// const mapCardCheckbox = mapCard.querySelector('.checkbox')
	// mapCard.closest
	// console.log('no cechkbox', mapCardCheckbox)
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
	// document.querySelector(`#pinnedList .map-list-item[oid="${oid}"]`).classList.add('unavailable')
	// document.querySelector(`#pinnedList .map-list-item[oid="${oid}"]`)
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
	// setAnimationSlider,
	beginAnimation,
	endAnimation,
	setLoadingStatus,
	enableAnimationSpeedSlider,
	hideUnavailableTopoCheckbox,
	uncheckMapCard,
	showAvailableTopoCheckbox,
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
	removeDownloadIndicator,
	resetUIAfterAnimation,
	removeHighlight,
	isAnimating,
	isLoading,
	// speeds,
};
