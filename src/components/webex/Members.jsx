import { useContext, useEffect, useState } from "react";
import WebexContext from "./webexstore/WebexContext";
//import { admitMember } from "./webexstore/utilsWebEx";

const leyendaStatus = (value) => {
	let resp = value;
	switch(value) {
		case "IN_MEETING":
			resp = "En la reunión";
			break;
		case "IN_LOBBY":
			resp = "En la sala de espera";
			break;
		default:
			break;
	}
	return resp;
};

const Members = () => {
	const wc = useContext(WebexContext);
	const [miembros, setMiembros] = useState([]);

	useEffect(() => {
		setMiembros(wc.state.members.filter(f => f.status !== "NOT_IN_MEETING"));
	}, [wc.state.members]);

	const getMeeting = async () => {
		await wc.state.webEx.meetings.syncMeetings();
		let objMeeting = await wc.state.webEx.meetings.getAllMeetings()[wc.state.webExMeetingKey];
		return objMeeting;
	};

	const admitMember = async (key) => {
		let objMeeting = await getMeeting();
		await objMeeting.admit([key]);
	};

	const muteUnmuteVideo = async (sino) => {
		let objMeeting = await getMeeting();
		if(sino) {
			objMeeting.muteVideo();
		} else {
			objMeeting.unmuteVideo();
		}
	}

	const muteUnmuteAudio = async (sino) => {
		let objMeeting = await getMeeting();
		if(sino) {
			objMeeting.muteAudio();
		} else {
			objMeeting.unmuteAudio();
		}
	}

	return(
		<div className="Members mt-4">
			<hr className="text-gray-800" />
			{
				wc.state.webExMeetingKey && miembros.map((miembro) => {
					return (
						<div key={miembro.key} className={`p-2 rounded-md my-1 w-full flex gap-4 ${miembro.isInLobby ? "bg-yellow-200" : "bg-green-200"}`}>
							<div className={`flex justify-center items-center rounded-full p-2 ${miembro.isInLobby ? "bg-yellow-400" : "bg-green-400"}`}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 cursor-pointer">
									<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
								</svg>
							</div>
							<div className="flex flex-col gap-2 w-full">
								<h4 className="text-2xl">{miembro.name}</h4>
								<div className="flex justify-between items-center">
									<div className="text-sm text-gray-400 font-bold italic">{leyendaStatus(miembro.status)}</div>
									<div className="flex justify-end items-center gap-4">
										{
											miembro.isInLobby ?
											<svg onClick={() => admitMember(miembro.key)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
												<path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
											</svg>
											:
											<>
											{
												miembro.isAudioMuted ?
												<svg onClick={() => muteUnmuteAudio(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
													<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
												</svg>
												:
												<svg onClick={() => muteUnmuteAudio(true)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 cursor-pointer">
													<path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
													<path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
												</svg>
											}
											{
												miembro.isVideoMuted ?
												<svg onClick={() => muteUnmuteVideo(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 cursor-pointer">
													<path d="M.97 3.97a.75.75 0 0 1 1.06 0l15 15a.75.75 0 1 1-1.06 1.06l-15-15a.75.75 0 0 1 0-1.06ZM17.25 16.06l2.69 2.69c.944.945 2.56.276 2.56-1.06V6.31c0-1.336-1.616-2.005-2.56-1.06l-2.69 2.69v8.12ZM15.75 7.5v8.068L4.682 4.5h8.068a3 3 0 0 1 3 3ZM1.5 16.5V7.682l11.773 11.773c-.17.03-.345.045-.523.045H4.5a3 3 0 0 1-3-3Z" />
												</svg>
												:
												<svg onClick={() => muteUnmuteVideo(true)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 cursor-pointer">
													<path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
												</svg>
											}
											</>
										}
									</div>
								</div>
							</div>
						</div>
					)
				})
			}
		</div>
	);
};

export default Members;