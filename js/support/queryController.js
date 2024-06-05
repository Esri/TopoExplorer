//NOTE: This whole file has gotten out of hand, a lot of elements need to be reviewed to make a more effecive refactor..
//this is certainly not an ideal layout, but I want to see what other additions I may have to add before I look at refactoring
//At the risk of being redundant: I want to know what this file is doing before I try to refactor it.
//TIP: this file should have as little involvement as possible with the UI.
import { config } from '../../app-config.js?v=0.03';
import {
	findMinYear,
	findMaxYear,
	findMinScale,
	findMaxScale,
} from './GetAllMapScalesAndYears.js?v=0.03';
import {
	numberOfMapsinView,
	extentQuery,
	queryForHashedTopos,
} from './Query.js?v=0.03';
import {
	hideMapCount,
	// updateMapcount,
	showSpinnerIcon,
	hideSpinnerIcon,
} from './MapCount.js?v=0.03';
import {
	clearMapsList,
	// setMapListData,
	createMapSlotItems,
	makeCards,
	setNumberOfPreviousTopos,
	removeUnpinnedTopo,
} from '../UI/MapCards/ListOfMaps.js?v=0.03';
import {
	checkForPreviousTopos,
	activeExport,
} from '../support/HashParams.js?v=0.03';
import { resumeExportPrompt } from '../UI/ExportMaps/ExportMapsPrompt.js?v=0.03';
import { isMobileFormat } from '../UI/EventsAndSelectors/EventsAndSelectors.js?v=0.03';

const setURL = () => {
	return config.environment.serviceUrls.historicalTopoImageService;
};

//NOTE: this needs a better variable name. This is the imageServiceURL. There are a lot of 'URLs' in this application.
const url = setURL();
// let isQueryInProcess = false;

let whereStatement = 'Date_On_Map >= 1879';
//'IsDefault = 1';
//'Date_On_Map <= 1879';
const objectId = 'ObjectID';
const mapName = 'Map_Name';
const dateOnMap = 'Date_On_Map';
const dateCurrent = 'DateCurrent';
const mapState = 'State';
const mapYear = 'Imprint_Year';
const mapScale = 'Map_Scale';
const mapCenterX = 'CenterX';
const mapCenterY = 'CenterY';
const mapDownloadLink = 'DownloadG';
const surveyYear = 'Survey_Year';
const photoYear = 'Aerial_Photo_Year';
const photoRevisionYear = 'Photo_Revision';
const fieldCheckYear = 'Field_Check_Year';
const projection = 'Projection';
const datum = 'Datum';
const citation = 'Citation';

//This isn't exactly pretty, but it's a first step in moving this information
const getMinYear = findMinYear(`${url}/query`);
const getMaxYear = findMaxYear(`${url}/query`);
const getMinScale = findMinScale(`${url}/query`);
const getMaxScale = findMaxScale(`${url}/query`);
// let minScaleRangeHandle;
// let maxScaleRangeHandle;

const queryController = {
	url: `${url}/query`,
	imageExportEndpoint: `${url}/exportImage`,
	mapView: null,
	where: whereStatement,
	geometry: '',
	spatialRelation: 'esriSpatialRelIntersects',
	inSR: 4326,
	queryOutfields: [
		objectId,
		mapName,
		mapState,
		mapYear,
		dateOnMap,
		dateCurrent,
		mapScale,
		mapCenterX,
		mapCenterY,
		mapDownloadLink,
		surveyYear,
		photoYear,
		photoRevisionYear,
		fieldCheckYear,
		projection,
		datum,
		citation,
	].join(','),
	// sortChoice: sortOptions.onlyYear,
	resultOffset: 0,
	//the result record count was 25.
	resultRecordCount: '',
	totalMaps: 0,
	totalMapsInExtentParams: function () {
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: 'esriGeometryPoint',
			spatialRel: this.spatialRelation,
			inSR: this.inSR,
			returnCountOnly: true,
			returnExtentOnly: true,
			f: 'json',
		});
	},
	totalMapExtents: function () {
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: 'esriGeometryPoint',
			spatialRel: this.spatialRelation,
			inSR: this.inSR,
			returnExtentOnly: true,
			f: 'json',
		});
	},
	mapDataParams: function () {
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: 'esriGeometryPoint',
			spatialRel: this.spatialRelation,
			returnGeometry: true,
			inSR: this.inSR,
			outFields: this.queryOutfields,
			resultOffset: this.resultOffset,
			// resultRecordCount: this.resultRecordCount,
			// orderByFields: this.sortChoice,
			f: 'json',
		});
	},
	//this function initializes the query for up to 25 topo maps and processes their returned data.
	queryMapData: function () {
		// if (isQueryInProcess) {
		// 	return;
		// }
		// isQueryInProcess = true;

		extentQuery(this.url, this.mapDataParams())
			.then((response) => {
				// checkForMapsVisibleWithinExtent()
				this.topoMapsInExtent = response.data.features;

				return this.topoMapsInExtent;
			})
			.then((listOfTopos) => {
				// this.resultOffset = this.resultOffset + this.resultRecordCount;
				// updateMapcount(listOfTopos.length);
				return this.processMapData(listOfTopos);
			})
			.then((mapsList) => {
				// setMapListData(mapsList);
				const isTopoHashed = false;
				createMapSlotItems(mapsList, this.mapView, isTopoHashed);
				hideSpinnerIcon();
				return;
			});
	},
	getNewMaps: function () {
		// isQueryInProcess = true;
		removeUnpinnedTopo(),
			clearMapsList(),
			showSpinnerIcon(),
			hideMapCount(),
			this.queryMapData();
	},
	topoMapsInExtent: [],
	processMapData: function (topos) {
		const arrayOfPreviouslyPinnedTopos = checkForPreviousTopos()
			? checkForPreviousTopos().split(',')
			: false;

		const isMapPinned = (objectId) => {
			if (!arrayOfPreviouslyPinnedTopos) {
				return -1;
			}
			return arrayOfPreviouslyPinnedTopos
				.map((hashedTopoId) => hashedTopoId)
				.indexOf(objectId);
		};

		return topos.map((topo) => ({
			topo,
			OBJECTID: topo.attributes.OBJECTID,
			date: topo.attributes[dateOnMap],
			mapName: topo.attributes.Map_Name,
			mapScale: `1:${topo.attributes.Map_Scale.toLocaleString()}`,
			location: `${topo.attributes.Map_Name}, ${topo.attributes.State}`,
			thumbnail: `${url}/${topo.attributes.OBJECTID}/info/thumbnail`,
			downloadLink: topo.attributes.DownloadG,
			mapBoundry: topo.geometry,
			previousPinnedMap:
				isMapPinned(`${topo.attributes.OBJECTID}`) !== -1 ? true : false,
		}));
	},
	setGeometry: function (locationData) {
		return (this.geometry = `${locationData.longitude}, ${locationData.latitude}`);
	},
	setSortChoice: function (choiceValue) {
		return (this.sortChoice = sortOptions[choiceValue]);
	},
	extentQueryCall: function () {
		extentQueryCall(this.url, this.totalMapsInExtentParams());
	},
};

const extentQueryCall = (url, params) => {
	queryController.getNewMaps(url, params);
};

const setHashedTopoQueryParams = (oid) => {
	const params = new URLSearchParams({
		where: `${objectId} IN (${oid})`,
		returnGeometry: true,
		outFields: queryController.queryOutfields,
		f: 'json',
	});

	return params;
};

const isHashedToposForQuery = async (view) => {
	if (isMobileFormat()) {
		return;
	}

	if (activeExport()) {
		await dataForTopoExports();
	}

	const previousTopos = checkForPreviousTopos();

	if (previousTopos) {
		await getDataForHashedTopos(view);
	}
};

const dataForTopoExports = async () => {
	if (!activeExport()) {
		return;
	}
	const hashedToposForExport = activeExport();
	const paramsForExportTopos = setHashedTopoQueryParams(hashedToposForExport);

	queryForHashedTopos(queryController.url, paramsForExportTopos)
		.then((topos) => {
			const toposForExport = topos.data.features;
			return queryController.processMapData(toposForExport);
		})
		.then((exportTopoDetails) => {
			resumeExportPrompt(exportTopoDetails);
		});
};

const getDataForHashedTopos = async (view) => {
	if (!checkForPreviousTopos()) {
		return;
	}

	const hashedTopos = checkForPreviousTopos();
	const originalOrderHashedTopos = checkForPreviousTopos().split(',');
	const numberOfPreviousTopos = originalOrderHashedTopos.length;
	setNumberOfPreviousTopos(numberOfPreviousTopos);

	const paramsForHashedTopos = setHashedTopoQueryParams(hashedTopos);

	queryForHashedTopos(queryController.url, paramsForHashedTopos)
		.then((hashedTopoData) => {
			const hashDataArray = hashedTopoData.data.features;
			return queryController.processMapData(hashDataArray);
		})
		.then((topoMapData) => {
			topoMapData.map((mapData) => {
				const properIndex = originalOrderHashedTopos.indexOf(
					`${mapData.OBJECTID}`
				);
				originalOrderHashedTopos.splice(properIndex, 1, mapData);
			});

			originalOrderHashedTopos.map((singleMap) => {
				const isTopoHashed = true;
				singleMap.previousPinnedMap = true;
				//I should really call 'makeCards()' here, but there's an existing race condition I'll need to deal with
				//the ListOfMaps File is still declaring some variables that makeCards() needs.
				createMapSlotItems([singleMap], view, isTopoHashed);
			});
			return originalOrderHashedTopos;
		});
};

const getView = () => {
	return queryController.mapView;
};

const setView = (view) => {
	queryController.mapView = view;
};

export {
	url,
	queryController,
	// yearsAndMapScales,
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
	isHashedToposForQuery,
	getView,
	setView,
};
