import { mapFootprint } from '../../UI/MapAndFootprint/MapFootprint.js?v=0.01';

// const mapListItems = document.querySelectorAll('.map-list-item');
// const container = document.querySelector('#mapsList');

// console.log('map listeners connected');

// const handleOpacityChange = (event) => {
// 	console.log('some kinda thing');
// 	let target = event.target;

// 	// const min = target.min;
// 	// const max = target.max;
// 	const value = target.value;
// 	console.log(event);
// 	console.log(target.parentElement.querySelector('.slider-range-color'));

// 	target.parentElement.querySelector(
// 		'.slider-range-color'
// 	).style.width = `${value}%`;
// };

// const waitForIt = () =>
// 	opacitySlider.forEach((slider) => {
// 		slider.addEventListener('input', handleOpacityChange);
// 	});

// const mapItemClick = (callback) => {
// 	container.addEventListener('click', (e) => {
// 		let target = e.target;

// 		if (target.closest('.map-list-item')) {
// 			let mapItem = target.closest('.map-list-item');
// 			console.log('found it');
// 			// console.log(e.target.querySelector('.action-container'));
// 			// console.log(mapItem.attributes);
// 			callback(mapItem.attributes.oid.value);

// 			if (
// 				target
// 					.closest('.map-list-item')
// 					.querySelector('.action-container')
// 					.classList.contains('invisible')
// 			) {
// 				target
// 					.closest('.map-list-item')
// 					.querySelector('.action-container')
// 					.classList.remove('invisible');

// 				target
// 					.closest('.map-list-item')
// 					.querySelector('.action-container')
// 					.classList.add('flex');

// 				target
// 					.closest('.map-list-item')
// 					.querySelector('input')
// 					.addEventListener('input', handleOpacityChange);
// 			} else if (target.closest('.action-container')) {
// 				console.log('event,', e.target);
// 				return;
// 			} else {
// 				console.log(target.closest('.map-list-item'));

// 				target
// 					.closest('.map-list-item')
// 					.querySelector('.action-container')
// 					.classList.remove('flex');

// 				target
// 					.closest('.map-list-item')
// 					.querySelector('.action-container')
// 					.classList.add('invisible');
// 			}
// 		}
// 	});
// };

// const mapItemHover = (addCallback) => {
// 	container.addEventListener(
// 		'mouseenter',
// 		(e) => {
// 			if (e.target.className === 'map-list-item') {
// 				let mapItem = e.target;

// 				mapFootprint(mapItem.attributes.location.value).then((footprint) => {
// 					addCallback(footprint);
// 				});
// 			}
// 		},
// 		true
// 	);
// };

// const mouseLeavesMapItem = (removeGraphicCallback) => {
// 	container.addEventListener(
// 		'mouseleave',
// 		(e) => {
// 			if (e.target.className === 'map-list-item') {
// 				console.log('leaving');
// 				removeGraphicCallback();
// 			}
// 		},
// 		true
// 	);
// };

//     {
// 			const mapid = e.target.attributes.value.value;
// 			console.log('hover', mapid);

// 			require(['esri/layers/GraphicsLayer', 'esri/Graphic'], function (
// 				GraphicsLayer,
// 				Graphic
// 			) {
// 				const footprintPolygon = {
// 					type: 'polygon',
// 					rings: mapItem.attributes.location.rings,
// 				};

// 				const footprintFill = {
// 					type: 'simple-fill',
// 					color: '#7f7f7f',
// 					outline: {
// 						color: '#FFFFFF',
// 						width: mapFootprintOutline,
// 					},
// 				};

// 				const mapFootprintGraphic = new Graphic({
// 					geometry: footprintPolygon,
// 					symbol: footprintFill,
// 				});

// 				addCallback(mapFootprintGraphic);
// 			});
// 		}
// 	});
// };
//End of hover event and graphic gen

// mapItem.addEventListener('click', () => {
// 	const mapid = mapItem.attributes.value.value;
// 	// console.log(mapid);
// 	if (mapItem.querySelector('.action-container')) {
// 		if (
// 			mapItem.querySelector('.action-container').classList.contains('invisible')
// 		) {
// 			mapItem.querySelector('.action-container').classList.remove('invisible');
// 		} else {
// 			mapItem.querySelector('.action-container').classList.add('invisible');
// 		}
// 	}
// });

// export { mapItemHover, mouseLeavesMapItem, mapItemClick };
