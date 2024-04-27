import { useContext } from "react";
import WebexContext from "./webexstore/WebexContext";

const Members = () => {
	const wc = useContext(WebexContext);
	return(
		<div className="Members">
			<pre>
				<code>
					{
						JSON.stringify(wc.state.members, null, 4)
					}
				</code>
			</pre>
		</div>
	);
};

export default Members;