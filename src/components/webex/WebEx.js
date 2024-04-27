import { generateWebexConfig } from "./webexUtils";

class WebEx {
	webex =  null;
	status = "offline";
	meeting = null;

	constructor(configuration) {
		this.webex = window.webex = Webex.init({
			config: generateWebexConfig({}),
			credentials: {
				access_token: configuration.token
			}
		});

		this.webex.once("ready", () => {
			this.webex.meetings.register()
			.then(() => {
				this.status = "ready";
				configuration.onReadyCallBack();
			})
			.catch((error) => {
				this.status = "error";
				console.warn('Authentication#register() :: error registering', error);
			});
		});
	}

	async getNextMeetings() {
		await this.webex.meetings.syncMeetings();
		let meetings = this.webex.meetings.getAllMeetings();
		return meetings;
	}

	getMediaDevices() {
		if(this.meeting) {
			console.log('MeetingControls#getMediaDevices()');
			this.webex.meetings.mediaHelpers.getDevices()
			.then((devices) => {
				devices.forEach((device) => {
					console.log(device);
					//populateSourceDevices(device);
				});
			});
		} else {
			console.log('MeetingControls#getMediaDevices() :: no valid meeting object!');
		}
	}

	async joinMeeting(selectedMeetingId, visores) {
		this.meeting = await this.webex.meetings.getAllMeetings()[selectedMeetingId];

		let resourceId = null;

		if(!this.meeting) {
			throw new Error(`La reunión ${selectedMeetingId} no es válida o ya ha concluido.`);
		}

		/*
		if(withDevice) {
			resourceId = this.webex.devicemanager._pairedDevice ? this.webex.devicemanager._pairedDevice.identity.id : undefined;
			this.getMediaDevices();
		}
		*/

		const joinOptions = {
			enableMultistream: false, //Use a multistream connection
			pin: "", //Password/PIN
			moderator: false, //Join as Moderator
			breakoutsSupported: false, //Support breakout sessions
			moveToResource: false,
			resourceId,
			locale: "es_ES", // audio disclaimer language
			deviceCapabilities: ["SERVER_AUDIO_ANNOUNCEMENT_SUPPORTED", "CONFLUENCE_IN_LOBBY_SUPPORTED"], //audio disclaimer toggle, Support media in lobby
		};

		if(!this.meeting.requiredCaptcha) {
			joinOptions.captcha = "";
		}

		try {

			const mediaSettings = {
				audioEnabled: true,
				videoEnabled: true,
				shareAudioEnabled: true,
				shareVideoEnabled: true,
				allowMediaInLobby: true, //Support media in lobby
				bundlePolicy: "max-bundle"
			};

			console.log(this.webex.meetings);

			let microphoneStream = await this.webex.meetings.mediaHelpers.createMicrophoneStream({ audio: true });
			let cameraStream = await this.webex.meetings.mediaHelpers.createCameraStream({ video: true });

			this.meeting.on("media:ready", (media) => {
				switch(media.type) {
					case "remoteVideo":
						visores.meetingStreamsRemoteVideo.srcObject = media.stream;
						break;
					case "remoteAudio":
						visores.meetingStreamsRemoteAudio.srcObject = media.stream;
						break;
					case "remoteShare":
						visores.meetingStreamsRemoteShare.srcObject = media.stream;
						break;
				}
			});
			
			// remove stream if media stopped
			this.meeting.on("media:stopped", (media) => {
				switch(media.type) {
					case "remoteVideo":
						visores.meetingStreamsRemoteVideo.srcObject = null;
						break;
					case "remoteAudio":
						visores.meetingStreamsRemoteAudio.srcObject = null;
						break;
					case "remoteShare":
						visores.meetingStreamsRemoteShare.srcObject = null;
						break;
				}
			});

			// we're using the default RemoteMediaManagerConfig
			const mediaOptions = {
				localStreams: {
					microphone: microphoneStream,
					camera: cameraStream,
					screenShare: {
						audio: true,
						video: true
					}
				},
				...mediaSettings
			};

			await this.meeting.joinWithMedia({ joinOptions, mediaOptions });
		} catch(e) {
			console.log(e);
		}
	}
}

export default WebEx;
