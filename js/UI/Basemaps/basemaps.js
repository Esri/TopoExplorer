import { configurables } from '../../../app-config.js?v=0.03';

let mapView;
let terrainLayer;
let imageryLayer;
let outdoorBasemapLabels;

const setLayers = async (view) => {
	console.log('config', configurables.webMapLayers);
	mapView = view;

	return new Promise((resolve, reject) => {
		console.log(view.map);

		terrainLayer = view.map.layers.items.find((layer) => {
			console.log(layer);
			if (layer.portalItem) {
				if (
					layer.portalItem.id ===
					configurables.webMapLayers.terrainLayer.mapItemId
				)
					return layer;
			}
		});

		imageryLayer = view.map.layers.items.find((layer) => {
			if (layer.portalItem) {
				if (
					layer.portalItem.id ===
					configurables.webMapLayers.satelliteLayer.mapItemId
				)
					return layer;
			}
		});
		imageryLayer.popupEnabled = false;

		outdoorBasemapLabels = view.map.layers.items.find((layer) => {
			if (layer.portalItem) {
				if (
					layer.portalItem.id ===
					configurables.webMapLayers.labelLayer.mapItemId
				)
					return layer;
			}
		});

		resolve();
	});
};

const addLayerToggleToMap = () => {
	const layerToggleHTML = `
    <div id='layerToggle' class='flex'>
      <div class='mapLayer flex ${
				configurables.webMapLayers.satelliteLayer.labelName
			}'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="20" width="20">
            <path class="hidden" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
          ${capitalizeString(
						configurables.webMapLayers.satelliteLayer.labelName
					)}
        </span>
      </div>
      <div class='mapLayer flex ${
				configurables.webMapLayers.terrainLayer.labelName
			}'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="20" width="20">
            <path class="hidden" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
        ${capitalizeString(configurables.webMapLayers.terrainLayer.labelName)}
        </span>
      </div>
      <div class='mapLayer flex ${
				configurables.webMapLayers.labelLayer.labelName
			}'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="20" width="20">
            <path class="" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
        ${capitalizeString(configurables.webMapLayers.labelLayer.labelName)}
        </span>
      </div>
    </div>
  `;

	const layerToggleElement = document.createElement('div');
	layerToggleElement.innerHTML = layerToggleHTML;

	mapView.ui.add(layerToggleElement, 'bottom-right');
};

const toggleMapLayerCheckbox = (eventTarget) => {
	const checkmark = eventTarget.querySelector('path');

	checkmark.classList.toggle('hidden');
	toggleMapLayer(checkmark);
};

const toggleMapLayer = (checkmark) => {
	if (checkmark.classList.contains('hidden')) {
		if (
			checkmark.closest(
				`.${configurables.webMapLayers.satelliteLayer.labelName}`
			)
		) {
			imageryLayer.visible = false;
		}

		if (
			checkmark.closest(`.${configurables.webMapLayers.terrainLayer.labelName}`)
		) {
			terrainLayer.visible = false;
		}

		if (
			checkmark.closest(`.${configurables.webMapLayers.labelLayer.labelName}`)
		) {
			outdoorBasemapLabels.visible = false;
		}

		return;
	}

	if (
		checkmark.closest(`.${configurables.webMapLayers.satelliteLayer.labelName}`)
	) {
		imageryLayer.visible = true;
	}

	if (
		checkmark.closest(`.${configurables.webMapLayers.terrainLayer.labelName}`)
	) {
		terrainLayer.visible = true;
	}

	if (
		checkmark.closest(`.${configurables.webMapLayers.labelLayer.labelName}`)
	) {
		outdoorBasemapLabels.visible = true;
	}
};

const initLayerToggle = async (view) => {
	setLayers(view)
		.then((item) => {
			addLayerToggleToMap();
		})
		.then(() => {
			mapView.map.layers.reorder(imageryLayer, 0);
			mapView.map.layers.reorder(outdoorBasemapLabels, 1);
		})
		.then(() => {
			const mapLayer = document.querySelectorAll('.mapLayer');

			mapLayer.forEach((layerToggleInput) => {
				layerToggleInput.addEventListener('click', (event) => {
					event.preventDefault();
					toggleMapLayerCheckbox(layerToggleInput);
				});
			});
		});
};

const capitalizeString = (string) => {
	return string[0].toUpperCase() + string.slice(1);
};

export { initLayerToggle, terrainLayer, imageryLayer, outdoorBasemapLabels };
