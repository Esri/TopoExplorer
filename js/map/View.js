// import { mapFootprint } from '../UI/MapAndFootprint/MapFootprint';

const initView = async () => {
	return new Promise((resolve, reject) => {
		//creating the view object and incorporating map.
		require([
			'esri/WebMap',
			'esri/views/MapView',
			'esri/layers/GraphicsLayer',
			'esri/layers/ImageryLayer',
			'esri/geometry/Extent',
			'esri/geometry/SpatialReference',
			'esri/widgets/Search',
			'esri/core/reactiveUtils',
		], (
			WebMap,
			MapView,
			GraphicsLayer,
			ImageryLayer,
			Extent,
			SpatialReference,
			Search,
			reactiveUtils
		) => {
			const footprintLayer = new GraphicsLayer({
				id: 'mapFootprint',
				title: 'mapFootprint',
				graphics: [],
				effect: 'drop-shadow(0px, 0px, 8px, black) contrast(2)',
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

			// const topoMapLayer = new ImageryLayer({
			// 	id: 'topoMaps',
			// 	title: 'topoMaps',
			// 	// fields: [],
			// 	blendMode: 'normal',
			// });

			// const topoMapLayer = new ImageryLayer({
			// 	id: 'topoMap',
			// 	title: 'topoMap',
			// 	url: '',
			// });

			const map = new WebMap({
				portalItem: {
					id: '2e8a3ccdfd6d42a995b79812b3b0ebc6',
				},
				layers: [footprintLayer, haloLayer],
			});

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
				layerView: [],
				extent: new Extent(extentOption[random()]),
			});

			const searchWidget = new Search({
				view: view,
				resultGraphicEnabled: false,
				popupEnabled: false,
				includeDefaultSources: true,
				countryCode: 'US',
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
