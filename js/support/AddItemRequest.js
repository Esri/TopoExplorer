import { setUserContentURL } from '../UI/ExportMapsPrompt/exportPromptUI.js?v=0.01';

let accountData;
let userToken;

const setAccountData = async (authorizationResponse) => {
	console.log(authorizationResponse);
	accountData = authorizationResponse;
	setUserContentURL(accountData.urlKey, accountData.customUrl, accountData.url);
};

const setUserToken = (credentials) => {
	userToken = credentials.token;
};
// const addTokenAndSendRequest = (webMapDef) => {
// 	webMapDef.token = accountData.token;
// 	addWebMapToUserPortal(webMapDef);
// };

const addWebMapToUserPortal = (webMapDef) => {
	return new Promise((resolve, reject) => {
		webMapDef.token = userToken;

		axios
			.post(
				`${accountData.restUrl}/content/users/${accountData.userName}/addItem?`,
				webMapDef,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			.then((response) => {
				console.log('response from POST request', response);
				resolve(response);
				resolve('error');
			})
			.catch((error) => {
				console.log('request denied', error);
			});
	});
};

export { addWebMapToUserPortal, setAccountData, setUserToken };
