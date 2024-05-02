import { useEffect, useState, useContext } from "react";
import WebexContext from "./webexstore/WebexContext";
import { getDevices } from "./webexstore/utilsWebEx";
import { SET_SINK_ID } from "./webexstore/constants";


const datosDevices = async () => {
	let response = {
		responseDevices: {
			audioInput: [],
			audioOutput: [],
			videoInput: []
		},
		responseDefualtDevices: {
			audioInput: null,
			audioOutput: null,
			videoInput: null
		}
	};

	let respDevices = await getDevices();
	response.responseDevices = respDevices;

	if(respDevices) {
		let newDefaults = ({
			audioInput: null,
			audioOutput: null,
			videoInput: null
		});
		if(respDevices.audioInput && (respDevices.audioInput.length > 0)) {
			newDefaults.audioInput = respDevices.audioInput[0].deviceId;
		}
		if(respDevices.audioOutput && (respDevices.audioOutput.length > 0)) {
			newDefaults.audioOutput = respDevices.audioOutput[0].deviceId;
		}
		if(respDevices.videoInput && (respDevices.videoInput.length > 0)) {
			newDefaults.videoInput = respDevices.videoInput[0].deviceId;
		}
		response.responseDefualtDevices = newDefaults;
	}

	return response;
};

const Devices = () => {
	const wc = useContext(WebexContext);
	const [open, setOpen] = useState(false);
	const [devices, setDevices] = useState(null);
	const [defualtDevices, setDefaultDevices] = useState({
		audioInput: null,
		audioOutput: null,
		videoInput: null
	});

	useEffect(() => {
		const setData = async () => {
			let { responseDevices, responseDefualtDevices } = await datosDevices();
			console.log(responseDevices, responseDefualtDevices);
			setDevices(responseDevices);
			setDefaultDevices(responseDefualtDevices);
		};
		setData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChangeMedia = async (event) => {
		let value = event.target.value;
		let field = event.target.name;
		setDefaultDevices({ ...defualtDevices, [field]: value });

		
		/* Seteo en WebEx de dispositivo */

		if(wc.state.webExMeetingKey) {
			var media = null;
			var selected = null;
			
			switch(field) {
				case "audioInput":
					console.log(`Cambio de micrófono: ${value}`);
					media = { sendAudio: true };
					selected = { audio: { deviceId: { exact: value } } };
					break;
				case "videoInput":
					console.log(`Cambio de cámara: ${value}`);
					media = { sendVideo: true };
					selected = { video: { deviceId: { exact: value } } };
					break;
				case "audioOutput":
					console.log(`Cambio de parlantes: ${value}`);
					wc.dispatch({ type: SET_SINK_ID, payload: value });
					break;
				default:
					break;
			}

			if(media) {
				await wc.state.webEx.meetings.syncMeetings();
				let objMeeting = await wc.state.webEx.meetings.getAllMeetings()[wc.state.webExMeetingKey];

				if(field === "audioInput") {
					let [localStream] = await objMeeting.getMediaStreams(media, selected);
					objMeeting.updateAudio({
						stream: localStream,
						sendAudio: true,
						receiveAudio: true
					});
				}
				
				if(field === "videoInput") {
					let [localStream] = await objMeeting.getMediaStreams(media, selected);
					objMeeting.updateVideo({
						stream: localStream,
						sendVideo: true,
						receiveVideo: true
					});
				}

				
			}
			setOpen(false);
		} else {
			alert("No Key?!");
		}
	};

	if(!devices) return <div>Loading</div>;

	return(
		<div className="Devices">
			<div className="absolute right-4 top-4 cursor-pointer" onClick={() => setOpen(!open)}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 fill-white">
					<path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
					<path d="m10.076 8.64-2.201-2.2V4.874a.75.75 0 0 0-.364-.643l-3.75-2.25a.75.75 0 0 0-.916.113l-.75.75a.75.75 0 0 0-.113.916l2.25 3.75a.75.75 0 0 0 .643.364h1.564l2.062 2.062 1.575-1.297Z" />
					<path fillRule="evenodd" d="m12.556 17.329 4.183 4.182a3.375 3.375 0 0 0 4.773-4.773l-3.306-3.305a6.803 6.803 0 0 1-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 0 0-.167.063l-3.086 3.748Zm3.414-1.36a.75.75 0 0 1 1.06 0l1.875 1.876a.75.75 0 1 1-1.06 1.06L15.97 17.03a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
				</svg>
			</div>
			<div className="fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center min-h-screen w-full pointer-events-none">
				<dialog className="p-4 rounded-md z-50 pointer-events-auto" open={open}>
					<div className="fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center min-h-screen w-full" style={{backgroundColor: "rgba(0, 0, 0, .8)"}}>
						<div className="min-w-[300px] flex flex-col bg-white p-4 rounded-md">
							<div className="flex justify-between items-center">
								<h4 className="text-2xl p-2 bg-blue-300">Dispositivos</h4>
								<button className="bg-gray-200 rounded-md p-2" onClick={() => setOpen(!open)}>X</button>
							</div>
							<div className="mt-2">
								<div className="flex flex-col border">
									<label className="bg-gray-300 p-1" htmlFor="audioInput">Micrófono</label>
									{
										devices.audioInput && (devices.audioInput.length > 0) ?
										<select className="border py-2" name="audioInput" id="audioInput" value={defualtDevices.audioInput} onChange={handleChangeMedia}>
											{
												devices.audioInput.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label}</option>)
											}
										</select>
										:
										null
									}
								</div>
							</div>
							<div className="mt-2">
								<div className="flex flex-col border">
									<label className="bg-gray-300 p-1" htmlFor="videoInput">Cámara</label>
									{
										devices.videoInput && (devices.videoInput.length > 0) ?
										<select className="border py-2" name="videoInput" id="videoInput" value={defualtDevices.videoInput} onChange={handleChangeMedia}>
											{
												devices.videoInput.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label}</option>)
											}
										</select>
										:
										null
									}
								</div>
							</div>
							<div className="mt-2">
								<div className="flex flex-col border">
									<label className="bg-gray-300 p-1" htmlFor="audioOutput">Parlantes</label>
									{
										devices.audioOutput && (devices.audioOutput.length > 0) ?
										<select className="border py-2" name="audioOutput" id="audioOutput" value={defualtDevices.audioOutput} onChange={handleChangeMedia}>
											{
												devices.audioOutput.map(d => {
													return <option key={d.deviceId} value={d.deviceId}>{d.label}</option>;
												})
											}
										</select>
										:
										null
									}
								</div>
							</div>
						</div>
					</div>
				</dialog>
			</div>
		</div>
	);
};

export default Devices;