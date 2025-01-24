// apiService.js

import {
  postStatusApiCall,
  withoutStringiApiCall2,
} from "../../../../Services/Apis";

export const getApiData = async (route, token, page = 1, pageSize = 10) => {
  try {
    const res = await withoutStringiApiCall2({
      route: `${route}?limit=${pageSize}&page=${page}`,
      verb: "GET",
      token: token,
    });

    if (res.responseCode !== 200) {
    } else if (res.responseCode === 200) {
      return res.payload.data;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
};
export const getApiDataWithParams = async (
  route,
  token,
  setLoading = false,
  page
) => {
  if (setLoading && page == 1) {
    setLoading(true);
  }

  try {
    const res = await withoutStringiApiCall2({
      route: `${route}`,
      verb: "GET",
      token: token,
    });

    if (res.responseCode !== 200) {
      if (setLoading) {
        setLoading(false);
      }
    } else if (res.responseCode === 200) {
      if (setLoading) {
        setLoading(false);
      }

      return res.payload.data;
    }
  } catch (e) {
    if (setLoading) {
      setLoading(false);
    }
    console.log("saga error -- ", e.toString());
  }
};

export const postApiCall = async (route, formData, token) => {
  try {
    const res = await postStatusApiCall({
      route: route,
      verb: "POST",
      token: token,
      body: formData,
    });

    return res;
  } catch (e) {
    console.error("API call error:", e.toString());
    throw e;
  }
};

export const deleteApiData = async (route, token, verb) => {
  try {
    const res = await withoutStringiApiCall2({
      route: route,
      verb: verb,
      token: token,
    });
    return res;
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
};

export const getReminderDetailApiCall = async (route, token) => {
  try {
    const res = await withoutStringiApiCall2({
      route: `${route}`,
      verb: "GET",
      token: token,
    });
    if (res.responseCode !== 200) {
    } else if (res.responseCode === 200) {
      return res;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
};
