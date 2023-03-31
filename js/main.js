import { initView } from './map/View.js?v=0.01';
//NOTE: you are importing two elements from this module. Is that necessary?
import {
	queryConfig,
	yearsAndMapScales,
} from './support/QueryConfig.js?v=0.01';
import { getAllMapsScalesAndYears } from './support/GetAllMapScalesAndYears.js?v0.01';
import { initDualSlider } from './UI/DualSlider/DualSlider.js?v=0.01';
import { isScrollAtPageEnd } from './support/eventListeners/ScrollListener.js?v=0.01';

const initApp = async () => {
	try {
		//Initializing 'mapView', which contains 'map'.
		const view = await initView();

		view.when(
			// queryConfig.setGeometry(view.extent),
			console.log(queryConfig.geometry),
			require(['esri/core/reactiveUtils'], (reactiveUtils) => {
				reactiveUtils.when(
					() => view?.stationary,
					async () => {
						// console.log(view);
						await queryConfig.setGeometry(view.extent);
						queryConfig.extentQueryCall();
					}
				);
			})
		);

		const isReadyForMoreMaps = (value) =>
			value
				? (console.log('calling query'),
				  queryConfig.checkAvailableNumberOfMaps())
				: (console.log('doing nothing'), null);

		isScrollAtPageEnd(isReadyForMoreMaps);

		//what follows is a lot of logic and math. You shouldn't want any logic going on here.

		await getAllMapsScalesAndYears()
			.then((mapFeatures) => {
				const [years, scales] = [
					mapFeatures.availableYears,
					mapFeatures.availableScales,
				];

				yearsAndMapScales.setMinMaxYears(years);
				yearsAndMapScales.setMinMaxMapScales(scales);

				const adjustedQuery = () => {
					queryConfig.extentQueryCall();
				};

				//It really seems like I could move these functions somewhere else. They really clutter the function. There is nothing here (in the doc) that's keeping them here.
				//TODO: Refactor this section. I don't think I need all these actions here, and what needs to be here could be better organized.
				//TODO: Come up with a more accurate function name
				const getTheYear = (index, value) => {
					console.log(yearsAndMapScales);
					index === 0
						? yearsAndMapScales.updateMinYear(value)
						: yearsAndMapScales.updateMaxYear(value);
					// console.log(scalesAndYears);
					adjustedQuery();
				};
				//TODO: Come up with a more accurate function name here too
				const getTheScale = (index, value) => {
					console.log(value);
					index === 0
						? yearsAndMapScales.updateMinScale(value)
						: yearsAndMapScales.updateMaxScale(value);

					console.log(yearsAndMapScales);
					adjustedQuery();
				};

				initDualSlider(
					'years',
					'YEARS',
					getTheYear,
					years,
					years[0],
					years[years.length - 1]
				);
				initDualSlider(
					'scales',
					'SCALES',
					getTheScale,
					scales,
					scales[0],
					scales[scales.length - 1]
				);

				// return scalesAndYears;
			})
			.then((scalesAndYears) => {
				//TODO: You HAVE to more these functions out of here. They should not be synchronusly tied to the initSlider()
				// require(['esri/core/reactiveUtils'], (reactiveUtils) => {
				// 	reactiveUtils.when(
				// 		() => view?.stationary,
				// 		async () => {
				// 			// console.log(view);
				// 			await queryConfig.setGeometry(view.extent);
				// 			queryConfig.extentQueryCall();
				// 		}
				// 	);
				// });
				// const test = (value) =>
				// 	value ? queryConfig.checkAvailableNumberOfMaps() : null;
				// isScrollAtPageEnd(test);
			});
	} catch (error) {
		//error handeling for any intialization issues
		console.error('problem initalizing app', error);
	}
};

initApp();
