import { initMap } from './Map.js?v=0.01';

//initializes the webmap that will be the basemap
const map = await initMap();

const initView = async () => {
	return new Promise((resolve, reject) => {
		//any issues with the map, and the promise will reject
		if (!map) {
			reject('problem intializing map', error);
		}
		//creating the view object and incorporating map.
		require(['esri/views/MapView', 'esri/widgets/Search'], (
			MapView,
			Search
		) => {
			const view = new MapView({
				container: 'viewDiv',
				map: map,
				zoom: 4,
				center: [-100, 36],
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

			resolve(view);
		});
	});
};

export { initView };
