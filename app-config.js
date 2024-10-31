const configurables = {
	//Register your app with your own APP ID
	appId: 'TopoExplorer',
	//================================================================================
	//Default basemap and  initial settings
	//the basemap for the app uses the type 'webmap' and relies on the webmapID, an ArcGIS Online item ID
	webMapID: '710264327ad24ff5ba996e2a7c773b7f',
	defaultMapSettings: {
		center: [-98.5357, 40.1549],
		zoom: 4,
		constraints: {
			minZoom: 3,
		},
	},
	//spatial reference for the webmap
	spatialReference: {
		wkid: 123456,
		latestWkid: 3857,
	},
	//================================================================================
	//supplemental map layers to toggle on the map view
	//these layers rely on a name for the layer's checkbox and their item ID for initialization
	webMapLayers: {
		terrainLayer: {
			labelName: 'terrain',
			mapItemId: '1b243539f4514b6ba35e7d995890db1d',
		},
		satelliteLayer: {
			labelName: 'satellite',
			mapItemId: '10df2279f9684e4a9f6a7f08febac2a9',
		},
		labelLayer: {
			labelName: 'labels',
			mapItemId: '65605d0db3bd4067ad4805a81a4689b8',
		},
	},
	//================================================================================
	//image service URL endpoint and query parameters
	imageServerURL:
		'https://historical1-stg.arcgis.com/arcgis/rest/services/USA_Historical_Topographic_Maps/ImageServer',
	whereStatement: 'Date_On_Map >= 1879',
	//if you do not need an outfield, or if the outfield doesn't apply to a service, use null or False
	outfields: {
		objectId: 'ObjectID',
		//name of the map displayed on the card
		mapName: 'Map_Name',
		//state where the map is located
		mapState: 'State',
		//Year of the map's printing
		mapYear: 'Imprint_Year',
		//Year of the map's original publication
		dateOnMap: 'Date_On_Map',
		//UTC date time
		dateCurrent: 'DateCurrent',
		//scale of the map
		mapScale: 'Map_Scale',
		//download for the
		mapDownloadLink: 'DownloadG',
		//the following outfield keys are related to hover/tooltip information for the maps
		surveyYear: 'Survey_Year',
		photoYear: 'Aerial_Photo_Year',
		photoRevisionYear: 'Photo_Revision',
		fieldCheckYear: 'Field_Check_Year',
		projection: 'Projection',
		datum: 'Datum',
		citation: 'Citation',
	},
	//The spatial reference of the input geometry for the query
	inSR: 4326,
	spatialRelation: 'esriSpatialRelIntersects',
	geometryPointType: 'esriGeometryPoint',
	queryReturnFormat: 'json',
	imageThumbnailEndpoint: '/info/thumbnail',
	//messages for unavailable information
	unavailableInformationString: 'unavailable',
	//================================================================================
	//range of the animation speeds, these are in milliseconds between frames
	animationSpeeds: [3000, 2000, 1000, 800, 700, 500, 400, 300, 200],
	//================================================================================
	//Tooltip controls for the mouse-over event in the map card
	//when false, does not render the info icon on the map cards
	enableTooltip: true,
	//================================================================================
	//info modal
	//controls whether or not an info icon will be rendered to the side bar
	enableInfoModal: true,
	//the text that will populate for the app's info modal. If value is null/false, text will default to the Topo explorer's
	informationParagraph: '',
	//================================================================================
	//ArcGIS Online user authentication
	//If you want to tie your application to an ArcGIS Online account or company portal and allow the user to export maps to their account.
	enablePortalAuthentication: true,
	//================================================================================
	//App Header
	//modifies the title of the application in the header section of the sidebar. The default Header is 'Historical Topo Map Explorer'
	appHeaderName: '',
	//changes the name of the tab in the browser
	appTitleName: 'Topo Map Explorer',
	//the color of the sidebar header, where the title and imgs are located. It's default color is '#ABB4C2'
	appHeaderColor: null,
	//these imgs will append to the sidebar, next to the appHeaderName
	headerLogoImgs: [
		{
			imageSrc: './public/images/usgs_logo.png',
			altText: 'United States Geological Survey Logo',
		},
		{
			imageSrc: './public/images/esri-10GlobeLogo_1CRev.png',
			altText: 'esri Logo',
		},
	],
};

export { configurables };
