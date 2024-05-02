import { useReducer } from "react";
import WebexContext from "./WebexContext";
import reducer from "./reducer";
import { defaultData } from "./constants";

const WebexData = (props) => {
	const [state, dispatch] = useReducer(reducer, defaultData);

	return(
		<WebexContext.Provider value={{ state, dispatch }}>
			{ props.children }
		</WebexContext.Provider>
	);
};

export default WebexData;