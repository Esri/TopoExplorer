import { queryConfig } from '../support/QueryConfig.js?v=0.01';

const mediaLayerSourceElementsArray = [];
let mediaLayer;
const mediaLayerIdAndTitle = 'animation';

const createMediaLayer = () => {
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
	});
};

const removeMediaLayer = () => {
	queryConfig.mapView.map.remove(mediaLayer);

	console.log(queryConfig.mapView.map.layers.items);
};

const createImageElementForMediaLayer = async (url) => {
	return new Promise((resolve) => {
		require([
			'esri/layers/support/ImageElement',
			'esri/layers/support/ExtentAndRotationGeoreference',
			'esri/geometry/Extent',
		], (ImageElement, ExtentAndRotationGeoreference, Extent) => {
			const imageElement = new ImageElement({
				image: url,
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
	removeMediaLayer,
	createImageElementForMediaLayer,
	removeTopoImageElements,
};
