//NOTE: This whole file has gotten out of hand, a lot of elements need to be reviewed to make a more effecive refactor..
//this is cerainly not an ideal layout, but I want to see what other additions I may have to add before I look at refactoring
//At the risk of being redundant: I want to know what this file is doing before I try to refactor it.
//TIP: this file should have as little involvement as possible with the UI.
import { config } from '../../app-config.js?v=0.01';
import {
	findMinYear,
	findMaxYear,
	findMinScale,
	findMaxScale,
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

const setURL = () => {
	return config.environment.serviceUrls.historicalTopoImageService;
};

//NOTE: this needs a better variable name. This is the imageServiceURL. There are a lot of 'URLs' in this application.
const url = setURL();
let isQueryInProcess = false;

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
let minScaleRangeHandle;
let maxScaleRangeHandle;

const sortOptions = {
	onlyYear: `${mapYear} ASC`,
	oldestToNewest: `${mapYear} ASC, ${mapName} ASC, ${mapScale} ASC`,
	newestToOldest: `${mapYear} DESC, ${mapName} ASC, ${mapScale} ASC`,
	largeScaleToSmallScale: `${mapScale} ASC, ${mapName} ASC, ${mapYear} ASC`,
	smallScaleToLargeScale: `${mapScale} DESC, ${mapName} ASC, ${mapYear} ASC`,
	AZ: `${mapName} ASC, ${mapYear} ASC, ${mapScale} ASC`,
	ZA: `${mapName} DESC, ${mapYear} ASC, ${mapScale} ASC`,
};

//this SHOULD be in it's own module. It's getting too large and generalized to be here.
//also we're messing with some of the UI elements (which you already know), and that's really cluttering this file/module
const CheckandAdjustScaleSliderHeaderStyle = (availableScaleIndex) => {
	if (
		parseInt(maxScaleRangeHandle.value) > parseInt(minScaleRangeHandle.value)
	) {
		if (minScaleRangeHandle.value < availableScaleIndex) {
			document
				.querySelectorAll('#scales .sliderBtn span')[0]
				.classList.add('transparency');
			document
				.querySelector('#scales .zoomInHelpText')
				.classList.remove('hidden');
		} else {
			if (
				document.querySelector('#scales .minSlider').value >=
				availableScaleIndex
			) {
				document
					.querySelectorAll('#scales .sliderBtn span')[0]
					.classList.remove('transparency');

				document
					.querySelector('#scales .zoomInHelpText')
					.classList.add('hidden');
			}
		}

		if (maxScaleRangeHandle.value < availableScaleIndex) {
			document
				.querySelectorAll('#scales .sliderBtn span')[1]
				.classList.add('transparency');
			document
				.querySelector('#scales .zoomInHelpText')
				.classList.remove('hidden');
		} else {
			if (
				document.querySelector('#scales .maxSlider').value >=
				availableScaleIndex
			) {
				document
					.querySelectorAll('#scales .sliderBtn span')[1]
					.classList.remove('transparency');
				document
					.querySelector('#scales .zoomInHelpText')
					.classList.add('hidden');
			}
		}
	}
	if (
		parseInt(maxScaleRangeHandle.value) <= parseInt(minScaleRangeHandle.value)
	) {
		if (maxScaleRangeHandle.value >= availableScaleIndex) {
			document
				.querySelectorAll('#scales .sliderBtn span')[0]
				.classList.remove('transparency');
			document.querySelector('#scales .zoomInHelpText').classList.add('hidden');
		} else {
			if (maxScaleRangeHandle.value < availableScaleIndex) {
				document
					.querySelectorAll('#scales .sliderBtn span')[0]
					.classList.add('transparency');
				document
					.querySelector('#scales .zoomInHelpText')
					.classList.remove('hidden');
			}
		}

		if (parseInt(minScaleRangeHandle.value) < availableScaleIndex) {
			document
				.querySelectorAll('#scales .sliderBtn span')[1]
				.classList.add('transparency');
			document
				.querySelector('#scales .zoomInHelpText')
				.classList.remove('hidden');
		} else {
			if (minScaleRangeHandle.value >= availableScaleIndex) {
				document
					.querySelectorAll('#scales .sliderBtn span')[1]
					.classList.remove('transparency');
				document
					.querySelector('#scales .zoomInHelpText')
					.classList.add('hidden');
			}
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
		this.years.minYear = this.years.allYears[sliderPosition];
		updateWhereStatement();
		resetQueryOffsetNumber();
	},
	updateMaxYear: function (sliderPosition) {
		this.years.maxYear = this.years.allYears[sliderPosition];
		updateWhereStatement();
		resetQueryOffsetNumber();
	},

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
		resetQueryOffsetNumber();
	},
	updateMaxScale: function (sliderPosition) {
		this.scales.maxScale = this.scales.allScales[sliderPosition];
		this.scales.maxScaleSliderPositionValue =
			this.scales.allScales[sliderPosition];
		resetQueryOffsetNumber();
	},

	setZoomDependentScale: function () {
		//this is the logic to determine what maps scales are available at certain zoom levels (which determines what slider values are available).
		const zoomLevel = Math.round(queryConfig.mapView.zoom);
		const scaleHeaders = document.querySelector('#scales .headers');
		minScaleRangeHandle = document.querySelector('#scales .minSlider');
		maxScaleRangeHandle = document.querySelector('#scales .maxSlider');
		const scaleTicks = document.querySelectorAll('#scales .tick');
		const scaleNumber = document.querySelector('#scales .minSliderValue');

		//no restrictions on zoom level -- all scales (and all slider choices are available)
		if (zoomLevel >= 9) {
			scaleNumber.classList.remove('transparency');
			scaleTicks.forEach((tickMark) =>
				tickMark.classList.remove('transparency')
			);

			if (
				parseInt(maxScaleRangeHandle.value) <
				parseInt(minScaleRangeHandle.value)
			) {
				this.scales.maxScale = this.scales.allScales[minScaleRangeHandle.value];
				this.scales.minScale = this.scales.allScales[maxScaleRangeHandle.value];
			}

			if (
				parseInt(maxScaleRangeHandle.value) >
				parseInt(minScaleRangeHandle.value)
			) {
				this.scales.maxScale = this.scales.allScales[maxScaleRangeHandle.value];
				this.scales.minScale = this.scales.allScales[minScaleRangeHandle.value];
			}

			CheckandAdjustScaleSliderHeaderStyle(0);
			updateWhereStatement();
		}
		//if zoom-level is between 7 & 8, map scales from 1:65k-1:250k are available
		if (zoomLevel === 7 || zoomLevel === 8) {
			//sets the transparency style for the tick marks, tooltip and numbers

			scaleNumber.classList.add('transparency');
			scaleTicks.forEach((tickMark, index) => {
				if (index < scaleTicks.length - 3) {
					tickMark.classList.add('transparency');
				} else {
					tickMark.classList.remove('transparency');
				}
			});

			if (
				parseInt(maxScaleRangeHandle.value) <
				parseInt(minScaleRangeHandle.value)
			) {
				this.scales.maxScale = this.scales.allScales[minScaleRangeHandle.value];
				this.scales.minScale = this.scales.allScales[maxScaleRangeHandle.value];
			}

			if (
				parseInt(maxScaleRangeHandle.value) >
				parseInt(minScaleRangeHandle.value)
			) {
				this.scales.maxScale = this.scales.allScales[maxScaleRangeHandle.value];
				this.scales.minScale = this.scales.allScales[minScaleRangeHandle.value];
			}

			if (
				this.scales.allScales[maxScaleRangeHandle.value] <
					this.scales.allScales[2] &&
				this.scales.allScales[minScaleRangeHandle.value] <
					this.scales.allScales[2]
			) {
				updateWhereStatement();
				const noMapsText = `<div class='helpText'>
      Change your map extent,
      or adjust filter selections,
      to find topo maps.
      </div>
      `;
				CheckandAdjustScaleSliderHeaderStyle(2);

				document.querySelector('.mapCount').innerHTML = 0;
				document.querySelector('#exploreList').innerHTML = noMapsText;
				return -1;
			}

			//this ternary is checking to see if the min/max values of the scale slider's selections fall within the appropriate range
			//if the values of the selected scales don't pass the threshold, the minimum threshold will be used instead.
			this.scales.maxScale =
				this.scales.maxScale < this.scales.allScales[2]
					? this.scales.allScales[2]
					: this.scales.maxScale;
			this.scales.minScale =
				this.scales.minScale < this.scales.allScales[2]
					? this.scales.allScales[2]
					: this.scales.minScale;
			CheckandAdjustScaleSliderHeaderStyle(2);
			updateWhereStatement();
		}
		if (zoomLevel === 5 || zoomLevel === 6) {
			scaleNumber.classList.add('transparency');
			scaleTicks.forEach((tickMark, index) => {
				if (index < scaleTicks.length - 2) {
					tickMark.classList.add('transparency');
				} else {
					tickMark.classList.remove('transparency');
				}
			});

			if (
				parseInt(maxScaleRangeHandle.value) <
				parseInt(minScaleRangeHandle.value)
			) {
				this.scales.maxScale = this.scales.allScales[minScaleRangeHandle.value];
				this.scales.minScale = this.scales.allScales[maxScaleRangeHandle.value];
			}

			if (
				parseInt(maxScaleRangeHandle.value) >
				parseInt(minScaleRangeHandle.value)
			) {
				this.scales.maxScale = this.scales.allScales[maxScaleRangeHandle.value];
				this.scales.minScale = this.scales.allScales[minScaleRangeHandle.value];
			}

			if (
				this.scales.allScales[maxScaleRangeHandle.value] <
					this.scales.allScales[3] &&
				this.scales.allScales[minScaleRangeHandle.value] <
					this.scales.allScales[3]
			) {
				updateWhereStatement();
				const noMapsText = `<div class='helpText'>
      Change your map extent,
      or adjust filter selections,
      to find topo maps.
      </div>
      `;
				CheckandAdjustScaleSliderHeaderStyle(3);
				document.querySelector('.mapCount').innerHTML = 0;
				document.querySelector('#exploreList').innerHTML = noMapsText;
				return -1;
			}

			this.scales.maxScale =
				this.scales.maxScale < this.scales.allScales[3]
					? this.scales.allScales[3]
					: this.scales.maxScale;
			this.scales.minScale =
				this.scales.minScale < this.scales.allScales[3]
					? this.scales.allScales[3]
					: this.scales.minScale;

			CheckandAdjustScaleSliderHeaderStyle(3);
			updateWhereStatement();
		}
		if (zoomLevel === 4) {
			scaleTicks.forEach((tickMark, index) => {
				if (index < scaleTicks.length - 1) {
					tickMark.classList.add('transparency');
				} else {
					tickMark.classList.remove('transparency');
				}
			});

			scaleNumber.classList.add('transparency');

			if (
				parseInt(maxScaleRangeHandle.value) <
				parseInt(minScaleRangeHandle.value)
			) {
				this.scales.maxScale = this.scales.allScales[minScaleRangeHandle.value];
				this.scales.minScale = this.scales.allScales[maxScaleRangeHandle.value];
			}

			if (
				parseInt(maxScaleRangeHandle.value) >
				parseInt(minScaleRangeHandle.value)
			) {
				this.scales.maxScale = this.scales.allScales[maxScaleRangeHandle.value];
				this.scales.minScale = this.scales.allScales[minScaleRangeHandle.value];
			}

			if (
				this.scales.allScales[maxScaleRangeHandle.value] <
					this.scales.allScales[this.scales.allScales.length - 1] &&
				this.scales.allScales[minScaleRangeHandle.value] <
					this.scales.allScales[this.scales.allScales.length - 1]
			) {
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
};

const queryConfig = {
	url: `${url}/query`,
	imageExportEndpoint: `${url}/exportImage`,
	mapView: '',
	where: whereStatement,
	geometry: '',
	spatialRelation: 'esriSpatialRelIntersects',
	inSR: 4326,
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
			inSR: this.inSR,
			returnCountOnly: true,
			returnExtentOnly: true,
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
			inSR: this.inSR,
			outFields: this.queryOutfields,
			resultOffset: this.resultOffset,
			resultRecordCount: this.resultRecordCount,
			orderByFields: this.sortChoice,
			f: 'json',
		});
	},
	//this function initializes the query for up to 25 topo maps and processes their returned data.
	queryMapData: function () {
		if (isQueryInProcess) {
			return;
		}
		isQueryInProcess = true;
		extentQuery(this.url, this.mapDataParams())
			.then((response) => {
				console.log(response)
				// checkForMapsVisibleWithinExtent()
				this.topoMapsInExtent = response.data.features;

				return this.topoMapsInExtent;
			})
			.then( (listOfTopos) => {
				// const getMaxCoordinates = (a, b, index) => {
				// 	console.log(a, 'intial')
				// 	console.log(b, 'comparer' )
				// 	if (a[0] > b[0] && a[1] > b[1]){
				// 		return a
				// 	}
				// }

				const findMinCoordinates = (array) => {
					return array.reduce((a,b, index) => {
						console.log(a, 'a coord')
						// console.log(a[0] > b[0])
						// console.log(a[1] > b[1])
						// console.log(a[0] > b[0] && a[1] > b[1])
						console.log(b, 'b coord')
						if (b[0] < a[0]) {
							a[0] = b[0]
					   }
					   if (b[1] < a[1]) {
						   a[1] = b[1]	
					   }
					 	console.log(a, 'new result coord')  
					   return a
					})
					
				}
				this.resultOffset = this.resultOffset + this.resultRecordCount;

				const test = listOfTopos.map((topo, index) => {
					
					console.log(index, 'index')
					 return topo.geometry.rings.map((geometry) => {
						console.log(geometry)
						return	topo = findMinCoordinates(geometry)
						// geometry.reduce((a,b, index) => {
						// 	console.log(a)
						// 	console.log(a[0])
						// 	console.log(b)
						
						})
					})
				
console.log(test)
				// const visibleTopos = listOfTopos.filter(checkForMapsVisibleWithinExtent)


				
				// console.log(await visibleTopos)
				// const visibleTopos = await Promise.all(listOfTopos.map(async (topo) => {
				// 	// console.log(await checkForMapsVisibleWithinExtent(topo.geometry))
				// 	const portionOfExtentArea = await checkForMapsVisibleWithinExtent(topo.geometry)
				// 	console.log(portionOfExtentArea)
				// 	if(portionOfExtentArea < 20){
				// 		console.log('no')
				// 		return 
				// 	} 
				// 	return topo
					
				// })).then((visibleTopos) =>{
				// 	return visibleTopos
				// });
				// listOfTopos.map(async (topo) => {
				// 	 const portionOfExtentArea = await checkForMapsVisibleWithinExtent(topo.geometry)
				// 	console.log(topo.geometry)
				// 	if (  portionOfExtentArea >= 20) {
				// 		visibleTopos.push(topo) 
				// 	}
				// })
				// console.log(visibleTopos())
				// Promise.all(visibleTopos)
				 return listOfTopos;
			})
			.then((visibleTopos) => {
				console.log(visibleTopos)
				return this.processMapData(visibleTopos)
			})
			.then((mapsList) => {
				if (yearsAndMapScales.setZoomDependentScale() === -1) {
					return;
				}
				createMapSlotItems(mapsList, this.mapView);
				hideSpinnerIcon();
			})
			.then(() => {
				isQueryInProcess = false;
				return;
			});
	},
	getNewMaps: function () {
		this.resultOffset = 0;
		this.resultRecordCount = 25;

		isQueryInProcess = true;
		clearMapsList(),
			showSpinnerIcon(),
			hideMapCount(),
			numberOfMapsinView(this.url, this.totalMapsInExtentParams())
				.then((response) => {
					this.totalMaps = response.data.count;
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
					this.queryMapData();
					return;
				});
		return;
	},
	checkAvailableNumberOfMaps: function () {
		if (this.resultOffset === 0) {
			this.resultOffset = this.resultRecordCount;
		}

		if (
			this.resultOffset === this.totalMaps ||
			this.resultOffset > this.totalMaps
		) {
			return;
		} else if (this.resultOffset + this.resultRecordCount >= this.totalMaps) {
			showSpinnerIcon();

			this.resultRecordCount = this.totalMaps - this.resultOffset;

			this.queryMapData();
		} else if (this.resultOffset + this.resultRecordCount <= this.totalMaps) {
			showSpinnerIcon();
			this.queryMapData();
		}
	},
	topoMapsInExtent: [],
	processMapData: function (topos) {
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

			const xMargin =
				(geographicAdjustedLocation.xmax - geographicAdjustedLocation.xmin) *
				0.05;
			const yMargin =
				(geographicAdjustedLocation.ymax - geographicAdjustedLocation.ymin) *
				0.05;

			const bufferAdjustedExtentEnvelope = {
				xmin: geographicAdjustedLocation.xmin + xMargin,
				ymin: geographicAdjustedLocation.ymin + yMargin,
				xmax: geographicAdjustedLocation.xmax - xMargin,
				ymax: geographicAdjustedLocation.ymax - yMargin,
			};

			const polygon = new Polygon({
				hasZ: false,
				hasM: false,
				rings: [
					[
						[
							geographicAdjustedLocation.xmin,
							geographicAdjustedLocation.ymin,
						],
						[
							geographicAdjustedLocation.xmin,
							geographicAdjustedLocation.ymax,
						],
						[
							geographicAdjustedLocation.xmax,
							geographicAdjustedLocation.ymax,
						],
						[
							geographicAdjustedLocation.xmax,
							geographicAdjustedLocation.ymin,
						],
						[
							geographicAdjustedLocation.xmin,
							geographicAdjustedLocation.ymin,
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
		return (this.sortChoice = sortOptions[choiceValue]);
	},
	extentQueryCall: function () {
		if (yearsAndMapScales.setZoomDependentScale() === -1) {
			hideSpinnerIcon();
			return;
		}
		extentQueryCall(this.url, this.totalMapsInExtentParams());
	},
};


const checkForMapsVisibleWithinExtent = (topo) => {
	console.log('checkForMapsVisibleWithinExtent called')
			require([
				'esri/geometry/geometryEngine',
			], (geometryEngine) => {
				const topoMapLocation = topo.geometry
					const intersectingMaps = geometryEngine.intersect(queryConfig.mapView.extent, topoMapLocation)
					const mapArea = geometryEngine.planarArea(intersectingMaps, 'square-miles');
					const extentArea = geometryEngine.planarArea(queryConfig.mapView.extent, 'square-miles');
					const percentOfTopoInExtent = Number.parseFloat((mapArea/extentArea)*100).toFixed(2)
					console.log(mapArea, 'topo map area')
					console.log(extentArea, 'extent area')
					console.log(percentOfTopoInExtent+'%', 'percent of topo in extent')
				
					if (percentOfTopoInExtent > 20){
						console.log('add it')
						return(true)
					}
					
			})
		}
	

const resetQueryOffsetNumber = () => (queryConfig.resultOffset = 0);

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

const setHashedTopoQueryParams = (oid) => {
	const params = new URLSearchParams({
		where: `${objectId} IN (${oid})`,
		returnGeometry: true,
		outFields: queryConfig.queryOutfields,
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

	if (checkForPreviousTopos()) {
		await getDataForHashedTopos(view);
	}
};

const dataForTopoExports = async () => {
	if (!activeExport()) {
		return;
	}
	const hashedToposForExport = activeExport();
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
	if (!checkForPreviousTopos()) {
		return;
	}

	const hashedTopos = checkForPreviousTopos();
	const originalOrderHashedTopos = checkForPreviousTopos().split(',');

	const paramsForHashedTopos = setHashedTopoQueryParams(hashedTopos);

	queryForHashedTopos(queryConfig.url, paramsForHashedTopos)
		.then((hashedTopoData) => {
			const hashDataArray = hashedTopoData.data.features;
			return queryConfig.processMapData(hashDataArray);
		})
		.then((topoMapData) => {
			topoMapData.map((mapData) => {
				const properIndex = originalOrderHashedTopos.indexOf(
					`${mapData.OBJECTID}`
				);
				originalOrderHashedTopos.splice(properIndex, 1, mapData);
			});

			originalOrderHashedTopos.map((singleMap) => {
				singleMap.previousPinnedMap = true;
				createMapSlotItems([singleMap], view);
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
};
