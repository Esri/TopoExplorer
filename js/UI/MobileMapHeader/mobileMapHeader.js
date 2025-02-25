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
import { toggleSideBar } from '../SideBar/sideBar.js?v=0.03';
import {
	opacitySliderEvent,
	zoomEvent,
} from '../MapCards/ListOfMaps.js?v=0.03';

let topoMap;
let mapNameAndScale;
let mapOpacitySlider;
let mapOID;
let mapGeometry;

const addMobileHeader = () => {
	const mobileHeaderDiv = `
  <div class='mobile-header'>
    
  </div>
`;
	document
		.querySelector('aside')
		.insertAdjacentHTML('afterend', mobileHeaderDiv);
};

const addHeaderSearchInfo = () => {
	const searchInfo = `
  <div class='mobile-search flex' style="align-items: center">
    <div class='openSideBarBtn icon left-arrow'>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 13H4.707l2.646 2.646-.707.707L2.793 12.5l3.853-3.854.707.707L4.707 12H21z"></path></svg>
    </div>
    <div class='mapInfo flex'>
    
      <div class="map-count-container">
        <calcite-icon
          class="queryIndicator"
          icon="spinner"
          scale="s"
        ></calcite-icon>
      </div>
      <div class="explorer-mode btn-text underline">
        <span class="mapCount"> </span>
        <span>Topo Maps</span>
      </div>
    </div>
    
  </div>
`;

	document.querySelector('.mobile-header').innerHTML = searchInfo;
};

const headerMapInfo = () => {
	const mapInfo = `
  <div class='map-list-item mobile' oid=${mapOID}>  
    <div class='openSideBarBtn icon left-arrow'>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 13H4.707l2.646 2.646-.707.707L2.793 12.5l3.853-3.854.707.707L4.707 12H21z"></path></svg>
    </div>
    
    <div class='mapInfo zoom'>${mapNameAndScale}</div>
    <div class='mapCard-slider'>${mapOpacitySlider}</div>
    
  </div>
  `;
	document.querySelector('.mobile-header').innerHTML = mapInfo;
};

const addMapInfoOnMobileHeader = (event) => {
	topoMap = event.target.closest('.map-list-item');
	topoMap.querySelector('.slider-range-color').style.width = '100%';

	mapNameAndScale = topoMap.querySelector('.map-list-item-title').innerHTML;
	mapOpacitySlider = topoMap.querySelector('.mapCard-slider').innerHTML;

	mapOID = topoMap.attributes.oid.value;
};

const resetMobileHeaderInfo = () => {
	addHeaderSearchInfo();
};

const initMobileHeader = () => {
	if (!isMobileFormat()) {
		return;
	}
	addMobileHeader();
	addHeaderSearchInfo();

	document.querySelector('#sideBar').addEventListener('click', (event) => {
		if (!event.target.closest('.map-list-item')) {
			return;
		}

		addMapInfoOnMobileHeader(event);
		headerMapInfo();
	});

	document.addEventListener('input', (event) => {
		if (!event.target.closest('.mobile-header')) {
			return;
		}

		opacitySliderEvent(event.target, mapOID);
	});

	document
		.querySelector('.mobile-header')
		.addEventListener('click', (event) => {
			if (event.target.closest('.mapInfo')) {
				event.stopImmediatePropagation();

				zoomEvent(event.target, mapOID);
			}

			if (event.target.closest('.openSideBarBtn')) {
				event.stopImmediatePropagation();
				toggleSideBar();
			}
		});
};

export { initMobileHeader, resetMobileHeaderInfo };
