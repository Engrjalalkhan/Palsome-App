import { combineReducers } from "redux";
import profileReducers from "./ProfileReducers";
import authReducer from "./AuthReducers";
import newsFeedReducers from "./NewsFeedReducers";
import blackNewsFeedRed from "./BlackListReducers/NewsFeedReds";
import WalletRed from "./BlackListReducers/WalletRed";
import RoomsRed from "./BlackListReducers/RoomsRed";
import ReelsRed from "./BlackListReducers/ReelsRed";
import chatGPTReducers from "./ChatGPT";
import buyNsellReducer from "./BuyNsellReducers";
import reminderReducer from "./RemindersReducer";
import EventsReducer from "./EventsReducer";
import constantReducers from "./ConstantReducer";
export const rootReducer = combineReducers({
  prof: profileReducers,
  auth: authReducer,
  newsF: newsFeedReducers,
  blackNewsF: blackNewsFeedRed,
  walletRed: WalletRed,
  roomsRed: RoomsRed,
  reelsRed: ReelsRed,
  chatGPTRed: chatGPTReducers,
  buyNsellRed: buyNsellReducer,
  reminderRed: reminderReducer,
  eventsRed: EventsReducer,
  constantReducers: constantReducers,
});
