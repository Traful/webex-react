import WebexData from "./webexstore/WebexData";
import RegUnReg from "./RegUnReg";
import IncomingMeetings from "./IncomingMeetings";
import Members from "./Members";
import Remote from "./Remote";
import Local from "./Local";

const Call = () => {
	return(
		<WebexData>
			<div className="flex gap-2 min-h-screen">
				<div className="bg-green-200 p-2">
					<RegUnReg />
					<IncomingMeetings />
					<Members />
				</div>
				<Remote />
			</div>
			<Local />
		</WebexData>
	);
};

export default Call;