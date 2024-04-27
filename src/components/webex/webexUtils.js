export const generateWebexConfig = ({ credentials }) => {
	return {
		appName: "webex-react",
		appPlatform: "testClient",
		fedramp: false, //Enable Fedramp
		logger: {
			level: "debug"
		},
		//Enable Integration Environment
		/*
		services: {
			discovery: {
				u2c: "https://u2c-intb.ciscospark.com/u2c/api/v1",
				hydra: "https://apialpha.ciscospark.com/v1/"
			}
		},
		*/
		meetings: {
			reconnection: {
				enabled: true
			},
			enableRtx: true,
			experimental: {
				enableMediaNegotiatedEvent: false,
				enableUnifiedMeetings: true,
				enableAdhocMeetings: true,
				enableTcpReachability: false //Enable TCP reachability (experimental)
			},
			enableAutomaticLLM: true //Enable LLM
		},
		credentials,
		// Any other sdk config we need
	};
};