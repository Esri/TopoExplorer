/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { activeExport } from '../../support/HashParams.js?v=0.03';
import { url } from '../../support/queryController.js?v=0.03';
import { appConfig } from '../../../app-config.js';

import {
	successMessagePrompt,
	failureMessagePrompt,
	setWebMapURL,
	exportOver,
	fillTextFields,
	exportTitleQC,
	exportText,
	addExportBtn,
	openExportPrompt,
} from '../ExportMapsPrompt/exportPromptUI.js?v=0.03';
import {
	setUserToken,
	addWebMapToUserPortal,
} from '../../support/AddItemRequest.js?v=0.03';
import { getCredentials } from '../../support/OAuth.js?v=0.03';

const promptBox = document.querySelector('.prompt-box');

const tags = appConfig.tags.join(', ');
let summaryText;

let viewOperationalLayers;
let baseMapInfo;
let userExtent;
let userView;
let webMapDef;

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
};

const setViewInfo = (view) => {
	userView = view;
	userExtent = view.extent;
};

const mapExportProcess = (mapDetails) => {
	summaryText = '';
	topoLayerInfo.length = 0;

	promptBox.querySelector('.prompt-box .tags').value = tags;

	const mapDetailSummary = mapDetails
		.map((mapDetail) => {
			const mapName =
				mapDetail.mapName || mapDetail.querySelector('.name').innerHTML || '';
			const mapYear =
				mapDetail.date || mapDetail.querySelector('.year').innerHTML || '';
			const mapScale =
				mapDetail.mapScale || mapDetail.querySelector('.scale').innerHTML || '';

			const mapInfo = `${
				mapYear === appConfig.unavailableInformationString ? '' : mapYear
			} ${mapName === appConfig.unavailableInformationString ? '' : mapName} ${
				mapScale === appConfig.unavailableInformationString ? '' : mapScale
			}`;

			const oid = mapDetail.OBJECTID || mapDetail.attributes.oid.value;

			const layerData = {
				title: mapInfo,
				layerType: 'ArcGISImageServiceLayer',
				url: url,
				format: 'jpgpng',
				compressionQuality: 75,
				visibility: true,
				opacity: 1,
				layerDefinition: {
					definitionExpression: `${appConfig.outfields.objectId} = ${oid}`,
				},
				mosaicRule: {
					mosaicMethod: 'esriMosaicLockRaster',
					lockRasterIds: [oid],
				},

				timeAnimation: appConfig.timeEnableExport,
			};

			topoLayerInfo.push(layerData);

			return mapInfo;
		})
		.join(';');

	summaryText = `An extract of ${mapDetails.length} map${
		mapDetails.length > 1 ? `s` : ``
	}, accessed via the ${
		appConfig.appId === 'TopoExplorer' ? 'Living Atlas' : ''
	} ${appConfig.appTitleName}. ${mapDetailSummary}`;

	exportText.title = `${appConfig.appTitleName} export`;
	exportText.tags = appConfig.tags.join(', ');
	exportText.summary = summaryText;

	fillTextFields(exportText);

	openExportPrompt();
	addExportBtn();
	exportTitleQC();
};

const createWebMapExportDefinition = () => {
	topoLayerInfo.reverse();

	webMapDef = {
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
				title: baseMapInfo.title,
			},
			initialState: {
				viewpoint: {
					scale: userView.scale,
					targetGeometry: userExtent,
				},
			},
			spatialReference: userExtent.spatialReference,
			version: '2.28',
			authoringApp: appConfig.appTitleName,
			authoringAppVersion: '0.1',
		}),
	};

	sendExportRequestAndClose(webMapDef);
};

const sendExportRequestAndClose = (webMapDef) => {
	getCredentials().then((credentials) => {
		if (credentials) {
			webMapDef.token = credentials.token;
			setUserToken(credentials);
		}
		addWebMapToUserPortal(webMapDef).then((response) => {
			if (response.status !== 200) {
				exportOver();
				failureMessagePrompt();
				return;
			}

			if (response.data.success === true) {
				exportOver();
				successMessagePrompt();
				setWebMapURL(response.data.id);
			} else {
				exportOver();
				failureMessagePrompt();
			}
		});
	});
};

export {
	mapExportProcess,
	resumeExportPrompt,
	createWebMapExportDefinition,
	setBaseMapInfo,
	setViewInfo,
};
