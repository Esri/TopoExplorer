import { initView } from './map/View.js?v=0.01';
import { extentQuery, initalQueryforUI } from './support/Query.js?v=0.01';
// import { orderMapsByDate, createMapSlotItems } from './UI/ListOfMaps.js?v=0.01';
// import { filterExistingMaps } from './support/FilterMaps.js?v=0.01';
import { initSlider, createSlider } from './UI/Slider/Slider.js?v=0.01';

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

				createSlider({
					sliderValues: years,
					onchange: () => {},
				});
				createSlider({
					sliderValues: scales,
					onchange: () => {},
				});

				const scalesAndYears = {
					minYear: years[0].toString(),
					maxYear: years[years.length - 1].toString(),
					minScale: scales[0].toString(),
					maxScale: scales[scales.length - 1].toString(),
				};

				return scalesAndYears;
			})
			.then((scalesAndYears) => {
				const adjustedQuery = () => {
					view.zoom > 11 ? extentQuery(view.extent, scalesAndYears) : null;
				};

				for (
					let i = 0;
					i < document.querySelectorAll('.minSlider').length;
					i++
				) {
					//NOTE: This is not a great way to add event listeners to the sliders.
					//This is temporary while I refeactor the accompanying slider.js.
					// Then I'll rework this section too.

					//Adding eventlisteners to the minSlider handles on all sliders
					(document.querySelectorAll('.minSlider')[i].onchange = async () => {
						console.log(
							await initSlider(document.querySelectorAll('.minSlider')[i])
						);
						console.log(document.querySelectorAll('.minSlider')[i]);

						if (i === 0) {
							scalesAndYears.minYear = await initSlider(
								document.querySelectorAll('.minSlider')[i]
							);
							adjustedQuery();
						} else {
							scalesAndYears.minScale = await initSlider(
								document.querySelectorAll('.minSlider')[i]
							);
							adjustedQuery();
						}
					})(
						//Adding eventlisteners to the maxSlider handles on all sliders
						(document.querySelectorAll('.maxSlider')[i].onchange = async () => {
							console.log(
								await initSlider(document.querySelectorAll('.maxSlider')[i])
							);
							if (i === 0) {
								scalesAndYears.maxYear = await initSlider(
									document.querySelectorAll('.maxSlider')[i]
								);
								adjustedQuery();
							} else {
								scalesAndYears.maxScale = await initSlider(
									document.querySelectorAll('.maxSlider')[i]
								);
								adjustedQuery();
							}
						})
					);
				}
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
										// const returnedList = orderMapsByDate(result);
										// return returnedList;
									}
								);
								// .then((returnedList) => {
								// 	console.log(returnedList);
								// 	//QUESTION: Can we make a function in the 'FilterMaps' file that will store the organized list as global variable? Is that viable?
								// 	createMapSlotItems(returnedList);
								// });
							} else if (view.zoom <= 11) {
								const sidebarHelpPrompt = `<div id="mapsListUxText">
                  <em>Zoom in to find historical topo maps...</em>
                </div>`;

								document.querySelector('#mapsList').innerHTML =
									sidebarHelpPrompt;
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
