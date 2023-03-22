import { initView } from './map/View.js?v=0.01';
//NOTE: you are importing two elements from this module. Is that necessary?
import {
	checkIfQuerying,
	numberOfMapsinView,
	// initalQueryforUI,
} from './support/Query.js?v=0.01';
import { getAllMapsScalesAndYears } from './support/GetAllMapScalesAndYears.js?v0.01';
import { initDualSlider } from './UI/DualSlider/DualSlider.js?v=0.01';
import { renderSidebarUXText } from './support/uxText.js?=v0.01';

const initApp = async () => {
	try {
		//Initializing 'mapView', which contains 'map'.
		const view = await initView();
		console.log(view);
		console.log(view.center);

		view.when(numberOfMapsinView(view.center));

		//what follows is a lot of logic and math. You shouldn't want any logic going on here.

		await getAllMapsScalesAndYears()
			.then((mapFeatures) => {
				const [years, scales] = [
					mapFeatures.availableYears,
					mapFeatures.availableScales,
				];

				//NOTE: pretty sure this could be done elsewhere. It's great that it's working. Now it needs somewhere
				//NOTE: this object keeps track of the current state of the years/scales selections in the app
				const scalesAndYears = {
					minYear: years[0].toString(),
					maxYear: years[years.length - 1].toString(),
					minScale: scales[0].toString(),
					maxScale: scales[scales.length - 1].toString(),
				};

				//NOTE: I could do a call like this anywhere.
				// numberOfMapsinView(view.extent, scalesAndYears);
				//NOTE: This also doesn't need to be here
				const adjustedQuery = () => {
					checkIfQuerying(view.extent, scalesAndYears);
				};

				//It really seems like I could move these functions somewhere else. They really clutter the function. There is nothing here (in the doc) that's keeping them here.
				//TODO: Come up with a more accurate function name
				const getTheYear = (index, value) => {
					index === 0
						? (scalesAndYears.minYear = years[value])
						: (scalesAndYears.maxYear = years[value]);
					console.log(scalesAndYears);
					adjustedQuery();
				};
				//TODO: Come up with a more accurate function name here too
				const getTheScale = (index, value) => {
					console.log(value);
					index === 0
						? (scalesAndYears.minScale = scales[value])
						: (scalesAndYears.maxScale = scales[value]);

					console.log(scalesAndYears);
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

				return scalesAndYears;
			})
			.then((scalesAndYears) => {
				//NOTE: I don't think I want the following code in this module. It's carrying too many concerns, right? It's doing too much at once. I think I need to simplified this some more.
				require(['esri/core/reactiveUtils'], (reactiveUtils) => {
					reactiveUtils.when(
						() => view?.stationary,
						async () => {
							await checkIfQuerying(view.extent, scalesAndYears);
							//NOTE: originally we were calling the function to create the map-list-items from here...
							//I've moved it so the query, calls that function after it recieves the map-response from the map-collection

							// .then((returnedList) => {
							// 	console.log(returnedList);
							// 	//QUESTION: Can we make a function in the 'FilterMaps' file that will store the organized list as global variable? Is that viable?
							// 	createMapSlotItems(returnedList);
							// });
						}
					);
				});
			});
	} catch (error) {
		//error handeling for any intialization issues
		console.error('problem initalizing app', error);
	}
};

initApp();
