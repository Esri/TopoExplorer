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

import { appConfig } from '../app-config.js?v=0.03';

if (appConfig.appHeaderColor) {
	document.getElementById('header').style.backgroundColor =
		appConfig.appHeaderColor;
}

document.title = appConfig.appTitleName;

if (appConfig.appHeaderName) {
	document.querySelector('.app.heading').innerHTML = appConfig.appHeaderName;
	document.querySelector('.app.heading').style =
		'text-align: center; align-content: center';
}

if (appConfig.enableInfoModal === false) {
	document.querySelector('.infoModalIcon').remove();
}

if (appConfig.headerLogoImgs) {
	appConfig.headerLogoImgs.forEach((img) => {
		if (!img.imageSrc) {
			return;
		}

		const imageElement = document.createElement('img');
		imageElement.src = img.imageSrc;
		imageElement.classList.add('logo');
		document.querySelector('.heading.logo-container').append(imageElement);
	});
}

document.getElementById('header').classList.remove('hidden');
