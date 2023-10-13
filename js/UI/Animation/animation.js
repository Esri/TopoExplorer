import // listOfPinnedCards,
// listOfPinnedIDs,
// animationStart,
'../MapCards/ListOfMaps.js?v=0.01';

import {
	animationStart,
	setInitialDuration,
} from '../Animation/AnimatingLayers.js?v=0.01';

import { preventingMapInteractions } from '../EventsAndSelectors/EventsAndSelectors.js?v=0.01';

//this variable is used to determine if the button events are disabled during animation
let isAnimating = false;
const speeds = [];

//move thi to animatedlayers
const animationSpeeds = (() => {
	const animationFastSpeed = 500;
	const animationSlowSpeed = 2000;
	let speedSetting = animationSlowSpeed;
	speeds.push(animationSlowSpeed);
	const speedLevelIntervals = (animationSlowSpeed - animationFastSpeed) / 10;
	while (speedSetting !== animationFastSpeed) {
		speedSetting = speedSetting - speedLevelIntervals;
		speeds.push(speedSetting);
	}
	setInitialDuration(speeds);
})();
console.log(speeds);

const beginAnimation = () => {
	// console.log(listOfPinnedCards);
	// console.log(listOfPinnedIDs);
	isAnimating = true;
	togglePlayPause();
	adjustUIForAnimation();
	toggleAnimateCheckboxVisibility();
	preventingMapInteractions();
	addMapCloseOverlay();
	animationStart();
};

const endAnimation = () => {
	isAnimating = false;
	removeMapCloseOverlay();
	togglePlayPause();
	resetUIAfterAnimation();
	toggleAnimateCheckboxVisibility();
};

const togglePlayPause = () => {
	document
		.querySelector('.icon .play-pause .play')
		.classList.toggle('invisible');

	document
		.querySelector('.icon .play-pause .pause')
		.classList.toggle('invisible');
};

const addMapCloseOverlay = () => {
	const closeDivOverlay = document.createElement('div');
	closeDivOverlay.className = 'mapCloseOverlay';
	closeDivOverlay.style = 'position: absolute; left: 25px; z-index: 3;';
	const closeBtn =
		'<svg width="64" height="64" viewBox="0 0 32 32" ><path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"></path></svg>';
	closeDivOverlay.innerHTML = closeBtn;
	document.querySelector('#viewDiv').prepend(closeDivOverlay);
};

const removeMapCloseOverlay = () => {
	document.querySelector('.mapCloseOverlay').remove();
	// document.querySelector('#viewDiv').remove(closeDivOverlay);
};

const toggleAnimateCheckboxVisibility = () => {
	document.querySelectorAll('#pinnedList .animate.checkbox').forEach((box) => {
		box.classList.toggle('hidden');
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
	resetUIAfterAnimation,
	isAnimating,
	speeds,
};
