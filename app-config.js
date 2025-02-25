const appConfig = {
	//APPID
	//If registering this application with ArcGIS you'll use the appID. 'TopoExplorer' is the appId for this esri application. Do not use 'TopoExplorer' for your on AppId.
	appId: 'TopoExplorer',
	portalURL: 'https://www.arcgis.com/',

	//================================================================================
	//BASEMAP
	//Make sure the basemap for the app is a 'webmap' type.
	//The default webmap is an ArcGIS Online item.
	webMapID: 'a9a0ab48db1b4691adfa62cc5775de74',

	//================================================================================
	//Default settings for the webmap when the app loads.
	//the default webmap uses a web mercator spatial reference, so the center coordinates are longitude, latitude.
	defaultMapSettings: {
		center: [-98.5357, 40.1549],
		zoom: 4,
		constraints: {
			minZoom: 3,
		},
	},
	//================================================================================
	// SEARCHWIDGET
	//geocode service URL
	searchWidget: {
		geocodeSourceURL:
			'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
		//countryCode for the search widget. Uses a country code to limit search results to that specific country. country ISO codes as described in the ISO 3166 international standard.
		// The default is the United States. If left empty, the search widget will provide suggestions from around the world.
		countryCode: 'US',
		placeholderText: 'Find address or place',
	},
	//================================================================================
	//BASEMAP LAYER TOGGLE.
	enableBasemapToggleElement: true,
	//If enabling this feature, please provide the id of the desired layer(s) in the webmap and include the name for that layer in the toggle element (the layerId).
	webmapLayersForToggleElement: [
		{
			layerId: '10df2279f9684e4a9f6a7f08febac2a9',
			layerTitle: 'Satellite',
		},
		{
			layerId: '65605d0db3bd4067ad4805a81a4689b8',
			layerTitle: 'Labels',
		},
		{
			layerId: '1b243539f4514b6ba35e7d995890db1d',
			layerTitle: 'Terrain',
		},
	],

	//================================================================================
	//REST ENDPOINT and URL PARAMS
	//URL for the image service that will contain the image collection for the application.
	imageServerURL: '',
	// 'https://www.ocgis.com/arcpub/rest/services/Historic_Imagery/Historic_Imagery/ImageServer/',

	//where clause for the query
	whereStatement: '1=1',
	//the URL endpoint for the thumbnails images
	imageThumbnailEndpoint: '/info/thumbnail',
	//message to use as placeholder on the mapCard for unavailable information from the service.
	unavailableInformationString: 'unavailable',
	//================================================================================
	//fields to be included in the image services query.
	//These must match the attribute field names in the image service table.
	//Unneeded fields can be commented out or contain 'null' or 'false'
	outfields: {
		//the following fields
		requiredFields: {
			//The object id of the image -- DO NOT modify this field.
			objectId: 'OBJECTID',
			//Name of the image.
			//This field also determines how these images are sorted when sorted alphabetically (A-Z or Z-A)
			//Will be displayed on the card in both the title and, if 'mapLocation' is being used, the subtitle .
			mapName: 'Map_Name',
			//Name of the image's location.
			// Will be combined with the 'mapName' value and displayed as the subtitle for the mapCard.
			mapLocation: 'State',
			//date of image. Number value (YYYY format)
			//This value is tied to the years slider filter.
			//Appears on the mapCard
			dateCurrent: 'DateCurrent',
			//Map Scale of the image. Number value (#,### format)
			//The mapScale value is tied to the 'scales' slider filter.
			//Appears on the mapCard
			mapScale: 'Map_Scale',
			//download link for the map.
			// If this is set to false or commented out, the download btn will not render
			mapDownloadLink: 'DownloadG',
		},
		optionalFields: {
			//Year of the map's printing. Number value (YYYY format).
			// Appears on the map card as the 'publication' year.
			publicationYear: 'Imprint_Year',
			//Tooltip contents
			//The tooltip can be turned off. If so, these fields can be commented out or set to false.
			surveyYear: 'Survey_Year',
			photoYear: 'Aerial_Photo_Year',
			photoRevisionYear: 'Photo_Revision_Year',
			fieldCheckYear: 'Field_Check_Year',
			projection: 'Projection',
			datum: 'Datum',
			citation: 'Citation',
		},
	},
	//================================================================================
	//if your service provides a download link for the image, keep this true.
	// Relies on the 'mapDownloadLink' value.
	enableImageDownloads: true,
	//================================================================================
	//date and scale sliders.
	//sliders expect number values.
	enableSliders: true,
	enableTimeFilterSlider: true,
	enableScaleFilterSlider: true,
	//================================================================================
	//ANIMATION
	//range of the animation speeds, in milliseconds.
	animationSpeeds: [3000, 2000, 1000, 800, 700, 500, 400, 300, 200],
	//================================================================================
	//TOOLTIP
	//when false, does not render the info icon (for the tooltip) on the map cards
	enableCardTooltip: true,
	//================================================================================
	//INFO MODAL
	//controls whether or not an info icon for the info modal will be rendered.
	enableInfoModal: true,
	//the text that will populate for the app's info modal. If value is null/false, text will default to the Topo explorer's text.
	informationParagraph: '',
	//================================================================================
	//OAUTH2 USER AUTHENTICATION
	//If you want to tie your application to an ArcGIS Online account or company portal on AcrGis Online and allow the user to export maps to their account.
	enablePortalAuthentication: true,
	//================================================================================
	//MAP STYLES
	//image card mouseover highlight border color. Expects a RGBA value.
	hoverHighlightBorderColor: [255, 255, 255, 255],
	//image card mouseover  highlight fill color. Expects a RGBA value
	hoverHighlightFillColor: [255, 255, 255, 160],
	//image border color. Expects a hex or color value.
	mapImageBorderColor: '#FFFFFF',
	//image background fill color. Expects a hex or color value.
	mapImageFillColor: '#7f7f7f',

	//================================================================================
	//APP HEADER
	//Header for the app.
	//Default name is 'Historical Topo Map Explorer'
	appHeaderName: '',
	//Changes the name of the tab in the browser.
	appTitleName: 'Historical Topo Map Explorer',
	//Color of the sidebar header.
	appHeaderColor: '#ABB4C2',
	//these imgs will append in the sidebar, next to the appHeaderName. The src location for these images are in the "public/images" folder.
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
	//MAP EXPORT SETTINGS
	//Tags added to the exported image, ArcGIS Online field.
	tags: ['Living Atlas', 'USGS', 'Topographic', 'Topo', 'Quad'],
	//if you want to make your exported ArcGIS online map time enabled, set this value to 'true'.
	timeEnableExport: false,
};

export { appConfig };
