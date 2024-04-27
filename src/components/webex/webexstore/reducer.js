import { SET_WEBEX, SET_MEETING, SET_MEMBERS, SET_LOCAL, SET_REMOTE_VIDEO, SET_REMOTE_AUDIO, SET_REMOTE_SHARE } from "./constants";

const reducer = (state, action) => {
	switch(action.type) {
		case SET_WEBEX:
			return ({ ...state, webEx: action.payload });
		case SET_MEETING:
			return ({ ...state, webExMeeting: action.payload });
		case SET_MEMBERS:
			return ({ ...state, members: action.payload });
		case SET_LOCAL:
			return ({ ...state, media: { ...state.media, local: action.payload }});
		case SET_REMOTE_VIDEO:
			return ({ ...state, media: { ...state.media, remoteVideo: action.payload }});
		case SET_REMOTE_AUDIO:
			return ({ ...state, media: { ...state.media, remoteAudio: action.payload }});
		case SET_REMOTE_SHARE:
			return ({ ...state, media: { ...state.media, remoteShare: action.payload }});
		default:
			console.error(`Acción ${action.type} no es válida.`);
			return state;
	}
};

export default reducer;