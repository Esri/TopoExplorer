// import { mapItemListener } from '../../support/eventListeners/MapItemListener.js?v=0.01';
import { mapFootprint } from '../../UI/MapAndFootprint/MapFootprint.js?v=0.01';
import { getTopoMap } from '../../support/ImageExportQuery.js?v=0.01';

const sideBarElement = document.querySelector('#sideBar');
const mapsList = document.querySelector('#exploreList');
const mapModes = document.querySelector('.map-mode-container .action-area');
const explorerList = document.querySelector('#exploreList');
const pinList = document.querySelector('#pinnedList');

// const container = document.querySelector('#mapsList');
//This will contain the map's geometry information to be used at various times while the mouse hovers

const mapListDetails = [];

const pinnedCardIDsArray = [];
const pinnedCardHTMLArray = [];

let urlTest;
let viewTest;
let mapFootprintLayer;
let mapHaloGraphicLayer;
let mapListItems;
let currentMapCard;
let mapGeometry;
let topoOnMapPlaceholder;

const createMapSlotItems = (list, view, url) => {
	if (!urlTest) {
		urlTest = url;
	}

	if (!viewTest) {
		viewTest = view;
	}

	// console.log(pinnedCardIDsArray);
	// console.log(topoOnMapPlaceholder);

	if (!mapFootprintLayer) {
		mapFootprintLayer = view.map.layers.find((layer) => {
			if (layer.title === 'mapFootprint') {
				return layer;
			}
		});
	}

	if (!mapHaloGraphicLayer) {
		mapHaloGraphicLayer = view.map.layers.find((layer) => {
			if (layer.title === 'halo') {
				return layer;
			}
		});
	}

	// view.map.layers.forEach((layer) => {
	// 	console.log('map layers before', toposOnMapArray);
	// 	toposOnMapArray.push(parseInt(layer.id));
	// 	console.log('map layers after', toposOnMapArray);
	// });

	// const addTopoToMap = (target, url) => {
	// 	getTopoMap(target, url).then((topoImageLayer) => {
	// 		//NOTE: maybe give this it's own function. Just to make things easier to parse
	// 		console.log('trying to add this topo');
	// 		view.map.add(topoImageLayer);
	// 	});
	// };

	// const findTopoLayer = (oid) => {
	// 	const addedLayers = view.map.layers.items;

	// 	return new Promise((resolve, reject) => {
	// 		addedLayers.find((imageTopo) => {
	// 			if (imageTopo.id == oid) {
	// 				resolve(imageTopo);
	// 			}
	// 		});
	// 	});
	// };

	// const removeTopoFromMap = (oid) => {
	// 	// console.log('closing map and card', pinnedCardIDsArray, topoOnMapPlaceholder);

	// 	findTopoLayer(oid)
	// 		.then((specificTopo) => {
	// 			view.map.remove(specificTopo);
	// 			// mapHaloGraphicLayer.graphics.remove(specificTopo);
	// 		})
	// 		.then(() => {
	// 			removeHalo(oid);
	// 		});
	// };

	const mapSlot = list
		.map((topoMap) => {
			//NOTE: since this function is now using the 'pinnedCardArray' it can be moved outside of this function.
			//which is what I want. Make it global
			// const isMapPinned = (map) => {
			// 	// console.log('chekcing for existing pin', map.OBJECTID);
			// 	// console.log(topoMap.OBJECTID);
			// 	return map === topoMap.OBJECTID;
			// };

			mapListDetails.push(topoMap);

			//NOTE: I'm calling the same function for the same purpose (but a different class result) twice. There has to be a better way than what I have.
			return ` 
        <div class='mapCard-container'>
          <div class ='map-list-item' oid='${topoMap.OBJECTID}'>
            
          <div class='topRow'>
            <div class='left-margin'>

              <div class="animate-checkbox">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="16" width="16">
                  <path d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
                </svg>
              </div>

              <div class='drag-grip'>
                <div class='grip-dot'></div>
                <div class='grip-dot'></div>
                <div class='grip-dot'></div>
              </div>

            </div>

            <div class="title-and-thumbnail">
              <div class ='map-list-item-title'>
                <p class="mapSlotHeader"> ${topoMap.date} | ${topoMap.mapName}
                </p>
                <p class ="mapSlotSub-title"> ${topoMap.mapScale} | ${
				topoMap.location
			} </p>
              </div>

              <div class="img-cover">
                <div class="frame">
                </div>
                <img src=${topoMap.thumbnail}>
              </div>
            
            </div>

              </div>

            
            <div class='action-container ${
							topoMap.OBJECTID == topoOnMapPlaceholder ||
							pinnedCardIDsArray.indexOf(`${topoMap.OBJECTID}`) !== -1
								? 'flex'
								: 'invisible'
						}'>
              <div class='action-area'>
                <div class='icon pushpin'>
                  <div class="checkmarkBackground ${
										pinnedCardIDsArray.indexOf(`${topoMap.OBJECTID}`) !== -1
											? null
											: 'hidden'
									}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M20,0H3.56757A3.56754,3.56754,0,0,0,0,3.56757V20"></path></svg>
                    <div class="checkmark">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12"viewBox="-3 3 32 32"><path fill="#EAEEF1" d="M11.927 22l-6.882-6.883-3 3L11.927 28 31.204 8.728l-3.001-3.001z"/></svg>
                    </div>
                  </div>
                  <div class="unpinned svgContainer ${
										pinnedCardIDsArray.indexOf(`${topoMap.OBJECTID}`) !== -1
											? 'pinned'
											: null
									}">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 28 28"><path d="M5 0h7v1.417l-1 .581v6l1 .502v1.498H9v6l-.5 1-.5-1v-6H5V8.5l1-.502v-6L5 1.5V0z"/></svg>
                  </div>
                </div>
                <div class='icon zoom'>
                <svg class="zoomToExtent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 16H2v6h6v-1H3zM16 3h5v5h1V2h-6zm5 18h-5v1h6v-6h-1zM8 2H2v6h1V3h5z"/><path fill="none" d="M0 0h24v24H0z"/>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-9 -8 36 36"><path d="M15.805 13.918l-3.067-3.068a.668.668 0 0 0-.943 0l-.124.124-1.108-1.108A5.279 5.279 0 1 0 6.5 11.8a5.251 5.251 0 0 0 3.373-1.244l1.108 1.108-.13.129a.667.667 0 0 0 0 .943l3.068 3.067a.665.665 0 0 0 .943 0l.943-.942a.666.666 0 0 0 0-.943zM6.5 10.8a4.3 4.3 0 1 1 4.3-4.3 4.304 4.304 0 0 1-4.3 4.3zm7.89 4.06l-2.596-2.595.473-.473 2.595 2.598z"/><path fill="none" d="M0 0h16v16H0z"/></svg>
                </svg>
                </div>
                <div class='icon save'>
                  <svg class="save" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 2h11v1H3v18h18V11h1v11H2zm20 6V2h-6v1h4.3l-8.41 8.403.707.707L21 3.714V8z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                </div>
                <a class='icon download' href="${
									topoMap.downloadLink
								}" download="${topoMap.location}, ${topoMap.date}, ${
				topoMap.mapScale
			}">
                  <svg class="download" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 3v12.294l2.647-2.647.707.707-3.853 3.854-3.854-3.854.707-.707L12 15.292V3zM6 21h13v-1H6z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                </a>
                
                
                <div class='mapCard-slider'>
                  <div>
                  <div class='slider-range'>
                    <div class='slider-range-background'></div>
                    <div class='slider-range-color'></div>
                  </div>
                  <input class="opacity-slider" type="range" list="" value="0" min="0" max="100">
                  </input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
		})
		.join(' ');

	mapsList.innerHTML = mapsList.innerHTML + mapSlot;

	mapListItems = document.querySelectorAll('.map-list-item');

	// const openMapCard = (target) => {
	// 	target
	// 		.closest('.map-list-item')
	// 		.querySelector('.action-container')
	// 		.classList.remove('invisible');

	// 	target
	// 		.closest('.map-list-item')
	// 		.querySelector('.action-container')
	// 		.classList.add('flex');
	// };

	// const closeMapCard = (target) => {
	// 	// if (pinnedCardIDsArray.length === 0) {
	// 	// 	console.log('leave the card open');
	// 	// 	return;
	// 	// }
	// 	target
	// 		.closest('.map-list-item')
	// 		.querySelector('.action-container')
	// 		.classList.remove('flex');

	// 	target
	// 		.closest('.map-list-item')
	// 		.querySelector('.action-container')
	// 		.classList.add('invisible');
	// };

	// const isMapCardOpen = (target) => {
	// 	const targetInvisability = target
	// 		.closest('.map-list-item')
	// 		.querySelector('.action-container')
	// 		.classList.contains('invisible');

	// 	if (targetInvisability) {
	// 		openMapCard(target);
	// 		return false;
	// 	} else {
	// 		closeMapCard(target);
	// 		return true;
	// 	}
	// };

	// const setTopoMapPlaceholder = (oid) => {
	// 	if (
	// 		topoOnMapPlaceholder !== parseInt(oid) &&
	// 		pinnedCardIDsArray.indexOf(`${topoOnMapPlaceholder}`) === -1
	// 	) {
	// 		console.log('removing?');
	// 		removeTopoFromMap(topoOnMapPlaceholder);
	// 	}
	// 	console.log(topoOnMapPlaceholder);
	// 	console.log(oid);
	// 	topoOnMapPlaceholder == oid
	// 		? (topoOnMapPlaceholder = 0)
	// 		: (topoOnMapPlaceholder = parseInt(oid));
	// 	console.log(topoOnMapPlaceholder);
	// };

	// const updatePinnedNumberHeader = () => {
	// 	const pinnedNumber = pinnedCardIDsArray.length || '';
	// 	const pinnedTextUpdate = 'Pinned Topo Map';
	// 	document.querySelector('.pinCount').innerHTML = pinnedNumber;
	// 	if (pinnedCardIDsArray > 1) {
	// 		document.querySelector('.pinnedText').innerHTML = pinnedTextUpdate;
	// 	} else {
	// 		document.querySelector('.pinnedText').innerHTML = `${pinnedTextUpdate}s`;
	// 	}
	// };

	// const updatePinnedListHTML = () => {
	// 	console.log(pinnedCardHTMLArray);
	// 	// pinList.innerHTML =
	// 	const pinnedMapSlot = pinnedCardHTMLArray
	// 		.map((pinnedMap) => {
	// 			return `
	//             <div class='mapCard-container'>
	//               ${pinnedMap}
	//             </div>`;
	// 		})
	// 		.join(' ');
	// 	pinList.innerHTML = pinnedMapSlot;
	// };

	// const formatPinnedListMapCard = (targetMapCard) => {
	// 	console.log(targetMapCard.innerHTML);
	// 	pinnedCardHTMLArray.push(targetMapCard.innerHTML);
	// 	updatePinnedListHTML();
	// };
	// // const addToPinnedArray = (oid, targetMapCard) => {
	// 	pinnedCardIDsArray.push(oid);
	// 	formatPinnedListMapCard(targetMapCard);
	// 	updatePinnedNumberHeader();
	// };

	// const removePinnedTopo = (index) => {
	// 	pinnedCardIDsArray.splice(index, 1);
	// 	pinnedCardHTMLArray.splice(index, 1);
	// 	console.log(pinnedCardHTMLArray);
	// 	updatePinnedListHTML();
	// 	updatePinnedNumberHeader();
	// };

	// const isCurrentMapPinned = (targetMapCard, callback) => {
	// 	const oid =
	// 		targetMapCard.querySelector('.map-list-item').attributes.oid.value;
	// 	console.log(oid);

	// 	const searchPinnedArray = pinnedCardIDsArray.indexOf(oid);

	// 	//if the targetMapCard is not in the array, it has just been pinned. Add the mapCard to the pinnedArray, render the topo on the map.
	// 	//otherwise the mapCard must already be pinned, remove it (and it's topo).
	// 	if (searchPinnedArray === -1) {
	// 		callback(oid, targetMapCard);
	// 		return;
	// 	} else {
	// 		//remove the mapCard from the 'pinnedIDsArray' to reflect it's unpinning.
	// 		removePinnedTopo(pinnedCardIDsArray.indexOf(oid));

	// 		//checking if the unpinned mapCard is the most-recently-opened mapCard.
	// 		//if yes, the holder variable will be set to '0'.
	// 		if (oid == topoOnMapPlaceholder) {
	// 			console.log('checking oid', oid);
	// 			topoOnMapPlaceholder = 0;
	// 		}

	// 		//checking to see if there are any other topos pinned and if an unpinned map has been opened.If yes, stop the process.
	// 		if (
	// 			pinnedCardIDsArray.length == 0 &&
	// 			(topoOnMapPlaceholder == oid || topoOnMapPlaceholder == 0)
	// 		) {
	// 			return;
	// 		}

	// 		const relatedMapCard = document.querySelector(
	// 			`.map-list-item[oid="${oid}"]`
	// 		);
	// 		callback(oid);
	// 		closeMapCard(relatedMapCard);
	// 	}
	// };

	// const mapPinningAction = (pinIcon, pinCheckmarkIcon, targetMapCard) => {
	// 	console.log('pinning is', currentMapCard);

	// 	console.log(pinnedCardIDsArray);

	// 	pinIcon.classList.toggle('pinned');
	// 	pinCheckmarkIcon.classList.toggle('hidden');

	// 	if (pinIcon.classList.contains('pinned')) {
	// 		isCurrentMapPinned(targetMapCard, addToPinnedArray);
	// 	} else {
	// 		console.log('checking the placeholder', topoOnMapPlaceholder);

	// 		isCurrentMapPinned(targetMapCard, removeTopoFromMap);
	// 	}

	// 	console.log(pinnedCardIDsArray);
	// };

	// const zoomToTopo = (lat, long) => {
	// 	console.log('zoomin.', long, lat);
	// 	view.goTo({
	// 		center: [long, lat],
	// 	});
	// };

	// const checkAnyOpenMapCards = (oid) => {
	// 	mapListItems.forEach((mapCard) => {
	// 		if (mapCard.attributes.oid.value === oid) {
	// 			return;
	// 		}
	// 		if (mapCard.querySelector('.action-container.invisible')) {
	// 			return;
	// 		} else {
	// 			if (mapCard.querySelector('.pinned')) {
	// 				return;
	// 			} else {
	// 				removeTopoFromMap(mapCard.attributes.oid.value);
	// 				closeMapCard(mapCard);
	// 			}
	// 		}
	// 	});
	// };

	// const addHalo = (mapItem) =>
	// 	mapCardData(mapItem).then((cardInfo) => {
	// 		mapFootprint(JSON.stringify(cardInfo)).then((topoOutline) => {
	// 			// console.log('the Halo', topoOutline);
	// 			mapHaloGraphicLayer.graphics.add(topoOutline);
	// 			// console.log('the view', view);
	// 		});
	// 	});

	// const findHaloGraphic = (oid) => {
	// 	// console.log(mapHaloGraphicLayer);
	// 	const haloGraphicsList = mapHaloGraphicLayer.graphics.items;
	// 	return new Promise((resolve, reject) => {
	// 		haloGraphicsList.find((mapHaloGraphic) => {
	// 			// console.log(mapHaloGraphic);
	// 			// console.log("here's the oid", oid);
	// 			if (mapHaloGraphic.attributes.id == oid) {
	// 				resolve(mapHaloGraphic);
	// 			}
	// 		});
	// 	});
	// };

	// const removeHalo = (oid) => {
	// 	console.log('was remove halo called?');
	// 	findHaloGraphic(oid).then((specificHalo) => {
	// 		// console.log('the specific halo', specificHalo);
	// 		mapHaloGraphicLayer.graphics.remove(specificHalo);
	// 		// console.log(mapHaloGraphicLayer);
	// 	});
	// };

	//Event Listeners for the mapCards
	// mapListItems.forEach((mapCard) => {
	// 	let footprintOutline;

	// mapCard.addEventListener('mouseenter', (event) => {
	// 	let mapItem = event.target;

	// 	mapCardData(mapItem).then((cardInfo) => {
	// 		// currentMapCard = JSON.stringify(cardInfo);
	// 		mapFootprint(JSON.stringify(cardInfo)).then((topoOutline) => {
	// 			mapGeometry = topoOutline;
	// 			// console.log(mapFootprintLayer);
	// 			// console.log('the topoOutline', topoOutline);
	// 			mapFootprintLayer.graphics.add(mapGeometry);
	// 			// console.log('the view', view);
	// 		});
	// 	});
	// });

	// mapCard.addEventListener('mouseleave', (event) => {
	// 	console.log('leaving');
	// 	// mapFootprintLayer.graphics.remove(mapGeometry);
	// 	mapFootprintLayer.graphics.removeAll();
	// });

	// mapCard.addEventListener('click', (event) => {
	// if (event.target.closest('.action-container')) {
	// 	return;
	// }

	// let target = event.target;
	// let targetTopLevel = event.target.closest('.map-list-item');

	// if (pinnedCardIDsArray.indexOf(targetTopLevel.attributes.oid.value) > -1) {
	// 	return;
	// }

	// checkAnyOpenMapCards(targetTopLevel.attributes.oid.value);

	// if (!isMapCardOpen(target)) {
	// 	console.log('click checking the map card is not open');
	// 	addTopoToMap(targetTopLevel.attributes.oid.value, url);
	// 	addHalo(targetTopLevel);
	// 	setTopoMapPlaceholder(targetTopLevel.attributes.oid.value);
	// } else {
	// 	setTopoMapPlaceholder(targetTopLevel.attributes.oid.value);
	// 	console.log('click checking the map card IS open');
	// 	removeTopoFromMap(targetTopLevel.attributes.oid.value);
	// }
	// });

	// mapCard;
	//}); //end of mapCard top-level eventlistener assignment

	//Event Listeners for each of the action items in the cards
	//the pin event for the mapCard
	// mapCardPin.forEach((pinBtn) => {
	// 	pinBtn.addEventListener('click', (event) => {
	// 		event.stopPropagation();
	// 		//NOTE: this is a bad variable name...the function name isn't much better
	// 		// console.log(event.target.closest('.map-list-item'));
	// 		const targetMapCard = event.target.closest('.mapCard-container');

	// 		const pinIcon = pinBtn.querySelector('.unpinned');
	// 		const pinCheckmarkIcon = pinBtn.querySelector('.checkmarkBackground');
	// 		// console.log(targetMapCard.innerHTML);

	// 		mapPinningAction(pinIcon, pinCheckmarkIcon, targetMapCard);
	// 	});
	// });

	//this is the new approach/event delegation approach from the pinning action, and it almost works...
	// const pinEvent = (eventTarget, targetOID) => {
	// 	console.log(eventTarget.closest('.pushpin'));
	// 	if (!eventTarget.closest('.pushpin')) {
	// 		return;
	// 	}

	// 	console.log('pushpin');

	// 	const targetMapCard = eventTarget.closest('.mapCard-container');

	// 	const specificCard = explorerList.querySelector(
	// 		`.map-list-item[oid="${targetOID}"]`
	// 	);
	// 	console.log(specificCard);
	// 	const pinIcon = specificCard.querySelector('.unpinned');
	// 	//NOTE: this is the old way to select/find a mapCard, but it calls the specific mapCard that was clicked on.
	// 	// targetMapCard.querySelector('.unpinned');
	// 	const pinCheckmarkIcon = specificCard.querySelector('.checkmarkBackground');

	// 	// console.log(pinIcon);
	// 	// console.log(pinCheckmarkIcon);
	// 	mapPinningAction(pinIcon, pinCheckmarkIcon, targetMapCard);
	// };

	// const zoomEvent = (eventTarget) => {
	// 	if (!eventTarget.closest('.zoomToExtent')) {
	// 		return;
	// 	}

	// 	const location = [
	// 		mapGeometry.geometry.centroid.latitude,
	// 		mapGeometry.geometry.centroid.longitude,
	// 	];
	// 	zoomToTopo(location[0], location[1]);
	// };

	// const saveEvent = (eventTarget) => {
	// 	if (!eventTarget.closest('.save')) {
	// 		return;f
	// 	}
	// 	console.log('this would save and export');
	// };

	//  document.querySelector('#sideBar').addEventListener('click', (event) => {
	// 	console.log('sidebar, sideBar');
	// 	console.log(event.target.closest('.map-list-item'));
	// 	if (!event.target.closest('.map-list-item')) {
	// 		return;
	// 	}
	// 	const eventTarget = event.target;
	// 	const targetOID =
	// 		eventTarget.closest('.map-list-item').attributes.oid.value;

	// 	isMapCardOpen(eventTarget, targetOID);
	// 	checkAnyOpenMapCards(targetOID);
	// 	pinEvent(eventTarget, targetOID);
	// 	zoomEvent(eventTarget);
	// 	saveEvent(eventTarget);
	// });

	//zoomBtn event
	// mapCardZoom.forEach((zoomBtn) => {
	// 	zoomBtn.addEventListener('click', (event) => {
	// 		event.stopPropagation();
	// 		const mapItem = zoomBtn.closest('.map-list-item');

	// 		// console.log('clicked the zoom for', mapItem);
	// 		const location = [
	// 			mapGeometry.geometry.centroid.latitude,
	// 			mapGeometry.geometry.centroid.longitude,
	// 		];
	// 		zoomToTopo(location[0], location[1]);
	// 	});
	// });

	// //saveBtn
	// mapCardSave.forEach((saveBtn) => {
	// 	saveBtn.addEventListener('click', (event) => {
	// 		event.stopPropagation();
	// 		console.log('save');
	// 	});
	// });

	// //downloadBtn
	// mapCardDownload.forEach((downloadBtn) => {
	// 	downloadBtn.addEventListener('click', (event) => {
	// 		event.stopPropagation();
	// 		console.log('download');
	// 	});
	// });

	// mapOpacitySlider.forEach((opacitySlider) => {
	// 	opacitySlider.addEventListener('click', (event) => {
	// 		event.stopImmediatePropagation();
	// 	});
	// 	opacitySlider.addEventListener('input', (event) => {
	// 		const sliderValue = event.target.value;
	// 		handleOpacityChange(sliderValue);
	// 		sliderColorPosition(event, sliderValue);
	// 	});
	// });

	// const sliderColorPosition = (event, value) => {
	// 	//NOTE: this isn't handling any opacity element. It needs to access the layer with the corresponding id.
	// 	// event.preventDefault();

	// 	let target = event.target;

	// 	// const value = target.value;

	// 	target.parentElement.querySelector(
	// 		'.slider-range-color'
	// 	).style.width = `${value}%`;
	// };

	// const handleOpacityChange = (value) => {
	// 	//NOTE: I have a global var for the mapGeometry....why not a global var for the mapCard the mouse hovers over?

	// 	//Looking for a specific layer that matches the current map
	// 	// view.map.layers.items.find(())

	// 	findTopoLayer(currentMapCard.OBJECTID).then((specificTopo) => {
	// 		specificTopo.opacity = 1 - value / 100;
	// 	});
	// };
}; //end of the mapCard Generator

//We can move this inside the creatator module (just remember how to access different functions withing a function...obj notation)
const clearMapsList = () => {
	mapListDetails.length = 0;
	mapsList.innerHTML = '';
};

//toggling between the map modes.
const toggleListVisibility = () => {
	console.log('togglin');
	explorerList.classList.toggle('invisible');
	mapModes.querySelector('.explorer-mode').classList.toggle('underline');

	pinList.classList.toggle('invisible');
	mapModes.querySelector('.pinned-mode').classList.toggle('underline');
};

mapModes.addEventListener('click', (event) => {
	const toplevel = event.target.closest('.mode');
	console.log(event.target.closest('.explorer-mode'));
	console.log(toplevel.querySelector('.explorer-mode'));
	console.log(toplevel.querySelector('.underline'));
	// const targetMode = event.target.closest('.mode');
	if (toplevel.querySelector('.btn-text').classList.contains('underline')) {
		return;
	}
	toggleListVisibility();
});

console.log(urlTest);

const mapCardData = (mapItem) => {
	return new Promise((resolve, reject) => {
		mapListDetails.find((cardData) => {
			if (cardData.OBJECTID == mapItem.attributes.oid.value) {
				// console.log(cardData);
				currentMapCard = cardData;
				resolve(cardData);
			}
		});
	});
};

const setTopoMapPlaceholder = (oid) => {
	if (
		topoOnMapPlaceholder !== parseInt(oid) &&
		pinnedCardIDsArray.indexOf(`${topoOnMapPlaceholder}`) === -1
	) {
		console.log(
			'removing something other than most recent map based on the OID'
		);
		//NOTE: this used to remove the 'topoOnMapPlaceHolder'. I recently set it to 'oid'?
		removeTopoFromMap(topoOnMapPlaceholder);
	}
	console.log(topoOnMapPlaceholder);
	console.log(oid);
	topoOnMapPlaceholder == parseInt(oid)
		? (topoOnMapPlaceholder = 0)
		: (topoOnMapPlaceholder = parseInt(oid));
	console.log(topoOnMapPlaceholder);
};

const checkAnyOpenMapCards = (oid) => {
	mapListItems.forEach((mapCard) => {
		console.log(oid);
		if (mapCard.attributes.oid.value == oid || topoOnMapPlaceholder == oid) {
			return;
		}
		if (mapCard.querySelector('.action-container.invisible')) {
			return;
		} else {
			if (mapCard.querySelector('.pinned')) {
				return;
			} else {
				console.log('calling close mapCard on', mapCard, oid);
				removeTopoFromMap(mapCard.attributes.oid.value);
				closeMapCard(mapCard);
			}
		}
	});
};

const updatePinnedNumberHeader = () => {
	const pinnedNumber = pinnedCardIDsArray.length || '';
	const pinnedTextUpdate = 'Pinned Topo Map';
	document.querySelector('.pinCount').innerHTML = pinnedNumber;
	if (pinnedCardIDsArray > 1) {
		document.querySelector('.pinnedText').innerHTML = pinnedTextUpdate;
	} else {
		document.querySelector('.pinnedText').innerHTML = `${pinnedTextUpdate}s`;
	}
};

const updatePinnedListHTML = () => {
	console.log(pinnedCardHTMLArray);
	// pinList.innerHTML =
	const pinnedMapSlot = pinnedCardHTMLArray
		.map((pinnedMap) => {
			return `
            <div class='mapCard-container'>
              ${pinnedMap}
            </div>`;
		})
		.join(' ');
	pinList.innerHTML = pinnedMapSlot;
};

const formatPinnedListMapCard = (targetOID, targetMapCard) => {
	targetMapCard.querySelector('input').attributes.value.value =
		targetMapCard.querySelector('input').value;
	pinnedCardHTMLArray.push(targetMapCard.innerHTML);
	updatePinnedListHTML();
};

const addToPinnedArray = (oid, targetMapCard) => {
	pinnedCardIDsArray.push(oid);
	formatPinnedListMapCard(oid, targetMapCard);
	updatePinnedNumberHeader();
};

const removePinnedTopo = (index) => {
	pinnedCardIDsArray.splice(index, 1);
	pinnedCardHTMLArray.splice(index, 1);
	console.log(pinnedCardHTMLArray);
	updatePinnedListHTML();
	updatePinnedNumberHeader();
};

const isCurrentMapPinned = (targetMapCard, callback) => {
	const oid =
		targetMapCard.querySelector('.map-list-item').attributes.oid.value;
	console.log(oid);

	const searchPinnedArray = pinnedCardIDsArray.indexOf(oid);

	//if the targetMapCard is not in the array, it has just been pinned. Add the mapCard to the pinnedArray, render the topo on the map.
	//otherwise the mapCard must already be pinned, remove it (and it's topo).
	if (searchPinnedArray === -1) {
		callback(oid, targetMapCard);
		return;
	} else {
		const relatedMapCard = explorerList.querySelector(
			`.map-list-item[oid="${oid}"]`
		);

		if (targetMapCard.closest('#pinnedList')) {
			console.log('pinnList Card override');
			callback(oid);
			closeMapCard(relatedMapCard);
			removePinnedTopo(pinnedCardIDsArray.indexOf(oid));
			return;
		}

		//remove the mapCard from the 'pinnedIDsArray' to reflect it's unpinning.
		removePinnedTopo(pinnedCardIDsArray.indexOf(oid));

		//checking if the unpinned mapCard is the most-recently-opened mapCard.
		//if yes, the holder variable will be set to '0'.
		if (oid == topoOnMapPlaceholder) {
			console.log('checking oid', oid);
			// setTopoMapPlaceholder(oid);
		}

		//checking to see if there are any other topos pinned and if an unpinned map has been opened.If yes, stop the process.
		if (
			pinnedCardIDsArray.length == 0 &&
			(topoOnMapPlaceholder == oid || topoOnMapPlaceholder == 0)
		) {
			return;
		}

		callback(oid);
		closeMapCard(relatedMapCard);
	}
};

const mapPinningAction = (pinIcon, pinCheckmarkIcon, targetMapCard) => {
	console.log('pinning is', targetMapCard);

	console.log(pinnedCardIDsArray);

	pinIcon.classList.toggle('pinned');
	pinCheckmarkIcon.classList.toggle('hidden');

	if (pinIcon.classList.contains('pinned')) {
		isCurrentMapPinned(targetMapCard, addToPinnedArray);
	} else {
		console.log('checking the placeholder', topoOnMapPlaceholder);
		isCurrentMapPinned(targetMapCard, removeTopoFromMap);
	}

	console.log(pinnedCardIDsArray);
};

const findTopoLayer = (oid) => {
	const addedLayers = viewTest.map.layers.items;

	return new Promise((resolve, reject) => {
		addedLayers.find((imageTopo) => {
			if (imageTopo.id == oid) {
				resolve(imageTopo);
			}
		});
	});
};

const addTopoToMap = (target, url) => {
	getTopoMap(target, url).then((topoImageLayer) => {
		//NOTE: maybe give this it's own function. Just to make things easier to parse
		console.log('trying to add this topo');
		viewTest.map.add(topoImageLayer);
	});
};

const removeTopoFromMap = (oid) => {
	// console.log('closing map and card', pinnedCardIDsArray, topoOnMapPlaceholder);

	findTopoLayer(oid)
		.then((specificTopo) => {
			viewTest.map.remove(specificTopo);
			// mapHaloGraphicLayer.graphics.remove(specificTopo);
		})
		.then(() => {
			removeHalo(oid);
		});
};

const findHaloGraphic = (oid) => {
	// console.log(mapHaloGraphicLayer);
	const haloGraphicsList = mapHaloGraphicLayer.graphics.items;
	return new Promise((resolve, reject) => {
		haloGraphicsList.find((mapHaloGraphic) => {
			// console.log(mapHaloGraphic);
			// console.log("here's the oid", oid);
			if (mapHaloGraphic.attributes.id == oid) {
				resolve(mapHaloGraphic);
			}
		});
	});
};

const removeHalo = (oid) => {
	console.log('was remove halo called?');
	findHaloGraphic(oid).then((specificHalo) => {
		// console.log('the specific halo', specificHalo);
		mapHaloGraphicLayer.graphics.remove(specificHalo);
		// console.log(mapHaloGraphicLayer);
	});
};

const addHalo = (mapItem) =>
	mapCardData(mapItem).then((cardInfo) => {
		mapFootprint(JSON.stringify(cardInfo)).then((topoOutline) => {
			// console.log('the Halo', topoOutline);
			mapHaloGraphicLayer.graphics.add(topoOutline);
			// console.log('the view', view);
		});
	});

const pinEvent = (eventTarget, targetOID) => {
	if (!eventTarget.closest('.pushpin')) {
		return;
	}

	console.log('pushpin');

	const targetMapCard = eventTarget.closest('.mapCard-container');

	const mapCardInExploreModeList = explorerList.querySelector(
		`.map-list-item[oid="${targetOID}"]`
	);

	//NOTE: if the card is in 'pinned list' AND the mapCard exists in the 'explore list' set css to unpin.
	if (targetMapCard.closest('#pinnedList') && mapCardInExploreModeList) {
		mapCardInExploreModeList
			.querySelector('.unpinned')
			.classList.toggle('pinned');
		mapCardInExploreModeList
			.querySelector('.checkmarkBackground')
			.classList.toggle('hidden');
	}
	// console.log(specificCard);

	const pinIcon = targetMapCard.querySelector('.unpinned');
	//NOTE: this is the old way to select/find a mapCard, but it calls the specific mapCard that was clicked on.
	// targetMapCard.querySelector('.unpinned');
	const pinCheckmarkIcon = targetMapCard.querySelector('.checkmarkBackground');

	// console.log(pinIcon);
	// console.log(pinCheckmarkIcon);
	mapPinningAction(pinIcon, pinCheckmarkIcon, targetMapCard);
};

const zoomToTopo = (lat, long) => {
	console.log('zoomin.', long, lat);
	view.goTo({
		center: [long, lat],
	});
};

const zoomEvent = (eventTarget) => {
	if (!eventTarget.closest('.zoomToExtent')) {
		return;
	}

	const location = [
		mapGeometry.geometry.centroid.latitude,
		mapGeometry.geometry.centroid.longitude,
	];
	zoomToTopo(location[0], location[1]);
};

const saveEvent = (eventTarget) => {
	if (!eventTarget.closest('.save')) {
		return;
	}
	console.log('this would save and export');
};

const openMapCard = (target) => {
	target
		.closest('.map-list-item')
		.querySelector('.action-container')
		.classList.remove('invisible');

	target
		.closest('.map-list-item')
		.querySelector('.action-container')
		.classList.add('flex');
};

const handleOpacityChange = (targetOID, sliderValue) => {
	//NOTE: I have a global var for the mapGeometry....why not a global var for the mapCard the mouse hovers over?

	findTopoLayer(targetOID).then((specificTopo) => {
		specificTopo.opacity = 1 - sliderValue / 100;
	});
};

const opacitySliderEvent = (event, eventTarget, targetOID) => {
	if (!eventTarget.closest('.mapCard-slider')) {
		return;
	}

	console.log('opacity event', event);

	const sliderValue = event.target.value;
	console.log('sliderValue', sliderValue);
	handleOpacityChange(targetOID, sliderValue);
	sliderColorPosition(event, sliderValue, targetOID);
};

const sliderColorPosition = (event, value, targetOID) => {
	//NOTE: this isn't handling any opacity element. It needs to access the layer with the corresponding id.

	document
		.querySelectorAll(`.map-list-item[oid="${targetOID}"] .mapCard-slider`)
		.forEach((sliderBar) => {
			sliderBar.querySelector('.slider-range-color').style.width = `${value}%`;
			sliderBar.querySelector('.opacity-slider').value = value;
		});
};

const closeMapCard = (target) => {
	console.log('closeMapCard was called on', target);
	target
		.closest('.map-list-item')
		.querySelector('.action-container')
		.classList.remove('flex');

	target
		.closest('.map-list-item')
		.querySelector('.action-container')
		.classList.add('invisible');
};

const isMapCardOpen = (target, targetOID) => {
	const targetTopLevel = target.closest('.map-list-item');
	console.log(targetOID, topoOnMapPlaceholder);
	console.log(targetOID === topoOnMapPlaceholder);
	if (
		target.closest('.action-container') ||
		targetTopLevel.querySelector('.pinned')
	) {
		console.log(
			target,
			'map action clicked, OR map is pinned or the most recent opened and will stay open'
		);
		return;
	}

	const targetInvisability = targetTopLevel
		.querySelector('.action-container')
		.classList.contains('invisible');

	if (targetInvisability) {
		checkAnyOpenMapCards(targetOID);
		addTopoToMap(targetOID, urlTest);
		addHalo(targetTopLevel);
		openMapCard(target);
		setTopoMapPlaceholder(targetOID);
		return false;
	} else {
		closeMapCard(target);
		setTopoMapPlaceholder(targetOID);
		removeTopoFromMap(targetOID);
		return true;
	}
};

sideBarElement.addEventListener('click', (event) => {
	const eventTarget = event.target;
	const targetOID = eventTarget.closest('.map-list-item').attributes.oid.value;

	if (!eventTarget.closest('.map-list-item')) {
		return;
	}

	if (eventTarget.matches('.opacity-slider')) {
		return;
	}

	if (!eventTarget.closest('.action-container')) {
		isMapCardOpen(eventTarget, targetOID);
	}

	pinEvent(eventTarget, targetOID);
	zoomEvent(eventTarget);
	saveEvent(eventTarget);
});

sideBarElement.addEventListener('input', (event) => {
	event.stopImmediatePropagation();
	const eventTarget = event.target;
	const targetOID = eventTarget.closest('.map-list-item').attributes.oid.value;

	opacitySliderEvent(event, eventTarget, targetOID);
});

sideBarElement.addEventListener(
	'mouseenter',
	(event) => {
		if (event.target.matches('.map-list-item')) {
			let mapItem = event.target;

			mapCardData(mapItem).then((cardInfo) => {
				// currentMapCard = JSON.stringify(cardInfo);
				mapFootprint(JSON.stringify(cardInfo)).then((topoOutline) => {
					mapGeometry = topoOutline;
					mapFootprintLayer.graphics.add(mapGeometry);
				});
			});
		}
	},
	true
);

sideBarElement.addEventListener(
	'mouseleave',
	(event) => {
		mapFootprintLayer.graphics.removeAll();
	},
	true
);

export { clearMapsList, createMapSlotItems };
