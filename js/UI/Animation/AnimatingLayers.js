//NOTE: Rename this module to AnimationControl.
import { queryController } from '../../support/queryController.js?v=0.01';
import {
	removeAnimationLoadingDiv,
	addAnimationCloseBtn,
	showAnimateCheckboxVisibility,
	uncheckMapCard,
	setMapCardUnavailableStatus,
	showAvailableTopoCheckbox,
	hideUnavailableTopoCheckbox,
	removeHighlight,
	cardCheckStatus,
	endAnimation,
	isAnimating,
	setLoadingStatus,
	enableAnimationSpeedSlider,
} from './animation.js?v=0.01';
import {
	findTopoLayer,
	crosshairLayer,
	mapHaloGraphicLayer,
	currentStateOfPinnedList,
	isTargetPolygonWithinExtent,
	getPinnedTopoGeometry,
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
import { makeCompositeForAnimationDownload } from '../../support/AnimationComposite.js?v=0.01';
import { createAnimationVideo } from '../../support/animationDownload.js?v=0.01';

let mediaLayer;

let videoExportName;

const setVideoExportName = (string) => {
	videoExportName = string;
};
const animationSpeedSlider = document.querySelector('.animation-speed-value');

let isCancelled = false;
let mapIdIndex = -1;
let isCardUnchecked;
let arrayOfMapImages = [];
let arrayOfImageData = [];
let imagesForDownload = {
	basemap: null,
	topoImages: [],
};
const animationDimensions = {
	width: null,
	height: null,
};
let animationInterval;
let duration;
let pinListCurrentOrder;
const speeds = [3000, 2000, 1000, 800, 700, 500, 400, 300, 200];

const setAnimationDimensions = (width, height) => {
	animationDimensions.width = width;
	animationDimensions.height = height;
};

//This currently doesn't do anything. 'isCancelled' isn't being evaluated for anything. It was, but it's not now...currently
//this function is being called in the 'eventsAndSelectors' module.
const setCancelledStatus = (status) => {
	isCancelled = status;
};

const setAnimationSlider = (animationSpeedSlider, speedArray) => {
	animationSpeedSlider.max = (speedArray.length - 1) * 10;
	animationSpeedSlider.value = speedArray[((speedArray.length - 1) * 10) / 2];
};

const setInitialDuration = (speedArray) => {
	duration = speedArray[(speedArray.length - 1) / 2];
};

setAnimationSlider(animationSpeedSlider, speeds);
setInitialDuration(speeds);

const setPinListCurrentOrder = () => {
	pinListCurrentOrder = currentStateOfPinnedList();
	console.log('the pinned maps to loop over', pinListCurrentOrder);
};

const getAnimatingImages = async () => {
	await createArrayOfImageElements(arrayOfMapImages);
};

const removeAnimatingImages = () => {
	arrayOfMapImages.length = 0;
};

const removeImagesForDownload = () => {
	imagesForDownload.basemap = null;
	imagesForDownload.topoImages.length = 0;
};

const hideMapHalos = () => {
	mapHaloGraphicLayer.visible = false;
};

const hideCrosshairLayer = () => {
	crosshairLayer.visible = false;
};

const showMapHalos = () => {
	mapHaloGraphicLayer.visible = true;
};

const showCrosshairLayer = () => {
	crosshairLayer.visible = true;
};

//note:I don't like how this works. there has to be a cleaner method
const hideTopoLayers = async () => {
	await pinListCurrentOrder.forEach((card, index) => {
		findTopoLayer(
			card.querySelector('.map-list-item').attributes.oid.value
		).then((layer) => {
			layer.visible = false;
		});
		if (index === pinListCurrentOrder.length - 1) {
			return;
		}
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
	//check to see if the map with the oid and it's geometry are within the geometry of the extent
	//if the geometry is within the extent, proceed with this map to the next steps
	//if not, move to the next one.

	const processCardIntoImage = (card) => {
		return new Promise((resolve) => {
			console.log(card);
			const cardId = card.querySelector('.map-list-item').attributes.oid.value;
			// const cardMapLocation =
			// 	card.querySelector('.map-list-item').attributes.geometry.value;
			const currentOpacity = card.querySelector('.opacity-slider').value / 100;
			const imageName = `${
				card.querySelector('.map-list-item .location').textContent
			} ${card.querySelector('.map-list-item .year').textContent}`;

			getPinnedTopoGeometry(cardId).then((pinnedTopoMapGeometry) => {
				if (isTargetPolygonWithinExtent(pinnedTopoMapGeometry)) {
					imageExport(cardId, currentOpacity, isCancelled).then((imageData) => {
						imageData.isCheckedForAnimation = true;
						imageData.opacity = currentOpacity;
						imageData.mapName = imageName;

						arrayOfImageData.push(imageData);
						imagesForDownload.topoImages.push(imageData);

						showAvailableTopoCheckbox(cardId);
						resolve(imageData);
					});
					// .then(async (imageData) => {
					// 	console.log(imageData);
					// 	resolve(
					// 		await Promise.resolve(
					// 			createImageElementForMediaLayer(imageData)
					// 		)
					// 	);
					// });
				} else {
					disableMapCardForAnimation(cardId);
					resolve(false);
				}
			});
		});
	};

	const promiseArray = [];

	for (const card of pinListCurrentOrder) {
		// const cardId = card.querySelector('.map-list-item').attributes.oid.value;
		// const cardMapLocation =
		// 	card.querySelector('.map-list-item').attributes.geometry.value;
		// currentOpacity = card.querySelector('.opacity-slider').value / 100;
		// imageName = `${
		// 	card.querySelector('.map-list-item .location').textContent
		// } ${card.querySelector('.map-list-item .year').textContent}`;

		promiseArray.push(processCardIntoImage(card));
	}

	// arrayOfImageData =
	await Promise.all(promiseArray);

	// arrayOfImageData = arrayOfImageData.filter((image) => !(image === false));
	console.log(arrayOfImageData);
};

const addImageElementToMediaLayer = async () => {
	const promiseArray = [];
	console.log(arrayOfImageData);
	for (const imageData of arrayOfImageData) {
		console.log(imageData);
		imagesForDownload.topoImages.push(imageData);
		promiseArray.push(createImageElementForMediaLayer(imageData));
	}

	await Promise.all(promiseArray);

	// console.log(arrayOfMapImages);
};

const disableMapCardForAnimation = (cardId) => {
	setMapCardUnavailableStatus(cardId);
	hideUnavailableTopoCheckbox(cardId);
	uncheckMapCard(cardId);
};

const takeScreenshotOfView = () => {
	return new Promise((resolve, reject) => {
		// for (const animationTopoImage of arrayOfMapImages) {
		// 	console.log(animationTopoImage);
		// 	if (animationTopoImage.visible !== false) {
		// 		takeScreenshotOfView();
		// 		return;
		// 	}
		// }
		// if (mediaLayer.visible === true) {
		// 	console.log('media layer visible', mediaLayer);
		// 	mediaLayer.visible === false;
		// 	takeScreenshotOfView();
		// 	return;
		// }

		const screenshotQualityValue = 98;
		const screenshotFormat = 'jpg';

		const options = {
			format: screenshotFormat,
			height: queryController.mapView.height,
			width: queryController.mapView.width,
			quality: screenshotQualityValue,
		};

		queryController.mapView.takeScreenshot(options).then(async (screenshot) => {
			// startAnimationInterval();
			const screenshotResponse = await fetch(screenshot.dataUrl);
			const blob = URL.createObjectURL(await screenshotResponse.blob());

			const basemapImage = {
				id: 0,
				url: blob,
			};

			console.log(basemapImage);
			// imagesForDownload.basemap = basemapImage;
			resolve((imagesForDownload.basemap = basemapImage));
		});
	});
};

const toggleMapCardDownloadAvailability = (mapCardOID) => {
	imagesForDownload.topoImages.map((topoImageData) => {
		if (topoImageData.id === mapCardOID) {
			if (topoImageData.isCheckedForAnimation) {
				topoImageData.isCheckedForAnimation = false;
			} else {
				topoImageData.isCheckedForAnimation = true;
			}
		}
	});
};

const clearBasemapOfAnimationFrames = () => {
	for (const animationTopoImage of arrayOfMapImages) {
		return (animationTopoImage.visible = false);
	}
};

//this should be in another module
const hideMediaLayer = () => {
	return new Promise((resolve, reject) => {
		// mediaLayer.visible = false;

		queryController.mapView.map.remove(mediaLayer);

		resolve();
	});
};
const checkToposIncludedForDownload = async () => {
	stopAnimationInterval();
	hideMediaLayer().then(async () => {
		takeScreenshotOfView()
			.then(() => {
				//this should be in another module (the mediaLayer module) and called something like showMediaLayer
				queryController.mapView.map.add(
					mediaLayer,
					queryController.mapView.map.layers.items.length - 2
				);
				startAnimationInterval();
			})
			.then(async () => {
				try {
					const processImages = imagesForDownload.topoImages.map(
						async (topoMapImage) => {
							return await Promise.resolve(
								makeCompositeForAnimationDownload(
									imagesForDownload.basemap,
									topoMapImage
								)
							);
						}
					);
					console.log('processImages', processImages);

					const topoAnimationComposite = await Promise.all(processImages);

					const animationParams = {
						data: topoAnimationComposite,
						animationSpeed: duration,
						outputWidth: animationDimensions.width,
						outputHeight: animationDimensions.height,
						authoringApp: videoExportName,
						abortController: new AbortController(),
					};

					console.log(animationParams);
					createAnimationVideo(animationParams);
				} catch (e) {
					console.error('error during image processing', e);
				}
			});
	});
};

//NOTE: this is the hub for all animation related data is called. So how would you manage these functions if the animation is cancelled during the load? What is the risk condition?
//This section should be refactored, the 'awaits' are unnecessary and confusing. But some of the functions associated with these calls have asynchronous behavior (modules, fetch/server calls)
const animationStart = async () => {
	setPinListCurrentOrder();
	hideCrosshairLayer();
	hideTopoLayers();
	hideMapHalos();
	await exportingTopoImageAndCreatingImageElement();
	await addImageElementToMediaLayer();
	mediaLayer = await createMediaLayer();
	getAnimatingImages();
	getAnimationOrderForPinnedMapsUI();
	startAnimationInterval();
	removeAnimationLoadingDiv();
	checkAnimationLoadStatus();
	return;
};

const getAnimationOrderForPinnedMapsUI = () => {
	pinListCurrentOrder = pinListCurrentOrder.filter(
		(pinnedCard) =>
			!pinnedCard.firstElementChild.classList.contains('transparency')
	);
	console.log(pinListCurrentOrder);
};

const checkAnimationLoadStatus = () => {
	if (isCancelled) {
		addAnimationCloseBtn(isCancelled);
		setLoadingStatus();
		enableAnimationSpeedSlider();

		setCancelledStatus(false);
		return;
	}

	addAnimationCloseBtn();
	setLoadingStatus();
	enableAnimationSpeedSlider();
};
//note: some of these functions have more UI-centric. They could probably be moved into another module (i.e.: the animation.js module.)
const animationEnd = () => {
	stopAnimationInterval();
	removeHighlight();
	showMapHalos();
	showTopoLayers();
	showCrosshairLayer();
	removeMediaLayer();
	revokeTopoMapBlobURLs();
	// revokeBasemapBlobURL();
	removeTopoImageElements();
	removeAnimatingImages();
	removeImagesForDownload();
	resetMapIdIndex();
};

const stopAnimationInterval = () => {
	clearInterval(animationInterval);
	// animationInterval = null;
};

const revokeTopoMapBlobURLs = () => {
	while (arrayOfImageData.length > 0) {
		URL.revokeObjectURL(arrayOfImageData[0].urlDataObj);
		arrayOfImageData.shift();
	}
};

const revokeBasemapBlobURL = () => {
	URL.revokeObjectURL(imagesForDownload.basemap.url);
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

export {
	animationStart,
	animationEnd,
	setInitialDuration,
	setCancelledStatus,
	toggleMapCardDownloadAvailability,
	checkToposIncludedForDownload,
	setAnimationDimensions,
	setVideoExportName,
};
