//import the queryConfig stuff here??
import { queryConfig } from './QueryConfig.js?v=0.01';

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
// 	const exportImageSize = queryConfig.mapView.size.join(', ');
// 	const exportMosaicRule = JSON.stringify({
// 		mosaicMethod: 'esriMosaicLockRaster',
// 		lockRasterIds: [oid],
// 	});

// 	const params = new URLSearchParams({
// 		bbox: JSON.stringify(queryConfig.mapView.extent),
// 		size: exportImageSize,
// 		bboxSR: '102100',
// 		imageSR: '102100',
// 		mosaicRule: exportMosaicRule,
// 		format: 'jpgpng',

// 		f: 'image',
// 	});

// 	getImage(params);
// };

const imageExport = async (oid) => {
	// prepParams();
	const exportImageSize = queryConfig.mapView.size.join(', ');
	const exportMosaicRule = JSON.stringify({
		mosaicMethod: 'esriMosaicLockRaster',
		lockRasterIds: [oid],
	});

	const params = new URLSearchParams({
		bbox: JSON.stringify(queryConfig.mapView.extent),
		size: exportImageSize,
		bboxSR: '102100',
		imageSR: '102100',
		mosaicRule: exportMosaicRule,
		format: 'jpgpng',

		f: 'image',
	});

	return new Promise((resolve, reject) => {
		axios({
			url: queryConfig.imageExportEndpoint,
			method: 'get',
			params,
			responseType: 'blob',
		}).then((response) => {
			const url = URL.createObjectURL(response.data);

			// require([
			// 	'esri/layers/MediaLayer',
			// 	'esri/layers/support/ImageElement',
			// 	'esri/layers/support/ExtentAndRotationGeoreference',
			// 	'esri/geometry/Extent',
			// ], (MediaLayer, ImageElement, ExtentAndRotationGeoreference, Extent) => {
			// 	const imageElement = new ImageElement({
			// 		image: url,
			// 		georeference: new ExtentAndRotationGeoreference({
			// 			extent: queryConfig.mapView.extent,
			// 		}),
			// 	});

			// 	console.log(imageElement);

			// 	const mediaLayer = new MediaLayer({
			// 		source: imageElement,
			// 	});
			// 	queryConfig.mapView.map.add(mediaLayer);
			// 	console.log(queryConfig.mapView);
			// });

			// const imgElement = document.createElement('img');
			// imgElement.style =
			// 	'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;';
			// imgElement.src = url;
			// document.querySelector('#viewDiv').prepend(imgElement);

			resolve(url);
		});
	});
};
export { getTopoMap, imageExport };
