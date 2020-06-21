import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  GET_PROFILES,
  CLEAR_PROFILE,
  GET_REPOS,
} from "./types";

export const getCurrentProfile = () => (dispatch) => {
  axios
    .get("/api/profile/me")
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
// get all profiles

export const getProfiles = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  axios
    .get("/api/profile")
    .then((res) => {
      dispatch({
        type: GET_PROFILES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
//get profile by id
export const getProfileById = (userId) => (dispatch) => {
  axios
    .get(`/api/profile/user/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};

//get profile by id
export const getGithubRepos = (username) => (dispatch) => {
  axios
    .get(`/api/profile/github/${username}`)
    .then((res) => {
      dispatch({
        type: GET_REPOS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};

//create or update profile

export const createProfile = (formData, history, edit = false) => (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios
    .post("api/profile", formData, config)
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
      dispatch(
        setAlert(edit ? "Profile Updated" : "Profile Created", "success")
      );
      if (!edit) {
        history.push("/dashboard"); //redirecting to dashboard
      }
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};

//update profile with adding experiences
export const addExperience = (formData, history) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios
    .put("api/profile/experience", formData, config)
    .then((res) => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Experience Added", "success"));
      history.push("/dashboard"); //redirecting to dashboard
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
//update profile with adding educations
export const addEducation = (formData, history) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios
    .put("api/profile/education", formData, config)
    .then((res) => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Education Added", "success"));
      history.push("/dashboard"); //redirecting to dashboard
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};

//delete experience
export const deleteExperience = (id) => (dispatch) => {
  axios
    .delete(`api/profile/experience/${id}`)
    .then((res) => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Experience Removed", "success"));
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};

//delete experience
export const deleteEducation = (id) => (dispatch) => {
  axios
    .delete(`api/profile/education/${id}`)
    .then((res) => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Education Removed", "success"));
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};

//delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? This cannot be recovered")) {
    try {
      await axios.delete("/api/profile");
      dispatch({ type: ACCOUNT_DELETED });

      dispatch({ type: UPDATE_PROFILE });

      dispatch(setAlert("The ACCOUNT has been deleted Permanently", "danger"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
