const mapListItems = document.querySelectorAll('.map-list-slots');
const container = document.querySelector('#mapsList');

// console.log();

// const mapItemOnClick = (mapListItems) => {
// 	console.log('connected?');

const mapItemOnClick = () =>
	container.childNodes.forEach((mapItem) => {
		mapItem.addEventListener('mouseenter', (event) => {
			event.stopPropagation();
			// console.log(mapItem);
			// event.preventDefault();
			const mapid = mapItem.attributes.value.value;
			console.log('hover', mapid);
		});

		mapItem.addEventListener('click', () => {
			const mapid = mapItem.attributes.value.value;
			// console.log(mapid);
			if (mapItem.querySelector('.action-container')) {
				// console.log('found it');
				if (
					mapItem
						.querySelector('.action-container')
						.classList.contains('invisible')
				) {
					mapItem
						.querySelector('.action-container')
						.classList.remove('invisible');
				} else {
					mapItem.querySelector('.action-container').classList.add('invisible');
				}
			}
		});
	});
// };
export { mapItemOnClick };
