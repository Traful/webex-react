import { VITE_WEBEX_KEY } from "./../../../config";
import { SET_MEETING, SET_MEMBERS, SET_LOCAL, SET_REMOTE_VIDEO, SET_REMOTE_AUDIO, SET_REMOTE_SHARE } from "./constants";

export const getDataMeetings = async (webEx) => {
	await webEx.meetings.syncMeetings();
	let meetings = webEx.meetings.getAllMeetings();
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

const bindMeetingEvents = (dispatch, meeting) => {

	meeting.on("error", (err) => {
		console.error(err);
	});

	// Handle media streams changes to ready state
	meeting.on("media:ready", (media) => {
		if(!media) {
			return;
		}
		switch(media.type) {
			case "local":
				dispatch({ type: SET_LOCAL, payload: media.stream });
				break;
			case "remoteVideo":
				dispatch({ type: SET_REMOTE_VIDEO, payload: media.stream });
				break;
			case "remoteAudio":
				dispatch({ type: SET_REMOTE_AUDIO, payload: media.stream });
				break;
			case "remoteShare":
				dispatch({ type: SET_REMOTE_SHARE, payload: media.stream });
				break;
			default:
				console.log(`El medio ${media.type} no tiene handler!`);
		}
	});

	meeting.on("media:stopped", (media) => {
		switch(media.type) {
			case "local":
				dispatch({ type: SET_LOCAL, payload: null });
				break;
			case "remoteVideo":
				dispatch({ type: SET_REMOTE_VIDEO, payload: null });
				break;
			case "remoteAudio":
				dispatch({ type: SET_REMOTE_AUDIO, payload: null });
				break;
			case "remoteShare":
				dispatch({ type: SET_REMOTE_SHARE, payload: null });
				break;
			default:
				console.log(`El medio ${media.type} no tiene handler!`);
		}
	});

	meeting.members.on("members:update", async (res) => {
		console.log("member update", res);
		let buffer = [];
		let { members } = meeting.members.membersCollection;
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
			if(members[key].isInLobby) {
				await meeting.admit([key]);
			}
		}
		dispatch({ type: SET_MEMBERS, payload: buffer });
	});

	/*
	meeting.on("meeting:breakouts:update", (res) => {
		viewBreakouts();
	});
	*/

	// Of course, we"d also like to be able to leave the meeting:
	/*
	document.getElementById("hangup").addEventListener("click", () => {
		meeting.leave();
	});
	*/
}

export const joinMeeting = async (contexto, selectedMeetingId) => {
	try {
		const { state, dispatch } = contexto;
		const webex = state.webEx;

		//var meetings = await webex.meetings.getAllMeetings();
		//var meeting = meetings[selectedMeetingId];

		var meeting = await webex.meetings.getAllMeetings()[selectedMeetingId];
		
		console.log(meeting);

		if(!meeting) {
			throw new Error(`La reunión ${selectedMeetingId} no es válida o ya ha concluido.`);
		}
		bindMeetingEvents(dispatch, meeting);
		meeting.join()
		.then(() => {
			const mediaSettings = {
				receiveVideo: true,
				receiveAudio: true,
				receiveShare: false,
				sendVideo: true,
				sendAudio: true,
				sendShare: false
			};

			return meeting.getMediaStreams(mediaSettings).then((mediaStreams) => {
				const [localStream, localShare] = mediaStreams;
				meeting.addMedia({
					localShare,
					localStream,
					mediaSettings
				});
			});

			/*
			let mediaStreams = await meeting.getMediaStreams(mediaSettings);
			let [localStream, localShare] = mediaStreams;

			meeting.addMedia({
				localShare,
				localStream,
				mediaSettings
			});
			*/
			
		})
		.then(() => {
			dispatch({ type: SET_MEETING, payload: meeting });
		})
		.catch((error) => console.log("salida por catch", error));
	} catch(error) {
		console.log(error);
	}
}

export const leaveMeeting = async (contexto, selectedMeetingId) => {
	try {
		const { state, dispatch } = contexto;
		const webex = state.webEx;

		var meetings = await webex.meetings.getAllMeetings();
		var meeting = meetings[selectedMeetingId];
		if(!meeting) {
			throw new Error(`La reunión ${selectedMeetingId} no es válida o ya ha concluido.`);
		}

		await meeting.leave();
		dispatch({ type: SET_MEETING, payload: null });
	} catch (error) {
		console.log(error);
	}
}

export const generateWebexConfig = ({credentials}) => {
	var integrationEnv = false; //Enable Integration Environment
	var fedRampInput = false; //Enable Fedramp
	var tcpReachabilityConfigElm = false; //Enable TCP reachability (experimental)
	var enableLLM = true//Enable LLM

	return {
		appName: "sdk-samples",
		appPlatform: "testClient",
		fedramp: fedRampInput,
		logger: {
			level: "debug" // "info"
		},
		...(integrationEnv && {
			services: {
				discovery: {
					u2c: "https://u2c-intb.ciscospark.com/u2c/api/v1",
					hydra: "https://apialpha.ciscospark.com/v1/"
				}
			}
		}),
		meetings: {
			reconnection: {
				enabled: true
			},
			enableRtx: true,
			experimental: {
				enableMediaNegotiatedEvent: false,
				enableUnifiedMeetings: true,
				enableAdhocMeetings: true,
				enableTcpReachability: tcpReachabilityConfigElm,
			},
			enableAutomaticLLM: enableLLM,
		},
		credentials,
		// Any other sdk config we need
	};
}