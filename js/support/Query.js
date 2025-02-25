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

const defaultServiceURL =
	'https://utility.arcgis.com/usrsvcs/servers/88d12190e2494ce89374311800af4c4a/rest/services/USGS_Historical_Topographic_Maps/ImageServer';

let isQuerying;

let controller = new AbortController();

const cancelQuery = () => {
	controller.abort();
	controller = new AbortController();
};

const extentQuery = async (url, params) => {
	if (isQuerying !== true) {
		isQuerying = true;
	} else {
		cancelQuery();
		isQuerying = true;
	}

	return new Promise((resolve, reject) => {
		axios
			.get(url, { params, signal: controller.signal })
			.then((response) => {
				isQuerying = false;

				!isQuerying ? resolve(response) : (response = []);
			})
			.catch((error) => {
				if (error.message.includes('canceled')) {
					return;
				}
				console.log(error);
			});
	});
};

const numberOfMapsinView = async (url, params) => {
	if (isQuerying !== true) {
		isQuerying = true;
	} else {
		isQuerying = true;
		cancelQuery();
	}

	return new Promise((resolve, reject) => {
		axios
			.get(url, { params, signal: controller.signal })
			.then((response) => {
				isQuerying = false;

				resolve(response);
			})
			.catch((error) => {
				if (error.message.includes('canceled')) {
					return;
				}
				console.log(error);
			});
	});
};

const queryForHashedTopos = (url, params) => {
	return new Promise((resolve, reject) => {
		axios
			.get(url, { params })
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				console.log(error);
			});
	});
};

export {
	defaultServiceURL,
	extentQuery,
	numberOfMapsinView,
	queryForHashedTopos,
	cancelQuery,
};
