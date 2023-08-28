const mapListScrollBar = document.querySelector('#exploreList');

const scrollPosition = () => {
	return Math.abs(
		mapListScrollBar.scrollHeight -
			mapListScrollBar.clientHeight -
			mapListScrollBar.scrollTop
	);
};

//NOTE: Get feedback on this event listener. Is this a reliable way to find the bottom of an elements scroll?

const isScrollAtPageEnd = (callBack) => {
	mapListScrollBar.addEventListener('scroll', () => {
		if (
			mapListScrollBar.firstElementChild.classList.contains(
				'notificationMessage'
			)
		) {
			return;
		}

		if (scrollPosition() < 1) {
			callBack(true);
			// console.log(scrollPosition());
			// if (mapListScrollBar.scrollTop !== 0) {
			// 	console.log('calling query');
			// 	callBack(true);
			// }
		}
	});
};

// const bottom =
// 			e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

// 		console.log(
// 			mapListScrollBar.scrollHeight -
// 				mapListScrollBar.clientHeight -
// 				mapListScrollBar.scrollTop
// 		);
// 		console.log('scrolltop', e.target.scrollTop);
// 		console.log(bottom);
// 		console.log('clientheight', e.target.clientHeight);
// 		console.log(e.target.scrollHeight);
// 		if (bottom) {
// 			if (e.target.scrollTop !== 0) {
// 				callBack(true);
// 			}
// 		}

export { isScrollAtPageEnd };
