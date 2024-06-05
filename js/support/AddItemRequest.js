import { setUserContentURL } from '../UI/ExportMapsPrompt/exportPromptUI.js?v=0.03';

let accountData = {
	urlKey: '',
	customUrl: '',
	url: '',
};
let userToken;

const setAccountData = async (authorizationResponse) => {
	accountData = authorizationResponse;
	setUserContentURL(accountData.urlKey, accountData.customUrl, accountData.url);
};

const setUserToken = (credentials) => {
	if (!credentials) {
		return;
	}
	userToken = credentials.token;
};

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
				resolve(response);
			})
			.catch((error) => {
				resolve(error);
			});
	});
};

export { addWebMapToUserPortal, setAccountData, setUserToken };
