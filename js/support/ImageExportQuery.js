//import the queryController stuff here??
import { queryController } from './queryController.jsv=0.03';

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

const imageExport = async (oid, opacity, extent) => {
	const exportImageSize = queryController.mapView.size.join(', ');
	const extentResolution = queryController.mapView.resolution;

	const newImageSize = `${extent.width / extentResolution}, ${
		extent.height / extentResolution
	}`;
	const exportMosaicRule = JSON.stringify({
		mosaicMethod: 'esriMosaicLockRaster',
		lockRasterIds: [oid],
	});

	const params = new URLSearchParams({
		bbox: JSON.stringify(extent),
		size: newImageSize,
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
			const url = URL.createObjectURL(response.data);
			const imageData = {
				id: oid,
				url: url,
				currentOpacity: opacity,
				urlDataObj: response.data,
			};

			resolve(imageData);
		});
	});
};
export { getTopoMap, imageExport, cancelImageRequest };
