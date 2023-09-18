import { config } from '../../../app-config.js?v=0.01';

console.log(config);
let mapView;
let terrainLayer;
let imageryLayer;

const setLayers = async (view) => {
	mapView = view;

	console.log('basemap toggle', view.map.layers.items);
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

		resolve();
	});
};

const addLayerToggleToMap = () => {
	console.log(terrainLayer);
	console.log(imageryLayer);
	const layerToggleHTML = `
    <div id='layerToggle' class='flex'>
      <div class='mapLayer flex satellite'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="16" width="16">
            <path class="hidden" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
          Satellite
        </span>
      </div>
      <div class='mapLayer flex terrain'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="16" width="16">
            <path class="hidden" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
          Terrain
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
			console.log(imageryLayer);
			imageryLayer.visible = false;
		}

		if (checkmark.closest('terrain')) {
			console.log(terrainLayer);
			terrainLayer.visible = false;
		}

		return;
	}

	if (checkmark.closest('.satellite')) {
		console.log(imageryLayer);
		imageryLayer.visible = true;
	}

	if (checkmark.closest('terrain')) {
		console.log(terrainLayer);
		terrainLayer.visible = true;
	}
};

const initLayerToggle = (view) => {
	setLayers(view)
		.then((item) => {
			addLayerToggleToMap();
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

export { initLayerToggle };
