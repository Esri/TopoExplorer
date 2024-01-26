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
// let topoMap = null;
// let highlightingAnimatedMap;
let pinListCurrentOrder;
const speeds = [2000, 1000, 800, 500, 400, 200, 100, 20, 0];

//This currently doesn't do anything. 'isCancelled' isn't being evaluated for anything. It was, but it's not now...currently
//this function is being called in the 'eventsAndSelectors' module.
const setCancelledStatus = (status) => {
	isCancelled = status;
	console.log('isCancelledUpdated');
};

const setAnimationSlider = (animationSpeedSlider, speedArray) => {
	animationSpeedSlider.max = (speedArray.length - 1) * 10;
	animationSpeedSlider.value = ((speedArray.length - 1) * 10) / 2;
	console.log(animationSpeedSlider);
};

const setInitialDuration = (speedArray) => {
	duration = speedArray[(speedArray.length - 1) / 2];
	console.log(duration);
};

console.log(setAnimationSlider);
setAnimationSlider(animationSpeedSlider, speeds);
setInitialDuration(speeds);

const setPinListCurrentOrder = () => {
	pinListCurrentOrder = currentStateOfPinnedList();
};

const getAnimatingImages = async () => {
	await createArrayOfImageElements(arrayOfMapImages);
	console.log('got array of images', arrayOfMapImages);
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
		console.log(card);
		findTopoLayer(
			card.querySelector('.map-list-item').attributes.oid.value
		).then((layer) => {
			layer.visible = false;
			// arrayOfMapImages.push(layer);
		});
	});
};

// const removeImgs = () => {
// 	document.querySelectorAll('#viewDiv img').forEach((img) => {
// 		console.log(img);
// 		img.remove();
// 		// URL.revokeObjectURL()
// 	});
// };

const showTopoLayers = () => {
	pinListCurrentOrder.forEach((card, index) => {
		console.log(card);
		const cardId = card.querySelector('.map-list-item').attributes.oid.value;

		findTopoLayer(cardId).then((layer) => {
			layer.visible = true;
		});
	});
};

const exportingTopoImageAndCreatingImageElement = async () => {
	for await (const card of pinListCurrentOrder) {
		// if (isCancelled) {
		// 	console.log('first cancelling');
		// 	cancelImageRequest();
		// 	return;
		// }
		const cardId = card.querySelector('.map-list-item').attributes.oid.value;
		const currentOpacity = card.querySelector('.opacity-slider').value / 100;

		await imageExport(cardId, currentOpacity, isCancelled).then(
			async (imageData) => {
				// if (isCancelled) {
				// 	console.log('cancelling');
				// 	// cancelImageRequest();
				// 	return;
				// }
				console.log(imageData);
				arrayOfImageData.push(imageData);
				console.log(arrayOfImageData);
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
	// addAnimationCloseBtn(isCancelled);
	checkAnimationLoadStatus();
	return;
};

const checkAnimationLoadStatus = () => {
	if (isCancelled) {
		console.log('this is supposed to be the last check');
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

	console.log(
		'need to know if this is empty of if its a thing',
		arrayOfImageData
	);
};

// const removeAnimationCardHighlight = (highlightingAnimatedMap) => {
// 	if (highlightingAnimatedMap) {
// 		highlightingAnimatedMap
// 			.querySelector('.map-list-item')
// 			.classList.remove('animating');
// 	}
// };

const resetMapIdIndex = () => {
	mapIdIndex = -1;
};

animationSpeedSlider.addEventListener('change', (event) => {
	const value = Math.floor(event.target.value / speeds.length);
	console.log(value);
	duration = speeds[value];
	console.log(duration);
	if (isAnimating) {
		stopAnimationInterval();
		startAnimationInterval();
	}
});

// const animateCardHighlight
const startAnimationInterval = () => {
	// if (isCancelled) {
	// 	return;
	// }
	console.log(arrayOfMapImages);
	animationInterval = setInterval(animate, duration);
};

const animate = () => {
	console.log('animating87l?');
	// console.log(animationInterval);
	// console.log(duration);
	// console.log(mapIdIndex);
	let topoMap;
	let highlightingAnimatedMap;
	let topoChosenOpacity;
	// console.log(mapIdIndex);
	// console.log(arrayOfImageData);

	if (mapIdIndex !== -1) {
		// topoMap = arrayOfMapImages[mapIdIndex];
		// highlightingAnimatedMap = pinListCurrentOrder[mapIdIndex];
		// topoChosenOpacity = arrayOfImageData[mapIdIndex].currentOpacity;

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
		console.log('no check');
		// clearInterval(animationInterval);
		// startAnimationInterval();
		// ++mapIdIndex;
		return findNextTopoToAnimate();
	}
	// console.log(mapIdIndex);
	showTopoImage(mapIdIndex);
	// arrayOfMapImages[mapIdIndex].opacity =
	// 	arrayOfImageData[mapIdIndex].currentOpacity;
	// pinListCurrentOrder[mapIdIndex]
	// 	.querySelector('.map-list-item')
	// .classList.add('animating');
};

const findNextTopoToAnimate = () => {
	mapIdIndex === arrayOfMapImages.length - 1 ? (mapIdIndex = 0) : ++mapIdIndex;

	isCardUnchecked = cardCheckStatus(pinListCurrentOrder[mapIdIndex]);

	if (isCardUnchecked) {
		return findNextTopoToAnimate();
	}

	console.log('jumping to the next visible map', mapIdIndex);
	showTopoImage(mapIdIndex);
};
// const layerAnimation = () => {
// 	if (
// 		document.querySelector('.play-pause .pause').classList.contains('invisible')
// 	) {
// 		animationEnd();
// 		return;
// 	}

// 	mapIdIndex === arrayOfMapImages.length - 1 ? (mapIdIndex = 0) : mapIdIndex++;

// 	// if (topoMap) {
// 	// 	if (topoMap.opacity !== 0) {
// 	// 		topoMap.opacity = 0;
// 	// 	}
// 	// 	highlightingAnimatedMap
// 	// 		.querySelector('.map-list-item')
// 	// 		.classList.remove('animating');
// 	// }

// 	topoMap = arrayOfMapImages[mapIdIndex];
// 	highlightingAnimatedMap = pinListCurrentOrder[mapIdIndex];

// 	showTopoImage(topoMap);
// };

const showTopoImage = (mapIdIndex) => {
	let topoMap = arrayOfMapImages[mapIdIndex];
	let highlightingAnimatedMap = pinListCurrentOrder[mapIdIndex];
	let topoChosenOpacity = arrayOfImageData[mapIdIndex].currentOpacity;

	// console.log(highlightingAnimatedMap);
	// console.log('the current map', topoMap);
	// console.log(topoChosenOpacity);
	// const isCardUnchecked = highlightingAnimatedMap
	// 	.querySelector('.animate.checkbox .checkmark')
	// 	.classList.contains('hidden');

	// if (isCardUnchecked) {
	// 	clearInterval(animationInterval);
	// 	startAnimationInterval();
	// 	return;
	// }
	//make the topo visible
	topoMap.opacity = topoChosenOpacity;

	highlightingAnimatedMap
		.querySelector('.map-list-item')
		.classList.add('animating');

	// setTimeout(hideTopoImage, duration);
	return;
};

// const hideTopoImage = () => {
// 	topoMap.opacity = 0;
// 	highlightingAnimatedMap
// 		.querySelector('.map-list-item')
// 		.classList.remove('animating');

// 	layerAnimation();
// };

//for me: this is a reference.
// const createMediaLayer = () => {require([
//   'esri/layers/MediaLayer',
//   'esri/layers/support/ImageElement',
//   'esri/layers/support/ExtentAndRotationGeoreference',
//   'esri/geometry/Extent',
// ], (MediaLayer, ImageElement, ExtentAndRotationGeoreference, Extent) => {
//   const imageElement = new ImageElement({
//     image: url,
//     georeference: new ExtentAndRotationGeoreference({
//       extent: queryConfig.mapView.extent,
//     }),
//   });

//   console.log(imageElement);

//   const mediaLayer = new MediaLayer({
//     source: imageElement,
//   });
//   queryConfig.mapView.map.add(mediaLayer);
//   console.log(queryConfig.mapView);
// });
// }
export { animationStart, animationEnd, setInitialDuration, setCancelledStatus };
