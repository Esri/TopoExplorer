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

const exportForm = document.querySelector('.export-prompt');
const promptBox = document.querySelector('.prompt-box');
const closeBtn = document.querySelector('.export-prompt .close-btn');
const exportBtnContainer = document.querySelector('.exportBtnContainer');
const indicator = document.querySelector('.processing-indicator');

const tags = 'Living Atlas, USGS, Topographic, Topo, Quad';
let summaryText;

let baseMapInfo;
const topoLayerInfo = [];

const resumeExportPrompt = (exportTopoDetails) => {
	if (!activeExport) {
		return;
	}

	mapExportProcess(exportTopoDetails);
};

const setBaseMapInfo = (view) => {
	baseMapInfo = view.map.basemap.baseLayers;
};

const mapExportProcess = (mapDetails) => {
	summaryText = '';
	topoLayerInfo.length = 0;
	console.log(mapDetails);

	// const mapName = mapDetails.querySelector('.name').innerHTML;
	// const mapYear = mapDetails.querySelector('.year').innerHTML;
	// const mapScale = mapDetails.querySelector('.scale').innerHTML;

	// mapTitleField.value = webMapTitle;

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

	openExportPrompt();
	addExportBtn();
	exportTitleQC();
};

const createWebMapExportDefinition = () => {
	console.log(topoLayerInfo);
	console.log(baseMapInfo);
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
				// [
				// {
				// 	id: 'VectorTile_9836',
				// 	opacity: 1,
				// 	title: 'Outdoor',
				// 	visibility: true,
				// 	itemId: '659e7c1b1e374f6c8a89eefe17b23380',
				// 	layerType: 'VectorTileLayer',
				// 	styleUrl:
				// 		'https://www.arcgis.com/sharing/rest/content/items/659e7c1b1e374f6c8a89eefe17b23380/resources/styles/root.json',
				// },
				// {
				// 	id: 'VectorTile',
				// 	opacity: 1,
				// 	title: 'Outdoor VectorTileLayer',
				// 	visibility: true,
				// 	itemId: '659e7c1b1e374f6c8a89eefe17b23380',
				// 	layerType: 'VectorTileLayer',
				// 	styleUrl:
				// 		'https://www.arcgis.com/sharing/rest/content/items/659e7c1b1e374f6c8a89eefe17b23380/resources/styles/root.json',
				// },
				// ]
				title: 'Topographic',
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
