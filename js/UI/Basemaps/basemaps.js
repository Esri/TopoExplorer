import { appConfig } from '../../../app-config.js?v=0.03';

let mapView;

const getBasemapsFromView = (view) => {
	if (appConfig.webmapLayersForToggleElement.length > 4) {
		const tooManyLayersMessage =
			'Layer toggle can only have a maximum of 4 layers in use';
		throw new TypeError(tooManyLayersMessage);
	}

	mapView = view;

	const referenceLayers = [];

	appConfig.webmapLayersForToggleElement.forEach((layerData) => {
		view.map.layers.items.find((webmapLayer, index) => {
			// (layer.portalItem.id);
			if (!webmapLayer.portalItem) {
				return;
			}
			if (webmapLayer.portalItem.id === layerData.layerId) {
				webmapLayer.toggleName = layerData.layerTitle;
				const info = {
					layerData: webmapLayer,
					layerName: layerData,
				};

				return referenceLayers.push(info);
			}
			if (index === view.map.layers.items.length - 1) {
				const basemapLayerErrorMessage = `Could not find map layer, '${layerData.layerId}' in the webmap's layers.`;

				throw new TypeError(basemapLayerErrorMessage);
			}
		});
	});

	return referenceLayers;
};

const createHTMLForBasemapToggleElement = (arrayOfBasemaps) => {
	const layerHTML = arrayOfBasemaps
		.map((layer) => {
			return `<div class='mapLayer flex ${layer.layerName.layerTitle}'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="20" width="20">
            <path class="${
							layer.layerData.visible ? '' : 'hidden'
						}" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
          ${layer.layerName.layerTitle}
        </span>
      </div>`;
		})
		.join(' ');

	addBasemapToggleElementToView(layerHTML, arrayOfBasemaps);
};

const addBasemapToggleElementToView = (html, arrayOfBasemaps) => {
	const layerToggleHTML = `
    <div id='layerToggle' class='flex'>
      ${html}
    </div>
  `;

	const layerToggleElement = document.createElement('div');
	layerToggleElement.innerHTML = layerToggleHTML;

	mapView.ui.add(layerToggleElement, 'bottom-right');
	initToggleEventListener(layerToggleElement, arrayOfBasemaps);
};

const initToggleEventListener = (layerToggleElement, arrayOfBasemaps) => {
	layerToggleElement.addEventListener('click', (event) => {
		event.preventDefault();
		toggleMapLayerCheckbox(event);
		toggleBasemapLayers(event, arrayOfBasemaps);
	});
};

const toggleMapLayerCheckbox = (eventTarget) => {
	const targetContainer = eventTarget.target.closest('.mapLayer');
	const checkmark = targetContainer.querySelector('path');

	checkmark.classList.toggle('hidden');
};

const toggleBasemapLayers = (eventTarget, array) => {
	const eventTargetLayer = eventTarget.target.closest('.mapLayer');

	const basemapLayer = array.find(
		(layer) =>
			layer.layerName.layerTitle === eventTargetLayer.textContent.trim()
	);

	basemapLayer.layerData.visible === false
		? (basemapLayer.layerData.visible = true)
		: (basemapLayer.layerData.visible = false);
};

const initLayerToggle = (view) => {
	if (appConfig.enableBasemapToggleElement === false) {
		return;
	}

	const basemapArray = getBasemapsFromView(view);

	createHTMLForBasemapToggleElement(basemapArray);
};

export { initLayerToggle };
