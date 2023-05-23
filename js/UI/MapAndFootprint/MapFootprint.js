const mapFootprintOutline = 2;

const mapFootprint = (geometry) => {
	return new Promise((resolve, reject) => {
		require(['esri/layers/GraphicsLayer', 'esri/Graphic'], function (
			GraphicsLayer,
			Graphic
		) {
			// console.log(geometry);
			// console.log(JSON.parse(geometry));
			const mapObj = JSON.parse(geometry);
			// console.log(mapObj.mapBoundry);
			const mapOutline = mapObj.mapBoundry;
			// console.log(mapOutline);
			// // console.log(geometry.rings);
			// console.log(JSON.parse(geometry));
			// console.log(mapOutline.rings);

			// console.log(JSON.stringify(geometry[0]));

			const footprintPolygon = {
				type: 'polygon',
				rings: mapOutline.rings,
				spatialReference: mapOutline.spatialReference,
			};

			const footprintFill = {
				type: 'simple-fill',
				color: '#7f7f7f',
				outline: {
					color: '#FFFFFF',
					width: mapFootprintOutline,
				},
			};

			const mapFootprintGraphic = new Graphic({
				geometry: footprintPolygon,
				symbol: footprintFill,
				attributes: {
					id: mapObj.OBJECTID,
				},
			});

			// const mapFootprintLayer = new GraphicsLayer({
			// 	graphics: [mapFootprintGraphic],
			// });

			resolve(mapFootprintGraphic);
		});
	});
};
export { mapFootprint };
