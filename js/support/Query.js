let isQuerying;

let controller = new AbortController();

const cancelQuery = () => {
	controller.abort();
	controller = new AbortController();
};

const extentQuery = async (url, params) => {
	if (isQuerying !== true) {
		isQuerying = true;
	} else {
		cancelQuery();
		isQuerying = true;
	}

	return new Promise((resolve, reject) => {
		axios
			.get(url, { params, signal: controller.signal })
			.then((response) => {
				isQuerying = false;

				!isQuerying ? resolve(response) : (response = []);
			})
			.catch((error) => {
				if (error.message.includes('canceled')) {
					return;
				}
				console.log(error);
			});
	});
};

const numberOfMapsinView = async (url, params) => {
	if (isQuerying !== true) {
		isQuerying = true;
	} else {
		isQuerying = true;
		cancelQuery();
	}

	return new Promise((resolve, reject) => {
		axios
			.get(url, { params, signal: controller.signal })
			.then((response) => {
				isQuerying = false;

				resolve(response);
			})
			.catch((error) => {
				if (error.message.includes('canceled')) {
					return;
				}
				console.log(error);
			});
	});
};

const queryForHashedTopos = (url, params) => {
	return new Promise((resolve, reject) => {
		axios
			.get(url, { params })
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				console.log(error);
			});
	});
};

export { extentQuery, numberOfMapsinView, queryForHashedTopos };
