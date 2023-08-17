import { initView } from './map/View.js?v=0.01';
//NOTE: you are importing two elements from this module. Is that necessary?
import {
	queryConfig,
	yearsAndMapScales,
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
	queryHashedTopos,
	// getAllScalesAndYears,
} from './support/QueryConfig.js?v=0.01';
// import { getAllMapsScalesAndYears } from './support/GetAllMapScalesAndYears.js?=v0.01';
import { initDualSlider } from './UI/DualSlider/DualSlider.js?v=0.01';
import { isScrollAtPageEnd } from './support/eventListeners/ScrollListener.js?v=0.01';

import {
	updateHashParams,
	hashCoordinates,
} from './support/HashParams.js?v=0.01';
import {
	allYearChoices,
	allScaleChoices,
} from './support/YearsAndScalesProcessing.js?v=0.01';
import { sortChoice } from './UI/Sort/Sort.js?v=0.01';

// let prevCenter;

const initApp = async () => {
	try {
		//Initializing 'mapView', which contains 'map'.
		const getMinMaxyears = Promise.all([getMinYear, getMaxYear]);
		const getMinMaxScales = Promise.all([getMinScale, getMaxScale]);
		// getAllScalesAndYears;

		const minMaxYears = getMinMaxyears;
		const minMaxScales = getMinMaxScales;

		const getTheYear = (index, value) => {
			// console.log(yearsAndMapScales);
			index === 0
				? yearsAndMapScales.updateMinYear(value)
				: yearsAndMapScales.updateMaxYear(value);
			// console.log(scalesAndYears);
			queryConfig.extentQueryCall();
		};

		const getTheScale = (index, value) => {
			// console.log(value);
			index === 0
				? yearsAndMapScales.updateMinScale(value)
				: yearsAndMapScales.updateMaxScale(value);

			// console.log(yearsAndMapScales);
			queryConfig.extentQueryCall();
		};

		// minMaxYears.then((minMaxYears) => {
		// 	allYearChoices(minMaxYears).then((years) => {
		// 		yearsAndMapScales.setMinMaxYears(years);
		// 		initDualSlider(
		// 			'years',
		// 			'YEARS',
		// 			getTheYear,
		// 			years,
		// 			years[0],
		// 			years[years.length - 1], view
		// 		);
		// 	});
		// });

		// minMaxScales.then((minMaxScales) => {
		// 	allScaleChoices(minMaxScales).then((scales) => {
		// 		yearsAndMapScales.setMinMaxMapScales(scales);
		// 		initDualSlider(
		// 			'scales',
		// 			'SCALES',
		// 			getTheScale,
		// 			scales,
		// 			scales[0],
		// 			scales[scales.length - 1],
		// 			view
		// 		);
		// 	});
		// });

		const setSortOptions = (choiceValue) => {
			console.log('check the query Config', queryConfig);
			queryConfig.setSortChoice(choiceValue);
			queryConfig.extentQueryCall();
		};

		sortChoice(setSortOptions);

		const view = await initView();
		// const zoomDiv = document.createElement('div');
		// zoomDiv.innerHTML = 'Zoom level is...';
		// zoomDiv.classList.add('zoomDiv');
		// document.querySelector('#viewDiv').append(zoomDiv);

		view
			.when(
				location.hash ? queryHashedTopos(view) : null,

				minMaxYears.then((minMaxYears) => {
					allYearChoices(minMaxYears).then((years) => {
						yearsAndMapScales.setMinMaxYears(years);
						initDualSlider(
							'years',
							'YEARS',
							getTheYear,
							years,
							years[0],
							years[years.length - 1],
							view
						);
					});
				}),

				minMaxScales.then((minMaxScales) => {
					allScaleChoices(minMaxScales).then((scales) => {
						yearsAndMapScales.setMinMaxMapScales(scales);
						initDualSlider(
							'scales',
							'SCALES',
							getTheScale,
							scales,
							scales[0],
							scales[scales.length - 1],
							view
						);
					});
				})
			)
			.then(() => {
				require(['esri/core/reactiveUtils'], (reactiveUtils) => {
					// console.log('extent changed. view info,', view);
					// console.log(view.constraints.effectiveLODs);
					let prevCenter;
					reactiveUtils.when(
						() => view?.stationary === true,
						async () => {
							console.log('view info', view);
							console.log('view info', view.extent.xmax);
							// console.log(location.hash);
							// console.log(location);

							// console.log('previous layer count', prevCenter.map.layers.length);
							console.log('new layer count', view.map.layers.length);
							if (prevCenter) {
								// console.log(prevCenter);
								// console.log(view.extent.xmax);
								// 	if (prevCenter.extent.xmax === view.extent.xmax)
								if (prevCenter.x === view.center.x) {
									console.log('previous center', prevCenter.x);
									console.log('new center', view.center.x);
									// console.log(prevCenter, view.center, 'extent not changed');
									return;
								}
							}

							// console.log('extent moved >>> ', view?.center.toJSON());
							// console.log('previous extent >>> ', prevCenter);
							// console.log('previous extent >>> ', prevCenter);
							// document.querySelector('.zoomDiv span').innerHTML = view.zoom;
							queryConfig.setGeometry(view.extent);
							queryConfig.mapView = view;
							queryConfig.extentQueryCall();
							updateHashParams(view);

							// zoomDependentSelections(view);
							prevCenter = view?.center;
						}
					);

					reactiveUtils.watch(
						() => view.scale,
						async () => {
							queryConfig.setGeometry(view.extent);
							queryConfig.mapView = view;
							queryConfig.extentQueryCall();
							updateHashParams(view);
						}
					);
				});

				// if (hashCoordinates()) {
				// 	const hashLocation = hashCoordinates();

				// 	console.log(hashLocation);

				// 	view.goTo({
				// 		center: hashLocation,
				// 	});
				// }
			});

		// if (window.location.hash) {
		// queryHashedTopos(view);
		// }
		//NOTE: not sure if this is the best idea: setting up the render for any topos in the URL's hash, but it's worth a go, I suppose
		//It doesn't seem to be working. ...I think I'll have to call this from the queryConfig folder? the function needs the query's URL.

		// const hashCheck = new URL(window.location.href);
		// if (hashCheck.hash) {
		// 	console.log(hashCheck.hash);
		// 	console.log(view);
		// 	renderHashedTopoMaps(view);
		// }

		// const mapFootprintLayer = view.map.layers.find((layer) => {
		// 	layer.title === 'mapFootprint';

		// 	return layer;
		// });

		// let footprintTest;

		// const addMapFootprint = (mapOutline) => {
		// 	mapFootprintLayer.graphics.push(mapOutline);
		// };

		// const mapPerimeter = (map) => {
		// 	console.log(map);
		// 	footprintTest = map;
		// 	addMapFootprint(map);
		// 	console.log(footprintTest);
		// };
		// const removeMapFootprint = () => {
		// console.log(mapFootprintLayer.graphics);
		//NOTE: I don't like that I'm using removeAll() here. There has to be a better way to remove the graphic.youwont
		// mapFootprintLayer.graphics.removeAll();
		// };
		// mapItemHover(addMapFootprint);
		// mapItemHover(mapPerimeter);
		// mouseLeavesMapItem(removeMapFootprint);

		// const imageQuery = (oid, mapGeometry) => {
		// 	renderTopoMap(view, oid, mapGeometry);
		// };

		//NOTE This 'remove' func is likely going to move. Probably to the imageExport file
		// const removeTopo = (oid, mapGeometry) => {
		// 	removeTopoMap(view, oid, mapGeometry);
		// };

		// const zoomToTopo = (lat, long) => {
		// 	view.goTo({
		// 		center: [long, lat],
		// 	});
		// };

		// mapItemClick(imageQuery, removeTopo, zoomToTopo);

		const isReadyForMoreMaps = (value) =>
			value ? queryConfig.checkAvailableNumberOfMaps() : null;

		isScrollAtPageEnd(isReadyForMoreMaps);
	} catch (error) {
		//error handeling for any intialization issues
		console.error('problem initalizing app', error);
	}
};

initApp();
