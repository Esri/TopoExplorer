//NOTE: THIS (BELOW) IS WHAT WE'RE AIMING FOR.
// This should be your pattern for module development.
// Your module don't need to know anything outside of themselves other than the information passed directly to them.
// for example: it would only need the id of the
//in this example we're creating all the needed HTML W I T H I N a function from the module.
//this means we can apply the EVENTS directly to the elements...remember youre react components
//AND

const initSliderDemo = (containerId, onChangeHandler, values, min, max) => {
	const container = document.getElementById(`filter${containerId}`);

	let valA = min || values[0];
	let valB = max || values[values.length - 1];

	const formatSliderHeader = (numbers) => {
		return numbers.toString().length > 4
			? '1:' + numbers.toString().slice(0, -3) + 'k'
			: numbers;
	};

	container.innerHTML = `
    <div class="sliderHeader" style="display: flex; margin: auto">
      <button class="sliderBtn">
        <div class="filterAndSortBtn" style="padding: 3px">${containerId.toUpperCase()}:</div>
        <div style="width: 100%; text-align: center; align-self: center">  
        <p>
            <span class="headerSpan">${formatSliderHeader(min)}</span> 
            - <span class="headerSpan">${formatSliderHeader(max)}</span>
          </p>
        </div>
      </button>
      <div class="sliderElement invisible">
        <div class="slideContainer">
          <div class="sliders_control">
            <div class="slider-track">
              <span class="slider-selection"></span>  
            </div>
            <input class="minSlider" type="range" value="0" min="0" max="${
							values.length - 1
						}"/>
              <output class="tooltip invisible"></output>
            <input class="maxSlider" type="range" value="${
							values.length - 1
						}" min="0" max="${values.length - 1}"/>
            <output class="tooltip invisible"></output>
          </div>
       <datalist class='allOptions'></datalist>
      </div>
    </div>
  </div>
`;

	const sliderHandle = container.querySelectorAll('input');

	//Formating the slider array values to be displayed in the slider container
	const sliderOptions = values.map((sliderSteps) => {
		return `<option class="option" value='${sliderSteps}'><div class='sliderNumbers'>${
			containerId === 'Scales'
				? sliderSteps.toString().slice(0, -3) + 'k'
				: sliderSteps
		}</div></option>`;
	});
	//setting slider options
	container.querySelector('.allOptions').innerHTML = [...sliderOptions].join(
		''
	);

	const udpdateScaleHeaderValue = (child, value) => {
		container.querySelectorAll(`.sliderBtn span`)[child].innerHTML =
			formatSliderHeader(values[value]);
	};

	const setSliderTooltipVisibility = (index) => {
		container.querySelectorAll('.tooltip')[index].classList.remove('invisible');
	};

	const removeSliderToolTipVisibility = (index) => {
		container.querySelectorAll('.tooltip')[index].classList.add('invisible');
	};

	const setSliderTooltipText = (index, value) => {
		container.querySelectorAll('output')[index].innerHTML = formatSliderHeader(
			values[value]
		);
	};

	//TODO: Is there another way to find the 3% value without hard coding it?
	//or a SIMPLIER way to calculate this position? The answer is yes...I just need to think about it differently
	const setSliderTooltipPosition = (index, value) => {
		const getSliderContainerWidthPercentage =
			(container.querySelector('.slideContainer').offsetWidth /
				document.querySelector('#sideBar').offsetWidth) *
			100;

		const getSliderContainerPadding = parseInt(
			getComputedStyle(
				container.querySelector('.slideContainer')
			).paddingLeft.slice(0, 2)
		);

		const sliderTrackStart = Math.round(
			(getSliderContainerPadding /
				container.querySelector('.slideContainer').offsetWidth) *
				100
		);

		container.querySelectorAll('.tooltip')[index].style.left =
			(value / sliderHandle[index].max) * getSliderContainerWidthPercentage +
			sliderTrackStart +
			'%';
	};

	//Debounce
	const debounce = (func, wait) => {
		let timer;

		return (...args) => {
			clearTimeout(timer);

			return new Promise((resolve) => {
				timer = setTimeout(() => resolve(func(...args)), wait);
			});
		};
	};

	//The time for the debounce
	const debounceInput = debounce(
		(index, value) => onChangeHandler(index, value),
		1100
	);

	//ADDING EVENT LISTENERS
	//updating the color of the selected range AND controling the interaction between the min & max slider handles
	sliderHandle.forEach((input) => {
		const activeSliderRange = container.querySelector('.slider-selection');

		input.addEventListener('input', (e) => {
			let minRange = parseInt(sliderHandle[0].value);
			let maxRange = parseInt(sliderHandle[1].value);

			if (minRange >= maxRange) {
				if (e.target.className === 'minSlider') {
					sliderHandle[0].value = maxRange - 1;
					setSliderTooltipText(0, maxRange - 1);
				} else {
					sliderHandle[1].value = minRange + 1;
					setSliderTooltipText(1, minRange + 1);
				}
			} else {
				//NOTE: should I make these setting their own functions?
				activeSliderRange.style.left =
					(minRange / sliderHandle[0].max) * 100 + '%';
				activeSliderRange.style.right =
					100 - (maxRange / sliderHandle[1].max) * 100 + '%';
			}
		});

		input.addEventListener('input', (e) => {
			e.target.className === 'minSlider'
				? (setSliderTooltipText(0, e.target.value),
				  setSliderTooltipVisibility(0),
				  setSliderTooltipPosition(0, e.target.value))
				: (setSliderTooltipText(1, e.target.value),
				  setSliderTooltipVisibility(1),
				  setSliderTooltipPosition(1, e.target.value));
		});

		input.addEventListener('mouseup', (e) => {
			e.target.className === 'minSlider'
				? removeSliderToolTipVisibility(0)
				: removeSliderToolTipVisibility(1);
		});
	});

	//Listener that will updating the slider's header and the values
	//NOTE: I'm hard-coding the index value on these event-listeners.
	//this is probably because I'm using 'querySelector' on the container, and not 'querySelectorAll' on the document
	//Is this a good method?
	container.querySelector('.minSlider').addEventListener('change', (evt) => {
		valA = evt.target.value;

		debounceInput(0, valA);
		udpdateScaleHeaderValue(0, valA);
	});

	container.querySelector('.maxSlider').addEventListener('change', (evt) => {
		valB = evt.target.value;

		debounceInput(1, valB);
		udpdateScaleHeaderValue(1, valB);
	});

	//Listener to toggle the slider container visibility
	//NOTE: this can be refactored...right?
	container.querySelector(`button`).addEventListener('click', () => {
		container.querySelector(`.sliderElement`).classList.contains('invisible')
			? (document
					.querySelectorAll(`.sliderElement`)
					.forEach((slideContainer) => {
						slideContainer.classList.add('invisible');
					}),
			  container.querySelector(`.sliderElement`).classList.remove('invisible'))
			: document
					.querySelectorAll(`.sliderElement`)
					.forEach((slideContainer) => {
						slideContainer.classList.add('invisible');
					});
	});

	window.onclick = (e) => {
		e.target.className !== 'slideContainer' &&
		e.target.className !== 'allOptions' &&
		e.target.className !== 'filterAndSortBtn' &&
		e.target.className !== 'headerSpan' &&
		e.target.localName !== 'input'
			? document
					.querySelectorAll(`.sliderElement`)
					.forEach((slideContainer) => {
						!slideContainer.classList.contains('invisible')
							? slideContainer.classList.add('invisible')
							: null;
					})
			: null;
	};
};

export { initSliderDemo };
