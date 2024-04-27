import { useContext, useEffect, useRef } from "react";
import WebexContext from "./webexstore/WebexContext";

const Remote = () => {
	const wc = useContext(WebexContext);
	const refVideo = useRef(null);
	const refAudio = useRef(null);

	useEffect(() => {
		if(wc.state.media.remoteVideo && refVideo.current) {
			refVideo.current.srcObject = wc.state.media.remoteVideo;
		}
		if(wc.state.media.remoteAudio && refAudio.current) {
			refAudio.current.srcObject = wc.state.media.remoteAudio;
		}
	}, [wc.state.media.remoteVideo, wc.state.media.remoteAudio]);

	return(
		<div className="w-full h-full">
			<audio ref={refVideo} autoPlay></audio>
			<video ref={refAudio} className="w-full h-full bg-gray-800" autoPlay></video>
		</div>
	);
};

export default Remote;