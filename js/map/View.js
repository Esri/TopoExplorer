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
			'esri/geometry/Extent',
			'esri/geometry/SpatialReference',
			'esri/widgets/Search',
			'esri/core/reactiveUtils',
		], (MapView, Extent, SpatialReference, Search, reactiveUtils) => {
			const extentOption = [
				{
					xmax: -11279319.669861136,
					xmin: -12168435.182874074,
					ymax: 5151824.119027775,
					ymin: 4459610.3908774,
					spatialReference: new SpatialReference({ wkid: 3857 }),
				},
				{
					xmax: -8930653.05237454,
					xmin: -9819768.565387478,
					ymax: 4445023.887643386,
					ymin: 3752810.1594930105,
					spatialReference: new SpatialReference({ wkid: 3857 }),
				},
			];

			const random = () => Math.floor(Math.random() * extentOption.length);

			const view = new MapView({
				container: 'viewDiv',
				map: map,
				extent: new Extent(extentOption[random()]),
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

			return resolve(view);
		});
	});
};

export { initView };
