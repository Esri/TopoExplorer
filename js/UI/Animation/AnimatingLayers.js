import {
	findTopoLayer,
	mapHaloGraphicLayer,
	currentStateOfPinnedList,
} from '../MapCards/ListOfMaps.js?v=0.01';

import { speeds } from './animation.js?v=0.01';

const animationSpeed = document.querySelector('.animation-speed-value');

let mapIdIndex = -1;
let arrayOfMapLayers = [];
let duration;
let topoMap = null;
let highlightingAnimatedMap;
let pinListCurrentOrder;

const setInitialDuration = (speeds) => {
	duration = speeds[(speeds.length - 1) / 2];
};

const hideMapHalos = () => {
	mapHaloGraphicLayer.visible = false;
};

const showMapHalos = () => {
	mapHaloGraphicLayer.visible = true;
};

const animationStart = () => {
	hideMapHalos();
	pinListCurrentOrder = currentStateOfPinnedList();
	pinListCurrentOrder.forEach((card, index) => {
		console.log(card);
		findTopoLayer(card.querySelector('.map-list-item').attributes.oid.value)
			.then((layer) => {
				console.log('starting animation');
				layer.visible = false;
				arrayOfMapLayers.push(layer);
			})
			.then(() => {
				if (index === pinListCurrentOrder.length - 1) {
					console.log('call the animation layer');
					layerAnimation();
				}
			});
	});
};

const animationEnd = () => {
	showMapHalos();
	pinListCurrentOrder.forEach((card, index) => {
		findTopoLayer(
			card.querySelector('.map-list-item').attributes.oid.value
		).then((layer) => {
			console.log('finishing animation');
			layer.visible = true;
			arrayOfMapLayers.pop(layer);
		});
	});
};

animationSpeed.addEventListener('change', (event) => {
	const value = Math.round(event.target.value / 10) * 1;
	console.log(value);
	duration = speeds[value];
});

const layerAnimation = async () => {
	if (
		document.querySelector('.play-pause .pause').classList.contains('invisible')
	) {
		animationEnd();
		return;
	}
	mapIdIndex === arrayOfMapLayers.length - 1 ? (mapIdIndex = 0) : mapIdIndex++;

	if (topoMap) {
		topoMap.visible = false;
		highlightingAnimatedMap
			.querySelector('.map-list-item')
			.classList.remove('animating');
	}

	topoMap = arrayOfMapLayers[mapIdIndex];
	highlightingAnimatedMap = pinListCurrentOrder[mapIdIndex];

	console.log(topoMap);
	console.log(pinListCurrentOrder[mapIdIndex]);

	layerIntervalVisibility(topoMap);
};

const layerIntervalVisibility = (topoMap) => {
	console.log('this?');
	const isCardChecked = highlightingAnimatedMap
		.querySelector('.animate.checkbox .checkmark')
		.classList.contains('hidden');

	console.log(isCardChecked);
	if (isCardChecked) {
		layerAnimation();
		return;
	}
	highlightingAnimatedMap
		.querySelector('.map-list-item')
		.classList.add('animating');
	topoMap.visible = true;

	setTimeout(layerAnimation, duration);
};

export { animationStart, setInitialDuration };
