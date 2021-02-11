import React, {useState, useEffect, Fragment} from "react";
import {ZoomMtg} from "@zoomus/websdk";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import LoggedInHeader from "../../components/header/AfterLoggedInHeader";

import {APIgetLiveSessionBySourceId} from "../../config/API";
import {APIgetZoomSignature} from "../../config/API";

import Rotate from "../../components/modal/Rotate";

import MandatoryFieldsModal from "../../components/modal/UserMandatoryFieldsModel";
import "./Zoom.css";

const ZoomComponent = ({
	premiumLevel,
	accountTrial,
	match,
	mandatory_field_status,
	prime_add_ons,
}) => {
	

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://source.zoom.us/1.8.6/lib/vendor/react.min.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://source.zoom.us/1.8.6/lib/vendor/react-dom.min.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://source.zoom.us/1.8.6/lib/vendor/react.min.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://source.zoom.us/1.8.6/lib/vendor/redux.min.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://source.zoom.us/1.8.6/lib/vendor/redux-thunk.min.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://source.zoom.us/1.8.6/lib/vendor/jquery.min.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://source.zoom.us/1.8.6/lib/vendor/lodash.min.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://source.zoom.us/zoom-meeting-1.8.6.min.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);
	useEffect(() => {
		const style = document.createElement("link");
		style.href = "https://source.zoom.us/1.8.6/css/bootstrap.css";
		style.rel = "stylesheet";
		style.type = "text/css";
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);
	useEffect(() => {
		const style = document.createElement("link");
		style.href = "https://source.zoom.us/1.8.6/css/react-select.css";
		style.rel = "stylesheet";
		style.type = "text/css";
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	

	const [formData, setFormData] = useState({
		meetingLaunched: false,
		meetingNumber: match.params.sessionId,
		leaveUrl: `/promo/${match.params.sessionId}`,

		userEmail: localStorage.user,
		passWord: "",
		role: 0,
		signature: null,
		EventID: 0,
	});
	const [signature, setSignature] = useState("");
	const [EventID, setEventID] = useState();
	const [ZoomPass, setZoomPass] = useState();
	const [eventPremiumlevel, seteventPremiumlevel] = useState();
	const [userName, setUserName] = useState(localStorage.user);
	const [sessionTitle, setSessionTitle] = useState("Zoom Session");
	const {meetingLaunched, meetingNumber, leaveUrl, userEmail, role} = formData;
	const [redirctTo, setRedirctTo] = useState(false);
	const [sessionType, setsessionType] = useState();

	useEffect(
		() => {
			ZoomMtg.setZoomJSLib("https://source.zoom.us/1.8.6/lib", "/av"); // CDN version default
			ZoomMtg.preLoadWasm();
			ZoomMtg.prepareJssdk();

			const getSessionDetails = async () => {
				const config = {
					headers: {Authorization: `Bearer ${localStorage.token}`},
				};
				try {
					let result = await axios.get(
						`${APIgetLiveSessionBySourceId}${meetingNumber}`,
						config
					);

					setSessionTitle(result.data.data[0].NAME);

					setEventID(result.data.data[0].ID);

					let Zoom_Pass = result.data.data[0].ZOOM_PASS
						? result.data.data[0].ZOOM_PASS
						: "";

					setZoomPass(Zoom_Pass);

					seteventPremiumlevel(result.data.data[0].PREMIUM_LEVEL); //Setting up the event premium Level

					setsessionType(result.data.data[0].EVENT_TYPE);
				} catch (error) {}
			};

			const fetchData = async () => {
				try {
					let result = await axios.post(APIgetZoomSignature, {
						apiKey: ZOOM_API_KEY,
						apiSecret: ZOOM_SECRET_KEY,
						meetingNumber: meetingNumber,
						role: 0,
					});

					setSignature(result.data.signature);
				} catch (error) {}
			};
			fetchData();
			getSessionDetails();
		},
		[meetingNumber],
		[EventID],
		[ZoomPass]
	);


	const launchMeeting = () => {
		const apiKey = ZOOM_API_KEY;
		const meetConfig = {
			meetingNumber: meetingNumber,
			leaveUrl: leaveUrl,
			userName: userName,
			userEmail: userEmail,
			passWord: ZoomPass,
			role: role,
		};
		setFormData({...formData, meetingLaunched: true});
		getSignature(meetConfig, apiKey, signature, EventID);
	};

	

	const getSignature = (meetConfig, apiKey, signature) => {
		ZoomMtg.init({
			leaveUrl: meetConfig.leaveUrl,
			isSupportAV: true,
			success: function () {
				ZoomMtg.join({
					signature: signature,
					apiKey: apiKey,
					meetingNumber: meetConfig.meetingNumber, // required
					userName: meetConfig.userName, // required
					userEmail: meetConfig.userEmail, // Not used, required for Webinars
					passWord: meetConfig.passWord, // If required; set by host
					success() {
						storeEventUSer();
						setInterval(function () {
							updateSpendTime();
						}, 50000);
					},
					error(res) {},
				});
			},
			error(res) {},
		});
	};


	if (redirctTo) {
		return <Redirect to={redirctTo} />;
	} else if (mandatory_field_status === false) {
		return (
			<Fragment>
				<div className="App">
					<Fragment>
						<LoggedInHeader />
						<MandatoryFieldsModal />
					</Fragment>
				</div>
			</Fragment>
		);
	} else {
		return (
			<Fragment>
				<div className="App">
					{!meetingLaunched ? (
						<Fragment>
							<LoggedInHeader />

							<div className="container">
								<div className="row" style={{marginTop: "150px"}}>
									<h2
										className="new-class-heading livemheading"
										style={{fontSize: "1.5rem"}}
									>
										{sessionTitle}
									</h2>
									<div className="livwidthm">
										<div className="tooltiplive" title="JOIN NOW !">
											<button
												onClick={launchMeeting}
												className="joinnowbtn"
												translate="no"
											>
												<i
													className="fa fa-play-circle"
													aria-hidden="true"
													style={{textRendering: "optimizeLegibility"}}
												/>
											</button>
										</div>
										<h2 className="live-text-on">Join Live Session</h2>
										{/* <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#newModal">Open Modal</button> */}

										{/* <div className="modal fade livepopup" id="newModal">
                                            <div className="modal-dialog">
                                                <div className="modal-content lpopupcont">
                                                    <div className="head">
                                                        <div className="content livepopupimg">
                                                            <img src="../../assets/images/rotate-landscape.png" alt="Live Popup" />
                                                        </div>
                                                        <div className="lpopfooter">
                                                        <h5>Please Switch to Landscape Mode</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>  */}
									</div>
								</div>
							</div>

							{isLandscape === false && <Rotate />}
						</Fragment>
					) : (
						<div id="zIndexMinimal" />
					)}
				</div>
			</Fragment>
		);
	}
};

ZoomComponent.propTypes = {
	premiumLevel: PropTypes.string.isRequired,
	accountTrial: PropTypes.bool.isRequired,
	mandatory_field_status: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	premiumLevel: state.auth.premiumLevel,
	accountTrial: state.auth.accountTrial,
	mandatory_field_status: state.auth.mandatory_field_status,
	prime_add_ons: state.auth.prime_add_ons,
});

export default connect(mapStateToProps, null)(ZoomComponent);