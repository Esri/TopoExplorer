import {
	terrainLayer,
	imageryLayer,
	outdoorBasemapLabels,
} from '../Basemaps/basemaps.js?v=0.01';
import { activeExport } from '../../support/HashParams.js?v=0.01';
import { url } from '../../support/QueryConfig.js?v=0.01';

import {
	successMessagePrompt,
	failureMessagePrompt,
	closeExportPrompt,
	setWebMapURL,
	exportOver,
	fillTextFields,
	exportTitleQC,
	exportText,
	addExportBtn,
	openExportPrompt,
} from '../ExportMapsPrompt/exportPromptUI.js?v=0.01';
import { addWebMapToUserPortal } from '../../support/AddItemRequest.js?v=0.01';

const promptBox = document.querySelector('.prompt-box');

const tags = 'Living Atlas, USGS, Topographic, Topo, Quad';
let summaryText;

let viewOperationalLayers;
let baseMapInfo;
let userExtent;

const topoLayerInfo = [];

const resumeExportPrompt = (exportTopoDetails) => {
	if (!activeExport) {
		return;
	}

	mapExportProcess(exportTopoDetails);
};

const setBaseMapInfo = (view) => {
	baseMapInfo = view.map.basemap.baseLayers;
	viewOperationalLayers = view.map.layers.items;
	userExtent = view.extent;
};

const mapExportProcess = (mapDetails) => {
	summaryText = '';
	topoLayerInfo.length = 0;
	console.log(mapDetails);

	promptBox.querySelector('.prompt-box .tags').value = tags;

	//NOTE: this still needs to get cleaned up and move elsewhere
	const mapDetailSummary = mapDetails
		.map((mapDetail) => {
			// console.log(mapDetail);
			const mapName =
				mapDetail.mapName || mapDetail.querySelector('.name').innerHTML;
			const mapYear =
				mapDetail.date || mapDetail.querySelector('.year').innerHTML;
			const mapScale =
				mapDetail.mapScale || mapDetail.querySelector('.scale').innerHTML;

			const mapInfo = `${mapYear} ${mapName} ${mapScale}`;

			const oid = mapDetail.OBJECTID || mapDetail.attributes.oid.value;

			// mapDetail.querySelector('.map-list-item').attributes.oid.value.value;
			console.log(url);

			const layerData = {
				title: mapInfo,
				layerType: 'ArcGISImageServiceLayer',
				url: url,
				format: 'jpgpng',
				compressionQuality: 75,
				visibility: true,
				opacity: 1,
				layerDefinition: {
					definitionExpression: `OBJECTID = ${oid}`,
				},
				mosaicRule: {
					mosaicMethod: 'esriMosaicLockRaster',
					lockRasterIds: [oid],
				},

				timeAnimation: false,
			};

			topoLayerInfo.push(layerData);

			return mapInfo;
		})
		.join(';');

	summaryText = `An extract of ${mapDetails.length} USGS topographic map${
		mapDetails.length > 1 ? `s` : ``
	}, accessed via the Living Atlas Historical Topo Map Explorer. ${mapDetailSummary}`;

	exportText.title = 'Historical Topo Map Explorer export';
	exportText.tags = 'Living Atlas, USGS, Topographic, Topo, Quad';
	exportText.summary = summaryText;

	fillTextFields(exportText);
	//NOTE: you're going to have to put these layers in an array an map over them
	//use ago assist to figure out how to set up these layers.
	// addAdditionalOperationalLayers();
	openExportPrompt();
	addExportBtn();
	exportTitleQC();

	//after setting up object set up if(title === 'terrain'){topoLayerInfo.push(layer)}else{topoLayerInfo.unshift(layer);}
};

const addAdditionalOperationalLayers = () => {
	const outdoorBasemapLabelsData = {
		id: '18a89a9fd19-layer-52',
		title: 'Outdoor Labels',
		visibility: true,
		itemId: '65605d0db3bd4067ad4805a81a4689b8',
		layerType: 'VectorTileLayer',
		effect: null,
		styleUrl: '',
	};
	topoLayerInfo.unshift(outdoorBasemapLabels);
	topoLayerInfo.unshift(imageryLayer);
	topoLayerInfo.push(terrainLayer);
};

const createWebMapExportDefinition = () => {
	topoLayerInfo.reverse();

	const webMapDef = {
		description: `${promptBox.querySelector('.summary').value}`,
		tags: `${promptBox.querySelector('.tags').value}`,
		title: `${promptBox.querySelector('.title').value}`,
		type: 'Web Map',
		multipart: false,
		f: 'json',
		text: JSON.stringify({
			operationalLayers: topoLayerInfo,
			baseMap: {
				baseMapLayers: baseMapInfo,
				title: 'Outdoor',
			},
			//Adding this initialState value to see
			initialState: {
				viewpoint: {
					targetGeometry: {
						spatialReference: {
							latestWkid: 3857,
							wkid: 102100,
						},
						xmin: userExtent.xmin,
						ymin: userExtent.ymin,
						xmax: userExtent.xmax,
						ymax: userExtent.ymax,
					},
				},
			},
			spatialReference: {
				wkid: 102100,
				latestWkid: 3857,
			},
			version: '2.28',
			authoringApp: 'Historical Topographic Explorer',
			authoringAppVersion: '0.1',
		}),
	};

	sendExportRequestAndClose(webMapDef);
};

const sendExportRequestAndClose = (webMapDef) => {
	addWebMapToUserPortal(webMapDef).then((response) => {
		if (response.data.success === true) {
			exportOver();
			successMessagePrompt();
			setWebMapURL(response.data.id);
		} else {
			exportOver();
			failureMessagePrompt();
		}
	});
};

export {
	mapExportProcess,
	resumeExportPrompt,
	createWebMapExportDefinition,
	setBaseMapInfo,
};
