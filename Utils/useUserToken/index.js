import { useSelector } from "react-redux";

const useUserToken = () => {
  const token = useSelector((state) => state.auth.userToken);
  return token;
};

export default useUserToken;
