// import { setAnimationSlider } from './animation.js?v=0.01';
import {
	findTopoLayer,
	mapHaloGraphicLayer,
	currentStateOfPinnedList,
} from '../MapCards/ListOfMaps.js?v=0.01';
import { imageExport } from '../../support/ImageExportQuery.js?v=0.01';
import {
	createMediaLayer,
	removeMediaLayer,
	createImageElementForMediaLayer,
	removeTopoImageElements,
} from '../../map/MediaLayer.js?v=0.01';

const animationSpeedSlider = document.querySelector('.animation-speed-value');

let mapIdIndex = -1;
let arrayOfMapLayers = [];
let arrayOfGeneratedURLs = [];
let duration;
let topoMap = null;
let highlightingAnimatedMap;
let pinListCurrentOrder;
const speeds = [2000, 1000, 800, 500, 400, 200, 100, 20, 0];

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
	pinListCurrentOrder = currentStateOfPinnedList().reverse();
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
			// arrayOfMapLayers.push(layer);
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
		findTopoLayer(
			card.querySelector('.map-list-item').attributes.oid.value
		).then((layer) => {
			layer.visible = true;
		});
	});
};

const exportingTopoImageAndCreatingImageElement = async () => {
	for (const card of pinListCurrentOrder) {
		await imageExport(
			card.querySelector('.map-list-item').attributes.oid.value
		).then(async (url) => {
			console.log(url);
			arrayOfGeneratedURLs.push(url);
			await createImageElementForMediaLayer(url);
		});
	}
};

const animationStart = async () => {
	setPinListCurrentOrder();
	hideMapHalos();
	hideTopoLayers();
	await exportingTopoImageAndCreatingImageElement();
	createMediaLayer();
};

const animationEnd = () => {
	showMapHalos();
	showTopoLayers();
	removeMediaLayer();
	revokeGeneratedURLs();
	removeTopoImageElements();
};

const revokeGeneratedURLs = async () => {
	arrayOfGeneratedURLs.map((url, index, thisArray) => {
		console.log(url);
		URL.revokeObjectURL(url);
		thisArray.shift();
	});
};

animationSpeedSlider.addEventListener('change', (event) => {
	const value = Math.floor(event.target.value / speeds.length);
	console.log(value);
	duration = speeds[value];
	console.log(duration);
});

const layerAnimation = async () => {
	console.log(duration);
	if (
		document.querySelector('.play-pause .pause').classList.contains('invisible')
	) {
		animationEnd();
		return;
	}
	mapIdIndex === arrayOfMapLayers.length - 1 ? (mapIdIndex = 0) : mapIdIndex++;

	if (topoMap) {
		topoMap.visible = false;
		highlightingAnimatedMap
			.querySelector('.map-list-item')
			.classList.remove('animating');
	}

	topoMap = arrayOfMapLayers[mapIdIndex];
	highlightingAnimatedMap = pinListCurrentOrder[mapIdIndex];

	// console.log(topoMap);
	// console.log(pinListCurrentOrder[mapIdIndex]);

	layerIntervalVisibility(topoMap);
};

const layerIntervalVisibility = (topoMap) => {
	const isCardChecked = highlightingAnimatedMap
		.querySelector('.animate.checkbox .checkmark')
		.classList.contains('hidden');

	if (isCardChecked) {
		layerAnimation();
		return;
	}
	topoMap.visible = true;

	highlightingAnimatedMap
		.querySelector('.map-list-item')
		.classList.add('animating');

	setTimeout(layerAnimation, duration);
};
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
export { animationStart, animationEnd, setInitialDuration };
