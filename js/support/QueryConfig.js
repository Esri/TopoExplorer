import { numberOfMapsinView, extentQuery } from './Query.js?v=0.01';
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

//NOTE: I think I can move this OBJ into a different module...remember this when building out the sort Module.
const sortOptions = {
	oldestYearThenAzThenSmallestScale: `${mapYear} ASC, Map_Name ASC, Map_Scale ASC`,
	newestYearThenAzThenSmallestScale: `${mapYear} DESC, Map_Name ASC, Map_Scale ASC`,
	largestScaleYearThenAzThenOldest: `Map_Scale ASC, Map_Name ASC, ${mapYear} ASC,`,
	smallestScaleYearThenAzThenNewest: `Map_Scale ASC, Map_Name ASC, ${mapYear} DESC`,
	azOldestYearSmallestScale: `Map_Name ASC, ${mapYear} ASC, Map_Scale ASC`,
	zaOldestYearSmallestScale: `Map_Name DESC, ${mapYear} ASC, Map_Scale ASC`,
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
	where: whereStatement,
	geometry: '',
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
	resultOffset: 0,
	resultRecordCount: 25,
	totalMaps: 0,
	totalMapsInExtentParams: function () {
		return {
			where: this.where,
			geometry: this.geometry,
			geometryType: 'esriGeometryEnvelope',
			spatialRel: 'esriSpatialRelIntersects',
			returnExtentOnly: true,
			returnIdsOnly: true,
			f: 'json',
		};
	},
	mapDataParams: function () {
		return {
			where: this.where,
			geometry: this.geometry,
			geometryType: 'esriGeometryEnvelope',
			spatialRel: 'esriSpatialRelIntersects',
			returnGeometry: false,
			returnQueryGeometry: true,
			outFields: this.queryOutfields,
			returnDistinctValues: true,
			resultOffset: this.resultOffset,
			resultRecordCount: this.resultRecordCount,
			orderByFields: sortOptions.oldestYearThenAzThenSmallestScale,
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
				createMapSlotItems(mapsList);
				hideSpinnerIcon();
			})
			.then(() => {
				this.resultOffset = this.resultOffset + this.resultRecordCount;
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
					// console.log(response);
					this.totalMaps = response.data.objectIds.length;
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
		// if (this.resultOffset === 0) {
		// 	this.resultOffset = this.resultRecordCount;
		// }

		if (this.resultOffset === this.totalMaps) {
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
			date: `${topo.attributes.Imprint_Year}`,
			mapName: topo.attributes.Map_Name,
			mapScale: `1:${topo.attributes.Map_Scale}`,
			location: `${topo.attributes.Map_Name}, ${topo.attributes.State}`,
			thumbnail: `${url}/${topo.attributes.OBJECTID}/info/thumbnail?height=60`,
			mapCenterGeographyX: topo.attributes.CenterX,
			mapCenterGeographyY: topo.attributes.CenterY,
			downloadLink: topo.attributes.DownloadG,
		}));
	},
	setGeometry: function (locationData) {
		console.log(locationData);
		return (queryConfig.geometry = JSON.stringify(locationData));
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

// document.querySelector('#mapsList').addEventListener('scroll', (event) => {
// 	// extentQueryCall(queryConfig);
// 	if (
// 		Math.abs(
// 			document.querySelector('#mapsList').scrollHeight -
// 				document.querySelector('#mapsList').clientHeight -
// 				document.querySelector('#mapsList').scrollTop
// 		) < 1
// 	) {
// 	}
// });

export { queryConfig, yearsAndMapScales };
