import { appConfig } from '../../../app-config.js?v=0.03';

const mapFootprintOutline = 2;

const mapFootprint = (mapCardID, geometry) => {
	return new Promise((resolve, reject) => {
		require(['esri/layers/GraphicsLayer', 'esri/Graphic'], function (
			GraphicsLayer,
			Graphic
		) {
			const mapOutline = JSON.parse(geometry);

			const footprintPolygon = {
				type: 'polygon',
				rings: mapOutline.rings,
				spatialReference: mapOutline.spatialReference,
			};

			const footprintFill = {
				type: 'cim',
				data: {
					type: 'CIMSymbolReference',
					symbol: {
						type: 'CIMPolygonSymbol',
						symbolLayers: [
							{
								type: 'CIMSolidStroke',
								enable: true,
								capStyle: 'Round',
								joinStyle: 'Round',
								lineStyle3D: 'Strip',
								miterLimit: 10,
								width: 2.65,
								color: appConfig.hoverHighlightBorderColor,
							},
							{
								type: 'CIMHatchFill',
								enable: true,
								lineSymbol: {
									type: 'CIMLineSymbol',
									symbolLayers: [
										{
											type: 'CIMSolidStroke',
											enable: true,
											capStyle: 'Butt',
											joinStyle: 'Miter',
											lineStyle3D: 'Strip',
											miterLimit: 10,
											width: 1,
											color: appConfig.hoverHighlightFillColor,
										},
									],
								},
								rotation: 45,
								separation: 30,
							},
							{
								type: 'CIMSolidFill',
								color: [153, 153, 153, 0],
							},
						],
					},
				},
			};

			const mapFootprintGraphic = new Graphic({
				geometry: footprintPolygon,
				symbol: footprintFill,
				attributes: {
					id: mapCardID,
				},
			});

			resolve(mapFootprintGraphic);
		});
	});
};

const mapHalo = (mapCardID, geometry) => {
	return new Promise((resolve, reject) => {
		require(['esri/Graphic'], function (Graphic) {
			const mapOutline = JSON.parse(geometry);

			const haloPolygon = {
				type: 'polygon',
				rings: mapOutline.rings,
				spatialReference: mapOutline.spatialReference,
			};

			const haloFill = {
				type: 'simple-fill',
				color: appConfig.mapImageFillColor,
				outline: {
					color: appConfig.mapImageBorderColor,
					width: mapFootprintOutline,
				},
			};

			const mapHaloGraphic = new Graphic({
				geometry: haloPolygon,
				symbol: haloFill,
				attributes: {
					id: mapCardID,
				},
			});

			resolve(mapHaloGraphic);
		});
	});
};
export { mapFootprint, mapHalo };
