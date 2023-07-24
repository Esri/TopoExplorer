// import { mapItemListener } from '../../support/eventListeners/MapItemListener.js?v=0.01';
import { mapFootprint } from '../../UI/MapAndFootprint/MapFootprint.js?v=0.01';
import { getTopoMap } from '../../support/ImageExportQuery.js?v=0.01';
import { mapExportProcess } from '../Export/export.js?v=0.01';
const url = new URL(window.location.href);

const sideBarElement = document.querySelector('#sideBar');
const mapsList = document.querySelector('#exploreList');
const mapModes = document.querySelector('.map-mode-container .action-area');
const explorerList = document.querySelector('#exploreList');
const pinList = document.querySelector('#pinnedList');

// const mapListDetails = [];

const pinnedCardIDsArray = [];
const pinnedCardHTMLArray = [];

//NOTE I think this should be moved to the mapCount file. I have a number of related actions happening there. It's kind of confusing in the DOM if I don't put those things together.
const noMapsHelpText = `<div class='helpText'>
Change your map extent,
or adjust filter selections,
to find topo maps.
</div>
`;

let urlTest;
let viewTest;
let mapFootprintLayer;
let mapHaloGraphicLayer;
let mapListItems;
// let currentMapCard;
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

	if (!mapFootprintLayer && view) {
		mapFootprintLayer = view.map.layers.find((layer) => {
			if (layer.title === 'mapFootprint') {
				return layer;
			}
		});
	}

	if (!mapHaloGraphicLayer && view) {
		mapHaloGraphicLayer = view.map.layers.find((layer) => {
			if (layer.title === 'halo') {
				return layer;
			}
		});
	}

	if (list.length === 0) {
		mapsList.innerHTML = noMapsHelpText;
		return;
	}

	const mapSlot = list
		.map((topoMap) => {
			// mapListDetails.push(topoMap);

			console.log(topoMap.previousPinnedMap);
			const isCardPinned =
				topoMap.previousPinnedMap || getPinnedTopoIndex(`${topoMap.OBJECTID}`);
			console.log(isCardPinned);

			//NOTE: I'm calling the same function for the same purpose (but a different class result) twice. There has to be a better way than what I have.
			return ` 
        <div class='mapCard-container'>
          <div class ='map-list-item' oid='${
						topoMap.OBJECTID
					}' geometry='${JSON.stringify(topoMap.mapBoundry)}'>
            
          <div class='topRow'>
            <div class='left-margin'>

              <div class="animate-checkbox hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="16" width="16">
                  <path class="" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
                </svg>
              </div>

              <div class='drag-grip' draggable=true>
                <div class='grip-dot'></div>
                <div class='grip-dot'></div>
                <div class='grip-dot'></div>
              </div>

            </div>

            <div class="title-and-thumbnail">
              <div class ='map-list-item-title'>
                <p class="mapSlotHeader"> <span class="year">${
									topoMap.date
								}</span> | <span class="name">${topoMap.mapName}</span>
                </p>
                <p class ="mapSlotSub-title"> <span class="scale">${
									topoMap.mapScale
								}</span> | <span class="location">${topoMap.location}</span>
			</p>
              </div>

              <div class="img-cover">
                <div class="frame">
                </div>
                <img src=${topoMap.thumbnail}>
              </div>
            
            </div>

              </div>

            
            <div class='action-container ${
							topoMap.OBJECTID == topoOnMapPlaceholder || isCardPinned !== -1
								? 'flex'
								: 'invisible'
						}'>
              <div class='action-area'>
                <div class='icon pushpin'>
                  <div class="checkmarkBackground ${
										isCardPinned === true || isCardPinned !== -1 ? '' : 'hidden'
									}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M20,0H3.56757A3.56754,3.56754,0,0,0,0,3.56757V20"></path></svg>
                    <div class="checkmark">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12"viewBox="-3 3 32 32"><path fill="#EAEEF1" d="M11.927 22l-6.882-6.883-3 3L11.927 28 31.204 8.728l-3.001-3.001z"/></svg>
                    </div>
                  </div>
                  <div class="unpinned svgContainer ${
										isCardPinned === true || isCardPinned !== -1 ? 'pinned' : ''
									}">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 28 28"><path d="M5 0h7v1.417l-1 .581v6l1 .502v1.498H9v6l-.5 1-.5-1v-6H5V8.5l1-.502v-6L5 1.5V0z"/></svg>
                  </div>
                </div>
                <div class='icon zoom' location='${
									topoMap.mapCenterGeographyX
								}, ${topoMap.mapCenterGeographyY}'>
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
                    <div class='slider-range-color' style= "width: ${
											topoMap.OBJECTID == topoOnMapPlaceholder ||
											isCardPinned !== -1
												? setTopoOpacity(topoMap.OBJECTID)
												: 100
										}%;"></div>
                  </div>
                  <input class="opacity-slider" type="range" list="" value=100
                      min="0" max="100">
                  </input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
		})
		.join(' ');

	if (list[0].previousPinnedMap) {
		// pinList.innerHTML = mapSlot;
		console.log(list);
		// console.log(mapSlot);
		const mapItem = mapSlot;
		const mapCardContainingDiv = document.createElement('div');
		mapCardContainingDiv.innerHTML = mapSlot;
		const containingItem =
			mapCardContainingDiv.querySelector('.mapCard-container');
		console.log(containingItem);
		// addToPinnedArray(list[0].OBJECTID, mapSlot);
		addTopoToMap(list[0].OBJECTID, url);
		addHalo(list[0].OBJECTID, JSON.stringify(list[0].mapBoundry));
		isCurrentMapPinned(containingItem, addToPinnedArray);
		return;
	}

	mapsList.innerHTML = mapsList.innerHTML + mapSlot;

	mapListItems = document.querySelectorAll('.map-list-item');
}; //end of the mapCard Generator

//We can move this inside the creatator module (just remember how to access different functions withing a function...obj notation)
const clearMapsList = () => {
	// mapListDetails.length = 0;
	mapsList.innerHTML = '';
};

//toggling between the map modes.
//I think I should more this to another module/file. I want to add the pinned mode buttons
const toggleListVisibility = () => {
	explorerList.classList.toggle('invisible');
	document.querySelector('#filtersAndSorting').classList.toggle('flex');
	document.querySelector('#filtersAndSorting').classList.toggle('invisible');
	mapModes.querySelector('.explorer-mode').classList.toggle('underline');

	pinList.classList.toggle('invisible');
	document.querySelector('.pinned-mode-options').classList.toggle('flex');
	document.querySelector('.pinned-mode-options').classList.toggle('invisible');
	mapModes.querySelector('.pinned-mode').classList.toggle('underline');

	if (mapModes.querySelector('.pinned-mode').classList.contains('underline')) {
		addDragEventListener();
	}
};

mapModes.addEventListener('click', (event) => {
	const toplevel = event.target.closest('.mode');
	if (toplevel.querySelector('.btn-text').classList.contains('underline')) {
		return;
	}
	toggleListVisibility();
});

//NOTE: do I even need this value?
// const mapCardData = (mapItem) => {
// 	return new Promise((resolve, reject) => {
// 		mapListDetails.find((cardData) => {
// 			if (cardData.OBJECTID == mapItem.attributes.oid.value) {
// 				// console.log(cardData);
// 				currentMapCard = cardData;
// 				resolve(cardData);
// 			}
// 		});
// 	});
// };

const setTopoMapPlaceholder = (oid) => {
	if (
		topoOnMapPlaceholder !== parseInt(oid) &&
		pinnedCardIDsArray.indexOf(`${topoOnMapPlaceholder}`) === -1
	) {
		//NOTE: this used to remove the 'topoOnMapPlaceHolder'. I recently set it to 'oid'?
		removeTopoFromMap(topoOnMapPlaceholder);
	}

	topoOnMapPlaceholder == parseInt(oid)
		? (topoOnMapPlaceholder = 0)
		: (topoOnMapPlaceholder = parseInt(oid));
};

const checkAnyOpenMapCards = (oid) => {
	mapListItems.forEach((mapCard) => {
		if (mapCard.attributes.oid.value == oid || topoOnMapPlaceholder == oid) {
			return;
		}
		if (mapCard.querySelector('.action-container.invisible')) {
			return;
		} else {
			if (mapCard.querySelector('.pinned')) {
				return;
			} else {
				removeTopoFromMap(mapCard.attributes.oid.value);
				closeMapCard(mapCard);
			}
		}
	});
};

const updateHashParams = () => {
	const topoIDsString = pinnedCardIDsArray.join();

	url.hash = `${topoIDsString}`;

	window.location.hash = url.hash;
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

const updatePinnedListHTML = (mapObj) => {
	console.log(pinnedCardHTMLArray);
	// pinList.innerHTML =
	// const pinnedMapSlot = pinnedCardHTMLArray
	// 	.map((pinnedMap) => {

	// 		return `
	//           <div class='mapCard-container' draggable=false>
	//             ${pinnedMap.html}
	//           </div>`;
	// 	})
	// 	.join(' ');
	// pinList.innerHTML = pinnedMapSlot;
	const pinnedCardContainer = document.createElement('div');
	pinnedCardContainer.classList.add('mapCard-container');
	pinnedCardContainer.setAttribute('draggable', false);
	pinnedCardContainer.innerHTML = mapObj.html;
	pinList.append(pinnedCardContainer);
};

const formatPinnedListMapCard = (targetOID, targetMapCard) => {
	//setting the value of the opcaity slider in the HTML of the card

	const mapObj = {
		id: targetOID,
		html: targetMapCard,
	};
	console.log(mapObj);
	pinnedCardHTMLArray.push(mapObj);
	updatePinnedListHTML(mapObj);
};

const addToPinnedArray = (oid, targetMapCard) => {
	pinnedCardIDsArray.push(`${oid}`);
	console.log(pinnedCardIDsArray);
	formatPinnedListMapCard(oid, targetMapCard);
	updatePinnedNumberHeader();
	updateHashParams();
};

const removePinnedCardFromHTML = (oid) => {
	// console.log(pinList.querySelector(`.map-list-item[oid="${oid}"]`));
	pinList
		.querySelector(`.map-list-item[oid="${oid}"]`)
		.closest('.mapCard-container')
		.remove();
};

const removePinnedTopo = (index, oid) => {
	removePinnedCardFromHTML(oid);
	pinnedCardIDsArray.splice(index, 1);
	pinnedCardHTMLArray.splice(index, 1);
	mapFootprintLayer.graphics.removeAll();
	// console.log(pinnedCardHTMLArray);
	// updatePinnedListHTML();
	updatePinnedNumberHeader();
	updateHashParams();
};

const getPinnedTopoIndex = (oid) => {
	// console.log(pinnedCardHTMLArray, oid);

	return pinnedCardHTMLArray.map((topo) => topo.id).indexOf(oid);
};

const isCurrentMapPinned = (targetMapCard, callback) => {
	const oid =
		targetMapCard.querySelector('.map-list-item').attributes.oid.value;
	console.log(oid);
	// const searchPinnedArray = pinnedCardIDsArray.indexOf(oid);
	// console.log(getPinnedTopoIndex(oid));
	//if the targetMapCard is not in the array, it has just been pinned. Add the mapCard to the pinnedArray, render the topo on the map.
	//otherwise the mapCard must already be pinned, remove it (and it's topo).
	if (getPinnedTopoIndex(oid) === -1) {
		targetMapCard.querySelector('input').attributes.value.value =
			targetMapCard.querySelector('input').value;

		const cardHTML = targetMapCard.innerHTML;
		console.log(targetMapCard);
		console.log(cardHTML);
		callback(oid, cardHTML);
		return;
	} else {
		const relatedMapCard = explorerList.querySelector(
			`.map-list-item[oid="${oid}"]`
		);

		if (oid == topoOnMapPlaceholder) {
			setTopoMapPlaceholder(oid);
		}

		console.log(targetMapCard.closest('#pinnedList'));
		if (targetMapCard.closest('#pinnedList')) {
			console.log('these are pinned');
			callback(oid);
			relatedMapCard ? closeMapCard(relatedMapCard) : null;
			removePinnedTopo(pinnedCardIDsArray.indexOf(oid), oid);
			return;
		}

		//remove the mapCard from the 'pinnedIDsArray' to reflect it's unpinning.
		removePinnedTopo(pinnedCardIDsArray.indexOf(oid), oid);

		//checking if the unpinned mapCard is the most-recently-opened mapCard.
		//if yes, the holder variable will be set to '0'.

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
	if (!viewTest) {
		return;
	}
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
	// console.log(target);
	getTopoMap(target, url).then((topoImageLayer) => {
		// console.log(viewTest);
		// console.log(topoImageLayer);
		//NOTE: maybe give this it's own function. Just to make things easier to parse
		viewTest.map.add(topoImageLayer);
	});
};

const setTopoOpacity = (oid) => {
	if (!document.querySelector(`.map-list-item[oid="${oid}"]`)) {
		//if an oid is not found in any of mapCards, set the opacity of the slider to it's default
		return 100;
	}
	findTopoLayer(oid).then((topoLayer) => {
		const opacityValue = parseInt(0 + Math.round(topoLayer.opacity * 100));

		explorerList
			.querySelector(`.map-list-item[oid="${oid}"]`)
			.querySelector('.slider-range-color').style.width = `${opacityValue}%`;
		explorerList
			.querySelector(`.map-list-item[oid="${oid}"]`)
			.querySelector('input').value = `${opacityValue}`;

		//updating the opacity value on the UI of the pinned mapCard
		if (pinList.querySelector(`.map-list-item[oid="${oid}"]`)) {
			pinList
				.querySelector(`.map-list-item[oid="${oid}"]`)
				.querySelector('.slider-range-color').style.width = `${opacityValue}%`;
			pinList
				.querySelector(`.map-list-item[oid="${oid}"]`)
				.querySelector('input').value = `${opacityValue}`;
		}
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
	// console.log('was remove halo called?');
	findHaloGraphic(oid).then((specificHalo) => {
		// console.log('the specific halo', specificHalo);
		mapHaloGraphicLayer.graphics.remove(specificHalo);
		// console.log(mapHaloGraphicLayer);
	});
};

const addHalo = (oid, geometry) => {
	// const mapCardID = mapItem.attributes.oid.value;
	// const mapCardGeometry = mapItem.attributes.geometry.value;
	// console.log(oid, geometry);
	// console.log('mapCard Data info', cardInfo);
	mapFootprint(oid, geometry).then((topoOutline) => {
		// console.log('the Halo', topoOutline);
		mapHaloGraphicLayer.graphics.add(topoOutline);
		// console.log('the view', view);
	});
};

const pinEvent = (eventTarget, mapCard, targetOID) => {
	console.log(mapCard);
	console.log(!eventTarget.closest('.pushpin'));
	console.log(!eventTarget.closest('.unpin-action-warning'));
	if (
		!eventTarget.closest('.unpin-action-warning') &&
		!eventTarget.closest('.pushpin')
	) {
		return;
	}

	console.log('pushpin');
	// const targetMapCard = eventTarget.closest('.mapCard-container');

	const mapCardInExploreModeList = explorerList.querySelector(
		`.map-list-item[oid="${targetOID}"]`
	);

	//NOTE: if the card is in 'pinned list' AND the mapCard exists in the 'explore list' set css to unpin.
	if (mapCard.closest('#pinnedList') && mapCardInExploreModeList) {
		mapCardInExploreModeList
			.querySelector('.unpinned')
			.classList.toggle('pinned');
		mapCardInExploreModeList
			.querySelector('.checkmarkBackground')
			.classList.toggle('hidden');

		// console.log(mapCard);
		// console.log(mapCardInExploreModeList);
	}
	// console.log(specificCard);

	const pinIcon = mapCard.querySelector('.unpinned');
	//NOTE: this is the old way to select/find a mapCard, but it calls the specific mapCard that was clicked on.
	// mapCard.querySelector('.unpinned');
	const pinCheckmarkIcon = mapCard.querySelector('.checkmarkBackground');

	mapPinningAction(pinIcon, pinCheckmarkIcon, mapCard);
};

const zoomToTopo = (geography) => {
	viewTest.goTo({
		target: geography,
	});
};

const zoomEvent = (eventTarget, oid) => {
	if (!eventTarget.closest('.zoom')) {
		return;
	}

	const targetGeometry =
		eventTarget.closest('.map-list-item').attributes.geometry.value;

	mapFootprint(oid, targetGeometry).then((specificTopo) => {
		console.log('the topo', specificTopo);
		zoomToTopo(specificTopo.geometry);
	});
};

const saveEvent = (eventTarget) => {
	if (!eventTarget.closest('.save')) {
		return;
	}

	console.log('this would save and export');
	const mapDetails = eventTarget.closest('.map-list-item');
	mapExportProcess(mapDetails);
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
		specificTopo.opacity = 0 + sliderValue / 100;
	});
};

const opacitySliderEvent = (event, eventTarget, targetOID) => {
	if (!eventTarget.closest('.mapCard-slider')) {
		return;
	}

	const sliderValue = event.target.value;

	handleOpacityChange(targetOID, sliderValue);
	sliderColorPosition(sliderValue, targetOID);
};

const sliderColorPosition = (value, targetOID) => {
	//NOTE: this isn't handling any opacity element. It needs to access the layer with the corresponding id.

	document
		.querySelectorAll(`.map-list-item[oid="${targetOID}"] .mapCard-slider`)
		.forEach((sliderBar) => {
			sliderBar.querySelector('.slider-range-color').style.width = `${value}%`;
			sliderBar.querySelector('.opacity-slider').value = value;
		});
};

const closeMapCard = (target) => {
	target
		.closest('.map-list-item')
		.querySelector('.action-container')
		.classList.remove('flex');

	target
		.closest('.map-list-item')
		.querySelector('.action-container')
		.classList.add('invisible');

	// target
	// 	.closest('.map-list-item')
	// 	.querySelector('.slider-range-color').style.width = `${0}%`;

	// target.closest('.map-list-item').querySelector('.opacity-slider').value = 0;
};

const isMapCardOpen = (target, targetOID) => {
	const targetTopLevel = target.closest('.map-list-item');
	const targetGeometry = targetTopLevel.attributes.geometry.value;

	if (
		target.closest('.action-container') ||
		targetTopLevel.querySelector('.pinned')
	) {
		return;
	}

	const targetInvisability = targetTopLevel
		.querySelector('.action-container')
		.classList.contains('invisible');

	if (targetInvisability) {
		checkAnyOpenMapCards(targetOID);
		addTopoToMap(targetOID, urlTest);
		addHalo(targetOID, targetGeometry);
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

const reorderPinListEvent = (event) => {
	if (!event.target.closest('.reorder')) {
		return;
	}

	reorderPinnedListHTML();
	reorderMapLayers();
};

const unpinAll = (event) => {
	if (!event.target.closest('.unpin-all')) {
		document.querySelector('.unpin-action-warning').classList.add('invisible');
		return;
	}

	console.log('unpin all');

	document.querySelector('.unpin-action-warning').classList.toggle('invisible');

	// const currentStateOfPinnedList =
	// 	pinList.querySelectorAll('.mapCard-container');

	// currentStateOfPinnedList.forEach((mapCard) => {
	// 	isCurrentMapPinned(mapCard, removeTopoFromMap);
	// });
};

document.addEventListener('click', (event) => {
	if (
		!document
			.querySelector('.unpin-action-warning')
			.classList.contains('invisible') &&
		!event.target.closest('.unpin-action-warning') &&
		!event.target.closest('.unpin')
	) {
		console.log('different');
		document.querySelector('.unpin-action-warning').classList.add('invisible');
		return;
	}
});

const exportAllPinned = (event) => {
	if (!event.target.closest('.save-all')) {
		return;
	}
	console.log('export');
};

const reorderPinnedListHTML = () => {
	const currentStateOfPinnedList =
		pinList.querySelectorAll('.mapCard-container');

	const arrayFromPinListHTML = Array.from(currentStateOfPinnedList);

	pinList.innerHTML = '';

	for (let i = arrayFromPinListHTML.length - 1; i > -1; i--) {
		console.log(arrayFromPinListHTML[i]);
		pinList.append(arrayFromPinListHTML[i]);
	}
};

const reorderMapLayers = () => {
	console.log(viewTest.map.layers);

	viewTest.map.layers.reverse();

	const footprintLayer = viewTest.map.layers.at(viewTest.map.layers.length - 1);
	const haloLayer = viewTest.map.layers.at(viewTest.map.layers.length - 2);

	viewTest.map.layers.reorder(footprintLayer, 0);
	viewTest.map.layers.reorder(haloLayer, 1);
};

sideBarElement.addEventListener('click', (event) => {
	const eventTarget = event.target;

	if (event.target.closest('.pinned-mode-options')) {
		reorderPinListEvent(event);
		unpinAll(event);
		exportAllPinned(event);
		return;
	}

	if (!eventTarget.closest('.map-list-item')) {
		return;
	}

	const targetOID = eventTarget.closest('.map-list-item').attributes.oid.value;
	const targetMapCard = eventTarget.closest('.mapCard-container');

	if (eventTarget.matches('.opacity-slider')) {
		return;
	}

	if (!eventTarget.closest('.action-container')) {
		isMapCardOpen(eventTarget, targetOID);
	}

	if (eventTarget.closest('.animate-checkbox')) {
		toggleAnimateCheckbox(eventTarget);
	}

	pinEvent(eventTarget, targetMapCard, targetOID);
	zoomEvent(eventTarget, targetOID);
	saveEvent(eventTarget);
});

const toggleAnimateCheckbox = (eventTarget) => {
	const checkmark = eventTarget.querySelector('path');
	checkmark.classList.toggle('hidden');
};

sideBarElement.addEventListener('input', (event) => {
	event.stopImmediatePropagation();
	if (
		event.target.closest('.dualSliderContainer') ||
		event.target.closest('.animation-slider-container')
	) {
		return;
	}
	const eventTarget = event.target;
	const targetOID = eventTarget.closest('.map-list-item').attributes.oid.value;

	opacitySliderEvent(event, eventTarget, targetOID);
});

sideBarElement.addEventListener(
	'mouseenter',
	(event) => {
		if (event.target.matches('.map-list-item')) {
			let mapItem = event.target;

			const mapCardID = mapItem.attributes.oid.value;
			const mapCardGeometry = mapItem.attributes.geometry.value;

			mapFootprint(mapCardID, mapCardGeometry).then((topoOutline) => {
				mapGeometry = topoOutline;
				mapFootprintLayer.graphics.add(mapGeometry);
			});
		}
	},
	true
);

sideBarElement.addEventListener(
	'mouseleave',
	(event) => {
		if (event.target.matches('.map-list-item')) {
			mapFootprintLayer.graphics.removeAll();
		}
	},
	true
);

document.querySelectorAll('.warning-btns').forEach((warningBtn) => {
	warningBtn.addEventListener('click', (event) => {
		if (!event.target.innerHTML.includes('CANCEL')) {
			// console.log('remove');
			const currentStateOfPinnedList =
				pinList.querySelectorAll('.mapCard-container');

			currentStateOfPinnedList.forEach((mapCard) => {
				console.log(mapCard);
				// isCurrentMapPinned(mapCard, removeTopoFromMap);
				const mapCardOID =
					mapCard.querySelector('.map-list-item').attributes.oid.value;
				console.log(mapCardOID);
				// console.log(event.target.closest('.unpin-action-warning'));
				pinEvent(event.target, mapCard, mapCardOID);
			});
		}

		document.querySelector('.unpin-action-warning').classList.add('invisible');
	});
});

let movingCard;
let movingCardItem;
const handleDragStart = (event) => {
	// event.preventDefault();

	if (!event.target.closest('.drag-grip')) {
		return;
	}

	console.log(event.target, 'is draggable');
	//NOTE: trying something new...here's the example https://www.codehim.com/vanilla-javascript/javascript-drag-and-drop-reorder-list/
	//still need to add the classes.

	movingCard = event.target.closest('.mapCard-container');
	movingCardItem = event.target.closest('.map-list-item');

	const movingCardData = {
		htmlElement: movingCard.innerHTML,
	};

	const dragImage = document.querySelector('.grabbedItemImage');
	dragImage.innerHTML = movingCard.innerHTML;

	console.log('container card', movingCard);

	movingCardItem.classList.add('drag-sort-active');
	movingCard.classList.add('drag-sort-background');

	// event.dataTransfer.effectAllowed = 'move';

	// event.dataTransfer.setData('text/plain', JSON.stringify(movingCardData));
	event.dataTransfer.setDragImage(dragImage, 0, 0);
};

// const handleDrop = (event) => {
// 	event.preventDefault();
// 	console.log('drop called', event);

// 	if (!pinList) {
// 		return;
// 	}
// 	// const draggedData = event.dataTransfer.getData('text/plain');
// 	// const droppedCard = JSON.parse(draggedData);

// 	// const droppedCardHTML = droppedCard.htmlElement;
// 	//NOTE: what you're doing here is very VERY wrong, this is NOT how you should amend the list
// 	// pinList.innerHTML = pinList.innerHTML + droppedCardHTML;
// 	movingCard.classList.remove('drag-sort-active');

// };

const moveWithAnimation = (moveTarget, dropTarget) => {
	const moveDirection =
		!dropTarget ||
		dropTarget.previousElementSibling === moveTarget.nextElementSibling ||
		moveTarget === dropTarget;

	const animationTarget = moveDirection
		? dropTarget
			? dropTarget.previousElementSibling
			: moveTarget.nextElementSibling
		: moveTarget.previousElementSibling;

	console.log('target', moveTarget);
	console.log('dropTarget', dropTarget);
	console.log('moveDirection', moveDirection);
	console.log('animationTarget', animationTarget);

	// animation
	//NOTE: I'm calling a function that affects the style of the card. It's not an ideal solution for it to be here. It's here currently to see if this is a viable solution and worth refactoring.
	//also using this as a resource: https://stackoverflow.com/questions/75935047/how-to-add-sliding-animation-on-elements-reordered-using-element-insertbefore
	animationTarget.style.transform = `translateY(${
		moveDirection ? '-100%' : '100%'
	})`;
	animationTarget.style.transition = 'transform 0.5s ease 0.3s';
	moveTarget.style.transform = `translateY(${
		moveDirection ? '100%' : '-100%'
	})`;
	moveTarget.style.transition = 'transform 0.5s ease 0.3s';
	//removes the applied styles and places the movingCard to
	animationTarget.ontransitionend = () => {
		animationTarget.style.transition = '';
		animationTarget.style.transform = '';

		moveTarget.parentNode.insertBefore(moveTarget, dropTarget);
		moveTarget.style.transition = '';
		moveTarget.style.transform = '';
	};
};

const handleDragging = (event) => {
	event.preventDefault();
	// event.target.classList.add('grabbing');
	// event.dataTransfer.dropEffect = 'move';

	const x = event.clientX;
	const y = event.clientY;
	// console.log(x, y);

	let dropTargetSlot =
		document.elementFromPoint(x, y).closest('.mapCard-container') === null
			? movingCard
			: document.elementFromPoint(x, y).closest('.mapCard-container');

	// console.log('first dropTargetSlot', dropTargetSlot);

	if (movingCard.parentNode === dropTargetSlot.parentNode) {
		// console.log('this firing?');
		dropTargetSlot =
			dropTargetSlot !== movingCard.nextElementSibling
				? dropTargetSlot
				: dropTargetSlot.nextElementSibling;
		movingCard.parentNode.insertBefore(movingCard, dropTargetSlot);

		//NOTE: below is the additional logic used to established the direction of animation, but it's not working.
		// movingCard.parentNode.insertBefore(movingCard, swapItem);
		// if (movingCard !== dropTargetSlot) {

		// 	moveWithAnimation(movingCard, dropTargetSlot);
		// }
	}
};

const endDrag = (event) => {
	event.preventDefault();
	console.log('ending drag?');
	movingCard.classList.remove('drag-sort-background');
	movingCardItem.classList.remove('drag-sort-active');
	const listOfPinnedIDs = pinList.querySelectorAll('.map-list-item');
	console.log(listOfPinnedIDs);
	console.log(movingCardItem.attributes.oid.value);
	console.log(getPinnedTopoIndex(movingCardItem.attributes.oid.value));

	listOfPinnedIDs.forEach((pinCard, index) => {
		console.log(pinCard.attributes.oid.value);
		if (pinCard.attributes.oid.value === movingCardItem.attributes.oid.value) {
			console.log(index);
			findTopoLayer(movingCardItem.attributes.oid.value).then((movedMap) => {
				console.log(movedMap);
				console.log(viewTest.map.layers);
				viewTest.map.layers.reorder(movedMap, index + 2);
				console.log(viewTest.map.layers);
			});
		}
	});
};

const dragEnter = (event) => {
	event.preventDefault();
	console.log('entered');
	console.log(event);
	if (event.target.classList.contains('.mapCard-container')) {
		console.log('this a mapCard');
	}
};

pinList.addEventListener('dragstart', handleDragStart), { passive: true };

// pinList.addEventListener('drop', handleDrop);
pinList.addEventListener('dragend', endDrag);
pinList.addEventListener('dragover', handleDragging), false;

const addDragEventListener = () => {
	pinList.querySelectorAll('.mapCard-container').forEach((mapCard) => {
		mapCard.addEventListener('dragenter', (event) => {
			event.preventDefault();
		});
	});
};

// document.addEventListener('click', (event) => {
// 	if (
// 		!event.target.closest(
// 			'.unpin-action-warning' || event.target.closest('.unpin')
// 		)
// 	) {
// 		console.log(event.target);
// 		console.log(event.target.closest('.unpin'));

// 		document.querySelector('.unpin-action-warning').classList.add('invisible');
// 	}
// });
export { clearMapsList, createMapSlotItems };
