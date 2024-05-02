import { queryController } from './queryController.js?v=0.01';

// const arrayOfCompositeImages = [];

const makeCompositeForAnimationDownload = async (basemap, topo) => {
	try {
		//will create an image that combines the basemap image and each of the topoMap images present in the imagesForDownload obj.
		//Once the composite is made, on obj with the image and corresponding information will be stored in the imagesForDownload obj's animationImages array

		return new Promise(async (resolve, reject) => {
			const viewWidth = queryController.mapView.width;
			const viewHeight = queryController.mapView.height;

			const canvas = document.createElement('canvas');
			canvas.width = viewWidth;
			canvas.height = viewHeight;
			const compositeCanvas = canvas.getContext('2d');

			try {
				await drawBackgroundImg(basemap, compositeCanvas);
				await drawTopoMap(topo, compositeCanvas);
			} catch (error) {
				console.log('error during topo image drawing on canvas', error);
			}

			const canvasBlob = createLinkForCompositeImage(canvas);

			canvasBlob.then((blob) => {
				const url = URL.createObjectURL(blob, 'image/png');

				//this is for testing only. Checks the quality of the recently made composite image
				// downloadCompositeImages(basemap.url);
				console.log('the URL is ready', url);
				createAnimationImageElement(url, topo).then((animationImageElement) => {
					resolve(animationImageElement);
				});
			});
		});
	} catch (error) {
		console.log('error during topo image drawing on canvas, error', error);
	}
};

const createLinkForCompositeImage = (canvas, array) => {
	//convert the canvas's current image into a URL.
	//canvas.toBlob is an asynchronous method
	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			resolve(blob);
		});
	}, 'image/jpeg');
};

const createAnimationImageElement = (blobURL, topo) => {
	return new Promise((resolve, reject) => {
		const compositeImage = new Image();

		compositeImage.onload = () => {
			resolve(imageObj);
		};

		compositeImage.src = blobURL;
		const imageObj = {
			image: compositeImage,
			imageInfo: topo.mapName,
		};
	});
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
		console.error('error while drawing basemap image to canvas', error);
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

const downloadCompositeImages = (url) => {
	//Create an 'a' element that facilitates the image download using the blob URL. Once the download has been initiated, remove the 'a' element and remove the blob URL from memory.
	const anchor = document.createElement('a');

	anchor.href = url;
	anchor.download = 'animationComposite.png';

	anchor.click();
	anchor.remove();
};

// const deleteCanvasElement = (canvas) => {
// 	canvas.remove();
// };

// const revokeBlobDownloadURL = (downloadURL) => {
// 	URL.revokeObjectURL(downloadURL);
// 	console.log(arrayOfCompositeImages);
// };

export { makeCompositeForAnimationDownload };
