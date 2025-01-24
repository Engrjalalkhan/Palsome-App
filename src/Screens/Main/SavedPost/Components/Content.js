import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

import Hooks from "./Hooks";
import SavedItemCard from "./SavedItemCard";
import { useTranslation } from "react-i18next";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import {
  getApiData,
  getApiDataWithParams,
} from "../../ReminderScreen/Components/remindersApiCall";
import { useSelector } from "react-redux";
import SavedItemFolder from "./SavedItemFolder";

const Content = ({
  selectedTab,
  onPressItem,
  onPressItemFolder,
  onPressThreeDots,
  onPressThreeDotsFolder,
  loading,
  cachedCollections,
  onRefresh,
  loadMoreData,
  loadingMore,
}) => {
  const { t } = useTranslation();
  const { refreshing } = Hooks();

  const renderFooter = useMemo(() => {
    return (
      <View style={{ marginVertical: 10 }}>
        {loadingMore && <ActivityIndicator color="red" size={"large"} />}
      </View>
    );
  }, [loadingMore]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="red" size={"large"} />
          {/* <SkeletonLoader isLoading={loading} layoutType={"feed"} /> */}
        </View>
      );
    }

    const data = cachedCollections[selectedTab] || [];

    return data.length === 0 ? (
      <View style={styles.noReminderContainer}>
        {selectedTab === 0
          ? ICONS.feather("bookmark", COLORS.primary, 50)
          : ICONS.feather("bookmark", COLORS.primary, 50)}
        <Text style={styles.noReminderText}>
          {selectedTab === 0
            ? t("You do not have any saved items")
            : t("You do not have any collections")}
        </Text>
      </View>
    ) : selectedTab === 0 ? (
      <SavedItemCard
        data={data}
        onPressItem={onPressItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderFooter={renderFooter}
        loadMoreData={loadMoreData}
        onPressThreeDots={onPressThreeDots}
      />
    ) : (
      <SavedItemFolder
        data={data}
        onPressItem={onPressItemFolder}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderFooter={renderFooter}
        loadMoreData={loadMoreData}
        onPressThreeDots={onPressThreeDotsFolder}
      />
    );
  };

  return <View style={styles.contentContainer}>{renderContent()}</View>;
};

export default Content;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  noReminderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noReminderText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
    textAlign: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 30,
  },
});
