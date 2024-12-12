const formatSliderNumbers = (numbers) => {
	return numbers.toString().length > 4
		? numbers.toString().slice(0, -3) + 'k'
		: numbers.toString();
};

const formatNumbersForSliderHeader = (numbers) => {
	return numbers.toString().length > 4
		? '1:' + numbers.toString().slice(0, -3) + 'k'
		: numbers.toString();
};

const initDualSlider = (
	containerId,
	title,
	onChangeHandler,
	values,
	min,
	max,
	view
) => {
	const container = document.getElementById(`${containerId}`);
	container.innerHTML = `
    <div class="sliderHeader">
      <button class="sliderBtn">
        <div class="filterAndSortBtn">${title}:</div>
        <div class="headers">  
        <p>
            <span class="headerSpan">
              ${formatNumbersForSliderHeader(min)}
						</span> 
            - <span class="headerSpan">${formatNumbersForSliderHeader(max)}
            </span>
            
          </p>
        </div>
      </button>
      <div class="sliderElement invisible">
        <div class="dualSliderContainer">
          <div class="slider-group" ondragstart="return false;">
            <div class="slider-tracks inputs">
            <div class="clickable-track inputs"></div>
            <div class="slider-foreground inputs">
              </div>
              <div class="slider-handles">
                <div class="input-track">
                  <input class="minSlider" type="range" list="" value="0" min="0" max="${
										values.length - 1
									}">
                  </input>
                  <input class="maxSlider" type="range" value="${
										values.length - 1
									}" min="0" max="${values.length - 1}"/>
                </div>
                <div class="slider-background"></div>
              </div>
            </div>
            <datalist class='tickmarks-container'>
            </datalist>
            <div class="sliderNumbers">
              <span class="minSliderValue">${formatSliderNumbers(min)}</span>
              <span class="maxSliderValue">${formatSliderNumbers(max)}</span>
            </div>
            <div class='zoomInHelpText hidden'>
                  Zoom in to see this ${title
										.substring(0, title.length - 1)
										.toLowerCase()}
            </div>
          </div>
       </div>
    </div>
  </div>
`;

	const sliderComponents = container.querySelector('.inputs');

	//creating the slider sections on the track. Highlighting the change of selection when the handles move
	const sliderBar = values
		.map((sections) => {
			return `
	    <div  class="slider-area slider-color" value="${sections}">
        
	    </div>`;
		})
		.join('');

	const testBar = values
		.map((sections, index) => {
			return `
	    <div  class="clickable" value="${index}">
        
	    </div>`;
		})
		.join('');

	container.querySelector('.slider-foreground').innerHTML = sliderBar;
	container.querySelector('.clickable-track').innerHTML = testBar;

	//creating ticks for slider
	const sliderOptionsHTMLStr = values
		.map((sliderSteps) => {
			return `
      <div class="tick" value='${sliderSteps}'>
        <output class="tooltip invisible">${formatSliderNumbers(
					sliderSteps
				)}</output>

			</div>
      `;
		})
		.join('');

	container.querySelector('.tickmarks-container').innerHTML =
		sliderOptionsHTMLStr;

	const updateSliderHeading = (minValue, maxValue) => {
		let minHeaderSpan = container.querySelectorAll(`.sliderBtn span`)[0];

		let maxHeaderSpan = container.querySelectorAll(`.sliderBtn span`)[1];

		if (parseInt(maxValue) < parseInt(minValue)) {
			minHeaderSpan.innerHTML = formatNumbersForSliderHeader(maxValue);
			maxHeaderSpan.innerHTML = formatNumbersForSliderHeader(minValue);
			onChangeHandler(maxValue, minValue);
			return;
		}

		if (parseInt(minValue) <= parseInt(maxValue)) {
			maxHeaderSpan.innerHTML = formatNumbersForSliderHeader(maxValue);
			minHeaderSpan.innerHTML = formatNumbersForSliderHeader(minValue);
			onChangeHandler(minValue, maxValue);
		}
	};

	const addSliderTooltipVisibility = (index) => {
		container.querySelectorAll('.tooltip').forEach((tooltip) => {
			tooltip.classList.add('invisible');
		});
		container.querySelectorAll('.tooltip')[index].classList.remove('invisible');
	};

	const removeSliderToolTipVisibility = () => {
		container.querySelectorAll('.tooltip').forEach((tooltip) => {
			if (!tooltip.classList.contains('invisible')) {
				tooltip.classList.add('invisible');
			}
		});
	};

	const adjustSliderTrackSelection = () => {
		if (parseInt(minRangeHandle.value) > parseInt(maxRangeHandle.value)) {
			container.querySelectorAll('.slider-area').forEach((section, index) => {
				if (
					index >= parseInt(minRangeHandle.value) ||
					index < parseInt(maxRangeHandle.value)
				) {
					section.classList.add('slider-transparent');
					section.classList.remove('slider-color');
				} else {
					section.classList.remove('slider-transparent');
					section.classList.add('slider-color');
				}
			});
			return;
		}

		container.querySelectorAll('.slider-area').forEach((section, index) => {
			if (index < minRangeHandle.value || index >= maxRangeHandle.value) {
				section.classList.add('slider-transparent');
				section.classList.remove('slider-color');
			} else {
				section.classList.remove('slider-transparent');
				section.classList.add('slider-color');
			}
		});
	};

	//ADDING EVENT LISTENERS
	const minRangeHandle = sliderComponents.querySelector('.minSlider');
	const maxRangeHandle = sliderComponents.querySelector('.maxSlider');
	let isSelecting = false;

	const getMinValue = () => {
		return values[minRangeHandle.value];
	};

	const getMaxValue = () => {
		return values[maxRangeHandle.value];
	};

	window.addEventListener('mouseup', () => {
		if (isSelecting) {
			isSelecting = false;
			removeSliderToolTipVisibility();
		}
	});

	sliderComponents.querySelectorAll('input').forEach((input) => {
		//updating the color of the selected range and controlling the interaction between the min & max slider handles

		input.addEventListener('input', (e) => {
			adjustSliderTrackSelection();
		});

		input.addEventListener('input', (e) => {
			addSliderTooltipVisibility(e.target.value);
		});

		input.addEventListener('mouseup', (e) => {
			removeSliderToolTipVisibility();
		});
	});

	sliderComponents.querySelectorAll('.clickable').forEach((area) => {
		area.addEventListener('click', (e) => {
			let currentSelection = e.target.attributes.value.value;

			let minHandleDifference = Math.abs(
				currentSelection - minRangeHandle.value
			);
			let maxHandleDifference = Math.abs(
				currentSelection - maxRangeHandle.value
			);

			if (parseInt(maxRangeHandle.value) < parseInt(minRangeHandle.value)) {
				if (minHandleDifference < maxHandleDifference) {
					minRangeHandle.value = currentSelection;
					const minValue = getMinValue();
					const maxValue = getMaxValue();
					adjustSliderTrackSelection();

					updateSliderHeading(minValue, maxValue);
					return;
				}

				if (maxHandleDifference < minHandleDifference) {
					maxRangeHandle.value = currentSelection;
					const minValue = getMinValue();
					const maxValue = getMaxValue();
					adjustSliderTrackSelection();

					updateSliderHeading(minValue, maxValue);
					return;
				}

				if (currentSelection > parseInt(maxRangeHandle.value)) {
					maxRangeHandle.value = currentSelection;
					adjustSliderTrackSelection();
					const minValue = getMinValue();
					const maxValue = getMaxValue();

					updateSliderHeading(minValue, maxValue);
					return;
				}

				if (currentSelection < parseInt(minRangeHandle.value)) {
					minRangeHandle.value = currentSelection;
					adjustSliderTrackSelection();
					const minValue = getMinValue();
					const maxValue = getMaxValue();

					updateSliderHeading(minValue, maxValue);
					return;
				}
			}

			if (minHandleDifference === maxHandleDifference) {
				if (currentSelection - maxRangeHandle.value > 0) {
					maxRangeHandle.value = currentSelection;
					adjustSliderTrackSelection();
					const minValue = getMinValue();
					const maxValue = getMaxValue();

					updateSliderHeading(minValue, maxValue);
					return;
				}

				if (currentSelection - minRangeHandle.value < 0) {
					minRangeHandle.value = currentSelection;
					adjustSliderTrackSelection();
					const minValue = getMinValue();
					const maxValue = getMaxValue();

					updateSliderHeading(minValue, maxValue);
					return;
				}

				//if these handles are not overlapping move the minimum handle
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection();
				const minValue = getMinValue();
				const maxValue = getMaxValue();

				updateSliderHeading(minValue, maxValue);

				return;
			}

			if (
				currentSelection < minRangeHandle.value &&
				minHandleDifference < maxHandleDifference
			) {
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection();
				const minValue = getMinValue();
				const maxValue = getMaxValue();

				updateSliderHeading(minValue, maxValue);
			}

			if (
				currentSelection > maxRangeHandle.value &&
				minHandleDifference > maxHandleDifference
			) {
				maxRangeHandle.value = currentSelection;
				adjustSliderTrackSelection();
				const minValue = getMinValue();
				const maxValue = getMaxValue();

				updateSliderHeading(minValue, maxValue);
			}

			if (
				currentSelection > minRangeHandle.value &&
				minHandleDifference < maxHandleDifference
			) {
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection();
				const minValue = getMinValue();
				const maxValue = getMaxValue();

				updateSliderHeading(minValue, maxValue);
			}

			if (
				currentSelection < maxRangeHandle.value &&
				minHandleDifference > maxHandleDifference
			) {
				maxRangeHandle.value = currentSelection;
				adjustSliderTrackSelection();
				const minValue = getMinValue();
				const maxValue = getMaxValue();

				updateSliderHeading(minValue, maxValue);
			}
		});
	});

	//Listener that will updating the slider's header and the values
	container.querySelector('.minSlider').addEventListener('change', (event) => {
		let minVal = values[event.target.value];
		let maxVal = getMaxValue();

		updateSliderHeading(minVal, maxVal);
	});

	container.querySelector('.maxSlider').addEventListener('change', (event) => {
		let maxVal = values[event.target.value];
		let minVal = getMinValue();

		updateSliderHeading(minVal, maxVal);
	});

	//Listener to toggle the slider container and sort choice container visibility
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

	window.addEventListener('click', (e) => {
		if (e.target.closest('.filter')) {
			null;
		} else if (!e.target.closest('.sliderElement')) {
			document.querySelectorAll(`.sliderElement`).forEach((slideContainer) => {
				!slideContainer.classList.contains('invisible')
					? slideContainer.classList.add('invisible')
					: null;
			});
		}
	});
};

export { initDualSlider };
