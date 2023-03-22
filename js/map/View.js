import { initMap } from './Map.js?v=0.01';
// import { extentQueryCall } from '../support/query.js?v=0.01';

//initializes the webmap that will be the basemap
const map = await initMap();

const initView = async () => {
	return new Promise((resolve, reject) => {
		//any issues with the map, and the promise will reject
		if (!map) {
			reject('problem intializing map', error);
		}
		//creating the view object and incorporating map.
		require([
			'esri/views/MapView',
			'esri/widgets/Search',
			'esri/core/reactiveUtils',
		], (MapView, Search, reactiveUtils) => {
			const view = new MapView({
				container: 'viewDiv',
				map: map,
				zoom: 4,
				center: [-100, 36],
				// extent:
			});

			const searchWidget = new Search({
				view: view,
				resultGraphicEnabled: false,
				popupEnabled: false,
			});

			view.ui.move('zoom', 'top-right');
			view.ui.add(searchWidget, {
				position: 'top-right',
				index: 0,
			});

			// reactiveUtils.when(
			// 	() => view?.stationary,
			// 	async () => {
			// 		console.log('view listing query...');
			// 		await extentQueryCall(view.extent, scalesAndYears, 12);
			// 	}
			// );

			// const extent = new Extent({
			// 	xmax: -8896318.876043104,
			// 	xmin: -13367579.282611609,
			// 	ymax: 6753944.231884648,
			// 	ymin: 1847298.5122038936,
			// 	spatialReference: {
			// 		wkid: 102100,
			// 	},
			// });
			// view.extent = extent;

			return resolve(view);
		});
	});
};

export { initView };
