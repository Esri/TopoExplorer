const orderMapsByDate = async (result) => {
	return new Promise((resolve, reject) => {
		const mapsByDate = result.sort((a, b) => {
			let mapOrder = a.date - b.date;
			return mapOrder;
		});

		resolve(mapsByDate);
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

	return renderMapSlotsToSideBar(mapSlot);
};

const renderMapSlotsToSideBar = (mapSlot) => {
	console.log(mapSlot);
	const sideBarMaps = `<div> ${mapSlot.join(' ')} </div>`;

	document.querySelector('#mapsList').innerHTML = sideBarMaps;
};

export { orderMapsByDate, createMapSlotItems };
