/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { hashCoordinates, hashLoD } from '../support/HashParams.js?v=0.03';
import { appConfig } from '../../app-config.js?v=0.03';

const fetchWebmapData = fetch(
	`${appConfig.portalURL}/sharing/rest/content/items/${appConfig.webMapID}?f=json`
);

const isWebMapValid = async () => {
	try {
		const webmapData = await fetchWebmapData;
		const webmapJSON = await webmapData.json();
		if (!webmapJSON.error) {
			return true;
		}
	} catch (error) {
		const errorMessage = `error finding webmap data, ${error}`;
		throw new Error(errorMessage);
	}
};

const initView = async () => {
	return new Promise((resolve, reject) => {
		require([
			'esri/WebMap',
			'esri/views/MapView',
			'esri/layers/GraphicsLayer',
			'esri/geometry/SpatialReference',
			'esri/widgets/Search',
		], (WebMap, MapView, GraphicsLayer, SpatialReference, Search) => {
			const map = new WebMap({
				portalItem: {
					id: appConfig.webMapID,
				},
			});

			const view = new MapView({
				container: 'viewDiv',
				map: map,
				center: hashCoordinates() || appConfig.defaultMapSettings.center,
				zoom: hashLoD() || appConfig.defaultMapSettings.zoom,
				constraints: {
					snapToZoom: false,
					minZoom: appConfig.defaultMapSettings.constraints.minZoom,
				},
				popup: {
					popup: null,
					autoOpenEnabled: false,
				},
			});

			const footprintLayer = new GraphicsLayer({
				id: 'mapFootprint',
				title: 'mapFootprint',
				graphics: [],
				effect: 'drop-shadow(0px, 0px, 8px, black)',
				blendMode: 'hard-light',
				spatialReference: new SpatialReference(view.spatialReference),
			});

			const haloLayer = new GraphicsLayer({
				id: 'halo',
				title: 'halo',
				graphics: [],
				effect: 'drop-shadow(0px, 0px, 8px, black) contrast(2)',
				blendMode: 'hard-light',
				spatialReference: new SpatialReference(view.spatialReference),
			});

			const crosshairLayer = new GraphicsLayer({
				id: 'crosshair',
				title: 'crosshair',
				graphics: [],
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
						url: appConfig.searchWidget.geocodeSourceURL,
						singleLineFieldName: 'SingleLine',
						outFields: ['Addr_type'],
						name: 'World Geocoding Service',
						placeholder: appConfig.searchWidget.placeholderText,
						countryCode: appConfig.searchWidget.countryCode,
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

			resolve(view);
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
			color: 'blue',
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

export { initView, newMapCrossHair, isWebMapValid };
