import { appConfig } from '../../../app-config.js?v=0.03';

let mapView;

const getBasemapsFromView = (view) => {
	mapView = view;

	const referenceLayers = view.map.layers.items.filter(
		(layer) => layer.type !== 'graphics'
	);

	return referenceLayers;
};

const createHTMLForBasemapToggleElement = (arrayOfBasemaps) => {
	const layerHTML = arrayOfBasemaps
		.map((layer) => {
			return `<div class='mapLayer flex ${layer.title}'>
        <div class="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 20 20" height="20" width="20">
            <path class="${
							layer.visible ? '' : 'hidden'
						}" d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"></path>
          </svg>
        </div>
        <span>
          ${capitalizeString(layer.title)}
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
		(layer) => layer.title === eventTargetLayer.textContent.trim()
	);

	basemapLayer.visible === false
		? (basemapLayer.visible = true)
		: (basemapLayer.visible = false);
};

const initLayerToggle = (view) => {
	if (appConfig.enableBasemapToggleElement === false) {
		return;
	}

	const basemapArray = getBasemapsFromView(view);

	createHTMLForBasemapToggleElement(basemapArray);
};

const capitalizeString = (string) => {
	return string[0].toUpperCase() + string.slice(1);
};

export { initLayerToggle };
