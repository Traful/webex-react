import { useContext, useState } from "react";
import WebexContext from "./webexstore/WebexContext";

const RegUnReg = () => {
	const wc = useContext(WebexContext);
	const [disabled, setDisabled] = useState(false);

	const register = async () => {
		try {
			await wc.state.webEx.meetings.register();
			setDisabled(true);
			console.log("Se registro el componente!");
		} catch(error) {
			console.log(error);
		}
	};

	const unregister = async () => {
		try {
			await wc.state.webEx.meetings.unregister();
			setDisabled(false);
			console.log("Se DES registro el componente!");
		} catch(error) {
			console.log(error);
		}
	};

	return(
		<div className="flex justify-between mb-4">
			<button className={`cursor-pointer rounded p-2 ${disabled ? "bg-green-800" : "bg-green-400"}`} onClick={register} disabled={disabled}>Registrar</button>
			<button className={`cursor-pointer rounded p-2 ${disabled ? "bg-red-400" : "bg-red-800"}`} onClick={unregister} disabled={!disabled}>Desregistrar</button>
		</div>
	);
};

export default RegUnReg;