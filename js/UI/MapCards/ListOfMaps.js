import { renderSidebarUXText } from '../../support/uxText.js?=v0.01';
import { initSingleSlider } from '../SingleSlider/SingleSlider.js?=v0.01';

//NOTE These functions should be seperated into different files, probably. the 'formatQueryReturn' is business logics-oriented and the 'createMapSlotItems' is UI-oriented
// const formatQueryReturn = (result) => {
// 	if (result.length === 0) {
// 		const noMapsUXText = `<em> no maps found</em>`;
// 		renderSidebarUXText(noMapsUXText);
// 	} else {
// 		const mapsByDate = result.sort((a, b) => {
// 			let mapOrder = a.date - b.date;
// 			return mapOrder;
// 		});

// 		createMapSlotItems(mapsByDate);
// 	}
// };

const createMapSlotItems = (list) => {
	//NOTE: Come back to this later BUT...I don't think that invisible container on the flex is working as intended. It's a good idea though. Look at it again.
	const mapSlot = list
		.map((topoMap) => {
			// let mapSlotItem =
			return ` 
        <div class ='map-list-slots'>
          <div class ='map-list-item'>
            
              <div class ='map-list-item-title'>
                <p class="mapSlotHeader"> ${topoMap.date} | ${topoMap.mapName}</p>
                <p> ${topoMap.mapScale} | ${topoMap.location} </p>
              </div>
              <div>
                <img src=${topoMap.thumbnail} style='max-height: 60px;'>
              </div>
            <div class='action-container invisible'>
              <div class='action-area'>
                <div class='icon'></div>
                <div class='icon'></div>
                <div class='icon'></div>
                <div class='mapCard-slider'>  
                </div>
              </div>
            </div>
          </div>
        </div>`;

			// return mapSlotItem;
		})
		.join(' ');

	return MapSlotsContainerHTML(mapSlot);
};

const MapSlotsContainerHTML = (mapSlot) => {
	const sideBarMaps = `<div> ${mapSlot} </div>`;

	renderResultsToSideBar(sideBarMaps);
};

const renderResultsToSideBar = (results) => {
	document.querySelector('#mapsListUxText').classList.add('invisible');
	document.querySelector('#mapsList').innerHTML = results;
};

export { createMapSlotItems };
