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

import { isMobileFormat } from '../UI/EventsAndSelectors/EventsAndSelectors.js?v=0.03';

const spinnerIcon = document.querySelector('.queryIndicator');
const mapCount = document.querySelector('.mapCount');

//creating notification text for when queries are in process.
const queryNotificationMessage = document.createElement('div');
queryNotificationMessage.classList.add('notificationMessage');
queryNotificationMessage.innerHTML = 'gathering topographic maps...';

const hideMapCount = () => {
	if (isMobileFormat() && document.querySelector('.mobile-header .mapCount')) {
		document.querySelector('.mobile-header .mapCount').classList.add('hidden');
	}

	mapCount.classList.add('hidden');
};

const updateMapCount = (number) => {
	if (isMobileFormat() && document.querySelector('.mobile-header .mapCount')) {
		document.querySelector('.mobile-header .mapCount').innerHTML =
			number.toLocaleString();
		document
			.querySelector('.mobile-header .mapCount')
			.classList.remove('hidden');
	}

	mapCount.innerHTML = number.toLocaleString();
	mapCount.classList.remove('hidden');
};

const hideSpinnerIcon = () => {
	if (isMobileFormat() && document.querySelector('.mobile-header .mapCount')) {
		document
			.querySelector('.mobile-header .queryIndicator')
			.classList.add('hidden');
		if (document.querySelector('.notificationMessage')) {
			document.querySelector('.notificationMessage').remove();
		}
	}

	spinnerIcon.classList.add('hidden');
	if (document.querySelector('.notificationMessage')) {
		document.querySelector('.notificationMessage').remove();
	}
};

const showSpinnerIcon = () => {
	if (isMobileFormat() && document.querySelector('.mobile-header .mapCount')) {
		document
			.querySelector('.mobile-header .queryIndicator')
			.classList.remove('hidden');

		document.querySelector('#exploreList').append(queryNotificationMessage);
	}

	spinnerIcon.classList.remove('hidden');
	document.querySelector('#exploreList').append(queryNotificationMessage);
};

export { hideMapCount, updateMapCount, showSpinnerIcon, hideSpinnerIcon };
