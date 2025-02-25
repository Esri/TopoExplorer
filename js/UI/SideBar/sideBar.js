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

import { isMobileFormat } from '../EventsAndSelectors/EventsAndSelectors.js?v=0.03';

const sideBar = document.querySelector('#sideBar');
const exploreList = document.querySelector('#exploreList');
let touchstartX;
let touchendX;

const toggleSideBar = () => {
	document.querySelector('aside').classList.toggle('original-x');
	document.querySelector('aside').classList.toggle('slide-x');
};

const handleSwipe = (event) => {
	if (event.target.closest('.filter')) {
		return;
	}

	if (Math.abs(touchendX - touchstartX) > 50) {
		toggleSideBar();
	}
};

const initSideBar = () => {
	sideBar.previousElementSibling.classList.add('invisible');
	sideBar.querySelector('.for-desktop').classList.remove('display-content');
	sideBar.querySelector('.for-desktop').classList.add('invisible');
	sideBar.style.width = '100%';
	document.querySelector('aside').classList.add('fixed-position');

	//handling the mobile eventListeners
	//When a map is 'tapped' in mobile, close the sideBar to reveal the map.
	document.addEventListener('click', (event) => {
		if (!isMobileFormat()) {
			return;
		}
		if (
			!event.target.closest('aside') &&
			!document.querySelector('aside').classList.contains('slide-x')
		) {
			toggleSideBar();
		}
	});

	exploreList.addEventListener('click', (event) => {
		if (!isMobileFormat()) {
			return;
		}
		if (!event.target.closest('.map-list-item')) {
			return;
		}
		toggleSideBar();
	});

	document
		.querySelector('.explorer-mode-btn')
		.addEventListener('click', (event) => {
			toggleSideBar();
		});

	sideBar.addEventListener(
		'touchstart',
		(event) => {
			touchstartX = event.changedTouches[0].screenX;
		},
		false
	);

	sideBar.addEventListener(
		'touchend',
		(event) => {
			touchendX = event.changedTouches[0].screenX;
			handleSwipe(event);
		},
		false
	);
};

const renderErrorMessage = (errorNotification) => {
	if (!errorNotification.message) {
		return (exploreList.innerHTML = `<div class='helpText'> ${errorNotification}. </div>`);
	}

	exploreList.innerHTML = `<div class='helpText'> ${errorNotification.message}. </div>`;
};

export { initSideBar, toggleSideBar, renderErrorMessage };
