/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { url, queryController } from './queryController.js?v=0.03';

let controller = new AbortController();

const cancelImageRequest = () => {
	controller.abort();
	controller = new AbortController();
};

const getTopoMap = (oid, objectIdOutfield) => {
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
