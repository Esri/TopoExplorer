import { isMobileFormat } from '../EventsAndSelectors/EventsAndSelectors.js?v=0.01';
import {
	updateHashParams,
	addHashExportPrompt,
	invertHashedMapOrder,
	// animatingStatus,
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
import { updateMapCount } from '../../support/MapCount.js?v=0.01';
import { isAnimating, endAnimation } from '../Animation/animation.js?v=0.01';
import { toggleMapCardDownloadAvailability } from '../Animation/AnimatingLayers.js?v=0.01';
import { initSortChoice } from '../Sort/Sort.js?v=0.01';

const sideBarElement = document.querySelector('#sideBar');
const mapsList = document.querySelector('#exploreList');
const mapModes = document.querySelector('.map-mode-container .action-area');
const explorerList = document.querySelector('#exploreList');
const pinList = document.querySelector('#pinnedList');
const topoMapDataArray = [];
// const mapListDetails = [];
const currentStateOfPinnedList = () =>
	Array.from(pinList.querySelectorAll('.mapCard-container'));
const topoGeometriesArray = [];
const pinnedTopoGeometriesArray = [];

const pinnedCardIDsArray = [];
const pinnedCardHTMLArray = [];
let filterValues = {};
let listOfPinnedIDs = pinnedCardIDsArray;
let listOfPinnedCards = pinnedCardHTMLArray;
let sortOption;

//NOTE I think this should be moved to the mapCount file. I have a number of related actions happening there. It's kind of confusing in the DOM if I don't put those things together.
const noMapsHelpText = `<div class='helpText'>
Change your map extent,
or adjust filter selections,
to find topo maps.
</div>
`;

const serviceURL = config.environment.serviceUrls.historicalTopoImageService;
const unavailableInfo = 'Unavailable';

let currentView;
//This layer contains the crosshair/mapPoint indicator that highlights the user's selection.
let numberOfPreviousTopos;
let crosshairLayer;
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
let currentlySelectedMapId;
let currentlySelectedMapCardHTML;
let currentlySelectedMapGeometry;

let arrayFromPinListHTML;
let gettingTopoID;

const setTopoGeometriesArray = (list) => {
	topoGeometriesArray.length = 0;
	list.map((topoMap) => {
		const topoMapGeometry = [topoMap.OBJECTID, topoMap.mapBoundry];

		topoGeometriesArray.push(topoMapGeometry);
	});
};

const addToPinnedTopoGeometriesArray = (oid, topoMapGeometry) => {
	const pinnedTopoGeometry = [oid, topoMapGeometry];
	pinnedTopoGeometriesArray.push(pinnedTopoGeometry);
};

const setMapDataArray = (list) => {
	topoMapDataArray.length = 0;
	list.map((topoData) => topoMapDataArray.push(topoData));
};

const setNumberOfPreviousTopos = (number) => {
	numberOfPreviousTopos = number;
};

//This older function needs to be refactored. The reason for it being here is no longer applicable.
const createMapSlotItems = (list, view) => {
	setMapDataArray(list);
	setTopoGeometriesArray(list);

	if (!currentView) {
		currentView = view;
	}

	if (!crosshairLayer && view) {
		crosshairLayer = view.map.layers.find((layer) => {
			if (layer.title === 'crosshair') {
				return layer;
			}
		});
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
		updateMapCount(list.length);
		mapsList.innerHTML = noMapsHelpText;
		return;
	}

	const areOtherMapCardsPresent = () => {
		if (explorerList.querySelectorAll('.map-list-item')[0]) {
			return true;
		} else {
			return false;
		}
	};

	if (list[0].previousPinnedMap) {
		makeCards(list);
		return;
	}
	filterMaps();
}; //end of the mapCard Generator

const makeCards = (list) => {
	if (list.length === 0) {
		updateMapCount(list.length);
		mapsList.innerHTML = noMapsHelpText;
		return;
	}

	const mapSlot = list
		.map((topoMap, index) => {
			const isCardPinned =
				topoMap.previousPinnedMap || getPinnedTopoIndex(`${topoMap.OBJECTID}`);

			return `
        <div class='mapCard-container'>
          <div class ='map-list-item' oid='${topoMap.OBJECTID}'>

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
                <div style="display:flex">
                    
                    <p class="mapSlotHeader"> <span class="year">${
											topoMap.date
										}</span> | <span class="revisionYear">${
				topoMap.topo.attributes.Imprint_Year
			} </span> rev | <span class="name">${topoMap.mapName}</span>
                    </p>
                  </div>
                <div style="display:flex">
                <div class='infoIcon ${isMobileFormat() ? 'invisible' : ''}' >
                <div>
                <svg class='svg' xmlns="http://www.w3.org/2000/svg" viewBox="1 -5 21 21" height="16" width="16"><path d="M8.5 6.5a1 1 0 1 1 1-1 1.002 1.002 0 0 1-1 1zM8 13h1V8H8zm2-1H7v1h3zm5.8-3.5a7.3 7.3 0 1 1-7.3-7.3 7.3 7.3 0 0 1 7.3 7.3zm-1 0a6.3 6.3 0 1 0-6.3 6.3 6.307 6.307 0 0 0 6.3-6.3z"></path></svg>
                </div>  
                <div style='padding: 5px 20px; margin: 0 30px' class='tooltipText hidden'>
                  <div class='mapMetaData'>
                  <p>Date on Map: ${topoMap.date || unavailableInfo}</p>
                  <p>Revision Year: ${
										topoMap.topo.attributes.Imprint_Year || unavailableInfo
									}</p>
                  <p>Survey Year: ${
										topoMap.topo.attributes.Survey_Year || unavailableInfo
									}</p>
                  <p>Photo Year: ${
										topoMap.topo.attributes.Aerial_Photo_Year || unavailableInfo
									}</p>
                  <p>Photo Revision Year: ${
										topoMap.topo.attributes.Photo_Revision || unavailableInfo
									}</p>
                  <p>Field Check Year: ${
										topoMap.topo.attributes.Field_Check_Year || unavailableInfo
									}</p>
                  <p>Projection: ${
										topoMap.topo.attributes.Projection || unavailableInfo
									}</p>
                  <p>Datum: ${
										topoMap.topo.attributes.Datum || unavailableInfo
									}</p>
                  <p>Citation: ${
										topoMap.topo.attributes.Citation || unavailableInfo
									}</p>
                  </div>
                  <p><em>Click <span><svg class='svg' xmlns="http://www.w3.org/2000/svg" viewBox="1 -5 21 21" height="16" width="16"><path style="fill:#ffffff; stroke:#ffffff;" d="M8.5 6.5a1 1 0 1 1 1-1 1.002 1.002 0 0 1-1 1zM8 13h1V8H8zm2-1H7v1h3zm5.8-3.5a7.3 7.3 0 1 1-7.3-7.3 7.3 7.3 0 0 1 7.3 7.3zm-1 0a6.3 6.3 0 1 0-6.3 6.3 6.307 6.307 0 0 0 6.3-6.3z"></path></svg></span>to copy to clipboard</em></p>
                </div>
                
              </div>
                <p class ="mapSlotSub-title"> <span class="scale">${
									topoMap.mapScale
								}</span> | <span class="location">${topoMap.location}</span>
			</p>
      </div>  
              </div>

              <div class="img-cover">
                <div class="frame">
                </div>
                <img src=${topoMap.thumbnail}>
              </div>

            </div>

              </div>

            <div class='action-container ${
							topoMap.OBJECTID == currentlySelectedMapId || isCardPinned !== -1
								? 'flex'
								: 'invisible'
						}'>
              <div class='action-area'>
                <div class='iconWrapper'>
                  <span class='tooltipText hidden' style='top:-60px;'>Cannot pin more than 25 topos</span>
                  <span class='tooltipText pinMap hidden' style='top:-80px;'>Add this to the "Pinned Topo Maps" tab at the top of this list</span>
                  <span class='tooltipText unpinMap hidden' style='top:-45px;'>Unpin this topo map</span>
                  <div class='icon pushpin ${
										isMobileFormat() ? 'invisible' : ''
									}'>

                    <div class="checkmarkBackground ${
											isCardPinned === true || isCardPinned !== -1
												? ''
												: 'hidden'
										}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M20,0H3.56757A3.56754,3.56754,0,0,0,0,3.56757V20"></path></svg>
                      <div class="checkmark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12"viewBox="-3 3 32 32"><path fill="#637287" d="M11.927 22l-6.882-6.883-3 3L11.927 28 31.204 8.728l-3.001-3.001z"/></svg>
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
                <span class='tooltipText hidden' style='top:-60px; left: 60px'>Adjust the transparency of this topo map.</span>
                  <div>
                  <div class='slider-range'>
                    <div class='slider-range-background'></div>
                    <div class='slider-range-color' style= "width: ${
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
		isCurrentMapPinned(
			containingItem,
			JSON.stringify(list[0].mapBoundry),
			addToPinnedArray
		);
		addPreviouslyPinnedTopoToMap(list[0].OBJECTID, serviceURL);

		return;
	}

	updateMapCount(list.length);
	mapsList.innerHTML = mapSlot;

	mapListItems = document.querySelectorAll('.map-list-item');
};

//We can move this inside the creator module (just remember how to access different functions withing a function...obj notation)
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
	document.querySelector('.explorer-mode-btn').classList.toggle('selected');

	pinList.classList.toggle('invisible');
	document.querySelector('.pinned-mode-options').classList.toggle('flex');
	document.querySelector('.pinned-mode-options').classList.toggle('invisible');
	mapModes.querySelector('.pinned-mode').classList.toggle('underline');
	document.querySelector('.pin-mode-btn').classList.toggle('selected');

	if (mapModes.querySelector('.pinned-mode').classList.contains('underline')) {
		addDragEventListener();

		checkPinStatusOfSelectedMap();
	}

	if (
		mapModes.querySelector('.explorer-mode').classList.contains('underline')
	) {
		if (
			getPinnedTopoIndex(`${currentlySelectedMapId}`) === -1 &&
			currentlySelectedMapId
		) {
			addTopoToMap(currentlySelectedMapId, serviceURL);
			const openTopoCard = document.querySelector(
				`.map-list-item[oid="${currentlySelectedMapId}"]`
			);
			const openTopoCardGeometry = JSON.stringify(currentlySelectedMapGeometry);
			console.log(
				'the geometry for the returning selected map',
				openTopoCardGeometry
			);
			addHalo(currentlySelectedMapId, openTopoCardGeometry);
		}
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

const setTopoMapPlaceholder = (oid, isMapCardOpen) => {
	//if mobile is active, do not keep track of the most recently opened topo
	if (isMobileFormat()) {
		// return;

		currentlySelectedMapId = oid;
		return;
	}

	if (
		currentlySelectedMapId !== parseInt(oid) &&
		pinnedCardIDsArray.indexOf(`${currentlySelectedMapId}`) === -1 &&
		currentlySelectedMapId !== 0 &&
		currentlySelectedMapId !== undefined
	) {
		removeTopoFromMap(currentlySelectedMapId);
	}

	//if the topo on map and the oid are the same it means the user is closing the most recently opened card. Remove all aspects of the topo from the map and it's placeholder is no longer important.
	if (currentlySelectedMapId == oid) {
		currentlySelectedMapId = 0;
		gettingTopoID = 0;
		currentlySelectedMapCardHTML = null;
		currentlySelectedMapGeometry = null;
		return;
	}

	if (!isMapCardOpen) {
		currentlySelectedMapId = parseInt(oid);
		currentlySelectedMapGeometry = mapGeometry;
	}
};

const isTargetPolygonWithinExtent = (currentlySelectedMapGeometry) => {
	//determines wether a specific polygon is within the visible extent of the mapView.
	//This function deconstructs the rings of a polygon to create a simple extent object containing the xMax,Ymax,xMin,yMin of the polygon.
	// it then evaluates whether any of those points are withing the extent.
	return new Promise((resolve, reject) => {
		const currentlySelectedMapGeometryObj = currentlySelectedMapGeometry
			? JSON.parse(currentlySelectedMapGeometry)
			: null;

		if (!currentlySelectedMapGeometryObj) {
			return;
		}

		//normalize the extent. This returns an array of the extent, usually the array will contain only one extent.
		//If the International Date Line is present in the view, the array will have two extents: one for each side of the date line.
		//It has the additional use of resetting the extent coordinates if the user spins around the world.
		const extent = currentView.extent.clone().normalize();

		const topoExtent = {
			xmax: null,
			ymax: null,
			xmin: null,
			ymin: null,
		};

		currentlySelectedMapGeometryObj.rings[0].map((coordinates, index) => {
			if (index === 0) {
				(topoExtent.xmax = coordinates[0]),
					(topoExtent.ymax = coordinates[1]),
					(topoExtent.xmin = coordinates[0]),
					(topoExtent.ymin = coordinates[1]);
			}

			if (coordinates[0] > topoExtent.xmax) {
				topoExtent.xmax = coordinates[0];
			}
			if (coordinates[1] > topoExtent.ymax) {
				topoExtent.ymax = coordinates[1];
			}
			if (coordinates[0] < topoExtent.xmin) {
				topoExtent.xmin = coordinates[0];
			}
			if (coordinates[1] < topoExtent.ymin) {
				topoExtent.ymin = coordinates[1];
			}
		});

		if (extent.length > 1) {
			if (
				topoExtent.ymax > extent[0].ymin &&
				topoExtent.ymin < extent[0].ymax &&
				topoExtent.xmax > extent[0].xmin &&
				topoExtent.xmin < extent[0].xmax
			) {
				resolve(extent[0]);
				return;
			}

			if (
				topoExtent.ymax > extent[1].ymin &&
				topoExtent.ymin < extent[1].ymax &&
				topoExtent.xmax > extent[1].xmin &&
				topoExtent.xmin < extent[1].xmax
			) {
				resolve(extent[1]);
				return;
			}

			resolve(false);
			return;
		}

		if (
			topoExtent.ymax > extent[0].ymin &&
			topoExtent.ymin < extent[0].ymax &&
			topoExtent.xmax > extent[0].xmin &&
			topoExtent.xmin < extent[0].xmax
		) {
			resolve(extent[0]);
			return;
		}

		resolve(false);
		return;
	});
};

const checkAnyOpenMapCards = (oid) => {
	if (isMobileFormat()) {
		// return;
	}
	mapListItems.forEach((mapCard) => {
		if (mapCard.attributes.oid.value == oid || currentlySelectedMapId == oid) {
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

const addToPinnedArray = (oid, targetMapCard, topoMapGeometry) => {
	pinnedCardIDsArray.push(`${oid}`);
	addToPinnedTopoGeometriesArray(oid, topoMapGeometry);
	formatPinnedListMapCard(oid, targetMapCard);
	updatePinnedNumberHeader();
	updateHashParams(pinnedCardIDsArray);
	updatePinHeaderButtonStyle();
	if (pinnedCardIDsArray.length === 25) {
		pinBtnUnavailable();
	}

	return;
};

const removePinnedCardFromHTML = (oid) => {
	pinList
		.querySelector(`.map-list-item[oid="${oid}"]`)
		.closest('.mapCard-container')
		.remove();
};

const removePinnedTopo = (index, oid) => {
	removePinnedCardFromHTML(oid);
	removeFromPinnedGeometriesArray(oid);
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

const checkPinStatusOfSelectedMap = () => {
	if (!currentlySelectedMapId) {
		return;
	}
	if (pinnedCardIDsArray.indexOf(`${currentlySelectedMapId}`) === -1) {
		return removeTopoFromMap(currentlySelectedMapId);
		// closeSelectedMap(currentlySelectedMapId);
	}
};

//looks to see if the mapCard provided has already been pinned,
//the callback provided will either remove the mapCard from the pinned list, or create a copy of the mapCard, and add it to the list.
const isCurrentMapPinned = (targetMapCard, topoMapGeometry, callback) => {
	//will use this original ID to check if it already exists in an array that tracks the currently pinned topo maps
	const oid =
		targetMapCard.querySelector('.map-list-item').attributes.oid.value;

	if (getPinnedTopoIndex(oid) === -1) {
		//if this card (it's ID specifically) is not in the array of pinned topos,
		//document the position (value) of card's opacity slider.
		//this value will be used while creating the copy of the card for the pinned list
		const opacityValueForNewPin = targetMapCard.querySelector('input').value;
		targetMapCard.querySelector('input').attributes.value.value =
			opacityValueForNewPin;
		targetMapCard.querySelector(
			'.slider-range-color'
		).style.width = `${opacityValueForNewPin}%`;

		const cardHTML = targetMapCard.innerHTML;

		//take the ID, and the Card's HTML, and the associated topo map's geometry and add it to the pinned list.
		callback(oid, cardHTML, topoMapGeometry);
		//updating the most-recently selected card HTML
		// currentlySelectedMapCardHTML = cardHTML;
		return;
	} else {
		const relatedMapCard = explorerList.querySelector(`.map-list-item`)
			? explorerList.querySelector(`.map-list-item[oid="${oid}"]`)
			: null;

		if (oid == currentlySelectedMapId && pinnedCardIDsArray.length >= 1) {
			console.log('resetting placeholder');
			setTopoMapPlaceholder(oid, true);
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
		if (pinnedCardIDsArray.length == 0 && currentlySelectedMapId == 0) {
			setTopoMapPlaceholder(oid);
			return;
		}

		callback(oid);
		closeMapCard(relatedMapCard);
	}
};

const mapPinningAction = (pinIcon, pinCheckmarkIcon, targetMapCard) => {
	pinIcon.classList.toggle('pinned');
	pinCheckmarkIcon.classList.toggle('hidden');
	const objectId =
		targetMapCard.querySelector('.map-list-item').attributes.oid.value;

	if (!pinIcon.classList.contains('pinned')) {
		getPinnedTopoGeometry(objectId).then((topoMapGeometry) => {
			isCurrentMapPinned(targetMapCard, topoMapGeometry, removeTopoFromMap);
		});
	}

	getTopoGeometry(objectId).then((topoMapGeometry) => {
		if (pinIcon.classList.contains('pinned')) {
			isCurrentMapPinned(targetMapCard, topoMapGeometry, addToPinnedArray);
		}
	});
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
	gettingTopoID = parseInt(target);

	getTopoMap(target, url).then((topoImageLayer) => {
		if (gettingTopoID != topoImageLayer.id) {
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
		currentView.map.layers.reorder(
			crosshairLayer,
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
		currentView.map.layers.reorder(
			crosshairLayer,
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
	console.log('removing');
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
	console.log(oid, geometry);
	if (!oid) {
		return;
	}
	mapHalo(oid, geometry).then((topoOutline) => {
		console.log('the outline', topoOutline);
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

	if (!eventTarget.closest('#pinnedList')) {
		getTopoGeometry(oid).then((topoGeometryData) => {
			mapFootprint(oid, topoGeometryData).then((specificTopo) => {
				zoomToTopo(specificTopo.geometry);
			});
		});
		return;
	}

	getPinnedTopoGeometry(oid).then((topoGeometryData) => {
		mapFootprint(oid, topoGeometryData).then((specificTopo) => {
			zoomToTopo(specificTopo.geometry);
		});
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

	currentlySelectedMapCardHTML = target.closest('.mapCard-container').innerHTML;
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
		removeTopoFromMap(currentlySelectedMapId);
	}
	const targetTopLevel = target.closest('.map-list-item');

	if (
		target.closest('.action-container') ||
		targetTopLevel.querySelector('.pinned')
	) {
		return;
	}

	const targetInvisability = targetTopLevel
		.querySelector('.action-container')
		.classList.contains('invisible');

	getTopoGeometry(targetOID).then((targetGeometry) => {
		if (targetInvisability) {
			checkAnyOpenMapCards(targetOID);
			addTopoToMap(targetOID, serviceURL);
			addHalo(targetOID, targetGeometry);
			openMapCard(target);
			setTopoMapPlaceholder(targetOID, false);
			return false;
		} else {
			closeMapCard(target);
			setTopoMapPlaceholder(targetOID, true);
			removeTopoFromMap(targetOID);
			return true;
		}
	});
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
		!event.target.closest('.unpin') &&
		!event.target.closest('.infoIcon')
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
	currentView.map.layers.reorder(
		crosshairLayer,
		currentView.map.layers.length - 1
	);

	currentView.map.layers.reorder(basemapLables, 1);

	currentView.map.layers.reorder(mapHaloGraphicLayer, 2);

	invertHashedMapOrder();
};

//Icon events for mapcard
sideBarElement.addEventListener('click', (event) => {
	const eventTarget = event.target;

	if (event.target.closest('.infoIcon')) {
		const mapInfoText = event.target
			.closest('.infoIcon')
			.querySelector('.mapMetaData').innerText;
		navigator.clipboard.writeText(mapInfoText);
		// try {

		// } catch (error) {
		//   console.error('error while copying map info to clipboard', error)
		// }
		return;
	}

	if (eventTarget.closest('.animate.checkbox')) {
		toggleAnimateCheckbox(eventTarget);
		toggleMapCardDownloadAvailability(
			eventTarget.closest('.map-list-item').attributes.oid.value
		);
		// checkForMapsToAnimate();
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
	const checkmark = eventTarget.classList.contains('checkmark')
		? eventTarget
		: eventTarget.querySelector('path');
	checkmark.classList.toggle('hidden');
};

sideBarElement.addEventListener('input', (event) => {
	event.stopImmediatePropagation();
	if (
		event.target.closest('.dualSliderContainer') ||
		event.target.closest('.animation-slider-container') ||
		event.target.closest('.animation-speed-value')
	) {
		return;
	}
	const eventTarget = event.target;
	const targetOID = eventTarget.closest('.map-list-item').attributes.oid.value;

	eventTarget
		.closest('.mapCard-slider')
		.querySelector('.tooltipText')
		.classList.remove('visible');

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

			if (!event.target.closest('#pinnedList')) {
				getTopoGeometry(mapCardID).then((topoGeometryData) => {
					mapFootprint(mapCardID, topoGeometryData).then((topoOutline) => {
						mapGeometry = topoOutline;
						mapFootprintLayer.graphics.add(mapGeometry);
					});
				});
				return;
			}

			getPinnedTopoGeometry(mapCardID).then((topoGeometryData) => {
				mapFootprint(mapCardID, topoGeometryData).then((topoOutline) => {
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
	event.stopPropagation();

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
				currentView.map.layers.reorder(movedMap, index + 4);

				currentView.map.layers.reorder(
					mapFootprintLayer,
					currentView.map.layers.length - 1
				);

				currentView.map.layers.reorder(
					basemapTerrainLayer,
					currentView.map.layers.length - 1
				);

				currentView.map.layers.reorder(
					crosshairLayer,
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

const setFilterValues = (minYear, maxYear, minScale, maxScale) => {
	filterValues.minYear = minYear;
	filterValues.maxYear = maxYear;
	filterValues.minScale = minScale;
	filterValues.maxScale = maxScale;
};

const filterMaps = () => {
	if (!filterValues.minYear) {
		sortListByChoice(topoMapDataArray);
		return;
	}

	const isWithinYearValues = (map, view) => {
		if (
			map.date >= filterValues.minYear &&
			map.date <= filterValues.maxYear &&
			map.topo.attributes.Map_Scale >= filterValues.minScale &&
			map.topo.attributes.Map_Scale <= filterValues.maxScale
		) {
			return true;
		}
		return false;
	};

	const filteredList = topoMapDataArray.filter(isWithinYearValues);

	sortListByChoice(filteredList);
};

const sortByYearAsc = (a, b) => {
	if (a.date - b.date === 0) {
		return a.topo.attributes.Imprint_Year - b.topo.attributes.Imprint_Year;
	}

	return a.date - b.date;
};

const sortByYearDesc = (a, b) => {
	if (b.date - a.date === 0) {
		return b.topo.attributes.Imprint_Year - a.topo.attributes.Imprint_Year;
	}

	return b.date - a.date;
};

const sortListByChoice = (list) => {
	if (sortOption === 'yearAsc') {
		// list.sort((a, b) => a.date - b.date);
		list.sort(sortByYearAsc);
	}

	if (sortOption === 'yearDesc') {
		// list.sort((a, b) => b.date - a.date);
		list.sort(sortByYearDesc);
	}

	if (sortOption === 'scaleAsc') {
		list.sort(
			(a, b) => b.topo.attributes.Map_Scale - a.topo.attributes.Map_Scale
		);
	}

	if (sortOption === 'scaleDesc') {
		list.sort(
			(a, b) => a.topo.attributes.Map_Scale - b.topo.attributes.Map_Scale
		);
	}

	if (sortOption === 'AtoZ') {
		list.sort((a, b) => {
			const nameA = a.mapName.toUpperCase();
			const nameB = b.mapName.toUpperCase();

			if (nameA < nameB) {
				return -1;
			}

			if (nameA > nameB) {
				return 1;
			}
		});
	}
	if (sortOption === 'ZtoA') {
		list.sort((a, b) => {
			const nameA = a.mapName.toUpperCase();
			const nameB = b.mapName.toUpperCase();

			if (nameA > nameB) {
				return -1;
			}

			if (nameA < nameB) {
				return 1;
			}
		});
	}

	makeCards(list);
};

const setSortOptions = (choiceValue) => {
	//if the choiceValue picked is the same as the pre-existing sort option, end the function
	if (sortOption === choiceValue) {
		return;
	}
	sortOption = choiceValue;
};

const getTopoGeometry = (objectId) => {
	return new Promise((resolve) => {
		topoGeometriesArray.find((topoMap) => {
			if (topoMap[0] == objectId) {
				resolve(JSON.stringify(topoMap[1]));
			}
		});
	});
};

const getPinnedTopoGeometry = (objectId) => {
	return new Promise((resolve) => {
		pinnedTopoGeometriesArray.find((pinnedTopoMap) => {
			if (pinnedTopoMap[0] == objectId) {
				resolve(pinnedTopoMap[1]);
			}
		});
	});
};

const removeFromPinnedGeometriesArray = (objectId) => {
	const pinnedTopoIndex = pinnedCardIDsArray
		.map((topoID) => topoID)
		.indexOf(objectId);

	pinnedTopoGeometriesArray.splice(pinnedTopoIndex, 1);
};

initSortChoice(setSortOptions, filterMaps);

const removeUnpinnedTopo = () => {
	if (
		currentlySelectedMapId &&
		pinnedCardIDsArray.indexOf(`${currentlySelectedMapId}`) === -1
	) {
		removeTopoFromMap(currentlySelectedMapId);
		setTopoMapPlaceholder(currentlySelectedMapId);
	}
};

export {
	clearMapsList,
	setMapDataArray,
	setFilterValues,
	createMapSlotItems,
	setNumberOfPreviousTopos,
	makeCards,
	opacitySliderEvent,
	zoomEvent,
	findTopoLayer,
	currentStateOfPinnedList,
	isTargetPolygonWithinExtent,
	toggleListVisibility,
	getPinnedTopoGeometry,
	mapHaloGraphicLayer,
	crosshairLayer,
	filterMaps,
	removeUnpinnedTopo,
};
