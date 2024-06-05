import { queryController } from '../support/queryController.js?v=0.03';

//this will contain the images of each topo map in the animation and will be added to the media's source once layer is create
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
				queryController.mapView.map.layers.items.length - 3
			);

			resolve(mediaLayer);
		});
	});
};

const createArrayOfImageElements = (array) => {
	for (const topoImage of mediaLayer.source.elements.items) {
		array.push(topoImage);
	}

	return array;
};

const removeMediaLayer = () => {
	queryController.mapView.map.remove(mediaLayer);
};

const createImageElementForMediaLayer = async (imageData) => {
	if (!imageData) {
		return;
	}

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
					extent: imageData.containingExtent,
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
