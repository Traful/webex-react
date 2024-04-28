export const defaultData = {
	webEx: null,
	webExMeeting: null,
	webExMeetingKey: null,
	media: {
		local: null,
		remoteVideo: null,
		remoteAudio: null,
		remoteShare: null
	},
	audioVideo: {
		bufferAudioInput: [],
		bufferAudioOutput: [],
		bufferVideoInput: []
	},
	members: []
};

export const SET_WEBEX = "SET_WEBEX";
export const SET_MEETING = "SET_MEETING";
export const SET_MEETING_KEY = "SET_MEETING_KEY";
export const SET_MEMBERS = "SET_MEMBERS";

export const SET_LOCAL = "SET_LOCAL";
export const SET_REMOTE_VIDEO = "SET_REMOTE_VIDEO";
export const SET_REMOTE_AUDIO = "SET_REMOTE_AUDIO";
export const SET_REMOTE_SHARE = "SET_REMOTE_SHARE";

export const SET_DEVICES = "SET_DEVICES";