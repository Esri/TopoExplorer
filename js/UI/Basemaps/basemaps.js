import { config } from '../../../app-config.js?v=0.03';

let mapView;
let terrainLayer;
let imageryLayer;
let outdoorBasemapLabels;

const setLayers = async (view) => {
	mapView = view;

	return new Promise((resolve, reject) => {
		terrainLayer = view.map.layers.items.find((layer) => {
			if (layer.portalItem) {
				if (
					layer.portalItem.id ===
					config.environment.webMap.webMapLayers.worldHillshade
				)
					return layer;
			}
		});

		imageryLayer = view.map.layers.items.find((layer) => {
			if (layer.portalItem) {
				if (
					layer.portalItem.id ===
					config.environment.webMap.webMapLayers.worldImagery
				)
					return layer;
			}
		});
		imageryLayer.popupEnabled = false;

		outdoorBasemapLabels = view.map.layers.items.find((layer) => {
			if (layer.portalItem) {
				if (
					layer.portalItem.id ===
					config.environment.webMap.webMapLayers.outdoorLabels
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
      <div class='mapLayer flex satellite'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="20" width="20">
            <path class="hidden" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
          Satellite
        </span>
      </div>
      <div class='mapLayer flex terrain'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="20" width="20">
            <path class="hidden" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
          Terrain
        </span>
      </div>
      <div class='mapLayer flex labels'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="20" width="20">
            <path class="" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
          Labels
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
		if (checkmark.closest('.satellite')) {
			imageryLayer.visible = false;
		}

		if (checkmark.closest('.terrain')) {
			terrainLayer.visible = false;
		}

		if (checkmark.closest('.labels')) {
			outdoorBasemapLabels.visible = false;
		}

		return;
	}

	if (checkmark.closest('.satellite')) {
		imageryLayer.visible = true;
	}

	if (checkmark.closest('.terrain')) {
		terrainLayer.visible = true;
	}

	if (checkmark.closest('.labels')) {
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

export { initLayerToggle, terrainLayer, imageryLayer, outdoorBasemapLabels };
