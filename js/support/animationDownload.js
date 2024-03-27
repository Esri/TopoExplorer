import {
	addDownloadCancel,
	removeDownloadIndicator,
	addAnimationCloseBtn,
} from '../UI/Animation/animation.js?v=0.01';

const images2VideoClient =
	window['@vannizhang/images-to-video-converter-client'];

let controller = null;

const cancelAnimationVideo = () => {
	console.log('cancelling');
	controller.abort();
	revertAnimationUIToPreview();
};

const createAnimationVideo = (params) => {
	console.log('...downloading');
	controller = params.abortController;
	addDownloadCancel();

	images2VideoClient
		.convertImages2Video(params)
		.then((response) => {
			console.log(response);

			const videoURL = URL.createObjectURL(response.fileContent);
			downloadVideo(params, videoURL, response.filename);

			if (window.location.host !== 'livingatlas.arcgis.com') {
				// saveDownloadComponents(params, videoURL, response);
			}
		})
		.catch((error) => {
			if (error.message.includes('canceled')) {
				return;
			}
			console.log(error);
		});
};

const revokeBlobDownloadURL = (downloadURL) => {
	URL.revokeObjectURL(downloadURL);
};

const revokeCompositeBlobURLs = (compositeData) => {
	compositeData.map((compositeImage) => {
		URL.revokeObjectURL(compositeImage.image.src);
	});
};

const downloadVideo = (params, url, filename) => {
	console.log(url);
	const anchor = document.createElement('a');

	anchor.href = url;
	anchor.download = `${filename}`;

	anchor.click();
	anchor.remove();
	console.log(anchor);
	revokeBlobDownloadURL(url);
	revokeCompositeBlobURLs(params.data);
	revertAnimationUIToPreview();
};

const revertAnimationUIToPreview = () => {
	removeDownloadIndicator();
	addAnimationCloseBtn();
};

const saveDownloadComponents = (params, videoURL, response) => {
	const imgSources = params.data.map((imgFile) => {
		console.log(imgFile.image.src);
		console.log(imgFile.imageInfo);
		return [imgFile.imageInfo, imgFile.image.src];
	});

	const components = {
		downloadParams: params,
		animationFrames: imgSources,
		animationServiceResponse: response,
		animationMP4: videoURL,
	};

	console.log(components);

	const downloadComponents = encodeURIComponent(JSON.stringify(components));
	const componentsURL = `data:text/json;charset=utf-8, ${downloadComponents}`;

	console.log('download components', componentsURL);
	const anchor = document.createElement('a');

	anchor.href = componentsURL;
	anchor.download = `download_components.json`;

	anchor.click();
	anchor.remove();
};

export { createAnimationVideo, cancelAnimationVideo };
