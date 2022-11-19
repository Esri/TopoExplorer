//NOTE I was thinking of seperating the logic from the

const option = document.querySelectorAll('.option');
console.log(option);
function controlFromSlider(fromSlider, toSlider) {
	const [from, to] = getParsed(fromSlider, toSlider);
	fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
	if (from > to) {
		fromSlider.value = to;
	}
}

function controlToSlider(fromSlider, toSlider) {
	const [from, to] = getParsed(fromSlider, toSlider);
	fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
	setToggleAccessible(toSlider);
	if (from <= to) {
		toSlider.value = to;
	} else {
		toSlider.value = from;
	}
}

const updateFromScaleInfo = (fromSlider, option) => {
	console.log(fromSlider);
	console.log(option);
	console.log(option[fromSlider.value]);
	const fromScale = option[fromSlider.value].value;
	debounceThing(fromScale);
	return fromScale;
};

const updateToScaleInfo = (toSlider) => {
	const toScale = option[toSlider.value].value;
	setToScaleHeader(toScale);
};

function getParsed(currentFrom, currentTo) {
	const from = parseInt(currentFrom.value, 10);
	const to = parseInt(currentTo.value, 10);
	return [from, to];
}

// const setFromScaleHeader = (fromScale) => {
// 	selectedFromScale.innerHTML = `1:${fromScale.slice(0, -3)}k`;
// };

const setToScaleHeader = (toScale) => {
	selectedToScale.innerHTML = `1:${toScale.slice(0, -3)}k`;
};

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
	const rangeDistance = to.max - to.min;
	const fromPosition = from.value - to.min;
	const toPosition = to.value - to.min;
	controlSlider.style.background = `linear-gradient(
to right,
${sliderColor} 0%,
${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
	const toSlider = document.querySelector('#toSlider');
	if (Number(currentTarget.value) <= 0) {
		toSlider.style.zIndex = 2;
	} else {
		toSlider.style.zIndex = 0;
	}
}

function debounce(func, wait) {
	let timeout;

	return (...args) => {
		const later = () => {
			timeout = null;

			func(...args);
		};

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);
	};
}

const debounceThing = debounce((scale) => console.log(scale), 1000);

export { controlFromSlider, updateFromScaleInfo };
