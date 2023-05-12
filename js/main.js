import { initView } from './map/View.js?v=0.01';
//NOTE: you are importing two elements from this module. Is that necessary?
import {
	queryConfig,
	yearsAndMapScales,
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
} from './support/QueryConfig.js?v=0.01';
// import { getAllMapsScalesAndYears } from './support/GetAllMapScalesAndYears.js?=v0.01';
import { initDualSlider } from './UI/DualSlider/DualSlider.js?v=0.01';
import { isScrollAtPageEnd } from './support/eventListeners/ScrollListener.js?v=0.01';
import // mapItemHover,
// mouseLeavesMapItem,
// mapItemClick,
'./UI/MapCards/ListOfMaps.js?v=0.01';
import { getTopoMap } from './support/ImageExportQuery.js?v=0.01';
import {
	allYearChoices,
	allScaleChoices,
} from './support/YearsAndScalesProcessing.js?v=0.01';
import { sortChoice } from './UI/Sort/Sort.js?v=0.01';

const initApp = async () => {
	try {
		//Initializing 'mapView', which contains 'map'.
		const getMinMaxyears = Promise.all([getMinYear, getMaxYear]);
		const getMinMaxScales = Promise.all([getMinScale, getMaxScale]);

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

		minMaxYears.then((minMaxYears) => {
			allYearChoices(minMaxYears).then((years) => {
				yearsAndMapScales.setMinMaxYears(years);
				initDualSlider(
					'years',
					'YEARS',
					getTheYear,
					years,
					years[0],
					years[years.length - 1]
				);
			});
		});

		minMaxScales.then((minMaxScales) => {
			allScaleChoices(minMaxScales).then((scales) => {
				yearsAndMapScales.setMinMaxMapScales(scales);
				initDualSlider(
					'scales',
					'SCALES',
					getTheScale,
					scales,
					scales[0],
					scales[scales.length - 1]
				);
			});
		});

		const setSortOptions = (choiceValue) => {
			console.log('check the query Config', queryConfig);
			queryConfig.setSortChoice(choiceValue);
			queryConfig.extentQueryCall();
		};

		sortChoice(setSortOptions);

		const view = await initView();

		view.when(
			// NOTE: compafe view.center before and during event. if they are the same end/cancel the
			require(['esri/core/reactiveUtils'], (reactiveUtils) => {
				let prevCenter = view.center;
				reactiveUtils.watch(
					() => view?.center,
					async () => {
						if (prevCenter) {
							if (prevCenter.x === view.center.x) {
								console.log(prevCenter, view.center, 'extent not changed');
								return;
							}
						}
						console.log('extent moved >>> ', view?.center.toJSON());
						// console.log('previous extent >>> ', prevCenter);
						console.log('previous extent >>> ', prevCenter);
						queryConfig.setGeometry(view.extent);
						queryConfig.mapView = view;
						queryConfig.extentQueryCall();
						prevCenter = view?.center;
					}
				);
			})
		);

		console.log('heres the view', view);

		// const mapFootprintLayer = view.map.layers.find((layer) => {
		// 	layer.title === 'mapFootprint';

		// 	return layer;
		// });

		let footprintTest;

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

		const imageQuery = (oid, mapGeometry) => {
			renderTopoMap(view, oid, mapGeometry);
		};

		//NOTE This 'remove' func is likely going to move. Probably to the imageExport file
		// const removeTopo = (oid, mapGeometry) => {
		// 	removeTopoMap(view, oid, mapGeometry);
		// };

		const zoomToTopo = (lat, long) => {
			view.goTo({
				center: [long, lat],
			});
		};

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
