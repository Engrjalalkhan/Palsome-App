import { StyleSheet } from "react-native";
import Modal from "react-native-modalbox";
import React, { useRef, useState } from "react";
import CubeNavigationHorizontal from "./CubeNavigationHorizontal";

import StoryListItem from "../StoryListItem";
import { isNullOrWhitespace } from "../helpers";
import AndroidCubeEffect from "./AndroidCubeEffect";
import { getHeight, getWidth } from "../../../../../../Utils/NewResponsive";

const StoryModel = ({ isOpen, setIsModalOpen, data }) => {
  const duration = 10;

  const cube = useRef();

  const [currentPage, setCurrentPage] = useState(0);

  function onStoryFinish(state) {
    if (!isNullOrWhitespace(state)) {
      if (state == "next") {
        const newPage = currentPage + 1;
        if (newPage < data.length) {
          setCurrentPage(newPage);
          cube?.current?.scrollTo(newPage);
        } else {
          setIsModalOpen(false);
          setCurrentPage(0);
        }
      } else if (state == "previous") {
        const newPage = currentPage - 1;
        if (newPage < 0) {
          setIsModalOpen(false);
          setCurrentPage(0);
        } else {
          setCurrentPage(newPage);
          cube?.current?.scrollTo(newPage);
        }
      }
    }
  }
  const renderStoryList = () =>
    data.map((x, i) => {
      return (
        <StoryListItem
          inititalDuration={duration * 1000}
          key={i}
          userId={x.user_id}
          profileName={x.name}
          profileImage={x.profile_picture}
          stories={x?.items}
          currentPage={currentPage}
          onFinish={onStoryFinish}
          onClosePress={() => {
            setIsModalOpen(false);
          }}
          index={i}
        />
      );
    });
  const renderCube = () => {
    if (Platform.OS == "ios") {
      return (
        <CubeNavigationHorizontal
          ref={cube}
          callBackAfterSwipe={(x) => {
            if (x != currentPage) {
              setCurrentPage(parseInt(x));
            }
          }}
        >
          {renderStoryList()}
        </CubeNavigationHorizontal>
      );
    } else {
      return (
        <AndroidCubeEffect
          ref={cube}
          callBackAfterSwipe={(x) => {
            if (x != currentPage) {
              setCurrentPage(parseInt(x));
            }
          }}
        >
          {renderStoryList()}
        </AndroidCubeEffect>
      );
    }
  };
  return (
    <Modal
      style={{
        width: getWidth(100),
        height: getHeight(100),
      }}
      isOpen={isOpen}
      onClosed={() => {
        setIsModalOpen(false);
      }}
      position="center"
      swipeToClose
      swipeArea={250}
      backButtonClose
      coverScreen={true}
    >
      {renderCube()}
    </Modal>
  );
};

export default StoryModel;

const styles = StyleSheet.create({});
