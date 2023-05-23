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
		//NOTE: this is the url endpoint I'm using for this query
		// 	'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/exportImage?';
		//USE ImageryLayer now. Don't use the imageElement. You'll use a layer for every topo
		require(['esri/layers/ImageryLayer', 'esri/layers/support/MosaicRule'], (
			ImageryLayer,
			MosaicRule
		) => {
			//NOTE: I'm not a fan of this approach to finding the layer I want. Will need to look for a better method: something more sustainable.

			console.log(url);
			console.log(oid);
			// console.log(mapGeometry);

			// console.log(bbox);
			// console.log(view);

			// const wkid = view.spatialReference.wkid;

			// const boundry = {
			// 	xMin: mapGeometry.geometry.extent.xmin,
			// 	yMin: mapGeometry.geometry.extent.ymin,
			// 	xMax: mapGeometry.geometry.extent.xmax,
			// 	yMax: mapGeometry.geometry.extent.ymax,
			// };

			// const extentSize = view.size.join(', ');
			//NOTE: Do I want to use the view's sizes or do I want to use the topoImage's sizes?
			//if so you have to convert this width and height from map untis into pixels
			// const topoSize = `${mapGeometry.geometry.extent.width}, ${mapGeometry.geometry.extent.height}`;

			// const params = {
			// 	bbox: `${boundry.xMin}, ${boundry.yMin}, ${boundry.xMax}, ${boundry.yMax}`,
			// 	bboxSR: wkid,
			// 	// noData: 0,
			// 	// adjustAspectRatio: true,
			// 	size: extentSize,
			// 	imageSR: wkid,
			// 	mosaicRule: `{"mosaicMethod":"esriMosaicNone","where":"OBJECTID = ${oid}", }`,
			// 	format: 'jpgpng',
			// 	f: 'image',
			// };

			// const params = new URLSearchParams({
			// 	bbox: `${boundry.xMin}, ${boundry.yMin}, ${boundry.xMax}, ${boundry.yMax}`,
			// 	bboxSR: wkid,
			// 	// noData: 0,
			// 	// adjustAspectRatio: true,
			// 	size: extentSize,
			// 	imageSR: wkid,
			// 	mosaicRule: `{"mosaicMethod":"esriMosaicNone","where":"OBJECTID = ${oid}", }`,
			// 	format: 'jpgpng',
			// 	f: 'image',
			// });

			console.log('getting map image');
			// console.log(`${url}?${params}`);
			// const topoImageURL = `${url}?${params}`;
			// axios.get(url, { params }).then((response) => {
			// console.log(view.map.layers.items);
			// console.log(response);

			// console.log(response.request);
			// console.log(response.request.responseURL);
			// console.log(response.data.length);
			// console.log(response.data.href);

			// const imageEl = new Image();
			// imageEl.src = `data:image/png;base64,${window.btoa(response.data)}`;

			// const topoMapImage = new ImageElement({
			// 	image: `${url}?${params}`,
			// 	georeference: new ExtentAndRotationGeoreference({
			// 		extent: new Extent({
			// 			spatialReference: mapGeometry.geometry.extent.spatialReference,
			// 			xmin: mapGeometry.geometry.extent.xmin,
			// 			ymin: mapGeometry.geometry.extent.ymin,
			// 			xmax: mapGeometry.geometry.extent.xmax,
			// 			ymax: mapGeometry.geometry.extent.ymax,
			// 		}),
			// 		width: extentSize[0],
			// 		height: extentSize[1],
			// 		// content: 'imageData',
			// 		// type: 'image',
			// 	}),
			// });

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
					where: `OBJECTID = ${oid}`,
				},
				// blendMode: 'normal',
				// mosaicRule: new MosaicRule({
				// 	method: 'center',
				// 	where: `"OBJECTID = ${oid}"`,
				// }),
			});

			console.log('new imagery layer', topoMapLayer);
			resolve(topoMapLayer);
			// addTopoMap(view, topoMapImage);
			// });
		});
	});
};

export { getTopoMap, addTopoMap };
