//SLIDER GLOBAL VARIABLES
let availableScales;
const scaleSliderElement = document.querySelector('#scaleSlider');
const yearSliderElement = document.querySelector('#yearSlider');
const scaleSliderBtn = document.querySelector('#scaleSliderBtn');
const yearSliderBtn = document.querySelector('#yearSliderBtn');
// const document.querySelector('#steplist')
const selectedScales = document.querySelector('#selectedScales');
const selectedFromScale = document.querySelector('#fromSelectedScale');
const selectedToScale = document.querySelector('#toSelectedScale');
const sliderElement = document.querySelectorAll('.sliderElement');
const sliderHeader = document.querySelectorAll('.filterAndSortBtn');
// const sliderHeaderMinimum =
// 	sliderHeader.nextSibling.firstElementChild.firstElementChild;
// const sliderHeaderMaximum =
//  sliderHeader.nextSibling.firstElementChild.lastElementChild;
let fromSlider;
let toSlider;
let optionsList;
let option;

// const createSlider = (queryScalesReturned) => {
// 	console.log('scales added');
// 	availableScales = queryScalesReturned;
// 	scaleSlider(queryScalesReturned);
// };
//SLIDER CREATION
//Settings for the slider. Min/max values, and the total range of the slider.
// const createScaleSlider = (availableScales) => {
// 	console.log(availableScales);

// 	const sliderFeatures = {
// 		range: availableScales,
// 		rangeMin: availableScales[0].toString().slice(0, -3),
// 		rangeMax: availableScales[availableScales.length - 1]
// 			.toString()
// 			.slice(0, -3),
// 	};

// 	scaleSliderUI(sliderFeatures);
// };

//The format of the slider and its container
const scaleSliderUI = (sliderFeatures) => {
	console.log('slider format start', sliderFeatures);

	const rangeSlider = `
  <div class="slideContainer">
    <div class="sliders_control">
       <input class="minSlider" type="range" value="0" min="0" max="${
					sliderFeatures.range.length - 1
				}" list='steplist' onchange="" />
        <output class="tooltip"></output>
       <input class="maxSlider" type="range" value="${
					sliderFeatures.range.length - 1
				}" min="0" max="${sliderFeatures.range.length - 1}" list='steplist'/>
        <output class="tooltip"></output>
    </div>
    <div class='minRangeNumber'></div>
    <div class='maxRangeNumber'></div>
    <datalist class='allOptions'></datalist>
</div>`;

	for (let i = 0; i < sliderElement.length; i++) {
		if (!sliderElement[i].innerHTML) {
			sliderElement[i].innerHTML = rangeSlider;
			break;
		}
	}
};

//The consumer function that is called in Main.js
const createSlider = (arrayOfData) => {
	// availableScales ? console.log(availableScales) : console.log(availableYears);
	console.log(arrayOfData);
	console.log(arrayOfData.sliderValues[0]);
	const sliderFeatures =
		arrayOfData.sliderValues[0].toString().length > 4
			? {
					range: arrayOfData.sliderValues,
					rangeMin: `${arrayOfData.sliderValues[0].toString().slice(0, -3)}k`,
					rangeMax: `${arrayOfData.sliderValues[
						arrayOfData.sliderValues.length - 1
					]
						.toString()
						.slice(0, -3)}k`,
					scale: '1:',
			  }
			: {
					range: arrayOfData.sliderValues,
					rangeMin: arrayOfData.sliderValues[0].toString(),
					rangeMax:
						arrayOfData.sliderValues[
							arrayOfData.sliderValues.length - 1
						].toString(),
			  };

	console.log(sliderFeatures);
	scaleSliderUI(sliderFeatures);

	//Adding the additional options/steps within the range slider
	//creating the format for the options
	const sliderOptions = sliderFeatures.range.map((sliderSteps) => {
		return `<option class="option" value='${sliderSteps}'><div class='sliderNumbers'>${
			sliderSteps.toString().length > 4
				? sliderSteps.toString().slice(0, -3) + 'k'
				: sliderSteps
		}</div></option>`;
	});

	document.querySelectorAll('.allOptions')[
		document.querySelectorAll('.allOptions').length - 1
	].innerHTML = [...sliderOptions].join('');

	//Setting the header information for the sliders to reflect the min/max in the range
	//NOTE: this only applies to the scale headers, currently

	for (let i = 0; i < sliderHeader.length - 1; i++) {
		if (
			!sliderHeader[i].nextElementSibling.firstElementChild.firstElementChild
				.innerHTML
		) {
			sliderHeader[
				i
			].nextElementSibling.firstElementChild.firstElementChild.innerHTML = `${
				sliderFeatures.scale ? sliderFeatures.scale : ''
			}${sliderFeatures.rangeMin}`;

			sliderHeader[
				i
			].nextElementSibling.firstElementChild.lastElementChild.innerHTML = `${
				sliderFeatures.scale ? sliderFeatures.scale : ''
			}${sliderFeatures.rangeMax}`;
			break;
		}
	}

	//SLIDER CREATION END
	//==============================================================================
	//INTERNAL SLIDER LOGICS
	//managing the color and position-boundry on the minimum slider when it's reieving inputs
	const controlFromSlider = (fromSlider, toSlider) => {
		// console.log(fromSlider);
		const [from, to] = getParsed(fromSlider, toSlider);
		fillSlider(
			fromSlider,
			toSlider,
			'#C6C6C6',
			'rgba(255,255,255,1)',
			toSlider
		);
		if (from > to) {
			fromSlider.value = to;
		}
	};

	//managing the color and position-boundry on the maximum slider when it's reieving inputs
	const controlToSlider = (fromSlider, toSlider) => {
		const [from, to] = getParsed(fromSlider, toSlider);
		fillSlider(
			fromSlider,
			toSlider,
			'#C6C6C6',
			'rgba(255,255,255,1)',
			toSlider
		);
		setToggleAccessible(toSlider);
		if (from <= to) {
			toSlider.value = to;
		} else {
			toSlider.value = from;
		}
	};

	//supporting function that parses the value of the slider position into a number...I know it's pretty obvious, but still.
	const getParsed = (currentFrom, currentTo) => {
		// console.log(currentFrom);
		const from = parseInt(currentFrom.value, 10);
		const to = parseInt(currentTo.value, 10);
		return [from, to];
	};

	//what determines the color/styling of the slider/background range
	const fillSlider = (from, to, sliderColor, rangeColor, controlSlider) => {
		// console.log(to);
		// console.log(from);
		// console.log(controlSlider);
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
	};

	//assigning/instantiating slider elements to previous declared variables
	fromSlider = document.querySelectorAll('.minSlider');
	// console.log(fromSlider[fromSlider.length - 1]);
	toSlider = document.querySelectorAll('.maxSlider');
	optionsList = document.querySelectorAll('.allOptions');
	option = document.querySelectorAll('.option');

	//Is it possible to make a loop with ALL THE BELOW IN IT??
	//Controls the z-index of the maxSlider, which determines the visibility of the range and it's background
	const setToggleAccessible = (currentTarget) => {
		// const toSlider = document.querySelector('.maxSlider');
		if (Number(currentTarget.value) <= 0) {
			toSlider[toSlider.length - 1].style.zIndex = 2;
		} else {
			toSlider[toSlider.length - 1].style.zIndex = 0;
		}
	};

	//establishing the slider/slider-background colors
	fillSlider(
		fromSlider[fromSlider.length - 1],
		toSlider[toSlider.length - 1],
		'rgba(209,216,226,1)',
		'rgba(255,255,255,1)',
		toSlider[toSlider.length - 1]
	);
	setToggleAccessible(toSlider[toSlider.length - 1]);

	//NOTE: These events update the slider's visual elements -- changing the slider range and background colors.
	//LOOP OVER FOR THESE FUNCTIONS
	(fromSlider[fromSlider.length - 1].oninput = () => {
		controlFromSlider(
			fromSlider[fromSlider.length - 1],
			toSlider[toSlider.length - 1]
		),
			console.log('fromSlider click');
	}),
		(fromSlider[0].oninput = () => {
			controlFromSlider(fromSlider[0], toSlider[0]),
				console.log('fromSlider click'),
				sliderHandleTooltip(fromSlider[0]);
		}),
		(toSlider[fromSlider.length - 1].oninput = () => {
			controlToSlider(
				fromSlider[fromSlider.length - 1],
				toSlider[toSlider.length - 1]
			);
		}),
		(toSlider[0].oninput = () => {
			controlToSlider(fromSlider[0], toSlider[0]),
				sliderHandleTooltip(toSlider[0]);
		});
}; //END INTERNAL SLIDER LOGICS

const sliderHandleTooltip = (sliderHandler) => {
	console.log('tooltip called');
	console.log(sliderHandler.value);

	const selectedStep =
		sliderHandler.parentElement.nextElementSibling.nextElementSibling
			.nextElementSibling;

	const newVal = Number(
		((sliderHandler.value - sliderHandler.min) * 100) /
			(sliderHandler.max - sliderHandler.min)
	);
	console.log(newVal);
	sliderHandler.nextElementSibling.style.left = `calc(${newVal}% + (${
		8 - newVal * 0.15
	}px))`;

	sliderHandler.nextElementSibling.style.display = 'initial';
	sliderHandler.onmouseup = () => {
		sliderHandler.nextElementSibling.style.display = 'none';
	};

	const sliderTooltipValue = selectedStep.children[sliderHandler.value].value;
	sliderHandler.nextElementSibling.innerHTML = sliderTooltipValue;
	console.log(sliderTooltipValue);
};
//Adds a click event to the Scale header element that toggles its slider element
//CAN I RUN A LOOP OVER THESE?

yearSliderBtn.addEventListener('click', (event) => {
	console.log('years click');

	console.log(event);
	yearSliderElement.classList.contains('invisible')
		? yearSliderElement.removeAttribute('class', 'invisible')
		: yearSliderElement.setAttribute('class', 'invisible');
});

scaleSliderBtn.addEventListener('click', () => {
	scaleSliderElement.classList.contains('invisible')
		? scaleSliderElement.removeAttribute('class', 'invisible')
		: scaleSliderElement.setAttribute('class', 'invisible');
});

//updates the minimum value of the scale header
const setFromScaleHeader = (fromScale) => {
	const selectedStep =
		fromScale.parentElement.nextElementSibling.nextElementSibling
			.nextElementSibling;

	const sliderHeaderMin =
		fromScale.closest('.sliderHeader').firstElementChild.lastElementChild
			.firstElementChild.firstElementChild;

	const minNumber =
		selectedStep.children[fromScale.value].value.length > 4
			? `1:${selectedStep.children[fromScale.value].value.slice(0, -3)}k`
			: `${selectedStep.children[fromScale.value].value}`;

	sliderHeaderMin.innerHTML = minNumber;
};

//updates the maximum value of the scale header
const setToScaleHeader = (toScale) => {
	console.log('max number');
	const selectedStep =
		toScale.parentElement.nextElementSibling.nextElementSibling
			.nextElementSibling;

	const sliderHeaderMax =
		toScale.closest('.sliderHeader').firstElementChild.lastElementChild
			.firstElementChild.lastElementChild;

	const maxNumber =
		selectedStep.children[toScale.value].value.length > 4
			? `1:${selectedStep.children[toScale.value].value.slice(0, -3)}k`
			: `${selectedStep.children[toScale.value].value}`;

	sliderHeaderMax.innerHTML = maxNumber;
};

//parses the vaule of the slider based on its position
const currentSliderValue = (sliderPosition) => {
	const selectedStep =
		sliderPosition.parentElement.nextElementSibling.nextElementSibling
			.nextElementSibling;

	const sliderValue = selectedStep.children[sliderPosition.value].value;
	console.log(sliderValue);
	return sliderValue;
};

//the debounce function. Witholding the pre-determined function until the timer elapses without additional input.
const debounce = (func, wait) => {
	let timer;

	return (...args) => {
		clearTimeout(timer);

		return new Promise((resolve) => {
			timer = setTimeout(() => resolve(func(...args)), wait);
		});
	};
};

//the inciting function for the debounce function -- this function establishes the amount of time to set the timer and which function shall be run when the timer runs out.
const debounceInput = debounce((scale) => currentSliderValue(scale), 500);

// const sliderChangeFunctions = () => {
// 	for (let i = 0; i < fromSlider.length; i++) {
// 		(fromSlider[i].onchange = () => {
// 			setFromScaleHeader(fromSlider[i]), debounceInput(fromSlider[i]);
// 		})(
// 			(toSlider[i].onchange = () => {
// 				setToScaleHeader(toSlider[i]), debounceInput(toSlider[i]);
// 			})
// 		);
// 	}
// };

const initSlider = (onChangeHandler) => {
	console.log(onChangeHandler);
	console.log(onChangeHandler.classList.value);

	// console.log(onChangeHandler.onchange());
	if (onChangeHandler.classList.value === 'minSlider') {
		setFromScaleHeader(onChangeHandler);
		return debounceInput(onChangeHandler);
	} else {
		setToScaleHeader(onChangeHandler);
		return debounceInput(onChangeHandler);
	}

	// debounceInput: ()=> debounce((scale) => currentSliderValue(scale), 500);

	// for (let i = 0; i < fromSlider.length; i++) {
	// 	console.log(onChangeHandler.onchange(fromSlider[i]));
	// 	fromSlider[i].onchange = () => {
	// 		setFromScaleHeader(fromSlider[i]),
	// 			onChangeHandler.onchange(fromSlider[i]);
	// 	};
	// 	toSlider[i].onchange = () => {
	// 		setToScaleHeader(toSlider[i]), debounceInput(toSlider[i]);
	// 	};
	// }

	// return sliderChangeFunctions();
};

//NOTE: THIS IS WHAT WE'RE AIMING FOR.
// This should be your pattern for module development.
// Your module don't need to know anything outside of themselves other than the information passed directly to them.
// const initSliderDemo = (containerId, onChangeHander, values, min, max)=>{
//   const container = document.getElementById(containerId);

//   let valA = min || values[0];
//   let valB = max || values[values.length-1];

//   container.innerHTML = `
//     <div class="sliderHeader" style="display: flex; margin: auto">
//       <button id="yearSliderBtn" class="sliderBtn">
//         <div class="filterAndSortBtn" style="padding: 3px">YEARS:</div>
//         <div style="width: 100%; text-align: center; align-self: center">
//           <span id="selectedYears">
//             <span id="fromSelectedYear"></span>
//             - <span id="toSelectedYear"></span>
//           </span>
//         </div>
//       </button>
//       <div id="yearSlider" class="sliderElement invisible"></div>
//     </div>
//   `

//   container.querySelector('.hander-a').addEventListener('change', (evt)=>{
//     valA = evt.target.value;
//     onChangeHander(valA, valB)
//   })

//   container.querySelector('.hander-b').addEventListener('change', (evt)=>{
//     valB = evt.target.value;
//     onChangeHander(valA, valB)
//   })
// }

//All variables currently being eported.
//NOTE: Try to export only ONE function.
export { createSlider, initSlider };
