const addTopoMap = (view, topoMap) => {
	// const topoLayer = view.map.layers.items[1];

	console.log('adding topo layer >>>' + new Date().getTime(), topoMap);

	console.log('adding topo layer >>>', view?.center.toJSON());
	// console.log('trying to add', topoLayer);
	// topoLayer.source.elements.add(image);
	// view.map.layers.add(topoMap);
	view.map.add(topoMap);
};

// const removeTopoMapFromLayer = (view, oid) => {
// 	console.log('trying to remove', oid);

// 	const addedLayers = view.map.layers.items;

// 	const specificTopo = addedLayers.find((imageTopo) => {
// 		if (imageTopo.id === oid) {
// 			return imageTopo;
// 		}
// 	});

// 	console.log('this is the image we are removing,', specificTopo);
// 	view.map.remove(specificTopo);
// };

const getTopoMap = (oid, url) => {
	return new Promise((resolve, reject) => {
		require(['esri/layers/ImageryLayer', 'esri/layers/support/MosaicRule'], (
			ImageryLayer,
			MosaicRule
		) => {
			const topoMapLayer = new ImageryLayer({
				id: oid,
				url: url,
				// definitionExpression: `"where":"OBJECTID = ${oid}"`,
				// customParameters: {
				// 	bbox: `${boundry.xMin}, ${boundry.yMin}, ${boundry.xMax}, ${boundry.yMax}`,
				// 	bboxSR: wkid,
				// 	size: extentSize,
				// 	imageSR: wkid,
				// 	f: 'json',

				// 	// format: 'jpgpng',
				// },
				// format: 'jpgpng',
				mosaicRule: {
					mosaicMethod: 'LockRaster',
					lockRasterIds: [oid],
					where: `OBJECTID = ${oid}`,
				},
				// blendMode: 'normal',
				// mosaicRule: new MosaicRule({
				// 	method: 'center',
				// 	where: `"OBJECTID = ${oid}"`,
				// }),
			});

			// console.log('new imagery layer', topoMapLayer);
			resolve(topoMapLayer);
			// addTopoMap(view, topoMapImage);
			// });
		});
	});
};

export { getTopoMap, addTopoMap };
