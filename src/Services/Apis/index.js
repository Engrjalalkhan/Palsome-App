import { BASE_URL } from "../Constants";
import axios from "axios";

export const ApiCall = async ({ params, route, verb }) => {
  console.log(params, "params");
  console.log(route, "verb");
  console.log(verb, "verb");

  try {
    const url = `${BASE_URL}/${route}`;
    let options = {
      method: verb,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    };

    let response = await fetch(url, options);
    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const VerApiCall = async ({ params, route, verb }) => {
  try {
    const url = `${BASE_URL}/${route}`;
    let options = {
      method: verb,
      headers: {
        Accept: "application/json",
        v: 1,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    };

    let response = await fetch(url, options);
    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const settingsApiCall = async ({ params, route, verb, token }) => {
  try {
    const url = `${BASE_URL}/${route}`;
    let options = Object.assign(
      { method: verb },
      params ? { body: JSON.stringify(params) } : null
    );
    options.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    let response = await fetch(url, options);
    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const withoutStringiApiCall = async ({ params, route, verb, token }) => {
  try {
    const url = `${BASE_URL}/${route}`;
    let options = Object.assign(
      { method: verb },
      params ? { body: params } : null
    );
    options.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    let response = await fetch(url, options);
    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const postStatusApiCall = async ({
  params,
  route,
  verb,
  token,
  body,
}) => {
  try {
    // post/share //
    const url = `${BASE_URL}/${route}`;
    let options = Object.assign(
      { method: verb },
      params ? { body: JSON.stringify(params) } : null,
      body ? { body: body } : null
    );
    options.headers = {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    };

    let response = await fetch(url, options);

    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const commentDeleteApiCall = async ({
  params,
  route,
  verb,
  token,
  body,
}) => {
  try {
    const url = `${BASE_URL}/${route}`;
    let options = Object.assign(
      { method: verb },
      params ? { body: JSON.stringify(params) } : null,
      body ? { body: body } : null
    );
    options.headers = {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    };

    let response = await fetch(url, options);

    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const commentUpdateApiCall = async ({
  params,
  route,
  verb,
  token,
  body,
}) => {
  try {
    const url = `${BASE_URL}/${route}`;
    let options = Object.assign(
      { method: verb },
      params ? { body: JSON.stringify(params) } : null,
      body ? { body: body } : null
    );
    options.headers = {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    };

    let response = await fetch(url, options);
    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const singlePostApiCall = async ({ params, route, verb, token }) => {
  try {
    const url = route;
    let options = Object.assign(
      { method: verb },
      params ? { body: JSON.stringify(params) } : null
    );
    options.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    let response = await fetch(url, options);
    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const addWalletApiCall = async ({ params, route, verb, token }) => {
  try {
    const url = `${BASE_URL}/${route}`;
    let options = Object.assign(
      { method: verb },
      params ? { body: JSON.stringify(params) } : null
    );
    options.headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      // "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    let response = await fetch(url, options);
    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const updateApiCall = async ({
  params,
  route,
  verb,
  token,
  isFormData,
}) => {
  try {
    const url = `${BASE_URL}/${route}`;
    let options = Object.assign(
      { method: verb },
      params
        ? isFormData
          ? { body: params }
          : { body: JSON.stringify(params) }
        : null
    );
    options.headers = {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + token,
    };

    console.log(options);

    let response = await fetch(url, options);
    if (response) {
      console.log(response, "Response");
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

export const withoutStringiApiCall2 = async ({
  params,
  route,
  verb,
  token,
}) => {
  try {
    const url = `${BASE_URL}/${route}`;
    let options = Object.assign(
      { method: verb },
      params ? { body: params } : null
    );
    options.headers = {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    };
    // console.log(options)
    let response = await fetch(url, options);
    if (response) {
      return await response.json();
    } else {
      return response;
    }
  } catch (e) {
    return e.toString();
  }
};

const handleUpdate = async () => {
  try {
    if (jobSeekerIndustries && jobTitle && description && experience && video) {
      const numbers = /^[0-9]+$/;
      if (experience.match(numbers)) {
        setLoading(true);
        console.log("update");
        const formData = new FormData();
        formData.append("industry", jobSeekerIndustries);
        formData.append("jobTitle", jobTitle);
        formData.append("description", description);
        formData.append("experience", experience);
        formData.append("file", video);

        await axios({
          method: "POST",
          data: formData,
          url: BASE_URL + "/resume_video/create_resume_video.php",
          headers: {
            Authorization: "Bearer " + userToken,
            // Accept: 'application/json',
            "Content-Type": "application/json",
          },
          onUploadProgress: function (progressEvent) {
            let percentage = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress(percentage);
            console.log("PERCENTAGE ", percentage);
          },
        })
          .then((response) => {
            console.log("uploaded", response.data);

            console.log(response.json());
          })
          .catch((error) => {
            console.log("err i axios up", error);
          });
      } else {
        Alert.alert("Attention", "Experience Must Be a Number");
      }
    } else {
      Alert.alert("Attention", "Please Fill All Fields");
    }
  } catch (error) {
    console.log("error in try catch", error);
  }
};

export const friendsSuggesionSideBar = async ({ token }) => {
  const url = `${BASE_URL}/news_feed`;
  let options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      v: 1,
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  await fetch(url, options)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("responseJson", responseJson);
      return responseJson;
      // if (responseJson?.responseCode !== 200) {
      //   console.log(responseJson?.payload?.data);
      //   setIsLoading(false);
      //   setNoPosts(true);
      //   setNoPostText(responseJson?.message);
      //   setData(null);
      //   if (responseJson?.payload?.data?.session_expired == true) {
      //     navigation.navigate("SessionExpiredScreen");
      //   }
      // } else {
      //   if (getnew == "loadNew") {
      //     setData(responseJson.payload.data.singlePost.data);
      //     if (responseJson.payload.data.singlePost.data.length == 0) {
      //       setNoPosts(true);
      //     } else setNoPosts(false);
      //   } else {
      //     setData(data.concat(responseJson.payload.data.singlePost.data));
      //     // setfriendsSuggestData(responseJson.payload.data.friendsSuggestions);
      //   }
      //   setIsLoading(false);

      //   setGetNew(false);
      // }
    })
    .catch((e) => {});
};
