import { createMapSlotItems } from '../UI/MapCards/ListOfMaps.js?=v0.01';

let isQuerying = true;
//NOTE: TODO: You need to seperate some of these query-calls, some of doing similar things but for a different purpose. They should be grouped together (the queries for UI, and the queries for the map items)

// TODO: Add a 'controller' to enable cancelling api requests
let controller = new AbortController();

const queryOutfields = [
	'Map_Name',
	'State',
	'Date_On_Map',
	'Map_Scale',
	// 'View_Thumbnail_Image',
	'CenterX',
	'CenterY',
	'DownloadG',
].join(',');

const debounce = (func, wait) => {
	let timer;

	return (...args) => {
		clearTimeout(timer);

		timer = setTimeout(() => func(...args), wait);
	};
};

const checkIfQuerying = (viewExtent, scalesAndYears) => {
	if (isQuerying === false) {
		isQuerying = true;
		extentQueryCall(viewExtent, scalesAndYears);
	} else {
		console.log('cancelling query');
		controller.abort();
		controller = new AbortController();
		isQuerying = true;
		extentQueryCall(viewExtent, scalesAndYears);
	}
};

const extentQueryCall = debounce(
	(viewExtent, scalesAndYears) =>
		numberOfMapsinView(viewExtent, scalesAndYears),
	1000
);

const checkToRender = (mapsList) =>
	isQuerying === false
		? (console.log('render'), createMapSlotItems(mapsList))
		: (console.log('no render'), (mapsList = []));

const extentQuery = (viewExtent, scalesAndYears, numberOfTotalMaps) => {
	isQuerying = true;
	// const controller = new AbortController();

	// controller.abort();
	console.log('query to get fist 25 maps');

	// controller.reason = 'new query attempt';

	const url =
		'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';

	//NOTE TODO: YOU WILL HAVE TO CHANGE THE 'resultRecordCount' PARAMETER. This is going to change and be a variable setting
	const params = {
		where: scalesAndYears,
		// time: `${scalesAndYears.minYear}, ${scalesAndYears.maxYear}`,
		geometry: viewExtent,
		geometryType: 'esriGeometryEnvelope',
		spatialRel: 'esriSpatialRelIntersects',
		returnGeometry: false,
		returnQueryGeometry: true,
		outFields: queryOutfields,
		// returnDistinctValues: true,
		resultOffset: 1,
		resultRecordCount: 25,
		orderByFields: 'Date_on_Map ASC, Map_Name ASC',
		f: 'json',
	};
	axios
		.get(url, { params, signal: controller.signal })
		.then((response) => {
			isQuerying = false;
			console.log(response);
			console.log(response.data.features.length);
			console.log(numberOfTotalMaps);
			const topoMapsInExtent = response.data.features;
			// console.log(topoMapsInExtent);

			let mapsList = topoMapsInExtent.map((topo) => ({
				topo,
				OBJECTID: topo.attributes.OBJECTID,
				date: topo.attributes.Date_On_Map,
				mapName: topo.attributes.Map_Name,
				mapScale: `1:${topo.attributes.Map_Scale}`,
				location: `${topo.attributes.Map_Name}, ${topo.attributes.State}`,
				thumbnail: `https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/${topo.attributes.OBJECTID}/info/thumbnail`,
				mapCenterGeographyX: topo.attributes.CenterX,
				mapCenterGeographyY: topo.attributes.CenterY,
				downloadLink: topo.attributes.DownloadG,
			}));

			// return formatQueryReturn;
			console.log(isQuerying);
			setTimeout(() => {
				!isQuerying ? checkToRender(mapsList) : (mapsList = []);
			}, 700);
		})
		.catch((error) => {
			console.log(error);
		});
};

const numberOfMapsinView = (viewExtent, scalesAndYears) => {
	console.log('querying to find total number of maps');
	isQuerying = true;
	// console.log(JSON.stringify(viewExtent));
	console.log(controller);

	const whereParam = scalesAndYears
		? `year >= ${scalesAndYears.minYear} AND year <= ${scalesAndYears.maxYear} AND map_scale >= ${scalesAndYears.minScale} AND map_scale <= ${scalesAndYears.maxScale}`
		: `year >= 1878`;

	const url =
		'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';

	const params = {
		where: whereParam,
		geometry: JSON.stringify(viewExtent),
		geometryType: 'esriGeometryEnvelope',
		spatialRel: 'esriSpatialRelIntersects',
		returnExtentOnly: true,
		returnIdsOnly: true,
		f: 'json',
	};
	axios.get(url, { params, signal: controller.signal }).then((response) => {
		// isQuerying = false;
		console.log('the ids only.');
		console.log(response);
		console.log(JSON.stringify(response.config.params.geometry));
		console.log(response.config.params.where);
		extentQuery(
			JSON.stringify(viewExtent),
			response.config.params.where,
			response.data.objectIds.length
		);
	});
};

//NOTE: do I need to export both?
export { checkIfQuerying, numberOfMapsinView };
