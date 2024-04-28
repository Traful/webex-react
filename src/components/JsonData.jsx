//{ webExMeetingKey: wc.state.webExMeetingKey, members: wc.state.members }

const JsonData = ({ data }) => {
	return(
		<div className="">
			<pre>
				<code>
					{ JSON.stringify(data, null, 4) }
				</code>
			</pre>
			
		</div>
	);
};

export default JsonData;