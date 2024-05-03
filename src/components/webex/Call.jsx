import WebexData from "./webexstore/WebexData";
import WebEx from "./WebEx";

//import RemoteAudio from "./RemoteAudio";
import IncomingMeetings from "./IncomingMeetings";
import Members from "./Members";
import RemoteVideo from "./RemoteVideo";
import Devices from "./Devices";
import LocalVideo from "./LocalVideo";


const Call = () => {
	return(
		<WebexData>
			<WebEx>
				{/* <RemoteAudio /> */}
				<div className="flex gap-2 min-h-screen">
					<div className="bg-green-200 p-2 min-w-80">
						<IncomingMeetings />
						<Members />
					</div>
					<div className="min-h-screen w-full flex flex-col">
						<RemoteVideo />
						<Devices />
					</div>
				</div>
				<LocalVideo />
			</WebEx>
		</WebexData>
	);
};

export default Call;