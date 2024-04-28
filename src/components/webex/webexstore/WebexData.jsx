import { useEffect, useReducer } from "react";
import WebexContext from "./WebexContext";
import { VITE_WEBEX_KEY } from "./../../../config";
import reducer from "./reducer";
import { defaultData, SET_WEBEX } from "./constants";
import { generateWebexConfig } from "./utilsWebEx";

const WebexData = (props) => {
	const [state, dispatch] = useReducer(reducer, defaultData);

	useEffect(() => {
		var webex =  null;
		const initWebex = async () => {
			try {
				webex = await window.Webex.init({
					config: generateWebexConfig({}),
					credentials: {
						access_token: VITE_WEBEX_KEY
					}
				});
				await webex.meetings.register();
				webex.meetings._toggleUnifiedMeetings(true); //V1: false o V2: true (Toggles meeting between old and new versions. (Does not apply to currently running meetings))
				dispatch({ type: SET_WEBEX, payload: webex });
			} catch(err) {
				console.error(err);
				alert(err);
			}
		};
		initWebex();
		return async () => {
			if(webex) {
				console.log("Cerrando!");
				await webex.meetings.unregister();
			}
		}
	}, []);

	if(!state.webEx) return <div>Loading...</div>;

	return(
		<WebexContext.Provider value={{ state, dispatch }}>
			{ props.children }
		</WebexContext.Provider>
	);
};

export default WebexData;