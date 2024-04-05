import { hashCoordinates, hashLoD } from '../support/HashParams.js?v=0.01';
// import { CenterCrosshair } from '../../public/image/CenterCrosshair.png';
import { config } from '../../app-config.js?v=0.01';
const initView = () => {
	return new Promise((resolve, reject) => {
		require([
			'esri/WebMap',
			'esri/views/MapView',
			'esri/layers/GraphicsLayer',
			'esri/geometry/SpatialReference',
			'esri/widgets/Search',
		], (WebMap, MapView, GraphicsLayer, SpatialReference, Search) => {
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
					snapToZoom: false,
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
				sources: [
					{
						url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
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

const addVeiwCrosshairs = () => {
	const crosshairContainer = document.createElement('div');
	const crosshair = new Image();
	crosshairContainer.append(crosshair);

	crosshairContainer.classList.add('crosshairContainer');
	crosshair.src = './public/images/CenterCrosshair.png';

	document.querySelector('#viewDiv').append(crosshairContainer);
};

export { initView, addVeiwCrosshairs };
