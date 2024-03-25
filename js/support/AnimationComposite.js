const widthOfSideBar = 400;
const arrayOfCompositeImages = [];

console.log('loink');
const makeCompositeForAnimationDownload = async (basemap, topo) => {
	console.log(topo);
	return new Promise(async (resolve, reject) => {
		const viewWidth = window.innerWidth - widthOfSideBar;
		const viewHeight = window.innerHeight;

		const canvas = document.createElement('canvas');
		canvas.width = viewWidth;
		canvas.height = viewHeight;
		const compositeCanvas = canvas.getContext('2d');

		await drawBackgroundImg(basemap, compositeCanvas);
		await drawTopoMap(topo, compositeCanvas);

		const canvasBlob = createLinkForCompositeImage(canvas);

		canvasBlob.then((blob) => {
			console.log('resolved blolb', blob);
			const url = URL.createObjectURL(blob, 'image/png');
			// console.log(createAnimationImageElement(url));
			resolve(createAnimationImageElement(url, topo));
		});
	});
	//will create an image that combines the basemap image and each of the topoMap images present in the imagesForDownload obj.
	//Once the composite is made, on obj with the image and corresponding information will be stored in the imagesForDownload obj's animationImages array

	//note: I'm going to remove this hard-coded value. I've included for now just to get the function working properly
	// const viewWidth = window.innerWidth - widthOfSideBar;
	// const viewHeight = window.innerHeight;

	// const canvas = document.createElement('canvas');
	// canvas.width = viewWidth;
	// canvas.height = viewHeight;
	// const compositeCanvas = canvas.getContext('2d');

	// await drawBackgroundImg(basemap, compositeCanvas);
	// await drawTopoMap(topo, compositeCanvas);

	// const canvasBlob = createLinkForCompositeImage(canvas);

	// canvasBlob.then((blob) => {
	// 	console.log('resolved blolb', blob);
	// 	const url = URL.createObjectURL(blob, 'image/png');
	// 	console.log(createAnimationImageElement(url));
	//   resolve createAnimationImageElement(url)
	// });
};

const createLinkForCompositeImage = (canvas, array) => {
	//convert the canvas's current image into a URL.
	// console.log(compositeCanvas);
	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			// // console.log(blob);
			// const compositeImage = new Image();
			// const url = URL.createObjectURL(blob, 'image/png');

			// compositeImage.onload = () => {
			// 	URL.revokeObjectURL(url);
			// 	resolve(compositeImage);
			// };

			// compositeImage.src = url;
			// console.log(compositeImage);
			resolve(blob);
		});
	}, 'image/jpeg');
};

const createAnimationImageElement = (blobURL, topo) => {
	const compositeImage = new Image();
	compositeImage.onload = () => {
		// URL.revokeObjectURL(blobURL);
	};

	compositeImage.src = blobURL;
	const imageObj = {
		image: compositeImage,
		imageInfo: topo.mapName,
	};
	// console.log(compositeImage);
	return imageObj;
};

const drawBackgroundImg = async (basemap, compositeCanvas) => {
	return new Promise((resolve, reject) => {
		//create an image element linked to the current basemap. This will be the background image on the canvas
		const basemapBackgroundContext = new Image();

		basemapBackgroundContext.onload = () => {
			resolve(compositeCanvas.drawImage(basemapBackgroundContext, 0, 0));
		};

		basemapBackgroundContext.onerror = (error) => {
			console.error('background image failed to load', error);
		};

		basemapBackgroundContext.src = basemap.url;
	}).catch((error) => {
		reject(console.error('error while drawing basemap image to canvas', error));
	});
};

const drawTopoMap = async (topo, compositeCanvas) => {
	return new Promise((resolve, reject) => {
		//create an image element linked to the topo. This image will be placed atop the basemap image on the canvas.
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
};

const download = (url, canvas) => {
	//Create an 'a' element that facilitates the image download using the blob URL. Once the download has been initiated, remove the 'a' element and remove the blob URL from memory.
	const anchor = document.createElement('a');

	anchor.href = url;
	anchor.download = 'animationComposite.png';

	anchor.click();
	anchor.remove();
	console.log(anchor);
	revokeBlobDownloadURL(url);
};

const deleteCanvasElement = (canvas) => {
	console.log(canvas);
	canvas.remove();
	console.log(canvas);
};

const revokeBlobDownloadURL = (downloadURL) => {
	URL.revokeObjectURL(downloadURL);
	console.log(arrayOfCompositeImages);
};

export { makeCompositeForAnimationDownload };
