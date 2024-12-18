import { appConfig } from '../../app-config.js?v=0.03';
import {
	findMinYear,
	findMaxYear,
	findMinScale,
	findMaxScale,
} from './GetAllMapScalesAndYears.js?v=0.03';
import { extentQuery, queryForHashedTopos } from './Query.js?v=0.03';
import {
	hideMapCount,
	showSpinnerIcon,
	hideSpinnerIcon,
} from './MapCount.js?v=0.03';
import {
	clearMapsList,
	createMapSlotItems,
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
	return appConfig.imageServerURL;
};

const url = setURL();

const serviceFetch = await fetch(`${appConfig.imageServerURL}?f=pjson`);
const serviceJSON = await serviceFetch.json();

const dataServiceType = serviceJSON.serviceDataType;

const userDeterminedOutfields = Object.values(appConfig.outfields);

const areOutfieldsFoundInServiceAttributes = userDeterminedOutfields.map(
	(outfieldName) => {
		if (!outfieldName) {
			return;
		}
		if (
			!serviceJSON.fields.find(
				(serviceFieldName) => serviceFieldName.name === outfieldName
			)
		) {
			console.warn(
				`'${outfieldName}' is not an available field in this service.`
			);
		}
	}
);

const unavailableInfo = appConfig.unavailableInformationString;

const whereStatement = appConfig.whereStatement;
const objectId = appConfig.outfields.objectId;
const mapName = appConfig.outfields.mapName;
const dateCurrent = appConfig.outfields.dateCurrent;
const publicationYear = appConfig.outfields.publicationYear;
const mapState = appConfig.outfields.mapLocation;
const mapScale = appConfig.outfields.mapScale;
const mapDownloadLink = appConfig.outfields.mapDownloadLink;
const surveyYear = appConfig.outfields.surveyYear;
const photoYear = appConfig.outfields.photoYear;
const photoRevisionYear = appConfig.outfields.photoRevisionYear;
const fieldCheckYear = appConfig.outfields.fieldCheckYear;
const projection = appConfig.outfields.projection;
const datum = appConfig.outfields.datum;
const citation = appConfig.outfields.citation;

const getMinYear = findMinYear(`${url}/query`);
const getMaxYear = findMaxYear(`${url}/query`);
const getMinScale = findMinScale(`${url}/query`);
const getMaxScale = findMaxScale(`${url}/query`);

const queryController = {
	url: `${url}/query`,
	imageExportEndpoint: `${url}/exportImage`,
	mapView: null,
	where: whereStatement,
	geometry: '',
	spatialRelation: appConfig.spatialRelation,
	imageSR: serviceJSON.spatialReference,
	outSR: appConfig.outSR,
	queryOutfields: [
		objectId,
		mapName,
		mapState,
		dateCurrent,
		publicationYear,
		mapScale,
		mapDownloadLink,
		surveyYear,
		photoYear,
		photoRevisionYear,
		fieldCheckYear,
		projection,
		datum,
		citation,
	]
		.filter((outfield) => outfield)
		.join(','),
	resultRecordCount: '',
	totalMaps: 0,
	totalMapsInExtentParams: function () {
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: appConfig.geometryPointType,
			spatialRel: this.spatialRelation,
			returnCountOnly: true,
			returnExtentOnly: true,
			f: appConfig.queryReturnFormat,
		});
	},
	totalMapExtents: function () {
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: appConfig.geometryPointType,
			spatialRel: this.spatialRelation,
			returnExtentOnly: true,
			f: appConfig.queryReturnFormat,
		});
	},
	mapDataParams: function () {
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: appConfig.geometryPointType,
			spatialRel: this.spatialRelation,
			returnGeometry: true,
			outSR: this.outSR,
			outFields: this.queryOutfields,
			f: appConfig.queryReturnFormat,
		});
	},
	queryMapData: function () {
		extentQuery(this.url, this.mapDataParams())
			.then((response) => {
				this.topoMapsInExtent = response.data.features;

				return this.topoMapsInExtent;
			})
			.then((listOfTopos) => {
				return this.processMapData(listOfTopos);
			})
			.then((mapsList) => {
				const isTopoHashed = false;
				createMapSlotItems(mapsList, this.mapView, isTopoHashed);
				hideSpinnerIcon();
				return;
			});
	},
	getNewMaps: function () {
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

		// console.log(topos);
		return topos.map((topo) => ({
			topo,
			OBJECTID: topo.attributes[objectId] || unavailableInfo,
			date: topo.attributes[dateCurrent] || unavailableInfo,
			revisionYear: topo.attributes[publicationYear]
				? `${topo.attributes[publicationYear]} rev`
				: unavailableInfo,
			mapName: topo.attributes[mapName] || unavailableInfo,
			mapScale: topo.attributes.Map_Scale
				? `1:${topo.attributes.Map_Scale.toLocaleString()}`
				: unavailableInfo,
			location:
				`${topo.attributes[mapName]}, ${topo.attributes[mapState]}` ||
				unavailableInfo,
			thumbnail: `${url}/${topo.attributes[objectId]}${appConfig.imageThumbnailEndpoint}`,
			downloadLink: topo.attributes.DownloadG,
			mapBoundary: topo.geometry,
			previousPinnedMap:
				isMapPinned(`${topo.attributes.OBJECTID}`) !== -1 ? true : false,
		}));
	},
	setSpatialRelation: function (spatialReference) {
		this.spatialRelation = spatialReference;
		this.outSR = spatialReference;
	},
	setGeometry: function (locationData) {
		return (this.geometry = `${JSON.stringify(locationData)}`);
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
		outSR: queryController.outSR,
		outFields: queryController.queryOutfields,
		f: appConfig.queryReturnFormat,
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
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
	isHashedToposForQuery,
	dataServiceType,
	getView,
	setView,
};
