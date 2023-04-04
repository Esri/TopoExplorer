import { mapItemOnClick } from '../../support/eventListeners/MapItemListener.js?v0.01';

const mapsList = document.querySelector('#mapsList');

const clearMapsList = () => {
	mapsList.innerHTML = '';
};

// const createMapItemCard = () => {
// 	const mapItemCard = document.createElement('div');
// 	mapItemCard.className = 'map-list-slots';
// 	return mapItemCard;
// };

const createMapSlotItems = (list) => {
	//NOTE: Come back to this later BUT...I don't think that invisible container on the flex is working as intended. It's a good idea though. Look at it again.
	// const mapItemContainer = document.createElement('div');
	// mapItemCard.className.add('map-list-container');
	// mapItemCard.addEventListener('');
	const mapSlot = list
		.map((topoMap) => {
			// let mapSlotItem =
			console.log(topoMap);

			// <div class ='map-list-slots' value='${topoMap.OBJECTID}' onclick='${topoMap.OBJECTID}'>

			return ` 
          <div class ='map-list-item' value='${topoMap.OBJECTID}'>
              <div class ='map-list-item-title'>
                <p class="mapSlotHeader"> ${topoMap.date} | ${topoMap.mapName}</p>
                <p> ${topoMap.mapScale} | ${topoMap.location} </p>
              </div>
              <div>
                <img src=${topoMap.thumbnail}>
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
          </div>`;
		})
		.join(' ');

	// return renderResultsToSideBar(mapSlot);
	return MapSlotsContainerHTML(mapSlot);
};

const MapSlotsContainerHTML = (mapSlot) => {
	// console.log(mapSlot);
	const mapListContainer = document.createElement('div');

	const sideBarMaps = (mapListContainer.innerHTML = mapSlot);

	renderResultsToSideBar(sideBarMaps);
};

const renderResultsToSideBar = (results) => {
	// console.log(results);
	document.querySelector('#mapsListUxText').classList.add('invisible');
	// mapsList.append(results);
	// mapsList.innerHTML = mapsList.innerHTML + results;
	const maps = results;
	// console.log(maps);
	// console.log(mapsList);
	//NOTE: I don't like this: the render and then the mapItemOnClick call. There has to be a better way.
	//NOTE: Also: I this render method works, but 'append' is probably better.
	mapsList.innerHTML = mapsList.innerHTML + maps;
	mapItemOnClick();
};

export { clearMapsList, createMapSlotItems };
