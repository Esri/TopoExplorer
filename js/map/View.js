import { hashCoordinates, hashLoD } from '../support/HashParams.js?v=0.01';
import { config } from '../../app-config.js?v=0.01';
const initView = () => {
	return new Promise((resolve, reject) => {
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
				spatialReference: new SpatialReference(config.spatialReference),
			});

			const haloLayer = new GraphicsLayer({
				id: 'halo',
				title: 'halo',
				graphics: [],
				effect: 'drop-shadow(0px, 0px, 8px, black) contrast(2)',
				blendMode: 'hard-light',
				spatialReference: new SpatialReference(config.spatialReference),
			});

			const map = new WebMap({
				portalItem: {
					id: config.environment.webMap.webMapItemId,
				},
			});

			const view = new MapView({
				container: 'viewDiv',
				map: map,
				layerView: [],
				center: hashCoordinates() || config.defaultMapSettings.center,
				zoom: hashLoD() || config.defaultMapSettings.zoom,
				constraints: {
					minZoom: config.defaultMapSettings.constraints.minZoom,
				},
				popup: {
					popup: null,
					autoOpenEnabled: false,
				},
			});

			map.layers.add(haloLayer, map.layers, 2);
			map.layers.add(footprintLayer, map.layers.length - 1);

			const searchWidget = new Search({
				view: view,
				resultGraphicEnabled: false,
				popupEnabled: false,
				includeDefaultSources: false,
				countryCode: 'US',
				sources: [
					{
						url: 'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer',
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
