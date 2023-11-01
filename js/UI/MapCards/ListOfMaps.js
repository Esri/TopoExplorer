// import { mapItemListener } from '../../support/eventListeners/MapItemListener.js?v=0.01';
import { isMobileFormat } from '../EventsAndSelectors/EventsAndSelectors.js?v=0.01';
import {
	updateHashParams,
	addHashExportPrompt,
	invertHashedMapOrder,
} from '../../support/HashParams.js?v=0.01';
import {
	mapFootprint,
	mapHalo,
} from '../../UI/MapAndFootprint/MapFootprint.js?v=0.01';
import { getTopoMap } from '../../support/ImageExportQuery.js?v=0.01';
import {
	mapExportProcess,
	setViewInfo,
} from '../ExportMaps/ExportMapsPrompt.js?v=0.01';
import { getCredentials } from '../../support/OAuth.js?v=0.01';
import { setUserToken } from '../../support/AddItemRequest.js?v=0.01';
import { config } from '../../../app-config.js?v=0.01';
import { isAnimating, endAnimation } from '../Animation/animation.js?v=0.01';

const sideBarElement = document.querySelector('#sideBar');
const mapsList = document.querySelector('#exploreList');
const mapModes = document.querySelector('.map-mode-container .action-area');
const explorerList = document.querySelector('#exploreList');
const pinList = document.querySelector('#pinnedList');

const currentStateOfPinnedList = () =>
	Array.from(pinList.querySelectorAll('.mapCard-container'));

// const mapListDetails = [];

const pinnedCardIDsArray = [];
const pinnedCardHTMLArray = [];
let listOfPinnedIDs = pinnedCardIDsArray;
let listOfPinnedCards = pinnedCardHTMLArray;

//NOTE I think this should be moved to the mapCount file. I have a number of related actions happening there. It's kind of confusing in the DOM if I don't put those things together.
const noMapsHelpText = `<div class='helpText'>
Change your map extent,
or adjust filter selections,
to find topo maps.
</div>
`;

const serviceURL = config.environment.serviceUrls.historicalTopoImageService;

let currentView;
//this is the layer is tied to the outline highlighting the map when you hover over the it's corresponding map card
let mapFootprintLayer;
//this layer is the border that envelopes the topo map while it is rendered on the map.
let mapHaloGraphicLayer;
//these three basemap variables are used to help organize the order basemap layers as topo are added/removed on the map
let basemapTerrainLayer;
let basemapSatellite;
let basemapLables;

//will eventually be assigned to the 'map-list-items' class. These are the map cards.
let mapListItems;

let mapGeometry;

//keeps track of the most-recently open topo map.
let currentlyOpenedMapId;

let arrayFromPinListHTML;
let gettingTopoID;

const createMapSlotItems = (list, view) => {
	if (!currentView) {
		currentView = view;
	}

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

	if (!basemapTerrainLayer && view) {
		basemapTerrainLayer = view.map.layers.find((layer) => {
			if (layer.title === 'World Hillshade') {
				return layer;
			}
		});
	}

	if (!basemapSatellite && view) {
		basemapSatellite = view.map.layers.find((layer) => {
			if (layer.title === 'World Imagery') {
				return layer;
			}
		});
	}

	if (!basemapLables && view) {
		basemapLables = view.map.layers.find((layer) => {
			if (layer.title === 'Outdoor Labels') {
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
			const isCardPinned =
				topoMap.previousPinnedMap || getPinnedTopoIndex(`${topoMap.OBJECTID}`);

			return ` 
        <div class='mapCard-container'>
          <div class ='map-list-item' oid='${
						topoMap.OBJECTID
					}' geometry='${JSON.stringify(topoMap.mapBoundry)}'>
            
          <div class='topRow'>
            <div class='left-margin'>

              <div class="animate checkbox hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="16" width="16">
                  <path class="checkmark" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
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
							topoMap.OBJECTID == currentlyOpenedMapId || isCardPinned !== -1
								? 'flex'
								: 'invisible'
						}'>
              <div class='action-area'>
                <div class='iconWrapper'>
                  <span class='tooltipText hidden' style='top:-60px;'>Cannot pin more than 25 topos</span>
                  <span class='tooltipText pinMap hidden' style='top:-27px;'>Pin this topo map</span>
                  <span class='tooltipText unpinMap hidden' style='top:-45px;'>Unpin this topo map</span>
                  <div class='icon pushpin ${
										isMobileFormat() ? 'invisible' : null
									}'>
                  
                    <div class="checkmarkBackground ${
											isCardPinned === true || isCardPinned !== -1
												? ''
												: 'hidden'
										}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M20,0H3.56757A3.56754,3.56754,0,0,0,0,3.56757V20"></path></svg>
                      <div class="checkmark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12"viewBox="-3 3 32 32"><path fill="#EAEEF1" d="M11.927 22l-6.882-6.883-3 3L11.927 28 31.204 8.728l-3.001-3.001z"/></svg>
                      </div>
                    </div>
                    <div class="unpinned svgContainer 
                    ${
											isCardPinned === true || isCardPinned !== -1
												? 'pinned'
												: ''
										}
                    ${
											pinnedCardIDsArray.length === 25 && isCardPinned === -1
												? 'transparency'
												: ''
										}
                    ">
                    
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 28 28"><path d="M5 0h7v1.417l-1 .581v6l1 .502v1.498H9v6l-.5 1-.5-1v-6H5V8.5l1-.502v-6L5 1.5V0z"/></svg>
                    </div>
                  </div>
                </div>
                <div class='iconWrapper zoom'>
                  <span class='tooltipText hidden' style='top:-60px;'>Zoom to the extent of this topo map</span>
                  <div class='icon' location='${topoMap.mapCenterGeographyX}, ${
				topoMap.mapCenterGeographyY
			}'>
                  <svg class="zoomToExtent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 16H2v6h6v-1H3zM16 3h5v5h1V2h-6zm5 18h-5v1h6v-6h-1zM8 2H2v6h1V3h5z"/><path fill="none" d="M0 0h24v24H0z"/>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-9 -8 36 36"><path d="M15.805 13.918l-3.067-3.068a.668.668 0 0 0-.943 0l-.124.124-1.108-1.108A5.279 5.279 0 1 0 6.5 11.8a5.251 5.251 0 0 0 3.373-1.244l1.108 1.108-.13.129a.667.667 0 0 0 0 .943l3.068 3.067a.665.665 0 0 0 .943 0l.943-.942a.666.666 0 0 0 0-.943zM6.5 10.8a4.3 4.3 0 1 1 4.3-4.3 4.304 4.304 0 0 1-4.3 4.3zm7.89 4.06l-2.596-2.595.473-.473 2.595 2.598z"/><path fill="none" d="M0 0h16v16H0z"/></svg>
                  </svg>
                  </div>
                </div>
                <div class='iconWrapper'>
                <span class='tooltipText hidden' style='top:-77px;'>Save this topo map to a new ArcGIS Online web map</span>
                  <div class='icon save'>
                    <svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 2h11v1H3v18h18V11h1v11H2zm20 6V2h-6v1h4.3l-8.41 8.403.707.707L21 3.714V8z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                  </div>
                </div>
                <div class='iconWrapper'>
                  <span class='tooltipText hidden' style='top:-60px;'>Download this topo map as a GeoTIFF</span>
                  <a class='icon download' href="${
										topoMap.downloadLink
									}" download="${topoMap.location}, ${topoMap.date}, ${
				topoMap.mapScale
			}">
                    <svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 3v12.294l2.647-2.647.707.707-3.853 3.854-3.854-3.854.707-.707L12 15.292V3zM6 21h13v-1H6z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                  </a>
                </div>
                
                <div class='mapCard-slider'>
                  <div>
                  <div class='slider-range'>
                    <div class='slider-range-background'></div>
                    <div class='slider-range-color' style= "width: ${
											topoMap.OBJECTID == currentlyOpenedMapId ||
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
		const mapCardContainingDiv = document.createElement('div');
		mapCardContainingDiv.innerHTML = mapSlot;
		const containingItem =
			mapCardContainingDiv.querySelector('.mapCard-container');

		addHalo(list[0].OBJECTID, JSON.stringify(list[0].mapBoundry));
		isCurrentMapPinned(containingItem, addToPinnedArray);
		addPreviouslyPinnedTopoToMap(list[0].OBJECTID, serviceURL);
		return;
	}

	mapsList.innerHTML = mapsList.innerHTML + mapSlot;

	mapListItems = document.querySelectorAll('.map-list-item');
}; //end of the mapCard Generator

//We can move this inside the creatator module (just remember how to access different functions withing a function...obj notation)
const clearMapsList = () => {
	mapsList.innerHTML = '';
};

//toggling between the map modes.
const toggleListVisibility = () => {
	if (isAnimating) {
		return;
	}
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
	if (isMobileFormat()) {
		return;
	}
	const toplevel = event.target.closest('.mode');

	if (toplevel.querySelector('.btn-text').classList.contains('underline')) {
		return;
	}

	if (pinnedCardIDsArray.length === 0) {
		return;
	}

	toggleListVisibility();
});

const setTopoMapPlaceholder = (oid) => {
	//if mobile is active, do not keep track of the most recently opened topo

	if (isMobileFormat()) {
		return;
	}

	if (
		currentlyOpenedMapId !== parseInt(oid) &&
		pinnedCardIDsArray.indexOf(`${currentlyOpenedMapId}`) === -1
	) {
		removeTopoFromMap(currentlyOpenedMapId);
	}

	//if the topo on map and the oid are the same it means the user is closing the most recently opened card. Remove all aspects of the topo fromthe map and it's placeholder is no longer important.
	if (currentlyOpenedMapId == parseInt(oid)) {
		currentlyOpenedMapId = 0;
		gettingTopoID = 0;
		return;
	}

	currentlyOpenedMapId = parseInt(oid);
};

const checkAnyOpenMapCards = (oid) => {
	mapListItems.forEach((mapCard) => {
		if (mapCard.attributes.oid.value == oid || currentlyOpenedMapId == oid) {
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
	const pinnedCardContainer = document.createElement('div');
	pinnedCardContainer.classList.add('mapCard-container');
	pinnedCardContainer.setAttribute('draggable', false);
	pinnedCardContainer.innerHTML = mapObj.html;
	pinList.prepend(pinnedCardContainer);
};

const formatPinnedListMapCard = (targetOID, targetMapCard) => {
	//setting the value of the opcaity slider in the HTML of the card

	const mapObj = {
		id: targetOID,
		html: targetMapCard,
	};

	pinnedCardHTMLArray.unshift(mapObj);
	updatePinnedListHTML(mapObj);
};

const addToPinnedArray = (oid, targetMapCard) => {
	pinnedCardIDsArray.push(`${oid}`);

	formatPinnedListMapCard(oid, targetMapCard);
	updatePinnedNumberHeader();
	updateHashParams(pinnedCardIDsArray);
	updatePinHeaderButtonStyle();
	if (pinnedCardIDsArray.length === 25) {
		pinBtnUnavailable();
	}
};

const removePinnedCardFromHTML = (oid) => {
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

	updatePinnedNumberHeader();
	updateHashParams(pinnedCardIDsArray);
	updatePinHeaderButtonStyle();
	if (pinnedCardIDsArray.length < 25) {
		pinBtnAvailable();
	}
};

const getPinnedTopoIndex = (oid) => {
	return pinnedCardIDsArray.map((topoID) => topoID).indexOf(oid);
};

const isCurrentMapPinned = (targetMapCard, callback) => {
	const oid =
		targetMapCard.querySelector('.map-list-item').attributes.oid.value;

	if (getPinnedTopoIndex(oid) === -1) {
		const opacityValueForNewPin = targetMapCard.querySelector('input').value;
		targetMapCard.querySelector('input').attributes.value.value =
			opacityValueForNewPin;
		targetMapCard.querySelector(
			'.slider-range-color'
		).style.width = `${opacityValueForNewPin}%`;

		const cardHTML = targetMapCard.innerHTML;

		callback(oid, cardHTML);
		return;
	} else {
		const relatedMapCard = explorerList.querySelector(
			`.map-list-item[oid="${oid}"]`
		);

		if (oid == currentlyOpenedMapId) {
			setTopoMapPlaceholder(oid);
		}

		if (targetMapCard.closest('#pinnedList')) {
			callback(oid);
			relatedMapCard ? closeMapCard(relatedMapCard) : null;
			removePinnedTopo(pinnedCardIDsArray.indexOf(oid), oid);
			return;
		}

		//remove the mapCard from the 'pinnedIDsArray' to reflect it's unpinning.
		removePinnedTopo(pinnedCardIDsArray.indexOf(oid), oid);

		//checking to see if there are any other topos pinned and if an unpinned map has been opened.If yes, stop the process.
		if (
			pinnedCardIDsArray.length == 0 &&
			(currentlyOpenedMapId == oid || currentlyOpenedMapId == 0)
		) {
			return;
		}

		callback(oid);
		closeMapCard(relatedMapCard);
	}
};

const mapPinningAction = (pinIcon, pinCheckmarkIcon, targetMapCard) => {
	pinIcon.classList.toggle('pinned');
	pinCheckmarkIcon.classList.toggle('hidden');

	if (pinIcon.classList.contains('pinned')) {
		isCurrentMapPinned(targetMapCard, addToPinnedArray);
	} else {
		isCurrentMapPinned(targetMapCard, removeTopoFromMap);
	}
};

const findTopoLayer = (oid) => {
	if (!currentView) {
		return;
	}
	const addedLayers = currentView.map.layers.items;

	return new Promise((resolve, reject) => {
		addedLayers.find((imageTopo) => {
			if (imageTopo.id == oid) {
				resolve(imageTopo);
			}
		});
	});
};

const addTopoToMap = (target, url) => {
	gettingTopoID = target;
	getTopoMap(target, url).then((topoImageLayer) => {
		if (gettingTopoID !== topoImageLayer.id) {
			topoImageLayer.cancelLoad();
			removeHalo(topoImageLayer.id);
			return;
		}

		currentView.map.add(topoImageLayer);

		currentView.map.layers.reorder(
			mapFootprintLayer,
			currentView.map.layers.length - 1
		);
		currentView.map.layers.reorder(
			basemapTerrainLayer,
			currentView.map.layers.length - 1
		);
	});
};

const addPreviouslyPinnedTopoToMap = (target, serviceURL) => {
	getTopoMap(target, serviceURL).then((topoImageLayer) => {
		currentView.map.add(topoImageLayer);

		currentView.map.layers.reorder(
			mapFootprintLayer,
			currentView.map.layers.length - 1
		);
		currentView.map.layers.reorder(
			basemapTerrainLayer,
			currentView.map.layers.length - 1
		);

		return;
	});
};

const setTopoOpacity = (oid) => {
	//sets the slider opacity position of generated map cards using the topo layer's opacity value

	findTopoLayer(oid).then((topoLayer) => {
		const opacityValue = parseInt(0 + Math.round(topoLayer.opacity * 100));

		//updating the opacity value on the UI of the mapCard in the explore list
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
	findTopoLayer(oid)
		.then((specificTopo) => {
			currentView.map.remove(specificTopo);
		})
		.then(() => {
			removeHalo(oid);
		});
};

const findHaloGraphic = (oid) => {
	const haloGraphicsList = mapHaloGraphicLayer.graphics.items;
	return new Promise((resolve, reject) => {
		haloGraphicsList.find((mapHaloGraphic) => {
			if (mapHaloGraphic.attributes.id == oid) {
				resolve(mapHaloGraphic);
			}
		});
	});
};

const removeHalo = (oid) => {
	findHaloGraphic(oid).then((specificHalo) => {
		mapHaloGraphicLayer.graphics.remove(specificHalo);
	});
};

const addHalo = (oid, geometry) => {
	mapHalo(oid, geometry).then((topoOutline) => {
		mapHaloGraphicLayer.graphics.add(topoOutline);
	});
};

const pinEvent = (eventTarget, mapCard, targetOID) => {
	if (
		(!eventTarget.closest('.unpin-action-warning') &&
			!eventTarget.closest('.pushpin')) ||
		(pinnedCardIDsArray.length === 25 && !mapCard.querySelector('.pinned'))
	) {
		return;
	}

	//set the tooltip for the pushpin to hidden again
	if (eventTarget.closest('.iconWrapper')) {
		eventTarget
			.closest('.iconWrapper')
			.querySelector('.tooltipText.pinMap')
			.classList.remove('visible');
	}

	const mapCardInExploreModeList = explorerList.querySelector(
		`.map-list-item[oid="${targetOID}"]`
	);

	//if the card is in 'pinned list' AND the mapCard exists in the 'explore list' set the icon to the unpinned status.
	if (mapCard.closest('#pinnedList') && mapCardInExploreModeList) {
		mapCardInExploreModeList
			.querySelector('.unpinned')
			.classList.toggle('pinned');
		mapCardInExploreModeList
			.querySelector('.checkmarkBackground')
			.classList.toggle('hidden');
	}

	const pinIcon = mapCard.querySelector('.unpinned');
	const pinCheckmarkIcon = mapCard.querySelector('.checkmarkBackground');

	mapPinningAction(pinIcon, pinCheckmarkIcon, mapCard);
};

const zoomToTopo = (geography) => {
	currentView.goTo({
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
		zoomToTopo(specificTopo.geometry);
	});
};

const saveEvent = (eventTarget) => {
	if (!eventTarget.closest('.save')) {
		return;
	}
	const mapContainer = eventTarget.closest('.mapCard-container');
	const mapDetails = Array.from(
		mapContainer.querySelectorAll('.map-list-item')
	);

	addHashExportPrompt(mapDetails);
	getCredentials().then((credentials) => {
		setUserToken(credentials);
	});
	setViewInfo(currentView);
	mapExportProcess(mapDetails);
};

const openMapCard = (target) => {
	if (isMobileFormat()) {
		return;
	}

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
	findTopoLayer(targetOID).then((specificTopo) => {
		specificTopo.opacity = 0 + sliderValue / 100;
	});
};

const opacitySliderEvent = (eventTarget, targetOID) => {
	if (!eventTarget.closest('.mapCard-slider')) {
		return;
	}

	const sliderValue = eventTarget.value;

	handleOpacityChange(targetOID, sliderValue);
	sliderColorPosition(sliderValue, targetOID);
};

const sliderColorPosition = (value, targetOID) => {
	document
		.querySelectorAll(`.map-list-item[oid="${targetOID}"] .mapCard-slider`)
		.forEach((sliderBar) => {
			sliderBar.querySelector('.slider-range-color').style.width = `${value}%`;
			sliderBar.querySelector('.opacity-slider').value = value;
		});
};

const closeMapCard = (target) => {
	if (isMobileFormat()) {
		return;
	}
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
	if (isMobileFormat()) {
		removeTopoFromMap(targetOID);
	}
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
		addTopoToMap(targetOID, serviceURL);
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

	document.querySelector('.unpin-action-warning').classList.toggle('invisible');
};

document.addEventListener('click', (event) => {
	if (
		!document
			.querySelector('.unpin-action-warning')
			.classList.contains('invisible') &&
		!event.target.closest('.unpin-action-warning') &&
		!event.target.closest('.unpin')
	) {
		document.querySelector('.unpin-action-warning').classList.add('invisible');
		return;
	}
});

const exportAllPinned = (event) => {
	if (!event.target.closest('.save-all')) {
		return;
	}

	const mapDetails = Array.from(pinList.querySelectorAll('.map-list-item'));
	addHashExportPrompt(mapDetails);
	getCredentials().then((credentials) => {
		setUserToken(credentials);
	});
	setViewInfo(currentView);
	mapExportProcess(mapDetails);
};

const reorderPinnedListHTML = () => {
	arrayFromPinListHTML = currentStateOfPinnedList();

	pinList.innerHTML = '';

	for (let i = arrayFromPinListHTML.length - 1; i > -1; i--) {
		pinList.append(arrayFromPinListHTML[i]);
	}
};

const reorderMapLayers = () => {
	currentView.map.layers.reverse();

	currentView.map.layers.reorder(
		mapFootprintLayer,
		currentView.map.layers.length - 1
	);

	currentView.map.layers.reorder(
		basemapTerrainLayer,
		currentView.map.layers.length - 1
	);

	currentView.map.layers.reorder(basemapSatellite, 0);

	currentView.map.layers.reorder(basemapLables, 1);

	currentView.map.layers.reorder(mapHaloGraphicLayer, 2);

	invertHashedMapOrder();
};

//Icon events for mapcard
sideBarElement.addEventListener('click', (event) => {
	const eventTarget = event.target;

	if (eventTarget.closest('.animate.checkbox')) {
		toggleAnimateCheckbox(eventTarget);
	}

	if (isAnimating) {
		event.stopPropagation();
		event.preventDefault();
		return;
	}

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

	opacitySliderEvent(eventTarget, targetOID);
});

sideBarElement.addEventListener('mousedown', (event) => {
	if (!event.target.closest('.opacity-slider')) {
		return;
	}
	mapFootprintLayer.visible = false;
});

sideBarElement.addEventListener('mouseup', (event) => {
	if (!event.target.closest('.opacity-slider')) {
		return;
	}
	mapFootprintLayer.visible = true;
});

sideBarElement.addEventListener(
	'mouseenter',
	(event) => {
		if (isMobileFormat()) {
			return;
		}
		if (isAnimating) {
			return;
		}

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

const updatePinHeaderButtonStyle = () => {
	if (pinnedCardIDsArray.length === 0) {
		document.querySelector('.pin-mode-btn').classList.add('transparency');
		if (
			mapModes.querySelector('.pinned-mode').classList.contains('underline')
		) {
			toggleListVisibility();
		}
	}

	if (pinnedCardIDsArray.length === 1) {
		document.querySelector('.pin-mode-btn').classList.remove('transparency');
	}
};

const pinBtnUnavailable = () => {
	const unpinnedIcons = explorerList.querySelectorAll(
		'.pushpin .unpinned.svgContainer'
	);
	unpinnedIcons.forEach((pinIcon) => {
		if (
			pinIcon.classList.contains('transparency') ||
			pinIcon.classList.contains('pinned')
		) {
			return;
		}
		pinIcon.classList.add('transparency');
	});
};

const pinBtnAvailable = () => {
	const unpinnedIcons = explorerList.querySelectorAll(
		'.pushpin .unpinned.svgContainer.transparency'
	);

	unpinnedIcons.forEach((pinIcon) => {
		pinIcon.classList.remove('transparency');
	});
};

document.querySelectorAll('.warning-btns').forEach((warningBtn) => {
	warningBtn.addEventListener('click', (event) => {
		if (!event.target.innerHTML.includes('CANCEL')) {
			updatePinHeaderButtonStyle();
			const arrayFromPinList = currentStateOfPinnedList();

			arrayFromPinList.forEach((mapCard) => {
				const mapCardOID =
					mapCard.querySelector('.map-list-item').attributes.oid.value;
				pinEvent(event.target, mapCard, mapCardOID);
			});
		}

		document.querySelector('.unpin-action-warning').classList.add('invisible');
	});
});

let movingCard;
let movingCardItem;
const handleDragStart = (event) => {
	if (!event.target.closest('.drag-grip')) {
		return;
	}

	if (isAnimating) {
		endAnimation();
	}
	movingCard = event.target.closest('.mapCard-container');
	movingCardItem = event.target.closest('.map-list-item');

	const dragImage = document.querySelector('.grabbedItemImage');
	dragImage.innerHTML = movingCard.innerHTML;

	movingCardItem.classList.add('drag-sort-active');
	movingCard.classList.add('drag-sort-background');

	event.dataTransfer.setDragImage(dragImage, 0, 0);
};

const handleDragging = (event) => {
	event.preventDefault();

	const x = event.clientX;
	const y = event.clientY;

	let dropTargetSlot =
		document.elementFromPoint(x, y).closest('.mapCard-container') === null
			? movingCard
			: document.elementFromPoint(x, y).closest('.mapCard-container');

	if (movingCard.parentNode === dropTargetSlot.parentNode) {
		dropTargetSlot =
			dropTargetSlot !== movingCard.nextElementSibling
				? dropTargetSlot
				: dropTargetSlot.nextElementSibling;
		movingCard.parentNode.insertBefore(movingCard, dropTargetSlot);
	}
};

const endDrag = (event) => {
	event.preventDefault();
	movingCard.classList.remove('drag-sort-background');
	movingCardItem.classList.remove('drag-sort-active');
	listOfPinnedCards = Array.prototype.slice
		.call(pinList.querySelectorAll('.map-list-item'))
		.reverse();

	listOfPinnedIDs = listOfPinnedCards.map((mapHTML) => {
		return mapHTML.attributes.oid.value;
	});

	listOfPinnedIDs.forEach((pinCard, index) => {
		if (pinCard === movingCardItem.attributes.oid.value) {
			findTopoLayer(movingCardItem.attributes.oid.value).then((movedMap) => {
				currentView.map.layers.reorder(movedMap, index + 3);

				currentView.map.layers.reorder(
					mapFootprintLayer,
					currentView.map.layers.length - 1
				);

				currentView.map.layers.reorder(
					basemapTerrainLayer,
					currentView.map.layers.length - 1
				);
			});
		}
	});
	updateHashParams(listOfPinnedIDs);
};

pinList.addEventListener('dragstart', handleDragStart), { passive: true };

pinList.addEventListener('dragend', endDrag);
pinList.addEventListener('dragover', handleDragging), false;

const addDragEventListener = () => {
	pinList.querySelectorAll('.mapCard-container').forEach((mapCard) => {
		mapCard.addEventListener('dragenter', (event) => {
			event.preventDefault();
		});
	});
};

export {
	clearMapsList,
	createMapSlotItems,
	opacitySliderEvent,
	zoomEvent,
	findTopoLayer,
	currentStateOfPinnedList,
	mapHaloGraphicLayer,
};
