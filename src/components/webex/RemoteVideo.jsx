import { useContext, useEffect, useRef } from "react";
import WebexContext from "./webexstore/WebexContext";

const RemoteVideo = () => {
	const wc = useContext(WebexContext);
	const refVideo = useRef(null);

	useEffect(() => {
		if(wc.state.media.remoteVideo && refVideo.current) {
			refVideo.current.srcObject = wc.state.media.remoteVideo;
		}
	}, [wc.state.media.remoteVideo, wc.state.media.remoteAudio]);

	return(
		<div className="w-full h-full flex-auto">
			<video ref={refVideo} className="w-full h-full bg-gray-800" autoPlay></video>
		</div>
	);
};

export default RemoteVideo;