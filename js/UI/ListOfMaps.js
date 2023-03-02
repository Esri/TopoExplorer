import { renderSidebarUXText } from '../support/uxText.js?=v0.01';

const formatQueryReturn = async (result) => {
	return new Promise((resolve, reject) => {
		if (result.length === 0) {
			const noMapsUXText = `<em> no maps found</em>`;
			renderSidebarUXText(noMapsUXText);
		} else {
			const mapsByDate = result.sort((a, b) => {
				let mapOrder = a.date - b.date;
				return mapOrder;
			});

			resolve(mapsByDate);
			createMapSlotItems(mapsByDate);
		}
	});
};

const createMapSlotItems = (list) => {
	const mapSlot = list.map((topoMap) => {
		let mapSlotItem = ` 
  <div id='map-list-slots'>
    <div id='map-list-item'>
      <div id='map-list-item-title'>
        <p class="mapSlotHeader"> ${topoMap.date} | ${topoMap.mapName} </p>
        <p> ${topoMap.mapScale} | ${topoMap.location} </p>
      </div>
      <div>
        <p> <img src=${topoMap.thumbnail} style='max-height: 60px;'> </p>
      </div>
    </div>
  </div>`;

		return mapSlotItem;
	});

	return MapSlotsContainerHTML(mapSlot);
};

const MapSlotsContainerHTML = (mapSlot) => {
	const sideBarMaps = `<div> ${mapSlot.join(' ')} </div>`;

	renderResultsToSideBar(sideBarMaps);
};

const renderResultsToSideBar = (results) => {
	document.querySelector('#mapsListUxText').classList.add('invisible');
	document.querySelector('#mapsList').innerHTML = results;
};

export { formatQueryReturn, createMapSlotItems };
