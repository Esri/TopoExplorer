// import { mapFootprint } from '../UI/MapAndFootprint/MapFootprint';
import { hashCoordinates, hashLoD } from '../support/HashParams.js?v=0.01';
const initView = async () => {
	return new Promise((resolve, reject) => {
		//creating the view object and incorporating map.
		require([
			'esri/WebMap',
			'esri/views/MapView',
			'esri/layers/GraphicsLayer',
			'esri/geometry/SpatialReference',
			'esri/widgets/Search',
			'esri/widgets/Search/LocatorSearchSource',
		], (
			WebMap,
			MapView,
			GraphicsLayer,
			SpatialReference,
			Search,
			LocatorSearchSource
		) => {
			const footprintLayer = new GraphicsLayer({
				id: 'mapFootprint',
				title: 'mapFootprint',
				graphics: [],
				effect: 'drop-shadow(0px, 0px, 8px, black)',
				blendMode: 'hard-light',
				spatialReference: new SpatialReference({ wkid: 3857 }),
			});

			const haloLayer = new GraphicsLayer({
				id: 'halo',
				title: 'halo',
				graphics: [],
				effect: 'drop-shadow(0px, 0px, 8px, black) contrast(2)',
				blendMode: 'hard-light',
				spatialReference: new SpatialReference({ wkid: 3857 }),
			});

			const map = new WebMap({
				portalItem: {
					id: '2e8a3ccdfd6d42a995b79812b3b0ebc6',
				},
				layers: [haloLayer, footprintLayer],
			});

			console.log(location.hash);
			// console.log(hashCoordinates());

			const view = new MapView({
				container: 'viewDiv',
				map: map,
				layerView: [],
				center: hashCoordinates() || [-98.5357, 40.1549],
				zoom: hashLoD() || 4,
				constraints: {
					minZoom: 4,
				},
			});

			// const searchWidget = new Search({
			// 	sources: [
			// 		{
			// 			locator: new LocatorSearchSource({
			// 				url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
			// 			}),
			// 			countryCode: 'US',
			// 			// singleLineFieldName: 'SingleLine',
			// 			// name: 'Custom Geocoding Service',
			// 			// localSearchOptions: {
			// 			// 	minScale: 300000,
			// 			// 	distance: 50000,
			// 			// },
			// 			placeholder: 'Find address or place',
			// 			maxResults: 3,
			// 			maxSuggestions: 6,
			// 			suggestionsEnabled: true,
			// 			minSuggestCharacters: 0,
			// 		},
			// 	],
			// 	view: view,
			// 	includeDefaultSources: false,
			// });

			//TODO: Add API Key to this. Then it will work
			const searchWidget = new Search({
				view: view,
				resultGraphicEnabled: false,
				popupEnabled: false,
				includeDefaultSources: false,
				countryCode: 'US',
				sources: [
					{
						url: 'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer',
						apiKey:
							'AAPKe259b9f8cc57489cb0533ceb6da4b459DGbL3xnlg-YC7ah0DSbIB_1bJzAnUIegpFFBoigwoOvqAHj4aVreEZWdTaR28PEW',
						singleLineFieldName: 'SingleLine',
						outFields: ['Addr_type'],
						name: 'ArcGIS World Geocoding Service',
						placeholder: 'Find address or place',
						countryCode: 'US',
					},
				],
			});

			view.ui.move('zoom', 'top-right');
			view.ui.add(searchWidget, {
				position: 'top-right',
				index: 0,
			});

			const userIcon = document.querySelector('#user-icon');
			view.ui.add(userIcon, {
				position: 'top-right',
			});

			return resolve(view);
		});
	});
};

export { initView };
