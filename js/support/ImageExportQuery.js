const getTopoMap = (oid, url) => {
	return new Promise((resolve, reject) => {
		require(['esri/layers/ImageryLayer'], (
			ImageryLayer
			// MosaicRule
		) => {
			const topoMapLayer = new ImageryLayer({
				id: oid,
				url: url,

				mosaicRule: {
					mosaicMethod: 'LockRaster',
					lockRasterIds: [oid],
					where: `OBJECTID = ${oid}`,
				},
			});

			resolve(topoMapLayer);
		});
	});
};

export { getTopoMap };
