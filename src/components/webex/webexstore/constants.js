export const defaultData = {
	webEx: null,
	webExMeetingKey: null,
	media: {
		local: null,
		remoteVideo: null,
		remoteAudio: null,
		remoteShare: null
	},
	members: [],
	sinkId: null
};

export const SET_WEBEX = "SET_WEBEX";
export const SET_MEETING_KEY = "SET_MEETING_KEY";

export const SET_MEDIA = "SET_MEDIA";
export const SET_MEMBERS = "SET_MEMBERS";

export const RESET_MEETING = "RESET_MEETING";


export const SET_LOCAL = "SET_LOCAL";
export const SET_REMOTE_VIDEO = "SET_REMOTE_VIDEO";
export const SET_REMOTE_AUDIO = "SET_REMOTE_AUDIO";
export const SET_REMOTE_SHARE = "SET_REMOTE_SHARE";

export const SET_SINK_ID = "SET_SINK_ID";