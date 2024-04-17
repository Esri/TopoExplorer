import { queryController } from '../support/queryController.js?v=0.01';

const mediaLayerSourceElementsArray = [];
let mediaLayer;
const mediaLayerIdAndTitle = 'animation';

const createMediaLayer = async () => {
	return new Promise((resolve, reject) => {
		require(['esri/layers/MediaLayer'], (MediaLayer) => {
			mediaLayer = new MediaLayer({
				id: mediaLayerIdAndTitle,
				title: mediaLayerIdAndTitle,
				source: mediaLayerSourceElementsArray,
				effect: 'drop-shadow(0px, 0px, 8px, black)',
			});
			queryController.mapView.map.add(
				mediaLayer,
				queryController.mapView.map.layers.items.length - 2
			);

			resolve();
		});
	});
};

const createArrayOfImageElements = (array) => {
	// const imageElementsArray = [];
	// console.log(mediaLayer);
	// mediaLayer.source.elements.items.forEach((imageElement) => {
	// 	array.push(imageElement);
	// });

	for (const topoImage of mediaLayer.source.elements.items) {
		array.push(topoImage);
	}

	return array;
};

const removeMediaLayer = () => {
	queryController.mapView.map.remove(mediaLayer);
};

const createImageElementForMediaLayer = async (imageData) => {
	return await new Promise((resolve) => {
		require([
			'esri/layers/support/ImageElement',
			'esri/layers/support/ExtentAndRotationGeoreference',
			'esri/geometry/Extent',
		], (ImageElement, ExtentAndRotationGeoreference, Extent) => {
			const mapExtent = queryController.mapView.extent.clone().normalize()[0];

			console.log(mapExtent);
			const imageElement = new ImageElement({
				id: imageData.id,
				image: imageData.url,
				opacity: 0,
				// effect: 'drop-shadow(0px, 0px, 8px, black)',
				georeference: new ExtentAndRotationGeoreference({
					extent: mapExtent,
				}),
			});

			mediaLayerSourceElementsArray.push(imageElement);
		});
		resolve();
	});
};

const removeTopoImageElements = () => {
	mediaLayerSourceElementsArray.length = 0;
};

export {
	createMediaLayer,
	createArrayOfImageElements,
	removeMediaLayer,
	createImageElementForMediaLayer,
	removeTopoImageElements,
};
