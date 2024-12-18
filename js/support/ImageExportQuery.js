import { queryController } from './queryController.js?v=0.03';

let controller = new AbortController();

const cancelImageRequest = () => {
	controller.abort();
	controller = new AbortController();
};

const getTopoMap = (oid, url, objectIdOutfield) => {
	return new Promise((resolve, reject) => {
		require(['esri/layers/ImageryLayer'], (ImageryLayer) => {
			const topoMapLayer = new ImageryLayer({
				id: oid,
				url: url,
				mosaicRule: {
					mosaicMethod: 'LockRaster',
					lockRasterIds: [oid],
					where: `${objectIdOutfield} = ${oid}`,
				},
			});

			resolve(topoMapLayer);
		});
	});
};

const imageExport = async (oid, opacity, extent) => {
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
		bboxSR: queryController.spatialRelation,
		imageSR: queryController.imageSR,
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
