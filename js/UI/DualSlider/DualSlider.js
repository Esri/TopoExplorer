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
            <span class="tooltipText hidden">Zoom in to see this ${title
							.substring(0, title.length - 1)
							.toLowerCase()}</span>
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

	const zoomDependentSelections = () => {
		if (view.zoom == 4) {
			return values.length - 1;
		}
		if (view.zoom == 5 || view.zoom == 6) {
			return values.length - 2;
		}
		if (view.zoom == 7 || view.zoom == 8) {
			return values.length - 3;
		}
		if (view.zoom >= 9) {
			return -1;
		}
	};

	const isScaleValueWithinAvailableRange = (handle, value) => {
		const maxScaleChoice = sliderComponents.querySelector('.maxSlider').value;
		const minScaleChoice = sliderComponents.querySelector('.minSlider').value;

		let isAvailable = false;
		if (value < zoomDependentSelections()) {
			isAvailable = false;
			udpdateSliderHeading(handle, value, isAvailable);
			debounceInput(handle, value);
		} else {
			isAvailable = true;
			udpdateSliderHeading(handle, value, isAvailable);
			debounceInput(handle, value);
		}

		if (
			minScaleChoice < zoomDependentSelections() &&
			maxScaleChoice < zoomDependentSelections()
		) {
			const noMapsText = `<div class='helpText'>
      Change your map extent,
      or adjust filter selections,
      to find topo maps.
      </div>
      `;
			document.querySelector('.mapCount').innerHTML = 0;
			document.querySelector('#exploreList').innerHTML = noMapsText;
		}
	};

	const sliderComponents = container.querySelector('.inputs');

	//creating the slider sections on the track. Highlighting the change of slection whn the handles move
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

	//This querySelector finds the minValue for the Scale slider's header and adds a transparency effect to it. Because the initial value is outside the available range.
	if (container.querySelectorAll('#scales .sliderBtn span')[0]) {
		container
			.querySelectorAll('#scales .sliderBtn span')[0]
			.classList.add('transparency');
	}

	const udpdateSliderHeading = (handle, value, isAvailable) => {
		let minHeaderSpan = container.querySelectorAll(`.sliderBtn span`)[0];

		let maxHeaderSpan = container.querySelectorAll(`.sliderBtn span`)[1];

		if (parseInt(maxRangeHandle.value) < parseInt(minRangeHandle.value)) {
			minHeaderSpan.innerHTML = formatNumbersForSliderHeader(
				values[maxRangeHandle.value]
			);
			maxHeaderSpan.innerHTML = formatNumbersForSliderHeader(
				values[minRangeHandle.value]
			);

			if (container.id === 'scales') {
				if (parseInt(minRangeHandle.value) < zoomDependentSelections()) {
					maxHeaderSpan.classList.add('transparency');
				} else {
					maxHeaderSpan.classList.remove('transparency');
				}

				if (parseInt(maxRangeHandle.value) < zoomDependentSelections()) {
					minHeaderSpan.classList.add('transparency');
				} else {
					minHeaderSpan.classList.remove('transparency');
				}
			}
			return;
		}

		if (parseInt(minRangeHandle.value) <= parseInt(maxRangeHandle.value)) {
			maxHeaderSpan.innerHTML = formatNumbersForSliderHeader(
				values[maxRangeHandle.value]
			);
			minHeaderSpan.innerHTML = formatNumbersForSliderHeader(
				values[minRangeHandle.value]
			);

			if (container.id === 'scales') {
				if (parseInt(minRangeHandle.value) < zoomDependentSelections()) {
					minHeaderSpan.classList.add('transparency');
				} else {
					minHeaderSpan.classList.remove('transparency');
				}

				if (parseInt(maxRangeHandle.value) < zoomDependentSelections()) {
					maxHeaderSpan.classList.add('transparency');
				} else {
					maxHeaderSpan.classList.remove('transparency');
				}
			}
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

	const unavailbleScalesToolTip = (value) => {
		const zoomInHelpTextElement = document.querySelector(
			'#scales .zoomInHelpText'
		);
		if (value < zoomDependentSelections()) {
			zoomInHelpTextElement.classList.remove('hidden');
		} else {
			zoomInHelpTextElement.classList.add('hidden');
		}
	};

	const debounce = (func, wait) => {
		let timer;

		return (...args) => {
			clearTimeout(timer);

			return new Promise((resolve) => {
				timer = setTimeout(() => resolve(func(...args)), wait);
			});
		};
	};

	const debounceInput = debounce(
		(index, value) => onChangeHandler(index, value),
		1000
	);

	//ADDING EVENT LISTENERS
	const minRangeHandle = sliderComponents.querySelector('.minSlider');
	const maxRangeHandle = sliderComponents.querySelector('.maxSlider');
	let isSelecting = false;

	window.addEventListener('mouseup', () => {
		if (isSelecting) {
			isSelecting = false;
			removeSliderToolTipVisibility();
		}
	});

	sliderComponents.querySelectorAll('input').forEach((input) => {
		//updating the color of the selected range AND controling the interaction between the min & max slider handles

		input.addEventListener('input', (e) => {
			if (e.target.closest('#scales')) {
				unavailbleScalesToolTip(e.target.valueAsNumber);
			}

			adjustSliderTrackSelection(e.target, e.target.valueAsNumber);
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

			let minHandleDiffernce = Math.abs(
				currentSelection - minRangeHandle.value
			);
			let maxHandleDiffernce = Math.abs(
				currentSelection - maxRangeHandle.value
			);

			if (parseInt(maxRangeHandle.value) < parseInt(minRangeHandle.value)) {
				if (minHandleDiffernce < maxHandleDiffernce) {
					minRangeHandle.value = currentSelection;
					adjustSliderTrackSelection();
					if (e.target.closest('#scales')) {
						isScaleValueWithinAvailableRange(0, minRangeHandle.value);
						unavailbleScalesToolTip(minRangeHandle.value);
						return;
					}

					debounceInput(0, minRangeHandle.value);
					udpdateSliderHeading(0, minRangeHandle.value, true);
					return;
				}

				if (maxHandleDiffernce < minHandleDiffernce) {
					maxRangeHandle.value = currentSelection;
					adjustSliderTrackSelection();

					if (e.target.closest('#scales')) {
						isScaleValueWithinAvailableRange(1, maxRangeHandle.value);
						unavailbleScalesToolTip(minRangeHandle.value);
						return;
					}

					debounceInput(1, maxRangeHandle.value);
					udpdateSliderHeading(1, maxRangeHandle.value, true);
					return;
				}

				if (currentSelection > parseInt(maxRangeHandle.value)) {
					maxRangeHandle.value = currentSelection;
					adjustSliderTrackSelection();

					if (e.target.closest('#scales')) {
						isScaleValueWithinAvailableRange(1, maxRangeHandle.value);
						unavailbleScalesToolTip(minRangeHandle.value);
						return;
					}

					debounceInput(1, maxRangeHandle.value);
					udpdateSliderHeading(1, maxRangeHandle.value, true);
					return;
				}

				if (currentSelection < parseInt(minRangeHandle.value)) {
					minRangeHandle.value = currentSelection;
					adjustSliderTrackSelection();
					if (e.target.closest('#scales')) {
						isScaleValueWithinAvailableRange(0, minRangeHandle.value);
						unavailbleScalesToolTip(minRangeHandle.value);
						return;
					}

					debounceInput(0, minRangeHandle.value);
					udpdateSliderHeading(0, minRangeHandle.value, true);
					return;
				}
			}

			if (minHandleDiffernce === maxHandleDiffernce) {
				if (currentSelection - maxRangeHandle.value > 0) {
					maxRangeHandle.value = currentSelection;
					adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);

					if (e.target.closest('#scales')) {
						isScaleValueWithinAvailableRange(1, maxRangeHandle.value);
						unavailbleScalesToolTip(minRangeHandle.value);
						return;
					}

					debounceInput(1, maxRangeHandle.value);
					udpdateSliderHeading(1, maxRangeHandle.value, true);
					return;
				}

				if (currentSelection - minRangeHandle.value < 0) {
					minRangeHandle.value = currentSelection;
					adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
					if (e.target.closest('#scales')) {
						isScaleValueWithinAvailableRange(0, minRangeHandle.value);
						unavailbleScalesToolTip(minRangeHandle.value);
						return;
					}

					debounceInput(0, minRangeHandle.value);
					udpdateSliderHeading(0, minRangeHandle.value, true);
					return;
				}

				//if these handles are not overlapping move the minimum handle
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);

				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(0, minRangeHandle.value);
					unavailbleScalesToolTip(minRangeHandle.value);
				}

				debounceInput(0, minRangeHandle.value);
				udpdateSliderHeading(0, minRangeHandle.value, true);

				return;
			}

			if (
				currentSelection < minRangeHandle.value &&
				minHandleDiffernce < maxHandleDiffernce
			) {
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(0, minRangeHandle.value);
					unavailbleScalesToolTip(minRangeHandle.value);
					return;
				}

				debounceInput(0, minRangeHandle.value);
				udpdateSliderHeading(0, minRangeHandle.value, true);
			}

			if (
				currentSelection > maxRangeHandle.value &&
				minHandleDiffernce > maxHandleDiffernce
			) {
				maxRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);
				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(1, maxRangeHandle.value);
					unavailbleScalesToolTip(maxRangeHandle.value);
					return;
				}

				debounceInput(1, maxRangeHandle.value);
				udpdateSliderHeading(1, maxRangeHandle.value, true);
			}

			if (
				currentSelection > minRangeHandle.value &&
				minHandleDiffernce < maxHandleDiffernce
			) {
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(0, minRangeHandle.value);
					unavailbleScalesToolTip(minRangeHandle.value);
					return;
				}

				debounceInput(0, minRangeHandle.value);
				udpdateSliderHeading(0, minRangeHandle.value, true);
			}

			if (
				currentSelection < maxRangeHandle.value &&
				minHandleDiffernce > maxHandleDiffernce
			) {
				maxRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);
				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(1, maxRangeHandle.value);
					unavailbleScalesToolTip(maxRangeHandle.value);
					return;
				}

				debounceInput(1, maxRangeHandle.value);
				udpdateSliderHeading(1, maxRangeHandle.value, true);
			}
		});
	});

	//Listener that will updating the slider's header and the values
	container.querySelector('.minSlider').addEventListener('change', (event) => {
		let minVal = event.target.value;
		let sliderHandle;

		sliderHandle = 0;

		if (event.target.closest('#scales')) {
			isScaleValueWithinAvailableRange(sliderHandle, minVal);

			return;
		}
		debounceInput(0, minVal);
		udpdateSliderHeading(0, minVal, true);
	});

	container.querySelector('.maxSlider').addEventListener('change', (event) => {
		let maxVal = event.target.value;
		let sliderHandle = 1;

		if (event.target.closest('#scales')) {
			isScaleValueWithinAvailableRange(sliderHandle, maxVal);

			return;
		}

		debounceInput(1, maxVal);
		udpdateSliderHeading(1, maxVal, true);
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
