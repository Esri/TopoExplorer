import { hashCoordinates, hashLoD } from '../support/HashParams.js?v=0.02';
// import { CenterCrosshair } from '../../public/image/CenterCrosshair.png';
import { config } from '../../app-config.js?v=0.02';

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

			const crosshairLayer = new GraphicsLayer({
				id: 'crosshair',
				title: 'crosshair',
				graphics: [],
			});

			const map = new WebMap({
				portalItem: {
					id: config.environment.webMap.webMapItemId,
					//for bug testing during app init, '3582b744bba84668b52a16b0b6942544'
				},
			});

			const view = new MapView({
				container: 'viewDiv',
				map: map,
				// layerView: [],
				center: hashCoordinates() || config.defaultMapSettings.center,
				zoom: hashLoD() || config.defaultMapSettings.zoom,
				constraints: {
					snapToZoom: false,
					minZoom: config.defaultMapSettings.constraints.minZoom,
				},
				popup: {
					popup: null,
					autoOpenEnabled: false,
				},
			});

			map.layers.add(haloLayer);
			map.layers.add(footprintLayer);
			map.layers.add(crosshairLayer);

			const searchWidget = new Search({
				view: view,
				id: 'searchWidget',
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

			view.when(() => {
				return resolve(view);
			});
		});
	});
};

const newMapCrossHair = (view, mapPoint) => {
	require([
		'esri/geometry/Point',
		'esri/Graphic',
		'esri/symbols/PictureMarkerSymbol',
	], (Point, Graphic, PictureMarkerSymbol) => {
		const crosshairGraphicLayer = view.map.layers.items.find((layer) => {
			if (layer.id === 'crosshair') {
				return layer;
			}
		});

		crosshairGraphicLayer.graphics.removeAll();

		const mapPointSymbol = new PictureMarkerSymbol({
			url: './public/images/CrosshairRed.png',
			width: '44px',
			height: '44px',
		});

		const mapPointGraphic = new Graphic({
			symbol: mapPointSymbol,
			geometry: new Point({
				latitude: mapPoint.latitude,
				longitude: mapPoint.longitude,
			}),
		});

		crosshairGraphicLayer.graphics.add(mapPointGraphic);
	});
};

export { initView, newMapCrossHair };
