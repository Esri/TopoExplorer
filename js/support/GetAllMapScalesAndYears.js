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

import { appConfig } from '../../app-config.js?v=0.03';

const minYearOutStats = JSON.stringify([
	{
		statisticType: 'min',
		onStatisticField: appConfig.outfields.requiredFields.dateCurrent,
		outStatisticFieldName: 'MapYear',
	},
]);
const maxYearOutStats = JSON.stringify([
	{
		statisticType: 'max',
		onStatisticField: appConfig.outfields.requiredFields.dateCurrent,
		outStatisticFieldName: 'MapYear',
	},
]);
const minScaleOutStats = JSON.stringify([
	{
		statisticType: 'min',
		onStatisticField: appConfig.outfields.requiredFields.mapScale,
		outStatisticFieldName: 'MapScale',
	},
]);
const maxScaleOutStats = JSON.stringify([
	{
		statisticType: 'max',
		onStatisticField: appConfig.outfields.requiredFields.mapScale,
		outStatisticFieldName: 'MapScale',
	},
]);

const findMinYear = (url) => {
	if (!appConfig.enableTimeFilterSlider) {
		return;
	}
	return new Promise((resolve, reject) => {
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,
			outStatistics: minYearOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				const minYear = response.data;
				resolve(minYear);
			})
			.catch((error) => {
				const errorMessage = `Issue trying to obtain the image service's minimum year attribute,
						${error.message}`;
				console.log(errorMessage);
				reject(errorMessage);
			});
	});
};

const findMaxYear = (url) => {
	if (!appConfig.enableTimeFilterSlider) {
		return;
	}
	return new Promise((resolve, reject) => {
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,

			outStatistics: maxYearOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				const maxYear = response.data;
				resolve(maxYear);
			})
			.catch((error) => {
				const errorMessage = `Issue trying to obtain the image service's maximum year attribute,
						${error.message}`;
				console.log(errorMessage);
				reject(errorMessage);
			});
	});
};

const findMinScale = async (url) => {
	if (!appConfig.enableScaleFilterSlider) {
		return;
	}

	return new Promise((resolve, reject) => {
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,
			outStatistics: minScaleOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				const minScale = response.data;
				resolve(minScale);
			})
			.catch((error) => {
				const errorMessage = `Issue trying to obtain the image service's minimum map-scale attribute,
						${error.message}`;
				console.error(errorMessage);
				reject(errorMessage);
			});
	});
};

const findMaxScale = (url) => {
	if (!appConfig.enableScaleFilterSlider) {
		return;
	}

	return new Promise((resolve, reject) => {
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,
			outStatistics: maxScaleOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				const maxScale = response.data;
				resolve(maxScale);
			})
			.catch((error) => {
				const errorMessage = `Issue trying to obtain the image service's maximum map-scale attribute,
        ${error.message}`;
				console.log(errorMessage);
				reject(errorMessage);
			});
	});
};

export { findMinYear, findMaxYear, findMinScale, findMaxScale };
