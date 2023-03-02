import { initView } from './map/View.js?v=0.01';
//NOTE: you are importing two elements from this module. Is that necessary?
import { extentQuery, initalQueryforUI } from './support/Query.js?v=0.01';
import { initSliderDemo } from './UI/Slider/Slider.js?v=0.01';
import { renderSidebarUXText } from './support/uxText.js?=v0.01';

const initApp = async () => {
	try {
		//Initializing 'mapView', which contains 'map'.
		const view = await initView();

		//recognizing when the view has been successfully initialized.
		view.when().then(console.log('webmap initialized'));

		await initalQueryforUI()
			.then((mapFeatures) => {
				const [years, scales] = [
					mapFeatures.availableYears,
					mapFeatures.availableScales,
				];

				//NOTE: this object keeps track of the current state of the years/scales selections in the app
				const scalesAndYears = {
					minYear: years[0].toString(),
					maxYear: years[years.length - 1].toString(),
					minScale: scales[0].toString(),
					maxScale: scales[scales.length - 1].toString(),
				};

				const adjustedQuery = () => {
					view.zoom > 11 ? extentQuery(view.extent, scalesAndYears) : null;
				};

				//TODO: Come up with a more accurate function name
				const getTheYear = (index, value) => {
					index === 0
						? (scalesAndYears.minYear = years[value])
						: (scalesAndYears.maxYear = years[value]);
					console.log(scalesAndYears);
					adjustedQuery();
				};

				const getTheScale = (index, value) => {
					console.log(value);
					index === 0
						? (scalesAndYears.minScale = scales[value])
						: (scalesAndYears.maxScale = scales[value]);

					console.log(scalesAndYears);
					adjustedQuery();
				};

				initSliderDemo(
					'years',
					'YEARS',
					getTheYear,
					years,
					years[0],
					years[years.length - 1]
				);
				initSliderDemo(
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
				require(['esri/core/reactiveUtils'], (reactiveUtils) => {
					reactiveUtils.when(
						() => view?.stationary,
						async () => {
							if (view.stationary && view.zoom > 11) {
								await extentQuery(view.extent, scalesAndYears).then(
									(result) => {
										console.log(result);
									}
								);
								//NOTE: originally we were calling the function to create the map-list-items from here...
								//I've moved it so the query, calls that function after it recieves the map-response from the map-collection

								// .then((returnedList) => {
								// 	console.log(returnedList);
								// 	//QUESTION: Can we make a function in the 'FilterMaps' file that will store the organized list as global variable? Is that viable?
								// 	createMapSlotItems(returnedList);
								// });
							} else if (view.zoom <= 11) {
								//NOTE: This isn't an ideal solution. I do (roughly) the same thing at the end of 'ListOfMaps.js'. I think I'll need to make a new .js that holds the functions that do these steps.
								const findMapsUXText = `<em>Zoom in to find <br/> historical topo maps...</em>`;

								renderSidebarUXText(findMapsUXText);
							}
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
