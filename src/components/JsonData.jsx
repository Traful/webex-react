import { useContext } from "react";
import WebexContext from "./webex/webexstore/WebexContext";

const JsonData = () => {
	const wc = useContext(WebexContext);

	return(
		<div className="">
			<pre>
				<code>
					{ JSON.stringify(wc.state, null, 4) }
				</code>
			</pre>
			
		</div>
	);
};

export default JsonData;