import { appConfig } from '../../app-config.js?v=0.03';
import {
	findMinYear,
	findMaxYear,
	findMinScale,
	findMaxScale,
} from './GetAllMapScalesAndYears.js?v=0.03';
import {
	extentQuery,
	queryForHashedTopos,
	defaultServiceURL,
} from './Query.js?v=0.03';
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
	if (appConfig.imageServerURL) {
		return appConfig.imageServerURL;
	}
	return defaultServiceURL;
};

const url = setURL();

const serviceFetch = fetch(`${url}?f=pjson`);
let serviceJSON;

const isServiceAnImageService = async (serviceInfo) => {
	try {
		serviceJSON = await serviceInfo.json();
		const dataServiceType = serviceJSON.serviceDataType;

		if (!dataServiceType) {
			throw new TypeError(
				`could not verify the type of service. Please review the service URL.`
			);
		}
		if (!dataServiceType.includes('ImageService')) {
			throw new Error(
				`This application is built to interact with esri image services. Not a '${dataServiceType}' service. For optimal experience please use an image service`
			);
		}
		return dataServiceType;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const userDeterminedOutfields = Object.values(
	appConfig.outfields.requiredFields
);

const areOutfieldsFoundInServiceAttributes = async () => {
	userDeterminedOutfields.map((outfieldName) => {
		if (!outfieldName) {
			return;
		}
		if (
			!serviceJSON.fields.find(
				(serviceFieldName) => serviceFieldName.name === outfieldName
			)
		) {
			throw new Error(
				`'${outfieldName}' is not an available field in this service. Please double check your outfields with the fields in the requested service.`
			);
		}
	});
};
const unavailableInfo = appConfig.unavailableInformationString;

const whereStatement = appConfig.whereStatement;
const objectId = appConfig.outfields.requiredFields.objectId;
const mapName = appConfig.outfields.requiredFields.mapName;
const dateCurrent = appConfig.outfields.requiredFields.dateCurrent;
const publicationYear = appConfig.outfields.optionalFields.publicationYear;
const mapState = appConfig.outfields.requiredFields.mapLocation;
const mapScale = appConfig.outfields.requiredFields.mapScale;
const mapDownloadLink = appConfig.outfields.requiredFields.mapDownloadLink;
const surveyYear = appConfig.outfields.optionalFields.surveyYear;
const photoYear = appConfig.outfields.optionalFields.photoYear;
const photoRevisionYear = appConfig.outfields.optionalFields.photoRevisionYear;
const fieldCheckYear = appConfig.outfields.optionalFields.fieldCheckYear;
const projection = appConfig.outfields.optionalFields.projection;
const datum = appConfig.outfields.optionalFields.datum;
const citation = appConfig.outfields.optionalFields.citation;

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
	geometryType: 'esriGeometryPoint',
	spatialRelation: 'esriSpatialRelIntersects',
	imageSR: 3264,
	outSR: appConfig.outSR,
	returnedFormat: 'json',
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
			geometryType: this.geometryType,
			spatialRel: this.spatialRelation,
			returnCountOnly: true,
			returnExtentOnly: true,
			f: this.returnedFormat,
		});
	},
	totalMapExtents: function () {
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: this.geometryType,
			spatialRel: this.spatialRelation,
			returnExtentOnly: true,
			f: this.returnedFormat,
		});
	},
	mapDataParams: function () {
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: this.geometryType,
			spatialRel: this.spatialRelation,
			returnGeometry: true,
			outSR: this.outSR,
			outFields: this.queryOutfields,
			f: this.returnedFormat,
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

		return topos.map((topo) => ({
			topo,
			OBJECTID: topo.attributes[objectId] || unavailableInfo,
			date: topo.attributes[dateCurrent] || unavailableInfo,
			revisionYear: topo.attributes[publicationYear]
				? `${topo.attributes[publicationYear]} pub.`
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
		f: queryController.returnedFormat,
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
	serviceFetch,
	isServiceAnImageService,
	areOutfieldsFoundInServiceAttributes,
	// dataServiceType,
	getView,
	setView,
};
