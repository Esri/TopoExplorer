import {
	animationStart,
	animationEnd,
	// setInitialDuration,
} from '../Animation/AnimatingLayers.js?v=0.01';
import { preventingMapInteractions } from '../EventsAndSelectors/EventsAndSelectors.js?v=0.01';
import {
	animationLoadingHTML,
	closeAnimationBtnHTML,
} from './animationOptionsUI.js?v=0.01';

//this variable is used to determine if the button events are disabled during animation
let isAnimating = false;
let isLoading = false;
console.log('animation');
const beginAnimation = () => {
	isAnimating = true;
	setLoadingStatus();
	togglePlayPause();
	adjustUIForAnimation();
	// toggleAnimateCheckboxVisibility();
	// showAnimateCheckboxVisibility()
	preventingMapInteractions();
	addMapAnimationOverlay();
	addAnimationLoading();
	disableOpacitySlider();
	//this last function, it's not a good name. Write something clearer.
	animationStart();
};

//this is also a terrible function name
const endAnimation = () => {
	isAnimating = false;
	removeMapAnimationOverlay();
	togglePlayPause();
	removeMapCardUnavailableStatus();
	resetUIAfterAnimation();
	// toggleAnimateCheckboxVisibility();
	hideAnimateCheckboxVisibility();
	enableOpacitySlider();
	resetAnimateCheckbox();
	//this last function, it's not a good name. Write something clearer.
	animationEnd();
};

// console.log('test', test);
// const animationLoadingHTML = `
//                                       <div style='position: absolute; left:25px; top: 25px;'>
//                                         <div style='display: flex;'>
//                                           <div class='spinner'>
//                                             <calcite-icon class="queryIndicator" icon="spinner" scale="l" aria-hidden="true" calcite-hydrated=""></calcite-icon>
//                                           </div>
//                                           <div class='animationLoadClose'>
//                                             <calcite-icon class="cancelAnimationBtn" icon="x-circle-f" scale="s" aria-hidden="true" calcite-hydrated=""></calcite-icon>
//                                           </div>
//                                         </div>
//                                         <div class='animationWaitText'>Creating Animation</div>
//                                       </div>
//                               `;

// const closeAnimationBtnHTML = `
//                                 <div class='animationOptionsWrapper'>
//                                   <div class='downloadOptions invisible'>
//                                     <div>
//                                       <h4>HORIZONTAL</h4>
//                                       <div>1920 x 1080</div>
//                                       <div>720 x 1080</div>
//                                     </div>
//                                     <div>
//                                       <h4>SQUARE</h4>
//                                       <div>1920 x 1080</div>
//                                       <div>720 x 1080</div>
//                                     </div>
//                                     <div>
//                                       <h4>VERTICAL</h4>
//                                       <div>1920 x 1080</div>
//                                       <div>720 x 1080</div>
//                                     </div>
//                                   </div>
//                                   <div style='display: flex; position: absolute; left:25px; top: 25px;'>
//                                     <div class='closeAnimationBtn' style='text-align: right;'>
//                                       <svg width="64" height="64" viewBox="0 0 32 32" >
//                                         <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"></path>
//                                       </svg>
//                                     </div>
//                                     <div class='downloadAnimationBtn' style='text-align: right;'>
//                                       <svg width="64" height="64" viewBox="0 0 32 32" >
//                                       <path d="M25 27H8v-1h17zm-3.646-9.646l-.707-.707L17 20.293V5h-1v15.293l-3.646-3.646-.707.707 4.853 4.853z"></path>
//                                       </svg>
//                                     </div>
//                                   </div>
//                                 </div>
//                               `;

console.log('something', closeAnimationBtnHTML);
const cardCheckStatus = (mapIdIndex) => {
	return mapIdIndex
		.querySelector('.animate.checkbox .checkmark')
		.classList.contains('hidden');
};

const setLoadingStatus = () => {
	isLoading ? (isLoading = false) : (isLoading = true);
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

const addMapAnimationOverlay = () => {
	const closeDivOverlay = document.createElement('div');
	closeDivOverlay.className = 'mapAnimationOverlay';
	closeDivOverlay.style = `position: absolute; z-index: 3;  width:500px;
  height: 500px;
  background: linear-gradient(135deg, rgba(241,244,245,1) 20%, rgba(241,244,245,0) 50%);`;

	// closeDivOverlay.innerHTML = closeBtn;
	document.querySelector('#viewDiv').prepend(closeDivOverlay);
};

const removeMapAnimationOverlay = () => {
	document.querySelector('.mapAnimationOverlay').remove();
	// document.querySelector('#viewDiv').remove(closeDivOverlay);
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
	console.log('checkbox');
	const mapCard = document.querySelector(
		`#pinnedList .map-list-item[oid="${oid}"]`
	);
	const mapCardCheckbox = mapCard.querySelector('.checkbox');
	console.log(mapCardCheckbox);
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
	console.log(mapCard);
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
	resetUIAfterAnimation,
	removeHighlight,
	isAnimating,
	isLoading,
	// speeds,
};
