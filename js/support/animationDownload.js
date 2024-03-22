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
	// setTimeout(() => {
	// 	downloadVideo();
	// }, 3000);
	images2VideoClient
		.convertImages2Video(params)
		.then((response) => {
			console.log(response);

			const videoURL = URL.createObjectURL(response.fileContent);
			downloadVideo(videoURL, response.filename);
			revokeCompositeBlobURLs(params.data);
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

const downloadVideo = (url) => {
	console.log(url);
	const anchor = document.createElement('a');

	anchor.href = url;
	anchor.download = 'animationComposite.png';

	anchor.click();
	anchor.remove();
	console.log(anchor);
	revokeBlobDownloadURL(url);
	revertAnimationUIToPreview();
};

const revertAnimationUIToPreview = () => {
	removeDownloadIndicator();
	addAnimationCloseBtn();
};
export { createAnimationVideo, cancelAnimationVideo };
