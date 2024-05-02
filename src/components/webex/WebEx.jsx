import { useContext, useEffect } from "react";
import WebexContext from "./webexstore/WebexContext";
import { SET_WEBEX } from "./webexstore/constants";
import { VITE_WEBEX_KEY } from "./../../config";
import { generateWebexConfig } from "./webexstore/utilsWebEx";

const WebEx = (props) => {
	const wc = useContext(WebexContext);

	useEffect(() => {
		var webex =  null;
		const initWebEx = async () => {
			try {
				webex = await window.Webex.init({
					config: generateWebexConfig({}),
					credentials: {
						access_token: VITE_WEBEX_KEY
					}
				});
				await webex.meetings.register();
				webex.meetings._toggleUnifiedMeetings(true); //V1: false o V2: true (Toggles meeting between old and new versions. (Does not apply to currently running meetings))
				wc.dispatch({ type: SET_WEBEX, payload: webex });
			} catch(err) {
				console.error(err);
			}
		}
		if(wc.state.webEx) {
			webex = wc.state.webEx;
		} else {
			initWebEx();
		}
		return async () => {
			if(webex) {
				await webex.meetings.unregister();
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return(
		<div className="WebEx">
			{
				wc.state.webEx ?
				<div>{ props.children }</div>
				:
				<div>...</div>
			}
			<div>
				<h1>Codigo!</h1>
				<pre>
					<code>
						{ JSON.stringify(wc.state, null, 4) }
					</code>
				</pre>
			</div>
		</div>
	);
};

export default WebEx;