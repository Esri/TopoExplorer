import { queryConfig } from '../support/QueryConfig.js?v=0.01';

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
			queryConfig.mapView.map.add(
				mediaLayer,
				queryConfig.mapView.map.layers.items.length - 2
			);
			console.log(queryConfig.mapView.map.layers.items.length - 2);
			resolve();
		});
	});
};

const createArrayOfImageElements = async (array) => {
	// const imageElementsArray = [];
	// console.log(mediaLayer);
	// mediaLayer.source.elements.items.forEach((imageElement) => {
	// 	array.push(imageElement);
	// });

	for (const topoImage of mediaLayer.source.elements.items) {
		await array.push(topoImage);
	}

	return array;
};

const removeMediaLayer = () => {
	queryConfig.mapView.map.remove(mediaLayer);

	console.log(queryConfig.mapView.map.layers.items);
};

const createImageElementForMediaLayer = async (imageData) => {
	return await new Promise((resolve) => {
		require([
			'esri/layers/support/ImageElement',
			'esri/layers/support/ExtentAndRotationGeoreference',
			'esri/geometry/Extent',
		], (ImageElement, ExtentAndRotationGeoreference, Extent) => {
			const imageElement = new ImageElement({
				id: imageData.id,
				image: imageData.url,
				opacity: 0,
				// effect: 'drop-shadow(0px, 0px, 8px, black)',
				georeference: new ExtentAndRotationGeoreference({
					extent: queryConfig.mapView.extent,
				}),
			});

			mediaLayerSourceElementsArray.push(imageElement);

			console.log(mediaLayerSourceElementsArray);
		});
		resolve();
	});
};

const removeTopoImageElements = () => {
	mediaLayerSourceElementsArray.length = 0;
	console.log(mediaLayerSourceElementsArray);
};

export {
	createMediaLayer,
	createArrayOfImageElements,
	removeMediaLayer,
	createImageElementForMediaLayer,
	removeTopoImageElements,
};
