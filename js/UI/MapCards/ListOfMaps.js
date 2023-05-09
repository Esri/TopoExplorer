// import { mapItemListener } from '../../support/eventListeners/MapItemListener.js?v=0.01';
import { mapFootprint } from '../../UI/MapAndFootprint/MapFootprint.js?v=0.01';
import { getTopoMap } from '../../support/ImageExportQuery.js?v=0.01';

const mapsList = document.querySelector('#mapsList');
const opacitySlider = document.querySelectorAll(
	".action-container .mapCard-slider input[type='range']"
);

const container = document.querySelector('#mapsList');
//This will contain the map's geometry information to be used at various times while the mouse hovers

const mapListDetails = [];

const pinnedCardsArray = [];

const createMapSlotItems = (list, view, url) => {
	const toposOnMapArray = [];
	const mapFootprintLayer = view.map.layers.find((layer) => {
		layer.title === 'mapFootprint';

		return layer;
	});

	view.map.layers.forEach((layer) => {
		toposOnMapArray.push(parseInt(layer.id));
	});

	const addTopoToMap = (target, url) => {
		getTopoMap(target, url).then((topoImageLayer) => {
			//NOTE: maybe give this it's own function. Just to make things easier to parse
			console.log('trying to add this topo');
			view.map.add(topoImageLayer);
		});
	};

	const findTopoLayer = (oid) => {
		const addedLayers = view.map.layers.items;

		return new Promise((resolve, reject) => {
			addedLayers.find((imageTopo) => {
				if (imageTopo.id == oid) {
					resolve(imageTopo);
				}
			});
		});
	};

	const removeTopoFromMap = (oid) => {
		findTopoLayer(oid).then((specificTopo) => {
			view.map.remove(specificTopo);
		});
	};

	const mapSlot = list
		.map((topoMap) => {
			const isMapPinned = (map) => {
				// console.log('chekcing for existing pin', map.OBJECTID);
				// console.log(topoMap.OBJECTID);
				return map.OBJECTID === topoMap.OBJECTID;
			};

			mapListDetails.push(topoMap);

			//NOTE: I'm calling the same function for the same purpose (but a different class result) twice. There has to be a better way than what I have.
			return ` 
          <div class ='map-list-item' oid='${topoMap.OBJECTID}'>

            <div class="title-and-thumbnail">
              <div class ='map-list-item-title'>
                <p class="mapSlotHeader"> ${topoMap.date} | ${topoMap.mapName}
                </p>
                <p> ${topoMap.mapScale} | ${topoMap.location} </p>
              </div>
              <div class="img-cover">
                <div class="frame"></div>
                <img src=${topoMap.thumbnail}>
                </div>
              
            </div>
            
            <div class='action-container ${
							toposOnMapArray.indexOf(topoMap.OBJECTID) !== -1
								? 'flex'
								: 'invisible'
						}'>
              <div class='action-area'>
                <div class='icon pushpin'>
                  <div class="checkmarkBackground ${
										pinnedCardsArray.findIndex(isMapPinned) !== -1
											? null
											: 'hidden'
									}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M20,0H3.56757A3.56754,3.56754,0,0,0,0,3.56757V20"></path></svg>
                    <div class="checkmark">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12"viewBox="-3 3 32 32"><path fill="#EAEEF1" d="M11.927 22l-6.882-6.883-3 3L11.927 28 31.204 8.728l-3.001-3.001z"/></svg>
                    </div>
                  </div>
                  <div class="unpinned svgContainer ${
										pinnedCardsArray.findIndex(isMapPinned) !== -1
											? 'pinned'
											: null
									}">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 28 28"><path d="M5 0h7v1.417l-1 .581v6l1 .502v1.498H9v6l-.5 1-.5-1v-6H5V8.5l1-.502v-6L5 1.5V0z"/></svg>
                  </div>
                </div>
                <div class='icon zoom invisible'>
                <svg class="zoomToExtent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 16H2v6h6v-1H3zM16 3h5v5h1V2h-6zm5 18h-5v1h6v-6h-1zM8 2H2v6h1V3h5z"/><path fill="none" d="M0 0h24v24H0z"/>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-9 -8 36 36"><path d="M15.805 13.918l-3.067-3.068a.668.668 0 0 0-.943 0l-.124.124-1.108-1.108A5.279 5.279 0 1 0 6.5 11.8a5.251 5.251 0 0 0 3.373-1.244l1.108 1.108-.13.129a.667.667 0 0 0 0 .943l3.068 3.067a.665.665 0 0 0 .943 0l.943-.942a.666.666 0 0 0 0-.943zM6.5 10.8a4.3 4.3 0 1 1 4.3-4.3 4.304 4.304 0 0 1-4.3 4.3zm7.89 4.06l-2.596-2.595.473-.473 2.595 2.598z"/><path fill="none" d="M0 0h16v16H0z"/></svg>
                </svg>
                </div>
                <div class='icon save'>
                  <svg class="save" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 2h11v1H3v18h18V11h1v11H2zm20 6V2h-6v1h4.3l-8.41 8.403.707.707L21 3.714V8z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                </div>
                <div class='icon download'>
                  <svg class="download" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 3v12.294l2.647-2.647.707.707-3.853 3.854-3.854-3.854.707-.707L12 15.292V3zM6 21h13v-1H6z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                </div>
                
                
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
          </div>`;
		})
		.join(' ');

	mapsList.innerHTML = mapsList.innerHTML + mapSlot;

	let mapGeometry;
	let currentMapCard;
	const mapListItems = document.querySelectorAll('.map-list-item');
	const mapCardPin = document.querySelectorAll('.icon.pushpin');
	const mapCardZoom = document.querySelectorAll('.icon.zoom');
	const mapCardSave = document.querySelectorAll('.icon.save');
	const mapCardDownload = document.querySelectorAll('.icon.download');
	const mapOpacitySlider = document.querySelectorAll('.opacity-slider');

	console.log(mapCardPin);

	console.log(mapListDetails);

	const mapCardData = (mapItem) => {
		return new Promise((resolve, reject) => {
			mapListDetails.find((cardData) => {
				if (cardData.OBJECTID == mapItem.attributes.oid.value) {
					console.log(cardData);
					currentMapCard = cardData;
					resolve(cardData);
				}
			});
		});
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

	const closeMapCard = (target) => {
		target
			.closest('.map-list-item')
			.querySelector('.action-container')
			.classList.remove('flex');

		target
			.closest('.map-list-item')
			.querySelector('.action-container')
			.classList.add('invisible');
	};

	const isMapCardOpen = (target) => {
		console.log(
			target.closest('.map-list-item').querySelector('.action-container')
		);
		console.log(
			target.closest('.map-list-item').querySelector('.action-container')
				.classList
		);

		const targetInvisability = target
			.closest('.map-list-item')
			.querySelector('.action-container')
			.classList.contains('invisible');

		console.log(
			'checking a specific card',
			targetInvisability,
			target.closest('.map-list-item')
		);

		if (targetInvisability) {
			openMapCard(target);
			return false;
		} else {
			closeMapCard(target);
			return true;
		}
	};

	// const addTopoToMap = (target, url) => {
	// 	getTopoMap(target, url).then((topoImageLayer) => {
	// 		//NOTE: maybe give this it's own function. Just to make things easier to parse
	// 		console.log('trying to add this topo');
	// 		view.map.add(topoImageLayer);
	// 	});
	// };
	// const removeTopoFromMap = (oid) => {
	// 	const addedLayers = view.map.layers.items;

	// 	const specificTopo = addedLayers.find((imageTopo) => {
	// 		if (imageTopo.id === oid) {
	// 			return imageTopo;
	// 		}
	// 	});

	// 	// console.log('this is the image we are removing,', specificTopo);
	// 	view.map.remove(specificTopo);
	// };

	const isCurrentMapPinned = () =>
		pinnedCardsArray.find((pinnedMap, index) => {
			console.log(pinnedMap, currentMapCard);
			if (pinnedMap.OBJECTID === currentMapCard.OBJECTID) {
				console.log(pinnedMap, currentMapCard.OBJECTID);
				return pinnedCardsArray.splice(index, 1);
			}
			return false;
		});

	const mapPinningAction = (pinIcon, pinCheckmarkIcon) => {
		console.log('pinning is', currentMapCard);

		console.log(pinnedCardsArray);

		pinIcon.classList.toggle('pinned'),
			pinCheckmarkIcon.classList.toggle('hidden');

		if (!isCurrentMapPinned()) {
			pinnedCardsArray.push(currentMapCard);
		}
		// if (isCurrentMapPinned()) {
		// 	console.log('is pinned', index);
		// } else {
		// 	console.log('no find. Adding');
		// 	pinnedCardsArray.push(currentMapCard);
		// }

		// pinnedCardsArray.forEach((pinnedCard, index) => {
		// 	console.log(pinnedCard.OBJECTID);
		// 	if (pinnedCard.OBJECTID === currentMapCard.OBJECTID) {
		// 		return pinnedCardsArray.splice(index, 1);
		// 		// console.log(pinnedCardsArray);
		// 	}
		// 	// return;
		// });
		// pinnedCardsArray.push(currentMapCard);
		console.log(pinnedCardsArray);
	};

	const zoomToTopo = (lat, long) => {
		console.log('zoomin.', long, lat);
		view.goTo({
			center: [long, lat],
		});
	};

	const checkAnyOpenMapCards = (oid) => {
		mapListItems.forEach((mapCard) => {
			if (mapCard.attributes.oid.value === oid) {
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

	//Event Listeners for the mapCards
	mapListItems.forEach((mapCard) => {
		mapCard.addEventListener('mouseenter', (event) => {
			let mapItem = event.target;

			mapCardData(mapItem).then((cardInfo) => {
				currentMapCard = cardInfo;
				const mapBoundry = JSON.stringify(cardInfo.mapBoundry);
				mapFootprint(mapBoundry).then((topoOutline) => {
					mapGeometry = topoOutline;
					mapFootprintLayer.graphics.add(topoOutline);
				});
			});
		});

		mapCard.addEventListener('mouseleave', (event) => {
			// console.log('leaving');
			mapFootprintLayer.graphics.removeAll();
		});

		mapCard.addEventListener('click', (event) => {
			if (event.target.closest('.action-container')) {
				return;
			}

			let target = event.target;
			let targetTopLevel = event.target.closest('.map-list-item');

			checkAnyOpenMapCards(targetTopLevel.attributes.oid.value);

			if (!isMapCardOpen(target)) {
				addTopoToMap(targetTopLevel.attributes.oid.value, url);
			} else {
				removeTopoFromMap(targetTopLevel.attributes.oid.value);
			}
		});

		mapCard;
	}); //end of mapCard top-level eventlistener assignment

	//Event Listeners for each of the action items in the cards
	//the pin event for the mapCard
	mapCardPin.forEach((pinBtn) => {
		pinBtn.addEventListener('click', (event) => {
			event.stopPropagation();
			//NOTE: this is a bad variable name...the function name isn't much better
			const pinIcon = pinBtn.querySelector('.unpinned');
			const pinCheckmarkIcon = pinBtn.querySelector('.checkmarkBackground');
			console.log(pinCheckmarkIcon);
			mapPinningAction(pinIcon, pinCheckmarkIcon);
		});
	});

	//zoomBtn event
	mapCardZoom.forEach((zoomBtn) => {
		zoomBtn.addEventListener('click', (event) => {
			event.stopPropagation();
			const mapItem = zoomBtn.closest('.map-list-item');

			console.log('clicked the zoom for', mapItem);
			const location = [
				mapGeometry.geometry.centroid.latitude,
				mapGeometry.geometry.centroid.longitude,
			];
			zoomToTopo(location[0], location[1]);
		});
	});

	//saveBtn
	mapCardSave.forEach((saveBtn) => {
		saveBtn.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log('save');
		});
	});

	//downloadBtn
	mapCardDownload.forEach((downloadBtn) => {
		downloadBtn.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log('download');
		});
	});

	mapOpacitySlider.forEach((opacitySlider) => {
		opacitySlider.addEventListener('click', (event) => {
			event.stopImmediatePropagation();
		});
		opacitySlider.addEventListener('input', (event) => {
			const sliderValue = event.target.value;
			handleOpacityChange(sliderValue);
			sliderColorPosition(event, sliderValue);
		});
	});

	const sliderColorPosition = (event, value) => {
		//NOTE: this isn't handling any opacity element. It needs to access the layer with the corresponding id.
		// event.preventDefault();

		let target = event.target;

		// const value = target.value;

		target.parentElement.querySelector(
			'.slider-range-color'
		).style.width = `${value}%`;
		console.log();
	};

	const handleOpacityChange = (value) => {
		//NOTE: I have a global var for the mapGeometry....why not a global var for the mapCard the mouse hovers over?

		//Looking for a specific layer that matches the current map
		// view.map.layers.items.find(())

		findTopoLayer(currentMapCard.OBJECTID).then((specificTopo) => {
			specificTopo.opacity = 1 - value / 100;
		});
	};
}; //end of the mapCard Generator

//We can move this inside the creatator module (just remember how to access different functions withing a function...obj notation)
const clearMapsList = () => {
	mapListDetails.length = 0;
	mapsList.innerHTML = '';
};

// console.log('map listeners connected');
// const handleOpacityChange = (value) => {
// 	//NOTE: I have a global var for the mapGeometry....why not a global var for the mapCard the mouse hovers over?
// 	// mapCardData;
//   isCurrentMapPinned
// };
// const sliderColorPosition = (event, value) => {
//NOTE: this isn't handling any opacity element. It needs to access the layer with the corresponding id.
// event.preventDefault();

// let target = event.target;
// console.log(event);
// console.log(mapCardData);
// console.log(value);
// const value = target.value;

// target.parentElement.querySelector(
// 	'.slider-range-color'
// ).style.width = `${value}%`;
// };

export { clearMapsList, createMapSlotItems };
