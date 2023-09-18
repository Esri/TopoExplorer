// import { mapFootprint } from '../UI/MapAndFootprint/MapFootprint';
import { hashCoordinates, hashLoD } from '../support/HashParams.js?v=0.01';
const initView = () => {
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
					id: '710264327ad24ff5ba996e2a7c773b7f',
				},
				layers: [haloLayer, footprintLayer],
			});

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
