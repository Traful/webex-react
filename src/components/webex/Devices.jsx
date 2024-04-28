import { useContext, useEffect, useState } from "react";
import WebexContext from "./webexstore/WebexContext";
import { getMediaDevices } from "./webexstore/utilsWebEx";

import JsonData from "./../JsonData";

const Devices = () => {
	const wc = useContext(WebexContext);
	const [selectedDevices, setSelectedDevices] = useState({
		bufferAudioInput: null,
		bufferAudioOutput: null,
		bufferVideoInput: null
	});

	useEffect(() => {
		if(wc.state.webExMeeting) {
			getMediaDevices(wc).then(() => {
				let defaultAudioInput = wc.state.audioVideo.bufferAudioInput.filter(d => d.deviceId === "default");
				if(defaultAudioInput && (defaultAudioInput.length > 0)) {
					defaultAudioInput = defaultAudioInput[0].deviceId;
				} else {
					defaultAudioInput = wc.state.audioVideo.bufferAudioInput[0].deviceId;
				}

				let defaultAudioOutput = wc.state.audioVideo.bufferAudioOutput.filter(d => d.deviceId === "default");
				if(defaultAudioOutput && (defaultAudioOutput.length > 0)) {
					defaultAudioOutput = defaultAudioOutput[0].deviceId;
				} else {
					defaultAudioOutput = wc.state.audioVideo.bufferAudioOutput[0].deviceId;
				}

				let defaultVideoInput = wc.state.audioVideo.bufferVideoInput.filter(d => d.deviceId === "default");
				if(defaultVideoInput && (defaultVideoInput.length > 0)) {
					defaultVideoInput = defaultVideoInput[0].deviceId;
				} else {
					defaultVideoInput = wc.state.audioVideo.bufferVideoInput[0].deviceId;
				}

				setSelectedDevices({
					bufferAudioInput: defaultAudioInput,
					bufferAudioOutput: defaultAudioOutput,
					bufferVideoInput: defaultVideoInput
				});
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wc.state.webExMeeting, wc.state.audioVideo]);

	if(!wc.state.webExMeeting) return null;

	return(
		<>
		<div className="Devices flex gap-2 w-full">
			<select name="bufferAudioInput" id="bufferAudioInput" value={selectedDevices.bufferAudioInput}>
				{
					wc.state.audioVideo.bufferAudioInput.map(d => <option key={`o-${d.deviceId}`} value={d.deviceId}>{d.label}</option>)
				}
			</select>
			<select name="bufferAudioOutput" id="bufferAudioOutput" value={selectedDevices.bufferAudioOutput}>
				{
					wc.state.audioVideo.bufferAudioOutput.map(d => <option key={`o-${d.deviceId}`} value={d.deviceId}>{d.label}</option>)
				}
			</select>
			<select name="bufferVideoInput" id="bufferVideoInput" value={selectedDevices.bufferVideoInput}>
				{
					wc.state.audioVideo.bufferVideoInput.map(d => <option key={`o-${d.deviceId}`} value={d.deviceId}>{d.label}</option>)
				}
			</select>
		</div>
		<JsonData data={wc.state.audioVideo} />
		</>
	);
};

export default Devices;