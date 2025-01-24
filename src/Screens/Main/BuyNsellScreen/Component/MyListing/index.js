import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TopTabs from "../TopTabs";
import YourAds from "../YourAds";
import Drafts from "../Drafts";
import Favorites from "../Favorites";

const MyListing = ({
  data,
  yourAdsData,
  yourDrafts,
  yourFavorites,
  loading,
  navigation,
  onPressEditDeleteModel,
  onPressFavoriteItem,
  setSearchText,
  newDataApiCall,
  setNewDataApiCall,
}) => {
  const [yourAds, setYourAds] = useState(true);
  const [drafts, setDrafts] = useState(false);
  const [favorites, setFavorites] = useState(false);

  const onPressYourAds = () => {
    setYourAds(true);
    setDrafts(false);
    setFavorites(false);
  };
  const onPressDrafts = () => {
    setYourAds(false);
    setFavorites(false);
    setDrafts(true);
  };
  const onPressFavorite = () => {
    setYourAds(false);
    setDrafts(false);
    setFavorites(true);
  };
  return (
    <View style={styles.container}>
      <TopTabs
        yourListing
        onPressYourAds={() => {
          onPressYourAds();
        }}
        onPressDrafts={() => {
          onPressDrafts();
        }}
        onPressFavorite={() => {
          onPressFavorite();
        }}
      />
      {yourAds && (
        <YourAds
          data={yourAdsData}
          navigation={navigation}
          loading={loading}
          onPressEditDeleteModel={(item) => {
            onPressEditDeleteModel(item);
          }}
          setSearchText={(e) => {
            setSearchText(e);
          }}
          newDataApiCall={newDataApiCall}
          setNewDataApiCall={setNewDataApiCall}
        />
      )}
      {drafts && (
        <Drafts
          data={yourDrafts}
          navigation={navigation}
          loading={loading}
          onPressEditDeleteModel={(item) => {
            onPressEditDeleteModel(item, "draft");
          }}
          newDataApiCall={newDataApiCall}
        />
      )}
      {favorites && (
        <Favorites
          data={yourFavorites}
          navigation={navigation}
          loading={loading}
          onPressFavoriteItem={(item) => {
            onPressFavoriteItem(item);
          }}
        />
      )}
    </View>
  );
};

export default MyListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
});
