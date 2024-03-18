const makeCompositeForAnimationDownload = async (basemap, topo) => {
	//will create an image that combines the basemap image and each of the topoMap images present in the imagesForDownload obj.
	//Once the composite is made, on obj with the image and corresponding information will be stored in the imagesForDownload obj's animationImages array

	//note: I'm going to remove this hard-coded value. I've included for now just to get the function working properly
	const widthOfSideBar = 400;
	const viewWidth = window.innerWidth - widthOfSideBar;
	const viewHeight = window.innerHeight;

	const canvas = document.createElement('canvas');
	canvas.width = viewWidth;
	canvas.height = viewHeight;
	const compositeCanvas = canvas.getContext('2d');

	const drawBackgroundImg = new Promise((resolve, reject) => {
		const basemapContext = new Image();

		basemapContext.onload = () => {
			resolve(compositeCanvas.drawImage(basemapContext, 0, 0));
		};

		basemapContext.onerror = (error) => {
			console.error('background image failed to load', error);
		};

		basemapContext.src = basemap.url;
	}).catch((error) => {
		reject(console.error('error while drawing basemap image to canvas', error));
	});

	const drawTopoMap = new Promise((resolve, reject) => {
		const topoMap = new Image();
		topoMap.onload = () => {
			resolve(compositeCanvas.drawImage(topoMap, 0, 0));
		};
		topoMap.onerror = (error) => {
			console.error('topo image failed to load', error);
		};
		topoMap.src = topo.url;
	}).catch((error) => {
		reject(console.error('error while drawing topo image to canvas', error));
	});

	Promise.all([drawBackgroundImg, drawTopoMap])
		.then(() => {
			createCanvasLink();
		})
		.catch((error) => {
			console.error('failure to generate composite for animation frame', error);
		});

	const createCanvasLink = () => {
		console.log(compositeCanvas);
		canvas.toBlob((blob) => {
			console.log(blob);
			const url = URL.createObjectURL(blob);
			console.log(`${url}`);
			document.querySelector('.choice a').setAttribute.href = url;
		});
	};
};

export { makeCompositeForAnimationDownload };
