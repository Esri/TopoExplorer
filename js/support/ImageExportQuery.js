//import the queryController stuff here??
import { queryController } from './queryController.js?v=0.01';

let controller = new AbortController();

const cancelImageRequest = () => {
	controller.abort();
	controller = new AbortController();
};

//This function should be it's own component. It's operating differently now. Leaving it here would just be confusing.
const getTopoMap = (oid, url) => {
	return new Promise((resolve, reject) => {
		require(['esri/layers/ImageryLayer'], (ImageryLayer) => {
			const topoMapLayer = new ImageryLayer({
				id: oid,
				url: url,

				mosaicRule: {
					mosaicMethod: 'LockRaster',
					lockRasterIds: [oid],
					where: `OBJECTID = ${oid}`,
				},
			});

			resolve(topoMapLayer);
		});
	});
};

// const prepParams = (oid) => {
// 	const exportImageSize = queryController.mapView.size.join(', ');
// 	const exportMosaicRule = JSON.stringify({
// 		mosaicMethod: 'esriMosaicLockRaster',
// 		lockRasterIds: [oid],
// 	});

// 	const params = new URLSearchParams({
// 		bbox: JSON.stringify(queryController.mapView.extent),
// 		size: exportImageSize,
// 		bboxSR: '102100',
// 		imageSR: '102100',
// 		mosaicRule: exportMosaicRule,
// 		format: 'jpgpng',

// 		f: 'image',
// 	});

// 	getImage(params);
// };

const imageExport = async (oid, opacity, isCancelled) => {
	// console.log(isCancelled);
	// if (isCancelled) {
	// 	console.log('cancel');
	// 	cancelImageRequest();
	// }
	// prepParams();
	const exportImageSize = queryController.mapView.size.join(', ');
	const exportMosaicRule = JSON.stringify({
		mosaicMethod: 'esriMosaicLockRaster',
		lockRasterIds: [oid],
	});

	const params = new URLSearchParams({
		bbox: JSON.stringify(queryController.mapView.extent),
		size: exportImageSize,
		bboxSR: '102100',
		imageSR: '102100',
		mosaicRule: exportMosaicRule,
		format: 'jpgpng',

		f: 'image',
	});

	return new Promise((resolve, reject) => {
		axios({
			url: queryController.imageExportEndpoint,
			method: 'get',
			params,
			signal: controller.signal,
			responseType: 'blob',
		}).then((response) => {
			console.log(response);
			const url = URL.createObjectURL(response.data);
			const imageData = {
				id: oid,
				url: url,
				currentOpacity: opacity,
				urlDataObj: response.data,
			};

			// require([
			// 	'esri/layers/MediaLayer',
			// 	'esri/layers/support/ImageElement',
			// 	'esri/layers/support/ExtentAndRotationGeoreference',
			// 	'esri/geometry/Extent',
			// ], (MediaLayer, ImageElement, ExtentAndRotationGeoreference, Extent) => {
			// 	const imageElement = new ImageElement({
			// 		image: url,
			// 		georeference: new ExtentAndRotationGeoreference({
			// 			extent: queryController.mapView.extent,
			// 		}),
			// 	});

			// 	console.log(imageElement);

			// 	const mediaLayer = new MediaLayer({
			// 		source: imageElement,
			// 	});
			// 	queryController.mapView.map.add(mediaLayer);
			// 	console.log(queryController.mapView);
			// });

			// const imgElement = document.createElement('img');
			// imgElement.style =
			// 	'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;';
			// imgElement.src = url;
			// document.querySelector('#viewDiv').prepend(imgElement);
			console.log(imageData);
			resolve(imageData);
		});
	});
};
export { getTopoMap, imageExport, cancelImageRequest };
