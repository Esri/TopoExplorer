const initMap = async () => {
	return new Promise((resolve, reject) => {
		require(['esri/WebMap'], (WebMap) => {
			//creating a webmap object
			const map = new WebMap({
				portalItem: {
					id: '2e8a3ccdfd6d42a995b79812b3b0ebc6',
				},
				layers: [],
			});

			//once webmap is successfully loaded, resolve the promise
			map.load().then(resolve(map));
		});
	});
};

export { initMap };
