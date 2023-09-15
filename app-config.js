const config = {
	productionEnv: {
		appId: '',
		apiKey:
			'AAPKe259b9f8cc57489cb0533ceb6da4b459DGbL3xnlg-YC7ah0DSbIB_1bJzAnUIegpFFBoigwoOvqAHj4aVreEZWdTaR28PEW',
		webMap: {},
		serviceUrls: {
			historicalTopoImageService:
				'https://utility.arcgis.com/usrsvcs/servers/88d12190e2494ce89374311800af4c4a/rest/services/USGS_Historical_Topographic_Maps/ImageServer',
		},
	},
	developmentEnv: {
		appId: 'KZAK9DITO38X2SXM',
		apiKey:
			'AAPKe259b9f8cc57489cb0533ceb6da4b459DGbL3xnlg-YC7ah0DSbIB_1bJzAnUIegpFFBoigwoOvqAHj4aVreEZWdTaR28PEW',
		webMap: {},
		serviceUrls: {
			historicalTopoImageService:
				'https://utility.arcgis.com/usrsvcs/servers/88d12190e2494ce89374311800af4c4a/rest/services/USGS_Historical_Topographic_Maps/ImageServer',
		},
	},
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
