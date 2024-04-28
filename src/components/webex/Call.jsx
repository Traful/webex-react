import WebexData from "./webexstore/WebexData";
import IncomingMeetings from "./IncomingMeetings";
import Members from "./Members";
import Remote from "./Remote";
import Devices from "./Devices";
import Local from "./Local";

const Call = () => {
	return(
		<WebexData>
			<div className="flex gap-2 min-h-screen">
				<div className="bg-green-200 p-2">
					<IncomingMeetings />
					<Members />
				</div>
				<div className="min-h-screen w-full flex flex-col">
					<Remote />
					<Devices />
				</div>
			</div>
			<Local />
		</WebexData>
	);
};

export default Call;