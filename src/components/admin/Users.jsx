import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";

// Date Time Format (moment.js)
import moment from 'moment/min/moment-with-locales';
import { moment_locale, moment_format_date_time_long } from '../_resources/date-time/DateTime.js';
//import UserPasswordRecover from './UserPasswordRecover.jsx';

import default_user_profile_img from '../../assets/images/user.jpg';
import default_user_cover_img from '../../assets/images/cover.jpg';


// Notifications
import toast from 'react-hot-toast';

function Users(props) {

    const navigate = useNavigate();

    // list
    const [users, setUsers] = useState([]);

    const [filterPostStatus, setFilterPostStatus] = useState("pending")

    // http response status
    const [responseStatusGetAllPosts, setResponseStatusGetAllPosts] = useState("");
    const [responseStatusGetAllUsers, setResponseStatusGetAllUsers] = useState("");

    useEffect(() => {

        //checkAuth();

        getAllUsers();

    }, [props.userId, filterPostStatus]);


    const getAllUsers = async () => {

        setResponseStatusGetAllUsers("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/user/all`, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetAllUsers("success");
                //console.log(res.data);
                setUsers(res.data);
            }

        }).catch(err => {
            setResponseStatusGetAllUsers("error");
            //Logout();
            return;
        })
    }

    const handleFilterPostStatus = async (status) => {

        if (status === "active") {
            setFilterPostStatus(status);
        } else if (status === "pending") {
            setFilterPostStatus(status);

        } else if (status === "blocked") {
            setFilterPostStatus(status);
        } else {
            // all
            setFilterPostStatus(status);
        }
        //await getAllPosts();

    }

    const statusPost = async (postId, postStatus) => {

        const toastNotify = toast.loading("Waiting...");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        //console.log("user_id: " + userId);
        //console.log("post_id: " + postId);

        const data = {
            userId: props.userId,
            postId: postId,
            status: postStatus
        }

        await axios.post(`${url}/post/status`, data, config).then((res) => {
            if (res.status === 200) {
                //setButtonCreatePostIsDisabled(false);

                toast.dismiss(toastNotify);
                toast.success("Executed");

                //getAllPosts();
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setButtonCreatePostIsDisabled(false);
            return;
        })

    }

    return (
        <div>

            <div className="d-flex justify-content-center">
                <div className="card container-fluid shadow" style={{ maxWidth: 600 }}>
                    <div className="card-body">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                            <small className="me-md-2">Users - Filter by:</small>
                            <button type="button" className={"btn " + (filterPostStatus === "all" ? "btn-secondary" : "btn-outline-secondary") + " btn-sm"} disabled={filterPostStatus === "all"} onClick={() => handleFilterPostStatus("all")}>All</button>
                            <button type="button" className={"btn " + (filterPostStatus === "active" ? "btn-success" : "btn-outline-success") + " btn-sm"} disabled={filterPostStatus === "active"} onClick={() => handleFilterPostStatus("active")}>Active</button>
                            <button type="button" className={"btn " + (filterPostStatus === "pending" ? "btn-warning" : "btn-outline-warning") + " btn-sm"} disabled={filterPostStatus === "pending"} onClick={() => handleFilterPostStatus("pending")}>Pending</button>
                            <button type="button" className={"btn " + (filterPostStatus === "blocked" ? "btn-danger" : "btn-outline-danger") + " btn-sm"} disabled={filterPostStatus === "blocked"} onClick={() => handleFilterPostStatus("blocked")}>Blocked</button>
                        </div>

                    </div>
                </div>
            </div>

            {(users?.length === 0 && responseStatusGetAllUsers !== "error") ? <small>Empty Data</small>
                :

                <div id="scrollbar-small" className="d-flex justify-content-center" style={{ overflow: "scroll", maxHeight: "900px", width: "auto", maxWidth: "auto", overflowX: "auto" }}>



                    <table id="table" className="container-fluid">

                        <tbody>

                            {users?.map(user =>



                                <tr key={user.id}>
                                    <td>

                                        <div className="card container-fluid animate__animated animate__fadeIn shadow-sm" style={{ maxWidth: 500, marginTop: 50 }}>



                                            <div className="position-relative">
                                                {user.status === "active" ?
                                                    <div className="position-absolute top-0 start-50 translate-middle">
                                                        <span className="badge rounded-pill bg-success border border-secondary">Active</span>
                                                    </div>
                                                    :
                                                    user.status === "pending" ?
                                                        <div className="position-absolute top-0 start-50 translate-middle">
                                                            <span className="badge rounded-pill bg-warning text-dark border border-secondary">Pending</span>
                                                        </div>
                                                        :
                                                        user.status === "blocked" ?
                                                            <div className="position-absolute top-0 start-50 translate-middle">
                                                                <span className="badge rounded-pill bg-danger border border-secondary">Blocked</span>
                                                            </div>
                                                            :
                                                            <div className="position-absolute top-0 start-50 translate-middle">
                                                                <span className="badge rounded-pill bg-secondary border border-secondary">not defined</span>
                                                            </div>
                                                }
                                            </div>

                                            <br />

                                            <img src={user.userCoverImg ? `data:image/jpg;base64,${user.userCoverImg}` : default_user_cover_img} height="100" style={{ objectFit: "cover" }} className="card-img-top rounded" alt="image" />



                                            <div className="card-header bg-transparent">
                                                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                                    <img src={user.userProfileImg ? `data:image/jpg;base64,${user.userProfileImg}` : default_user_profile_img} width="60" height="60" style={{ objectFit: "cover", cursor: 'pointer', marginTop: -30 }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" onClick={() => navigate("/user/" + user.username)} />
                                                    <h6>{user.fullName} <span className="badge bg-secondary">{user.role}</span></h6>
                                                </div>


                                                <div className="position-absolute top-0 end-0">
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">

                                                        {(user.status === "pending" || user.status === "blocked") &&

                                                            <div className="dropdown">
                                                                <button className="btn btn-light btn-sm dropdown-toggle" style={{ margin: 5 }} type="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-check-circle text-success"></i> Approve</button>
                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                    <p><small className="text-secondary">Are you sure?</small></p>
                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => statusPost(user.id, "active")}>Yes</button>
                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                </ul>
                                                            </div>



                                                        }

                                                        {(user.status === "pending" || user.status === "active") &&
                                                            <div className="dropdown">
                                                                <button className="btn btn-light btn-sm dropdown-toggle" style={{ margin: 5 }} type="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-x-lg text-danger"></i> Block</button>
                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                    <p><small className="text-secondary">Are you sure?</small></p>
                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => statusPost(user.id, "blocked")}>Yes</button>
                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                </ul>
                                                            </div>
                                                        }


                                                    </div>

                                                </div>


                                            </div>
                                            <div className="card-body">

                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item"><small style={{ fontSize: 12 }}>id: {user.id}</small> / <small style={{ fontSize: 12 }}>{user.enabled ? "enabled" : "disabled"}</small></li>
                                                    <li className="list-group-item"><small style={{ fontSize: 12 }}>@{user.username}</small></li>
                                                    <li className="list-group-item"><small style={{ fontSize: 12 }}>{user.email}</small></li>
                                                </ul>

                                                <div className="position-absolute bottom-0 end-0 text-muted" style={{ padding: "5px", fontSize: 12 }}>

                                                    {user?.updatedDate ?

                                                        <small>updated: {moment(user.updatedDate).locale(moment_locale).format(moment_format_date_time_long)}</small>
                                                        :
                                                        <small>{moment(user.createdDate).locale(moment_locale).format(moment_format_date_time_long)}</small>
                                                    }
                                                </div>
                                            </div>
                                            <div className="card-footer bg-transparent text-muted">
                                            <button type="button" className="btn btn-light btn-sm rounded-pill" onClick={() => navigate("/user/" + user.username)}><i className="bi bi-person-fill"></i> Profile <i className="bi bi-arrow-right-short"></i></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>
                </div>


            }
        </div>
    )
}

export default Users;