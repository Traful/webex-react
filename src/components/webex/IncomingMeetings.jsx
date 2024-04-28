import { useContext, useEffect, useState } from "react";
import WebexContext from "./webexstore/WebexContext";
import { getDataMeetings, joinMeeting, leaveMeeting } from "./webexstore/utilsWebEx";

const IncomingMeetings = () => {
	const wc = useContext(WebexContext);
	const [loading, setLoading] = useState(true);
	const [reuniones, setReuniones] = useState([]);

	useEffect(() => {
		if(wc.state.webEx) {
			getDataMeetings(wc.state.webEx).then(data => setReuniones(data)).finally(setLoading(false));
		}
	}, [wc.state.webEx]);

	const refresDataMeetings = () => {
		setLoading(true);
		getDataMeetings(wc.state.webEx).then(data => setReuniones(data)).finally(setLoading(false));
	};

	const connectToReunion = async (key) => {
		try {
			await joinMeeting(wc, key);
		} catch(error) {
			console.log(error);
		}
	};

	const leaveReunion = async (key) => {
		try {
			await leaveMeeting(wc, key);
			getDataMeetings(wc.state.webEx).then(data => setReuniones(data)).finally(setLoading(false));
		} catch(error) {
			console.log(error);
		}
	};

	return(
		<div className="IncomingMeetings">
			<div className="mb-2 flex justify-between gap-2">
				<h3 className="font-bold">Reuniones programadas</h3>
				<button className="cursor-pointer" onClick={refresDataMeetings}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
					</svg>
				</button>
			</div>
			{
				loading ?
				<div>Loading...</div>
				:
				reuniones.length > 0 ?
				<ul>
					{
						reuniones.map((r) => {
							if(r.key === wc.state.webExMeetingKey) {
								return (
									<li className="p-1 bg-green-800 text-white rounded-sm cursor-pointer hover:bg-green-500 hover:text-black" key={r.key} onClick={() => leaveReunion(r.key)}>
										{r.title}
									</li>
								)
							}
							return (
								<li className="p-1 bg-gray-800 text-white rounded-sm cursor-pointer hover:bg-green-500 hover:text-black" key={r.key} onClick={() => connectToReunion(r.key)}>
									{r.title}
								</li>
							)
						})
					}
				</ul>
				:
				<div>No hay reuniones programadas</div>
			}
		</div>
	);
};

export default IncomingMeetings;