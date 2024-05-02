//import { VITE_WEBEX_KEY } from "./../../../config";
//import { SET_LOCAL, SET_REMOTE_VIDEO, SET_REMOTE_AUDIO, SET_REMOTE_SHARE } from "./constants";

//No eliminar
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

export const admitMember = async (contexto, key) => {
	const { state } = contexto;
	await state.webExMeeting.admit([key]);
};

/*
export const getDataMeetings = async (webEx) => {
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
*/

/*
const bindMeetingEvents = (dispatch, meeting) => {

	meeting.on("error", (err) => {
		console.error(err);
	});

	// Handle media streams changes to ready state
	meeting.on("media:ready", (media) => {
		if(!media) {
			return;
		}
		console.log(media);
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
		console.log(media);
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
			/
			if(members[key].isInLobby) {
				await meeting.admit([key]);
			}
			/
		}
		dispatch({ type: SET_MEMBERS, payload: buffer });
	});

	/
	meeting.on("meeting:breakouts:update", (res) => {
		viewBreakouts();
	});
	/

	// Of course, we"d also like to be able to leave the meeting:
	/
	document.getElementById("hangup").addEventListener("click", () => {
		meeting.leave();
	});
	/
}
*/

/*

*/

/*
export const joinMeeting = async (contexto, selectedMeetingId) => {
	try {
		const { state, dispatch } = contexto;
		const webex = state.webEx;

		var meeting = await webex.meetings.getAllMeetings()[selectedMeetingId];
		
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


			//localMedia.cameraStream = await webex.meetings.mediaHelpers.createCameraStream(videoConstraints);
			//localMedia.microphoneStream = await webex.meetings.mediaHelpers.createMicrophoneStream(audioConstraints);

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

			//return meeting.getMediaStreams(mediaSettings).then((mediaStreams) => {
			return meeting.getMediaStreams(mediaSettings, defaultDevices).then((mediaStreams) => {
				console.log(mediaStreams);
				const [localStream, localShare] = mediaStreams;
				meeting.addMedia({
					localShare,
					localStream,
					mediaSettings
				});
			});

			/
			let mediaStreams = await meeting.getMediaStreams(mediaSettings);
			let [localStream, localShare] = mediaStreams;

			meeting.addMedia({
				localShare,
				localStream,
				mediaSettings
			});
			/
			
		})
		.then(() => {
			dispatch({
				type: SET_MEETING,
				payload: {
					webExMeeting: meeting,
					webExMeetingKey: selectedMeetingId
				}
			});
		})
		.catch((error) => console.log("salida por catch", error));
	} catch(error) {
		console.log(error);
	}
}
*/

/*
export const leaveMeeting = async (contexto, selectedMeetingId) => {
	try {
		const { state, dispatch } = contexto;
		const webex = state.webEx;

		var meeting = webex.meetings.getAllMeetings()[selectedMeetingId];
		if(!meeting) {
			throw new Error(`La reunión ${selectedMeetingId} no es válida o ya ha concluido.`);
		}

		await meeting.leave();

		dispatch({ type: SET_MEETING, payload: null });
		/
		dispatch({ type: SET_MEETING_KEY, payload: null });
		dispatch({ type: SET_MEMBERS, payload: [] });
		/
	} catch (error) {
		console.log(error);
	}
}
*/

/*
export const getMediaDevices = async (contexto) => {
	const { state, dispatch } = contexto;
	if(state.webExMeeting && state.webEx) {
		
		//let devices = await webEx.meetings.mediaHelpers.getDevices();
		let devices = await state.webExMeeting.getDevices();
		
		let bufferAudioInput = [];
		let bufferAudioOutput = [];
		let bufferVideoInput = [];

		devices.forEach((device) => {
			switch(device.kind) {
				case 'audioinput':
					bufferAudioInput.push(device);
					break;
				case 'audiooutput':
					bufferAudioOutput.push(device);
					break;
				case 'videoinput':
					bufferVideoInput.push(device);
					break;
			}
		});
		dispatch({ type: SET_DEVICES, payload: {
			bufferAudioInput: bufferAudioInput,
			bufferAudioOutput: bufferAudioOutput,
			bufferVideoInput: bufferVideoInput
		} });
		return({
			bufferAudioInput: bufferAudioInput,
			bufferAudioOutput: bufferAudioOutput,
			bufferVideoInput: bufferVideoInput
		})
	} else {
		console.log("No hay reunion activa!");
	}
}
*/

//Media
export const mediaStop = async () => {
	//let streams = await navigator.mediaDevices.getUserMedia({ video: true });
	try {
		let streams = await searchMedia({ video: true })
		streams.getTracks().forEach(track => track.stop());
	} catch (error) {
		console.log(error);
	}
};

export const videoMediaStop = (video) => {
	try {
		if(window.stream) {
			window.stream.getTracks().forEach(track => track.stop());
		}

		if(video?.srcObject) {
			video.srcObject.getTracks().forEach(track => track.stop());
			//video.srcObject.getVideoTracks().forEach(track => track.stop());
			video.srcObject = null;
		}
	} catch(error) {
		console.log(error);
	}
}

/*
export const searchMedia = (contrains) => {
	return new Promise((resolve, reject) => {
		try {
			navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			navigator.getMedia(
				contrains,
				(stream) => {
					resolve(stream);
				},
				(err) => {
					reject(err);
				}
			);
		} catch (error) {
			reject(error);
		}
	});
};
*/

export const searchMedia = (contrains) => {
	return navigator.mediaDevices.getUserMedia(contrains);
};

export const getDevices = async () => {
	let resp = {
		audioInput: [],
		audioOutput: [],
		videoInput: []
	};

	try {
		await searchMedia({ video: true, audio: true });

		let devices = await navigator.mediaDevices.enumerateDevices({ video: true, audio: true });

		let ai = devices.filter(d => (d.kind === "audioinput") && ((d.deviceId !== "default") && (d.deviceId !== "communications")));
		let ao = devices.filter(d => (d.kind === "audiooutput") && ((d.deviceId !== "default") && (d.deviceId !== "communications")));
		let vi = devices.filter(d => (d.kind === "videoinput") && ((d.deviceId !== "default") && (d.deviceId !== "communications")));

		resp.audioInput = ai;
		resp.audioOutput = ao;
		resp.videoInput = vi;

		/*
		let soloCamaras = devices.filter(device => device.kind === "videoinput");

		for(let index = 0; index < soloCamaras.length; index++) {
			let element = soloCamaras[index];
			let captabilities = await element.getCapabilities();

			let data = {
				deviceId: element.deviceId,
				groupId: element.groupId,
				kind: element.kind,
				label: element.label,
				captabilities: captabilities
			}

			resp.devices.push(data);

			let isback = false;
			let facingMode = captabilities.facingMode;

			if(Array.isArray(facingMode)) {
				if(facingMode.includes("environment") || facingMode.includes("back")) {
					isback = true;
					resp.bdevices.push(data);
				}
			} else {
				if(facingMode === "environment" || facingMode === "back") {
					isback = true;
					resp.bdevices.push(data);
				}
			}

			if(!isback) {
				resp.fdevices.push(data);
			}
		}

		resp.totalDevices = resp.devices.length;
		*/
	} catch(error) {
		console.log(error);
	}

	console.log(resp);

	return resp; 
};