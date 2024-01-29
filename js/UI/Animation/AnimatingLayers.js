//NOTE: Rename this module to AnimationControl.

import {
	removeAnimationLoadingDiv,
	addAnimationCloseBtn,
	removeHighlight,
	cardCheckStatus,
	endAnimation,
	isAnimating,
} from './animation.js?v=0.01';
import {
	findTopoLayer,
	mapHaloGraphicLayer,
	currentStateOfPinnedList,
} from '../MapCards/ListOfMaps.js?v=0.01';
import {
	imageExport,
	cancelImageRequest,
} from '../../support/ImageExportQuery.js?v=0.01';
import {
	createMediaLayer,
	createArrayOfImageElements,
	removeMediaLayer,
	createImageElementForMediaLayer,
	removeTopoImageElements,
} from '../../map/MediaLayer.js?v=0.01';

const animationSpeedSlider = document.querySelector('.animation-speed-value');

let isCancelled = false;
let mapIdIndex = -1;
let isCardUnchecked;
let arrayOfMapImages = [];
let arrayOfImageData = [];
let animationInterval;
let duration;

let pinListCurrentOrder;
const speeds = [2000, 1000, 800, 500, 400, 200, 100, 20, 0];

//This currently doesn't do anything. 'isCancelled' isn't being evaluated for anything. It was, but it's not now...currently
//this function is being called in the 'eventsAndSelectors' module.
const setCancelledStatus = (status) => {
	isCancelled = status;
};

const setAnimationSlider = (animationSpeedSlider, speedArray) => {
	animationSpeedSlider.max = (speedArray.length - 1) * 10;
	animationSpeedSlider.value = ((speedArray.length - 1) * 10) / 2;
};

const setInitialDuration = (speedArray) => {
	duration = speedArray[(speedArray.length - 1) / 2];
};

setAnimationSlider(animationSpeedSlider, speeds);
setInitialDuration(speeds);

const setPinListCurrentOrder = () => {
	pinListCurrentOrder = currentStateOfPinnedList();
};

const getAnimatingImages = async () => {
	await createArrayOfImageElements(arrayOfMapImages);
};

const removeAnimatingImages = () => {
	arrayOfMapImages.length = 0;
};

const hideMapHalos = () => {
	mapHaloGraphicLayer.visible = false;
};

const showMapHalos = () => {
	mapHaloGraphicLayer.visible = true;
};

const hideTopoLayers = () => {
	pinListCurrentOrder.forEach((card, index) => {
		findTopoLayer(
			card.querySelector('.map-list-item').attributes.oid.value
		).then((layer) => {
			layer.visible = false;
		});
	});
};

const showTopoLayers = () => {
	pinListCurrentOrder.forEach((card, index) => {
		const cardId = card.querySelector('.map-list-item').attributes.oid.value;

		findTopoLayer(cardId).then((layer) => {
			layer.visible = true;
		});
	});
};

const exportingTopoImageAndCreatingImageElement = async () => {
	for await (const card of pinListCurrentOrder) {
		const cardId = card.querySelector('.map-list-item').attributes.oid.value;
		const currentOpacity = card.querySelector('.opacity-slider').value / 100;

		await imageExport(cardId, currentOpacity, isCancelled).then(
			async (imageData) => {
				arrayOfImageData.push(imageData);
				await createImageElementForMediaLayer(imageData);
			}
		);
	}
};

//NOTE: this is the hub for all animation related data is called. So how would you manage these functions if the animation is cancelled during the load? What is the risk condition?
const animationStart = async () => {
	setPinListCurrentOrder();
	hideMapHalos();
	hideTopoLayers();
	await exportingTopoImageAndCreatingImageElement();
	await createMediaLayer();
	await getAnimatingImages();
	startAnimationInterval();
	removeAnimationLoadingDiv();
	checkAnimationLoadStatus();
	return;
};

const checkAnimationLoadStatus = () => {
	if (isCancelled) {
		addAnimationCloseBtn(isCancelled);

		setCancelledStatus(false);
		return;
	}

	addAnimationCloseBtn();
};
//note: some of these functions have more UI-centric. They could probably be moved into another module (i.e.: the animation.js module.)
const animationEnd = async () => {
	stopAnimationInterval();
	removeHighlight();
	showMapHalos();
	showTopoLayers();
	removeMediaLayer();
	revokeGeneratedURLs();
	removeTopoImageElements();
	removeAnimatingImages();
	resetMapIdIndex();
};

const stopAnimationInterval = () => {
	clearInterval(animationInterval);
	animationInterval = null;
};
const revokeGeneratedURLs = () => {
	while (arrayOfImageData.length > 0) {
		URL.revokeObjectURL(arrayOfImageData[0].urlDataObj);
		arrayOfImageData.shift();
	}
};

const resetMapIdIndex = () => {
	mapIdIndex = -1;
};

animationSpeedSlider.addEventListener('change', (event) => {
	const value = Math.floor(event.target.value / speeds.length);
	duration = speeds[value];
	if (isAnimating) {
		stopAnimationInterval();
		startAnimationInterval();
	}
});

const startAnimationInterval = () => {
	animationInterval = setInterval(animate, duration);
};

const animate = () => {
	if (mapIdIndex !== -1) {
		if (arrayOfMapImages[mapIdIndex].opacity !== 0) {
			arrayOfMapImages[mapIdIndex].opacity = 0;
		}

		pinListCurrentOrder[mapIdIndex]
			.querySelector('.map-list-item')
			.classList.remove('animating');
	}

	mapIdIndex === arrayOfMapImages.length - 1 ? (mapIdIndex = 0) : ++mapIdIndex;

	isCardUnchecked = cardCheckStatus(pinListCurrentOrder[mapIdIndex]);

	if (isCardUnchecked) {
		return findNextTopoToAnimate();
	}

	showTopoImage(mapIdIndex);
};

const findNextTopoToAnimate = () => {
	mapIdIndex === arrayOfMapImages.length - 1 ? (mapIdIndex = 0) : ++mapIdIndex;

	isCardUnchecked = cardCheckStatus(pinListCurrentOrder[mapIdIndex]);

	if (isCardUnchecked) {
		return findNextTopoToAnimate();
	}

	showTopoImage(mapIdIndex);
};

const showTopoImage = (mapIdIndex) => {
	let topoMap = arrayOfMapImages[mapIdIndex];
	let highlightingAnimatedMap = pinListCurrentOrder[mapIdIndex];
	let topoChosenOpacity = arrayOfImageData[mapIdIndex].currentOpacity;

	topoMap.opacity = topoChosenOpacity;

	highlightingAnimatedMap
		.querySelector('.map-list-item')
		.classList.add('animating');

	return;
};

export { animationStart, animationEnd, setInitialDuration, setCancelledStatus };
