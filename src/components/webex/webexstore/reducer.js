import { SET_WEBEX, SET_MEETING_KEY, RESET_MEETING, SET_MEDIA, SET_MEMBERS, SET_SINK_ID } from "./constants";

const reducer = (state, action) => {
	switch(action.type) {
		case SET_WEBEX:
			return ({ ...state, webEx: action.payload });
		case SET_MEETING_KEY:
			return ({ ...state, webExMeetingKey: action.payload });
		case RESET_MEETING:
			return ({
				...state,
				webExMeetingKey: null,
				media: {
					local: null,
					remoteVideo: null,
					remoteAudio: null,
					remoteShare: null
				},
				members: []
			});
		case SET_MEDIA:
			return ({ ...state, media: action.payload });
		case SET_MEMBERS:
			return ({ ...state, members: action.payload });
		case SET_SINK_ID:
			return ({ ...state, sinkId: action.payload });
		/*
		case SET_LOCAL:
			return ({ ...state, media: { ...state.media, local: action.payload }});
		case SET_REMOTE_VIDEO:
			return ({ ...state, media: { ...state.media, remoteVideo: action.payload }});
		case SET_REMOTE_AUDIO:
			return ({ ...state, media: { ...state.media, remoteAudio: action.payload }});
		case SET_REMOTE_SHARE:
			return ({ ...state, media: { ...state.media, remoteShare: action.payload }});
		*/
		default:
			console.error(`Acción ${action.type} no es válida.`);
			return state;
	}
};

export default reducer;