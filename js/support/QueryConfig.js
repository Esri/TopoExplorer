//NOTE: This whole file has gotten out of hand, a lot of elements need to be reviewed to make a more effecive refactor..
//this is cerainly not an ideal layout, but I want to see what other additions I may have to add before I look at refactoring
//At the risk of being redundant: I want to know what this file is doing before I try to refactor it.
//TIP: this file should have as little involvement as possible with the UI.
import {
	findMinYear,
	findMaxYear,
	findMinScale,
	findMaxScale,
	// findAllScalesAndYears,
} from './GetAllMapScalesAndYears.js?v=0.01';
import {
	numberOfMapsinView,
	extentQuery,
	queryForHashedTopos,
} from './Query.js?v=0.01';
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
import {
	checkForPreviousTopos,
	activeExport,
} from '../support/HashParams.js?v=0.01';
import { resumeExportPrompt } from '../UI/ExportMaps/ExportMapsPrompt.js?v=0.01';
import { isMobileFormat } from '../UI/EventsAndSelectors/EventsAndSelectors.js?v=0.01';
// import { addTopoMap } from './ImageExportQuery';
// import { checkIfQuerying } from './Query.js?v=0.01';

const setURL = () => {
	console.log('location from query config', window.location);
	if (window.location.host === 'livingatlas.arcgis.com') {
		return 'https://utility.arcgis.com/usrsvcs/servers/88d12190e2494ce89374311800af4c4a/rest/services/USGS_Historical_Topographic_Maps/ImageServer';
	} else if (window.location.host === 'livingatlasstg.arcgis.com') {
		return 'https://historical1-stg.arcgis.com/arcgis/rest/services/USGS_Historical_Topographic_Maps/ImageServer';
	} else {
		return 'https://utility.arcgis.com/usrsvcs/servers/88d12190e2494ce89374311800af4c4a/rest/services/USGS_Historical_Topographic_Maps/ImageServer';
	}
};

//NOTE: this needs a better variable name. This is the imageServiceURL. There are a lot of 'URLs' in this application.
const url = setURL();
let isQueryInProcess = false;

// const isExploreModeActive = document
// 	.querySelector('.explorer-mode.btn-text')
// 	.classList.contains('underline');

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
// const getAllScalesAndYears = findAllScalesAndYears(`${url}/query`);

//NOTE: I think I can move this OBJ into a different module...remember this when building out the sort Module.
//Can definitely be moved to a different module. Just like the year & scale
const sortOptions = {
	onlyYear: `${mapYear} ASC`,
	oldestToNewest: `${mapYear} ASC, ${mapName} ASC, ${mapScale} ASC`,
	newestToOldest: `${mapYear} DESC, ${mapName} ASC, ${mapScale} ASC`,
	largeScaleToSmallScale: `${mapScale} ASC, ${mapName} ASC, ${mapYear} ASC`,
	smallScaleToLargeScale: `${mapScale} DESC, ${mapName} ASC, ${mapYear} ASC`,
	AZ: `${mapName} ASC, ${mapYear} ASC, ${mapScale} ASC`,
	ZA: `${mapName} DESC, ${mapYear} ASC, ${mapScale} ASC`,
};

//NOTE: this could be moved to a different module.
//this SHOULD be in it's own module. It's getting too large and specialized to be here.
//also we're messing with some of the UI elements (which you already know), and that's really cluttering this file/module

const CheckandAdjustScaleSliderHeaderStyle = (availableScaleIndex) => {
	if (
		document.querySelector('#scales .minSlider').value < availableScaleIndex
	) {
		document
			.querySelectorAll('#scales .sliderBtn span')[0]
			.classList.add('transparency');
		document
			.querySelector('#scales .zoomInHelpText')
			.classList.remove('hidden');
	} else {
		if (
			document.querySelector('#scales .minSlider').value >= availableScaleIndex
		) {
			document
				.querySelectorAll('#scales .sliderBtn span')[0]
				.classList.remove('transparency');
			console.log(document.querySelector('#scales .zoomInHelpText'));
			document.querySelector('#scales .zoomInHelpText').classList.add('hidden');
		}
	}

	if (
		document.querySelector('#scales .maxSlider').value < availableScaleIndex
	) {
		console.log(document.querySelector('#scales .maxSlider').value);
		console.log(availableScaleIndex);
		document
			.querySelectorAll('#scales .sliderBtn span')[1]
			.classList.add('transparency');
		document
			.querySelector('#scales .zoomInHelpText')
			.classList.remove('hidden');
	} else {
		if (
			document.querySelector('#scales .maxSlider').value >= availableScaleIndex
		) {
			console.log(document.querySelectorAll('#scales .sliderBtn span')[1]);
			document
				.querySelectorAll('#scales .sliderBtn span')[1]
				.classList.remove('transparency');
			document.querySelector('#scales .zoomInHelpText').classList.add('hidden');
		}
	}
};

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
		maxScaleSliderPositionValue: '',
		minScaleSliderPositionValue: '',
	},
	setMinMaxYears: function (years) {
		return (
			(this.years.allYears = years),
			(this.years.minYear = years[0]),
			(this.years.maxYear = years[years.length - 1])
		);
	},
	updateMinYear: function (sliderPosition) {
		// console.log(sliderPosition);
		// console.log(this);
		this.years.minYear = this.years.allYears[sliderPosition];
		updateWhereStatement();
		resetQueryOffsetNumber();
	},
	updateMaxYear: function (sliderPosition) {
		// console.log(sliderPosition);
		this.years.maxYear = this.years.allYears[sliderPosition];
		updateWhereStatement();
		resetQueryOffsetNumber();
	},
	//setting values
	setMinMaxMapScales: function (mapScales) {
		return (
			(this.scales.allScales = mapScales),
			(this.scales.minScale = mapScales[0]),
			(this.scales.maxScale = mapScales[mapScales.length - 1]),
			(this.scales.minScaleSliderPositionValue = this.scales.minScale),
			(this.scales.maxScaleSliderPositionValue = this.scales.maxScale)
		);
	},
	updateMinScale: function (sliderPosition) {
		this.scales.minScale = this.scales.allScales[sliderPosition];
		this.scales.minScaleSliderPositionValue =
			this.scales.allScales[sliderPosition];
		// updateWhereStatement();
		resetQueryOffsetNumber();
	},
	updateMaxScale: function (sliderPosition) {
		this.scales.maxScale = this.scales.allScales[sliderPosition];
		this.scales.maxScaleSliderPositionValue =
			this.scales.allScales[sliderPosition];
		resetQueryOffsetNumber();
		// updateWhereStatement();
	},
	//NOTE: for the record, I'm not sure I like this approach and it's inclusion in this file, but...it works for now. I think it'll be a headache later on, though.
	setZoomDependentScale: function () {
		//this is the logic to determine what maps scales are available at certain zoom levels (which determines what slider values are available).
		const zoomLevel = queryConfig.mapView.zoom;
		const scaleHeaders = document.querySelector('#scales .headers');
		const minScaleRangeHandle = document.querySelector('#scales .minSlider');
		const maxScaleRangeHandle = document.querySelector('#scales .maxSlider');
		const scaleTicks = document.querySelectorAll('#scales .tick');
		const scaleNumber = document.querySelector('#scales .minSliderValue');

		//no restrictions on zoom level -- all scales (and all slider choices are available)
		if (zoomLevel >= 9) {
			scaleNumber.classList.remove('transparency');
			scaleTicks.forEach((tickMark) =>
				tickMark.classList.remove('transparency')
			);

			this.scales.maxScale = this.scales.allScales[maxScaleRangeHandle.value];
			this.scales.minScale = this.scales.allScales[minScaleRangeHandle.value];
			CheckandAdjustScaleSliderHeaderStyle(0);
			updateWhereStatement();
		}
		//if zoom-level is between 7 & 8, map scales from 1:65k-1:250k are available
		if (zoomLevel === 7 || zoomLevel === 8) {
			//sets the transparency style for the tick marks, tooltip and numbers
			//if the index of the tick mark is less than the index of the perscribed mapScale, add the transparency.
			//NOTE: stlye adjustments shouldn't be here.
			scaleNumber.classList.add('transparency');
			scaleTicks.forEach((tickMark, index) => {
				if (index < scaleTicks.length - 3) {
					tickMark.classList.add('transparency');
				} else {
					tickMark.classList.remove('transparency');
				}
			});

			this.scales.maxScale = this.scales.allScales[maxScaleRangeHandle.value];
			this.scales.minScale = this.scales.allScales[minScaleRangeHandle.value];

			if (
				this.scales.allScales[maxScaleRangeHandle.value] <
					this.scales.allScales[2] &&
				this.scales.allScales[maxScaleRangeHandle.value] <
					this.scales.allScales[2]
			) {
				updateWhereStatement();
				const noMapsText = `<div class='helpText'>
      Change your map extent,
      or adjust filter selections,
      to find topo maps.
      </div>
      `;
				document.querySelector('.mapCount').innerHTML = 0;
				document.querySelector('#exploreList').innerHTML = noMapsText;
				return -1;
			}

			//this ternary is checking to see if the min/max values of the scale slider's selections fall within the appropriate range
			//if the values of the selected scales don't pass the threshold, the minimum threshold will be used instead.
			this.scales.maxScale =
				this.scales.maxScaleSliderPositionValue < this.scales.allScales[2]
					? this.scales.allScales[2]
					: this.scales.maxScaleSliderPositionValue;
			this.scales.minScale =
				this.scales.minScaleSliderPositionValue < this.scales.allScales[2]
					? this.scales.allScales[2]
					: this.scales.minScaleSliderPositionValue;
			CheckandAdjustScaleSliderHeaderStyle(2);
			updateWhereStatement();
		}
		if (zoomLevel === 5 || zoomLevel === 6) {
			//sets the transparency style for the tick marks, tooltip and numbers
			//if the index of the tick mark is less than the index of the perscribed mapScale, add the transparency.
			//NOTE: stlye adjustments shouldn't be here.
			scaleNumber.classList.add('transparency');
			scaleTicks.forEach((tickMark, index) => {
				if (index < scaleTicks.length - 2) {
					tickMark.classList.add('transparency');
				} else {
					tickMark.classList.remove('transparency');
				}
			});

			this.scales.maxScale = this.scales.allScales[maxScaleRangeHandle.value];
			this.scales.minScale = this.scales.allScales[minScaleRangeHandle.value];

			if (
				this.scales.allScales[maxScaleRangeHandle.value] <
					this.scales.allScales[3] &&
				this.scales.allScales[maxScaleRangeHandle.value] <
					this.scales.allScales[3]
			) {
				updateWhereStatement();
				const noMapsText = `<div class='helpText'>
      Change your map extent,
      or adjust filter selections,
      to find topo maps.
      </div>
      `;
				document.querySelector('.mapCount').innerHTML = 0;
				document.querySelector('#exploreList').innerHTML = noMapsText;
				return -1;
			}

			//this ternary is checking to see if the min/max values of the scale slider's selections fall within the appropriate range
			//if the values of the selected scales don't pass the threshold, the minimum threshold will be used instead.
			this.scales.maxScale =
				this.scales.maxScaleSliderPositionValue < this.scales.allScales[3]
					? this.scales.allScales[3]
					: this.scales.maxScaleSliderPositionValue;
			this.scales.minScale =
				this.scales.minScaleSliderPositionValue < this.scales.allScales[3]
					? this.scales.allScales[3]
					: this.scales.minScaleSliderPositionValue;
			//this is INCREDIBLY UGLY. I don't like this.
			CheckandAdjustScaleSliderHeaderStyle(3);
			updateWhereStatement();
		}
		if (zoomLevel === 4) {
			scaleTicks.forEach((tickMark, index) => {
				// console.log(index, scaleTicks.length - 1);
				if (index < scaleTicks.length - 1) {
					tickMark.classList.add('transparency');
				} else {
					tickMark.classList.remove('transparency');
				}
			});
			//This transparency added to the minimum scale value seems to be causing a problem occasionally during initialization.
			//I think it's getting an error because it's possible that the min slider value doesn't exist yet.
			//I'm going to comment it out. I'm not sure I need it at this level of detail(map-zoom).
			// console.log(scaleNumber);
			scaleNumber.classList.add('transparency');

			// console.log(this.scales.maxScaleSliderPositionValue);
			// console.log(this.scales.allScales[maxScaleRangeHandle.value]);
			// console.log(maxScaleRangeHandle.value);
			// if (
			// 	this.scales.allScales[maxScaleRangeHandle.value] <
			// 		this.scales.allScales[this.scales.allScales.length - 1] &&
			// 	this.scales.allScales[maxScaleRangeHandle.value] <
			// 		this.scales.allScales[this.scales.allScales.length - 1]
			// ) {
			// 	console.log('we got a hit');
			// 	return -1;
			// }

			this.scales.maxScale = this.scales.allScales[maxScaleRangeHandle.value];
			this.scales.minScale = this.scales.allScales[minScaleRangeHandle.value];

			if (
				this.scales.allScales[maxScaleRangeHandle.value] <
					this.scales.allScales[this.scales.allScales.length - 1] &&
				this.scales.allScales[maxScaleRangeHandle.value] <
					this.scales.allScales[this.scales.allScales.length - 1]
			) {
				// document.querySelectorAll('#scales .headerSpan').forEach((header) => {
				// 	header.classList.add('transparency');
				// });

				const noMapsText = `<div class='helpText'>
      Change your map extent,
      or adjust filter selections,
      to find topo maps.
      </div>
      `;
				document.querySelector('.mapCount').innerHTML = 0;
				document.querySelector('#exploreList').innerHTML = noMapsText;
				CheckandAdjustScaleSliderHeaderStyle(4);
				updateWhereStatement();
				return -1;
			}

			//only the maximum available map scale is able to be viewed at this zoom level.
			this.scales.maxScale =
				this.scales.maxScale <
				this.scales.allScales[this.scales.allScales.length - 1]
					? this.scales.allScales[this.scales.allScales.length - 1]
					: this.scales.maxScale;
			this.scales.minScale =
				this.scales.maxScale <
				this.scales.allScales[this.scales.allScales.length - 1]
					? this.scales.allScales[3]
					: this.scales.maxScale;

			CheckandAdjustScaleSliderHeaderStyle(4);
			updateWhereStatement();
		}
	},
};

const updateWhereStatement = () => {
	queryConfig.where = `${mapYear} >= ${yearsAndMapScales.years.minYear} AND ${mapYear} <= ${yearsAndMapScales.years.maxYear} AND map_scale >= ${yearsAndMapScales.scales.minScale} AND map_scale <= ${yearsAndMapScales.scales.maxScale}`;
	// console.log(queryConfig.where);
	// console.log('from the whereClause update', queryConfig.resultOffset);
	//NOTE: I shouldn't put this statement here, it should go in it's own function, but at the moment I'm testing to see if this resolves a bug
	// queryConfig.resultOffset = 0;
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
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: 'esriGeometryPolygon',
			spatialRel: this.spatialRelation,
			inSR: 4326,
			returnCountOnly: true,
			f: 'json',
		});
	},
	mapDataParams: function () {
		return new URLSearchParams({
			where: this.where,
			geometry: this.geometry,
			geometryType: 'esriGeometryPolygon',
			spatialRel: this.spatialRelation,
			returnGeometry: true,
			inSR: 4326,
			// returnQueryGeometry: true,
			outFields: this.queryOutfields,
			resultOffset: this.resultOffset,
			resultRecordCount: this.resultRecordCount,
			// NOTE: for the time-being we will not be using 'orderByFields'. This is to see how including 'OrderBy' can effect query-time.
			orderByFields: this.sortChoice,
			f: 'json',
		});
	},
	queryMapData: function () {
		if (isQueryInProcess) {
			console.log('query already in progress');
			return;
		}
		isQueryInProcess = true;
		extentQuery(this.url, this.mapDataParams())
			.then((response) => {
				// console.log(response);
				this.topoMapsInExtent = response.data.features;

				// console.log('new offset', this.resultOffset);
				return this.topoMapsInExtent;
			})
			.then((listOfTopos) => {
				//moved this down here to stop it from affecting the amount of maps returned
				// console.log(this.resultRecordCount);
				this.resultOffset = this.resultOffset + this.resultRecordCount;
				return this.processMapData(listOfTopos);
			})
			.then((mapsList) => {
				if (yearsAndMapScales.setZoomDependentScale() === -1) {
					return;
				}
				createMapSlotItems(mapsList, this.mapView, url);
				hideSpinnerIcon();
			})
			.then(() => {
				// this.resultOffset = this.resultOffset + this.resultRecordCount;
				// console.log(this.resultOffset);
				// if (this.resultRecordCount !== 25) {
				// this.resultOffset = this.resultRecordCount;
				// this.resultOffset = this.resultOffset + this.resultRecordCount;
				// }
				console.log('resetting query status to false');
				isQueryInProcess = false;
				return;
			});
	},
	getNewMaps: function () {
		//TODO: these two 'result' changes should be put together in a seperate function
		// if (this.resultOffset !== 0) {
		// 	console.log('resetting');
		// 	(this.resultOffset = 0), (this.resultRecordCount = 25);
		// }
		this.resultOffset = 0;
		this.resultRecordCount = 25;

		isQueryInProcess = true;
		clearMapsList(),
			showSpinnerIcon(),
			hideMapCount(),
			numberOfMapsinView(this.url, this.totalMapsInExtentParams())
				.then((response) => {
					// console.log(response);
					this.totalMaps = response.data.count;
					// console.log(this.totalMaps);
				})
				.then(() => {
					updateMapcount(this.totalMaps);
					isQueryInProcess = false;
				})
				.then(() => {
					if (
						!document
							.querySelector('.explorer-mode.btn-text')
							.classList.contains('underline')
					) {
						hideSpinnerIcon();
						return;
					}
					// isQueryInProcess = false;
					this.queryMapData();
					return;
				});
		return;
	},
	checkAvailableNumberOfMaps: function () {
		console.log('checking the this.resultOffset', this.resultOffset);
		if (this.resultOffset === 0) {
			// console.log(
			// 	'this.resultOffset is 0',
			// 	'this is the resultRecordCount',
			// 	this.resultRecordCount
			// );
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
			// console.log('the total offset is', this.resultOffset);
			// console.log('the total result RecordCount is', this.resultRecordCount);

			this.queryMapData();
		} else if (this.resultOffset + this.resultRecordCount <= this.totalMaps) {
			showSpinnerIcon();
			// this.resultOffset = this.resultOffset + this.resultRecordCount;
			// console.log(isQueryInProcess);
			this.queryMapData();
		}

		// console.log('checking resultOffset', this.resultOffset);
		// console.log(
		// 	'checking resultRecords to be returned',
		// 	this.resultRecordCount
		// );
	},
	topoMapsInExtent: [],
	processMapData: function (topos) {
		// console.log(topos);
		return topos.map((topo) => ({
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
		require([
			'esri/geometry/support/webMercatorUtils',
			'esri/geometry/Polygon',
		], (webMercatorUtils, Polygon) => {
			const createPolygon = Polygon.fromExtent(locationData);

			const convertPolygonToWGS =
				webMercatorUtils.webMercatorToGeographic(createPolygon);

			const geographicAdjustedLocation =
				webMercatorUtils.webMercatorToGeographic(locationData);

			if (geographicAdjustedLocation.xmin > geographicAdjustedLocation.xmax) {
				geographicAdjustedLocation.xmin -= 360;
			}

			const polygon = new Polygon({
				hasZ: false,
				hasM: false,
				rings: [
					[
						[
							geographicAdjustedLocation.xmin.toFixed(2),
							geographicAdjustedLocation.ymin.toFixed(2),
						],
						[
							geographicAdjustedLocation.xmin.toFixed(2),
							geographicAdjustedLocation.ymax.toFixed(2),
						],
						[
							geographicAdjustedLocation.xmax.toFixed(2),
							geographicAdjustedLocation.ymax.toFixed(2),
						],
						[
							geographicAdjustedLocation.xmax.toFixed(2),
							geographicAdjustedLocation.ymin.toFixed(2),
						],
						[
							geographicAdjustedLocation.xmin.toFixed(2),
							geographicAdjustedLocation.ymin.toFixed(2),
						],
					],
				],
				spatialReference: {
					wkid: 4326,
				},
			});

			return (queryConfig.geometry = JSON.stringify(polygon));
		});
	},
	setSortChoice: function (choiceValue) {
		// console.log('this is the choice for sorting', this.sortChoice);
		return (this.sortChoice = sortOptions[choiceValue]);
	},
	extentQueryCall: function () {
		// console.log('zoom-level for query:', this.mapView.zoom);
		// console.log(yearsAndMapScales.setZoomDependentScale());
		// console.log('running a test');
		if (yearsAndMapScales.setZoomDependentScale() === -1) {
			console.log('bad choices finally');
			// console.log(this.where);
			hideSpinnerIcon();
			return;
		}
		// console.log(this.totalMapsInExtentParams);
		extentQueryCall(this.url, this.totalMapsInExtentParams());
	},
};

const resetQueryOffsetNumber = () => (queryConfig.resultOffset = 0);

const debounce = (func, wait) => {
	let timer;

	return (...args) => {
		clearTimeout(timer);

		timer = setTimeout(() => func(...args), wait);
		// console.log(wait);
		// console.log(args);
	};
};

const extentQueryCall = debounce((url, totalMapsInExtentParams) => {
	// console.log('setting up query debounce. one second (literally).');
	queryConfig.getNewMaps(url, totalMapsInExtentParams), 1000;
});

const setHashedTopoQueryParams = (oid) => {
	const params = new URLSearchParams({
		where: `${objectId} IN (${oid})`,
		// where: `OBJECTID = ${oid}`,
		returnGeometry: true,
		outFields: queryConfig.queryOutfields,
		f: 'json',
	});

	return params;
	// console.log(params);
};

const isHashedToposForQuery = async (view) => {
	if (isMobileFormat()) {
		return;
	}

	if (activeExport()) {
		await dataForTopoExports();
	}

	if (checkForPreviousTopos()) {
		await getDataForHashedTopos(view);
	}
};

const dataForTopoExports = async () => {
	if (!activeExport()) {
		return;
	}
	const hashedToposForExport = activeExport();
	// console.log(hashedToposForExport);
	const paramsForExportTopos = setHashedTopoQueryParams(hashedToposForExport);

	queryForHashedTopos(queryConfig.url, paramsForExportTopos)
		.then((topos) => {
			const toposForExport = topos.data.features;
			return queryConfig.processMapData(toposForExport);
		})
		.then((exportTopoDetails) => {
			resumeExportPrompt(exportTopoDetails);
		});
};

const getDataForHashedTopos = async (view) => {
	// const arrayOfHashedMaps = window.location.hash.substring(1).split(',');

	// console.log(response);

	if (!checkForPreviousTopos()) {
		return;
	}

	const hashedTopos = checkForPreviousTopos();
	const originalOrderHashedTopos = checkForPreviousTopos().split(',');

	const paramsForHashedTopos = setHashedTopoQueryParams(hashedTopos);

	queryForHashedTopos(queryConfig.url, paramsForHashedTopos)
		.then((hashedTopoData) => {
			// console.log(hashedTopoData);
			const hashDataArray = hashedTopoData.data.features;
			// console.log(hashDataArray);
			return queryConfig.processMapData(hashDataArray);
		})
		.then((topoMapData) => {
			// topoMapData[topoMapData.length - 1].previousPinnedMap = true;
			// console.log(topoMapData);
			// console.log(queryConfig.mapView);

			// console.log(originalOrderHashedTopos);

			topoMapData.map((mapData) => {
				const properIndex = originalOrderHashedTopos.indexOf(
					`${mapData.OBJECTID}`
				);
				// console.log(properIndex);
				originalOrderHashedTopos.splice(properIndex, 1, mapData);
			});

			// console.log(originalOrderHashedTopos);
			originalOrderHashedTopos.map((singleMap) => {
				singleMap.previousPinnedMap = true;
				// console.log(singleMap);
				createMapSlotItems([singleMap], view, url);
			});
			return originalOrderHashedTopos;
		});
};

const explorerMode = document.querySelector('.explorer-mode');

const styleListenerConfig = { attributes: true };

const onStyleChange = (mutation, observer) => {
	if (document.querySelector('#exploreList').innerHTML === '') {
		showSpinnerIcon();
		queryConfig.queryMapData();
	}
};

const explorerModeObserver = new MutationObserver(onStyleChange);

explorerModeObserver.observe(explorerMode, styleListenerConfig);

export {
	url,
	queryConfig,
	yearsAndMapScales,
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
	isHashedToposForQuery,
	// getAllScalesAndYears,
	// renderTopoMap,
	// removeTopoMap,
};
