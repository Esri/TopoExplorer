const productionEnv = {
	appId: 'Tq1LTry7bEQeemat',
	webMap: {
		webMapItemId: 'a9a0ab48db1b4691adfa62cc5775de74',
		webMapLayers: {
			worldHillshade: '1b243539f4514b6ba35e7d995890db1d',
			worldImagery: '10df2279f9684e4a9f6a7f08febac2a9',
			outdoorLabels: '65605d0db3bd4067ad4805a81a4689b8',
		},
	},
	serviceUrls: {
		historicalTopoImageService:
			'https://utility.arcgis.com/usrsvcs/servers/88d12190e2494ce89374311800af4c4a/rest/services/USGS_Historical_Topographic_Maps/ImageServer',
	},
};

const developmentEnv = {
	appId: 'KZAK9DITO38X2SXM',
	webMap: {
		webMapItemId: '710264327ad24ff5ba996e2a7c773b7f',
		webMapLayers: {
			worldHillshade: '1b243539f4514b6ba35e7d995890db1d',
			worldImagery: '10df2279f9684e4a9f6a7f08febac2a9',
			outdoorLabels: '65605d0db3bd4067ad4805a81a4689b8',
		},
	},
	serviceUrls: {
		historicalTopoImageService:
			'https://utility.arcgis.com/usrsvcs/servers/88d12190e2494ce89374311800af4c4a/rest/services/USGS_Historical_Topographic_Maps/ImageServer',
	},
};

const config = {
	environment: '',
	defaultMapSettings: {
		center: [-98.5357, 40.1549],
		zoom: 4,
		constraints: {
			minZoom: 4,
		},
	},
	spatialRefernce: {
		wkid: 102100,
		latestWkid: 3857,
	},
};

window.location.host === 'livingatlas.arcgis.com'
	? (config.environment = productionEnv)
	: (config.environment = developmentEnv);

export { config };
