import { useContext, useEffect, useState } from "react";
import WebexContext from "./webexstore/WebexContext";
import { VITE_WEBEX_KEY } from "./../../config";
import { SET_MEETING_KEY, RESET_MEETING, SET_MEDIA, SET_MEMBERS } from "./webexstore/constants";

import JsonData from "./../JsonData";


const getDataMeetings = async (webEx) => {
	await webEx.meetings.syncMeetings();
	let meetings = await webEx.meetings.getAllMeetings();
	var buffer = [];
	var keys = Object.keys(meetings);
	for(let index = 0; index < keys.length; index++) {
		let key = keys[index];
		try {
			let infoMeeting = await fetch(`https://webexapis.com/v1/meetings/${meetings[key].destination.info.globalMeetingId}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${VITE_WEBEX_KEY}`
				}
			});
			let jsonInfo = await infoMeeting.json();
			buffer.push({
				key: key,
				startEnd: `${jsonInfo.start} - ${jsonInfo.end}`,
				title: jsonInfo.title,
				password: jsonInfo.password,
				webLink: jsonInfo.webLink,
				label: meetings[key].sipUri || meetings[key].id || meetings[key].destination
			});
		} catch(error) {
			console.log(error);
		}
	}
	return buffer;
};

const IncomingMeetings = () => {
	const wc = useContext(WebexContext);
	const [loading, setLoading] = useState(true);
	const [reuniones, setReuniones] = useState([]);

	useEffect(() => {
		if(wc.state.webEx) {
			getDataMeetings(wc.state.webEx).then(data => setReuniones(data)).finally(() => setLoading(false));
		}
	}, [wc.state.webEx]);

	const refresDataMeetings = () => {
		setLoading(true);
		getDataMeetings(wc.state.webEx).then(data => setReuniones(data)).finally(setLoading(false));
	};

	const connectToReunion = async (key) => {
		try {
			await leaveReunion();
			await wc.state.webEx.meetings.syncMeetings();
			let objMeeting = await wc.state.webEx.meetings.getAllMeetings()[key];
			if(!objMeeting) {
				throw new Error(`La reunión ${key} no es válida o ya ha concluido.`);
			}
			objMeeting.on("error", (err) => {
				console.error(err);
			});

			//Bind eventos
			objMeeting.on("media:ready", (media) => {
				if(media) {
					let newState = ({ ...wc.state.media });
					switch(media.type) {
						case "local":
							newState.local = media.stream;
							break;
						case "remoteVideo":
							newState.remoteVideo = media.stream;
							break;
						case "remoteAudio":
							newState.remoteAudio = media.stream;
							break;
						case "remoteShare":
							newState.remoteShare = media.stream;
							break;
						default:
							console.log(`El medio ${media.type} no tiene handler!`);
					}
					wc.dispatch({ type: SET_MEDIA, payload: newState });
				}
			});
			objMeeting.on("media:stopped", (media) => {
				if(media) {
					let newState = ({ ...wc.state.media });
					switch(media.type) {
						case "local":
							newState.local = null;
							break;
						case "remoteVideo":
							newState.remoteVideo = null;
							break;
						case "remoteAudio":
							newState.remoteAudio = null;
							break;
						case "remoteShare":
							newState.remoteShare = null;
							break;
						default:
							console.log(`El medio ${media.type} no tiene handler!`);
					}
					wc.dispatch({ type: SET_MEDIA, payload: newState });
				}
			});
			objMeeting.members.on("members:update", (res) => {
				let buffer = [];
				let { members } = objMeeting.members.membersCollection;
				let keys = Object.keys(members);
				for(let index = 0; index < keys.length; index++) {
					let key = keys[index];
					buffer.push({
						key: key,
						name: members[key].name,
						isVideoMuted: members[key].isVideoMuted,
						isAudioMuted: members[key].isAudioMuted,
						status: members[key].status,
						supportsBreakouts: members[key].supportsBreakouts,
						isInLobby: members[key].isInLobby //await selectedMetting.admit([key]);
					});
					/*
					if(members[key].isInLobby) {
						await meeting.admit([key]);
					}
					*/
				}
				console.log(buffer);
				wc.dispatch({ type: SET_MEMBERS, payload: buffer });
			});

			await objMeeting.join();
			const mediaSettings = {
				receiveVideo: true,
				receiveAudio: true,
				receiveShare: false,
				sendVideo: true,
				sendAudio: true,
				sendShare: false
			};
			/*
			let defaultDevices = {
				audio: {
					deviceId: {
						exact: "4173947f7a9a5a45f677bd291d1aba384fae669bb72ba0faf54ebfd1f01762d5"
					}
				},
				video: {
					deviceId: {
						exact: "cab9a51ddac09477bde62897f1bf05734076386d5259c4941f3f3834d877fd60"
					}
				}
			};
			*/
			//return objMeeting.getMediaStreams(mediaSettings, defaultDevices).then((mediaStreams) => {
			let mediaStreams = await objMeeting.getMediaStreams(mediaSettings)
			let [localStream, localShare] = mediaStreams;
			objMeeting.addMedia({
				localShare,
				localStream,
				mediaSettings
			});

			wc.dispatch({ type: SET_MEETING_KEY, payload: key });
		} catch(error) {
			console.log(error);
		}
	};

	const leaveReunion = async () => {
		if(wc.state.webExMeetingKey) {
			await wc.state.webEx.meetings.syncMeetings();
			let meeting = await wc.state.webEx.meetings.getAllMeetings()[wc.state.webExMeetingKey];
			meeting.leave();
			wc.dispatch({ type: RESET_MEETING });
		}
	};

	return(
		<div className="IncomingMeetings w-full">
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
				<>
				<ul>
					{
						reuniones.map((r) => {
							console.log(r.key);
							if(r.key === wc.state.webExMeetingKey) {
								return (
									<li className="p-1 bg-green-800 text-white rounded-sm cursor-pointer hover:bg-green-500 hover:text-black" key={r.key} onClick={leaveReunion}>
										{r.title} [LEAVE]
									</li>
								)
							}
							return (
								<li className="p-1 bg-gray-800 text-white rounded-sm cursor-pointer hover:bg-green-500 hover:text-black" key={r.key} onClick={() => connectToReunion(r.key)}>
									{r.title} [JOIN]
								</li>
							)
						})
					}
				</ul>
				</>
				:
				<div>No hay reuniones programadas</div>
			}
		</div>
	);
};

export default IncomingMeetings;