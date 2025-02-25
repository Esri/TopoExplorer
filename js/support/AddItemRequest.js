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

import { setUserContentURL } from '../UI/ExportMapsPrompt/exportPromptUI.js?v=0.03';

let accountData = {
	urlKey: '',
	customUrl: '',
	url: '',
};
let userToken;

const setAccountData = async (authorizationResponse) => {
	accountData = authorizationResponse;
	setUserContentURL(accountData.urlKey, accountData.customUrl, accountData.url);
};

const setUserToken = (credentials) => {
	if (!credentials) {
		return;
	}
	userToken = credentials.token;
};

const addWebMapToUserPortal = (webMapDef) => {
	return new Promise((resolve, reject) => {
		webMapDef.token = userToken;

		axios
			.post(
				`${accountData.restUrl}/content/users/${accountData.userName}/addItem?`,
				webMapDef,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				resolve(error);
			});
	});
};

export { addWebMapToUserPortal, setAccountData, setUserToken };
