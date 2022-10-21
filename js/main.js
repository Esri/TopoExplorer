import { initView } from './map/View.js?v=0.01';
import { extentQuery } from './support/Query.js?v=0.01';
import { orderMapsByDate, createMapSlotItems } from './UI/ListOfMaps.js?v=0.01';

const initApp = async () => {
	try {
		//Initializing 'mapView', which contains 'map'.
		const view = await initView();

		//recognizing when the view has been successfully initialized.
		view.when().then(console.log('webmap initialized'));

		require(['esri/core/reactiveUtils'], (reactiveUtils) => {
			reactiveUtils.when(
				() => view?.stationary,
				async () => {
					if (view.stationary && view.zoom > 11) {
						await extentQuery(view.extent)
							.then((result) => {
								console.log(result);
								const returnedList = orderMapsByDate(result);
								return returnedList;
							})
							.then((returnedList) => {
								console.log(returnedList);
								createMapSlotItems(returnedList);
							});
					}
				}
			);
		});
	} catch (error) {
		//error handeling for any intialization issues
		console.error('problem initalizing app', error);
	}
};

//executing intialization
initApp();
