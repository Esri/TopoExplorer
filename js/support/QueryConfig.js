import {
	findMinYear,
	findMaxYear,
	findMinScale,
	findMaxScale,
} from './GetAllMapScalesAndYears.js?v=0.01';
import { numberOfMapsinView, extentQuery } from './Query.js?v=0.01';
import { getTopoMap, addTopoMap } from './ImageExportQuery.js?v=0.01';
import {
	hideMapCount,
	updateMapcount,
	showSpinnerIcon,
	hideSpinnerIcon,
} from './MapCount.js?v=0.01';
import {
	clearMapsList,
	createMapSlotItems,
} from '../UI/MapCards/ListOfMaps.js?v=0.01';
// import { addTopoMap } from './ImageExportQuery';
// import { checkIfQuerying } from './Query.js?v=0.01';

const url =
	'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer';
let whereStatement = 'year >= 1878';

const objectId = 'ObjectID';
const mapName = 'Map_Name';
const mapState = 'State';
const mapYear = 'Imprint_Year';
const mapScale = 'Map_Scale';
const mapCenterX = 'CenterX';
const mapCenterY = 'CenterY';
const mapDownloadLink = 'DownloadG';

//This isn't exactly pretty, but it's a first step in moving this information
const getMinYear = findMinYear(`${url}/query`);
const getMaxYear = findMaxYear(`${url}/query`);
const getMinScale = findMinScale(`${url}/query`);
const getMaxScale = findMaxScale(`${url}/query`);

const renderTopoMap = (view, oid, mapGeometry) => {
	getTopoMap(url, view, oid, mapGeometry).then((topoMapImage) => {
		addTopoMap(view, topoMapImage);
	});
};

const removeTopoMap = (view, oid) => {
	console.log('said to remove');

	removeTopoMapFromLayer(view, oid);
};

//NOTE: I think I can move this OBJ into a different module...remember this when building out the sort Module.
//Can definitely be moved to a different module. Just like the year & scale
const sortOptions = {
	onlyYear: `${mapYear} ASC`,
	oldestToNewest: `${mapYear} ASC, ${mapName} ASC, ${mapScale} ASC`,
	newestToOldest: `${mapYear} DESC, ${mapName} ASC, ${mapScale} ASC`,
	largeScaleToSmallScale: `${mapScale} DESC, ${mapName} ASC, ${mapYear} ASC`,
	smallScaleToLargeScale: `${mapScale} ASC, ${mapName} ASC, ${mapYear} ASC`,
	AZ: `${mapName} ASC, ${mapYear} ASC, ${mapScale} ASC`,
	ZA: `${mapName} DESC, ${mapYear} ASC, ${mapScale} ASC`,
};
//NOTE: this could be moved to a different module.
const yearsAndMapScales = {
	years: {
		allYears: [],
		minYear: '',
		maxYear: '',
	},
	scales: {
		allScales: [],
		minScale: '',
		maxScale: '',
	},
	setMinMaxYears: function (years) {
		return (
			(this.years.allYears = years),
			(this.years.minYear = years[0]),
			(this.years.maxYear = years[years.length - 1])
		);
	},
	updateMinYear: function (sliderPosition) {
		console.log(sliderPosition);
		console.log(this);
		this.years.minYear = this.years.allYears[sliderPosition];
		updateWhereStatement();
	},
	updateMaxYear: function (sliderPosition) {
		console.log(sliderPosition);
		this.years.maxYear = this.years.allYears[sliderPosition];
		updateWhereStatement();
	},
	setMinMaxMapScales: function (mapScales) {
		return (
			(this.scales.allScales = mapScales),
			(this.scales.minScale = mapScales[0]),
			(this.scales.maxScale = mapScales[mapScales.length - 1])
		);
	},
	updateMinScale: function (sliderPosition) {
		this.scales.minScale = this.scales.allScales[sliderPosition];
		updateWhereStatement();
	},
	updateMaxScale: function (sliderPosition) {
		this.scales.maxScale = this.scales.allScales[sliderPosition];
		updateWhereStatement();
	},
};

const updateWhereStatement = () => {
	queryConfig.where = `year >= ${yearsAndMapScales.years.minYear} AND year <= ${yearsAndMapScales.years.maxYear} AND map_scale >= ${yearsAndMapScales.scales.minScale} AND map_scale <= ${yearsAndMapScales.scales.maxScale}`;
};

const queryConfig = {
	url: `${url}/query`,
	mapView: '',
	where: whereStatement,
	geometry: '',
	spatialRelation: 'esriSpatialRelIntersects',
	queryOutfields: [
		objectId,
		mapName,
		mapState,
		mapYear,
		mapScale,
		mapCenterX,
		mapCenterY,
		mapDownloadLink,
	].join(','),
	sortChoice: sortOptions.onlyYear,
	resultOffset: 0,
	resultRecordCount: 25,
	totalMaps: 0,
	totalMapsInExtentParams: function () {
		return {
			where: this.where,
			geometry: this.geometry,
			geometryType: 'esriGeometryEnvelope',
			spatialRel: this.spatialRelation,
			returnCountOnly: true,
			f: 'json',
		};
	},
	mapDataParams: function () {
		return {
			where: this.where,
			geometry: this.geometry,
			geometryType: 'esriGeometryEnvelope',
			spatialRel: this.spatialRelation,
			returnGeometry: true,
			// returnQueryGeometry: true,
			outFields: this.queryOutfields,
			resultOffset: this.resultOffset,
			resultRecordCount: this.resultRecordCount,
			// NOTE: for the time-being we will not be using 'orderByFields'. This is to see how including 'OrderBy' can effect query-time.
			orderByFields: this.sortChoice,
			f: 'json',
		};
	},
	queryMapData: function () {
		extentQuery(this.url, this.mapDataParams())
			.then((response) => {
				console.log(response);
				return (this.topoMapsInExtent = response.data.features);
			})
			.then((listOfTopos) => {
				return this.processMapData(listOfTopos);
			})
			.then((mapsList) => {
				createMapSlotItems(mapsList, this.mapView, url);
				hideSpinnerIcon();
			})
			.then(() => {
				this.resultOffset = this.resultOffset + this.resultRecordCount;
				console.log(this.resultOffset);
				// if (this.resultRecordCount !== 25) {
				// this.resultOffset = this.resultRecordCount;
				// this.resultOffset = this.resultOffset + this.resultRecordCount;
				// }
				return;
			});
	},
	getNewMaps: function () {
		//TODO: these two 'result' changes should be put together in a seperate function
		if (this.resultOffset !== 0) {
			console.log('resetting');
			(this.resultOffset = 0), (this.resultRecordCount = 25);
		}

		clearMapsList(),
			showSpinnerIcon(),
			hideMapCount(),
			numberOfMapsinView(this.url, this.totalMapsInExtentParams())
				.then((response) => {
					console.log(response);
					this.totalMaps = response.data.count;
					// console.log(this.totalMaps);
				})
				.then(() => {
					updateMapcount(this.totalMaps);
				})
				.then(() => {
					this.queryMapData();
				});
	},
	checkAvailableNumberOfMaps: function () {
		if (this.resultOffset === 0) {
			this.resultOffset = this.resultRecordCount;
		}

		if (
			this.resultOffset === this.totalMaps ||
			this.resultOffset > this.totalMaps
		) {
			console.log('no query should be running');
			return;
		} else if (this.resultOffset + this.resultRecordCount >= this.totalMaps) {
			showSpinnerIcon();
			console.log('equal to');
			this.resultRecordCount = this.totalMaps - this.resultOffset;

			this.queryMapData();
		} else if (this.resultOffset + this.resultRecordCount <= this.totalMaps) {
			showSpinnerIcon();
			// this.resultOffset = this.resultOffset + this.resultRecordCount;
			this.queryMapData();
		}

		// console.log('checking resultOffset', this.resultOffset);
		// console.log(
		// 	'checking resultRecords to be returned',
		// 	this.resultRecordCount
		// );
	},
	topoMapsInExtent: [],
	processMapData: function () {
		console.log;
		return this.topoMapsInExtent.map((topo) => ({
			topo,
			OBJECTID: topo.attributes.OBJECTID,
			date: topo.attributes[mapYear],
			mapName: topo.attributes.Map_Name,
			mapScale: `1:${topo.attributes.Map_Scale.toLocaleString()}`,
			location: `${topo.attributes.Map_Name}, ${topo.attributes.State}`,
			thumbnail: `${url}/${topo.attributes.OBJECTID}/info/thumbnail`,
			mapCenterGeographyX: topo.attributes.CenterX,
			mapCenterGeographyY: topo.attributes.CenterY,
			downloadLink: topo.attributes.DownloadG,
			mapBoundry: topo.geometry,
		}));
	},
	setGeometry: function (locationData) {
		console.log(locationData);
		return (queryConfig.geometry = JSON.stringify(locationData));
	},
	setSortChoice: function (choiceValue) {
		console.log('this is the choice for sorting', this.sortChoice);
		return (this.sortChoice = sortOptions[choiceValue]);
	},
	extentQueryCall: function () {
		extentQueryCall(this.url, this.totalMapsInExtentParams());
	},
};

const debounce = (func, wait) => {
	let timer;

	return (...args) => {
		clearTimeout(timer);

		timer = setTimeout(() => func(...args), wait);
	};
};

const extentQueryCall = debounce((url, totalMapsInExtentParams) => {
	queryConfig.getNewMaps(url, totalMapsInExtentParams), 1000;
});

export {
	queryConfig,
	yearsAndMapScales,
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
	renderTopoMap,
	removeTopoMap,
};
