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
	max
) => {
	const container = document.getElementById(`${containerId}`);
	//NOTE: I'm using an 'ondragstart' attribute to stop any drag events on that element. I'm using it to try and solve a bug. if this DOES work, I should implement this attribute more responsibly.
	container.innerHTML = `
    <div class="sliderHeader">
      <button class="sliderBtn">
        <div class="filterAndSortBtn">${title}:</div>
        <div class="headers">  
        <p>
            <span class="headerSpan">
              ${formatNumbersForSliderHeader(min)}
						</span> 
            - <span class="headerSpan">${formatNumbersForSliderHeader(
							max
						)}</span>
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
          </div>
       </div>
    </div>
  </div>
`;

	const sliderComponents = container.querySelector('.inputs');

	console.log(sliderComponents);

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

	const udpdateSliderHeading = (child, value) => {
		container.querySelectorAll(`.sliderBtn span`)[child].innerHTML =
			formatNumbersForSliderHeader(values[value]);
	};

	const addSliderTooltipVisibility = (index) => {
		container.querySelectorAll('.tooltip').forEach((tooltip) => {
			tooltip.classList.add('invisible');
		});
		container.querySelectorAll('.tooltip')[index].classList.remove('invisible');
	};

	const removeSliderToolTipVisibility = () => {
		container.querySelectorAll('.tooltip').forEach((tooltip) => {
			console.log(tooltip);
			if (!tooltip.classList.contains('invisible')) {
				tooltip.classList.add('invisible');
			}
		});
	};

	const adjustSliderTrackSelection = () => {
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
			console.log(e);
			// console.log(input.querySelector('.minSlider'));
			let minRange = parseInt(minRangeHandle.value);
			console.log(minRange);
			let maxRange = parseInt(maxRangeHandle.value);

			//controling the limits of slider handels. Making sure they don't overlap over each other.
			//TODO: I want them to overlap now. how do I do that AND make sure you can access the previously used slider??
			if (minRange >= maxRange) {
				if (e.target.className === 'minSlider') {
					minRangeHandle.value = maxRange;
				} else {
					maxRangeHandle.value = minRange;
				}
			}
			// else {
			//NOTE: needs a better name
			adjustSliderTrackSelection(e.target, e.target.valueAsNumber);
			// }
		});

		input.addEventListener('input', (e) => {
			// console.log(e);
			addSliderTooltipVisibility(e.target.value);
		});

		input.addEventListener('mouseup', (e) => {
			console.log(e);
			removeSliderToolTipVisibility();
		});

		// input.addEventListener('mousedown', (e) => {
		// 	console.log('click', e);
		// 	console.log(e.target.attributes.value.nodeType);
		// 	minRangeHandle.value = e.target.attributes.value.value;
		// });
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
			console.log(minHandleDiffernce);
			console.log(maxHandleDiffernce);
			if (minHandleDiffernce <= maxHandleDiffernce) {
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
				debounceInput(0, minRangeHandle.value);
				udpdateSliderHeading(0, minRangeHandle.value);
			} else {
				maxRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);
				debounceInput(1, maxRangeHandle.value);
				udpdateSliderHeading(1, maxRangeHandle.value);
			}
		});

		// area.addEventListener('mousedown', (e) => {
		// isSelecting = true;
		// console.log(parseInt(e.target.attributes.value.value));

		// let downSelection = parseInt(e.target.attributes.value.value);

		// let minHandleDiffernce = Math.abs(downSelection - minRangeHandle.value);
		// let maxHandleDiffernce = Math.abs(downSelection - maxRangeHandle.value);

		// if (minHandleDiffernce <= maxHandleDiffernce) {
		// 	minRangeHandle.value = downSelection;
		// 	adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
		// } else {
		// 	maxRangeHandle.value = downSelection;
		// 	adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);
		// }
		// });

		// area.addEventListener('mouseenter', (e) => {
		// 	if (isSelecting) {
		// 		console.log(
		// 			'the current value',
		// 			parseInt(e.target.attributes.value.value)
		// 		);

		// 		let moveSelection = parseInt(e.target.attributes.value.value);

		// 		let minHandleDiffernce = Math.abs(moveSelection - minRangeHandle.value);
		// 		let maxHandleDiffernce = Math.abs(moveSelection - maxRangeHandle.value);

		// 		if (minHandleDiffernce < maxHandleDiffernce) {
		// 			// minRangeHandle.value = moveSelection;
		// 			if (moveSelection > maxRangeHandle.value) {
		// 				minRangeHandle.value = maxRangeHandle.value;
		// 				addSliderTooltipVisibility(minRangeHandle.value);
		// 				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
		// 			} else {
		// 				minRangeHandle.value = moveSelection;
		// 				addSliderTooltipVisibility(minRangeHandle.value);
		// 				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
		// 			}
		// 			adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
		// 		} else if (minHandleDiffernce === maxHandleDiffernce) {
		// 		} else {
		// 			if (moveSelection < minRangeHandle.value) {
		// 				maxRangeHandle.value = minRangeHandle.value;
		// 				addSliderTooltipVisibility(maxRangeHandle.value);
		// 				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
		// 			} else {
		// 				maxRangeHandle.value = moveSelection;
		// 				// adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
		// 			}
		// 			maxRangeHandle.value = moveSelection;
		// 			addSliderTooltipVisibility(maxRangeHandle.value);
		// 			adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);
		// 		}

		// 		// console.log('the current max', maxRangeHandle.value);
		// 		// minRangeHandle.value = parseInt(e.target.attributes.value.value);

		// 		// if (moveSelection > maxRangeHandle.value) {
		// 		// 	minRangeHandle.value = maxRangeHandle.value - 1;
		// 		// } else {
		// 		// 	minRangeHandle.value = moveSelection;
		// 		// }

		// 		adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
		// 		// addSliderTooltipVisibility(minRangeHandle.value);
		// 	}
		// });
	});

	//Listener that will updating the slider's header and the values
	//Is this a good method?
	container.querySelector('.minSlider').addEventListener('change', (evt) => {
		let minVal = evt.target.value;

		debounceInput(0, minVal);
		udpdateSliderHeading(0, minVal);
	});

	container.querySelector('.maxSlider').addEventListener('change', (evt) => {
		let maxVal = evt.target.value;

		debounceInput(1, maxVal);
		udpdateSliderHeading(1, maxVal);
	});

	//Listener to toggle the slider container visibility
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
