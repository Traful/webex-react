import { useContext, useEffect, useState } from "react";
import WebexContext from "./webexstore/WebexContext";

const Members = () => {
	const wc = useContext(WebexContext);
	const [miembros, setMiembros] = useState([]);

	useEffect(() => {
		setMiembros(wc.state.members);
	}, [wc.state.members]);

	return(
		<div className="Members">
			<pre>
				<code>
					{
						JSON.stringify(miembros, null, 4)
					}
				</code>
			</pre>
		</div>
	);
};

export default Members;