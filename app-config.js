const appConfig = {
	//If registering this application with ArcGIS you'll use the appID, 'TopoExplorer' is the appId for this esri application.
	appId: 'TopoExplorer',

	//================================================================================
	//Default basemap for the app
	//the basemap for the app uses the type 'webmap' and relies on the webmapID, an ArcGIS Online item ID
	webMapID: '710264327ad24ff5ba996e2a7c773b7f',

	//================================================================================
	//Default settings for the webmap when the app loads.
	//the center coordinates are longitude, latitude
	defaultMapSettings: {
		center: [-98.5357, 40.1549],
		zoom: 4,
		constraints: {
			minZoom: 3,
		},
	},

	//================================================================================
	//countryCode for the search widget. Uses a country code to limit search results to that specific country. country ISO codes as described in the ISO 3166 international standard.
	// The default is the United States. If left empty, the search widget will provide suggestions from around the world.
	countryCode: 'US',
	//================================================================================

	enableBasemapToggleElement: true,
	//================================================================================
	imageServerURL:
		// 'https://utility.arcgis.com/usrsvcs/servers/88d12190e2494ce89374311800af4c4a/rest/services/USGS_Historical_Topographic_Maps/ImageServer',
		'https://www.ocgis.com/arcpub/rest/services/Historic_Imagery/Historic_Imagery/ImageServer/',

	//================================================================================
	//Query parameters for the image service
	whereStatement: '1=1',
	spatialRelation: 'esriSpatialRelIntersects',
	geometryPointType: 'esriGeometryPoint',
	queryReturnFormat: 'json',
	imageThumbnailEndpoint: '/info/thumbnail',
	//message to use as placeholder on the mapCard for unavailable information from the service.
	unavailableInformationString: 'unavailable',
	//================================================================================
	//fields to be included in the image services query.
	//if you do not need an outfield, or if the outfield doesn't apply to your service, use can comment it out or use 'null' or 'False' and those fields will not be included in the query
	outfields: {
		objectId: 'OBJECTID',
		//name of the map displayed on the card
		//This name will also be paired with the location name (if available), and added to the subtitle of the mapCard
		//Additionally, this field will determine how those maps are sorted when sorted alphabetically (A-Z or Z-A)
		mapName: 'Map_Name',
		// mapName: 'Name',
		//General area where the map is located, this will be paired with the maps, name and presented as a subtitle for the mapCard.
		// mapLocation: 'State',
		//Year of the map's printing. Appears on the map card as the 'revision' or 'Rev' year. The expected value type of this field is a Number.
		// publicationYear: 'Imprint_Year',
		//the dateCurrent value is tied to the years slider filter. The years slider expects an integer value when instantiating.
		//this value is also rendered on the mapCard
		dateCurrent: 'DateCurrent',
		//scales of the maps in the service. This value is rendered on the map cards.
		//The mapScale value is tied to the 'scales' slider filter. The scales slider expects an integer value when instantiating.
		mapScale: false,
		// mapScale: 'Map_Scale',
		//download for the map....this comment is false
		// mapDownloadLink: 'DownloadG',
		//the following outfield  are related to hover/tooltip information for the maps
		//the tooltip can be turned off. If so, these fields should be commented out or set to false.
		// surveyYear: 'Survey_Year',
		// photoYear: 'Aerial_Photo_Year',
		// photoRevisionYear: 'Photo_Revision',
		// fieldCheckYear: 'Field_Check_Year',
		// projection: 'Projection',
		// datum: 'Datum',
		// citation: 'Citation',
	},
	//================================================================================
	//if your service provides a download link for an image, keep this true (make sure the mapDownloadLink outfield is correct, too). If you want to remove the download icon, set this to 'false'
	enableImageDownloads: true,
	//================================================================================
	//date and scale sliders
	enableSliders: true,
	enableTimeFilterSlider: true,
	enableScaleFilterSlider: false,
	//================================================================================
	//range of the animation speeds, in milliseconds.
	animationSpeeds: [3000, 2000, 1000, 800, 700, 500, 400, 300, 200],
	//================================================================================
	//Tooltip controls for the mouse-over event in the map card
	//when false, does not render the info icon (the tooltip) on the map cards
	enableCardTooltip: true,
	//================================================================================
	//info modal
	//controls whether or not an info icon to open will be rendered to the side bar
	enableInfoModal: true,
	//the text that will populate for the app's info modal. If value is null/false, text will default to the Topo explorer's
	informationParagraph: '',
	//================================================================================
	//ArcGIS Online user authentication
	//If you want to tie your application to an ArcGIS Online account or company portal on AcrGis Online and allow the user to export maps to their account.
	enablePortalAuthentication: true,
	//================================================================================
	//App Header
	//modifies the title of the application in the header section of the sidebar. The default Header is 'Historical Topo Map Explorer'
	appHeaderName: '',
	//changes the name of the tab in the browser. This string will also be used as the app's name.
	appTitleName: 'Historical Topo Map Explorer',
	//the color of the sidebar header, where the title and imgs are located. It's default color is '#ABB4C2'
	appHeaderColor: '#ABB4C2',
	//these imgs will append in the sidebar, next to the appHeaderName. The src location for these images are in the public/image folder
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
	//================================================================================
	//map export settings
	//These tags will be added to the exported maps tags field in ArcGIS online.
	tags: ['Living Atlas', 'USGS', 'Topographic', 'Topo', 'Quad'],
	//if you want to make your exported ArcGIS online map time enabled, set this value to 'true'.
	timeEnableExport: false,
};

export { appConfig };
