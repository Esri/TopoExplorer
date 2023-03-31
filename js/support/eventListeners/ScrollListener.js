const mapListScrollBar = document.querySelector('#mapsList');

const scrollPosition = () => {
	return Math.abs(
		mapListScrollBar.scrollHeight -
			mapListScrollBar.clientHeight -
			mapListScrollBar.scrollTop
	);
};

const isScrollAtPageEnd = (callBack) => {
	mapListScrollBar.addEventListener('scroll', () => {
		if (scrollPosition() < 1 && scrollPosition() !== 0) {
			callBack(true);
		}
	});
};

export { isScrollAtPageEnd };
