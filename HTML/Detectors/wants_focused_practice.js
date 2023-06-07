// DETECTOR TEMPLATE

// Add output variable name below
let variableName = "wants_focused_practice"

// Initializations (DO NOT TOUCH)
let detector_output = {
	name: variableName,
	category: "Dashboard",
	value: {
		state: "off", 
		elaboration: "", 
		image: "HTML/Detectors/Images/idle.svg"
	},
	history: "",
	skill_names: "",
	step_id: "",
	transaction_id: "",
	time: ""
};
let mailer;

function receive_transaction( e ) {
	// e is the data of the transaction from mailer from transaction assembler
	/*
	 * Set conditions under which transaction should be processed
	 * (i.e., to update internal state and history, without
	 * necessarily updating external state and history)
	 */ 
	if(e.data.actor == 'student' && e.data.tool_data.action == "UpdateRadioButton") {
		//rawSkills = e.data.tutor_data.skills
		let currSkills = []
		//for (let property in rawSkills) {
		//    if (rawSkills.hasOwnProperty(property)) {
		//        currSkills.push(rawSkills[property].name + "/" + rawSkills[property].category)
		//    }
	//	}
		detector_output.skill_names = currSkills;
		//detector_output.step_id = e.data.tutor_data.step_id;

		// Custom processing (insert code here)
	  	//clearTimeout(timerId4);

		detector_output.history = e.data.tool_data.tool_event_time
		if (detector_output.value.state != "off") {
			detector_output.value.state = "off";
			detector_output.time = new Date();
			mailer.postMessage(detector_output);
			postMessage(detector_output);
			postMessage({ command: "broadcast", output: detector_output });
			console.log("wants_focused_practice sending out broadcast command");
            console.log('we are here 1 and ')
            console.log('selection is: '+e.data.tool_data.selection)
            console.log('action is: '+e.data.tool_data.action)
            console.log('input is: '+e.data.tool_data.input)
			console.log("output_data = ", detector_output);
		}
	}
	/*
	 * Set conditions under which detector should update
	 * external state and history
	 */ 
	if(e.data.actor == 'student' && e.data.tool_data.action == "UpdateRadioButton") {

		detector_output.time = new Date();
		detector_output.transaction_id = e.data.transaction_id;

        let checkstr = e.data.tool_data.input;
        console.log('checkstr: '+checkstr);
        let checkbool = e.data.tool_data.input.includes('wantsfp');
        console.log('checkbool: '+checkbool);

        let res_state = e.data.tool_data.input.includes('wantsfp') ? 'on' : e.data.tool_data.input.includes('nofp') ? 'off' : 'OTHER';
        console.log('res_state: '+res_state);

        detector_output.history = e.data.tool_data.tool_event_time;
        detector_output.value = {...detector_output.value, state: res_state, elaboration: ""};// e.data.tool_data.action == 'UpdateRadioButton' ? 'on' : 'off';
        mailer.postMessage(detector_output);
        postMessage(detector_output);
        console.log("wants_focused_practice sending out broadcast command");
        console.log('we are here 2 and ')
        console.log('selection is: '+e.data.tool_data.selection)
        console.log('action is: '+e.data.tool_data.action)
        console.log('input is: '+e.data.tool_data.input)
        console.log("output_data = ", detector_output);


	}
}

self.onmessage = function ( e ) {
    console.log(variableName, " self.onmessage:", e, e.data, (e.data?e.data.commmand:null), (e.data?e.data.transaction:null), e.ports);
    switch( e.data.command )
    {
    case "connectMailer":
		mailer = e.ports[0];
		mailer.onmessage = receive_transaction;
	break;
	case "initialize":
		for (initItem in e.data.initializer) {
			if (e.data.initializer[initItem].name == variableName) {
				detector_output.history = e.data.initializer[initItem].history;
				detector_output.value = e.data.initializer[initItem].value;
			}
		}       
	break;
    default:
	break;

    }

}
