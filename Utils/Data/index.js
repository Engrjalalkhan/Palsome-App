import React from "react";
import { Image } from "react-native";

export const MainArray = [
  {
    id: "0",
    name: "Feeling",
    placholder: "How are you feeling?",
    image: require("../../src/Assets/images/happyEmoji.png"),
    moreData: [
      {
        id: "0",
        name: "Happy",
        image: require("../../src/Assets/images/happyEmoji.png"),
      },
      {
        id: "2",
        name: "Loved",
        image: require("../../src/Assets/images/loveEmoji.png"),
      },
      {
        id: "3",
        name: "Satisfied",
        image: require("../../src/Assets/images/satisfiedEmoji.png"),
      },
      {
        id: "4",
        name: "Strong",
        image: require("../../src/Assets/images/strongEmoji.png"),
      },
      {
        id: "5",
        name: "Sad",
        image: require("../../src/Assets/images/sadEmoji.png"),
      },
      {
        id: "6",
        name: "Crazy",
        image: require("../../src/Assets/images/crazyEmoji.png"),
      },
      {
        id: "7",
        name: "Tired",
        image: require("../../src/Assets/images/tiredEmoji.png"),
      },
      {
        id: "8",
        name: "Sleepy",
        image: require("../../src/Assets/images/sleepyEmoji.png"),
      },
      {
        id: "9",
        name: "Confused",
        image: require("../../src/Assets/images/confusedEmoji.png"),
      },
      {
        id: "10",
        name: "Worried",
        image: require("../../src/Assets/images/worriedEmoji.png"),
      },
      {
        id: "11",
        name: "Angry",

        image: require("../../src/Assets/images/angryEmoji.png"),
      },
      {
        id: "12",
        name: "Annoyed",

        image: require("../../src/Assets/images/annoyedEmoji.png"),
      },
      {
        id: "13",
        name: "Shocked",

        image: require("../../src/Assets/images/shockedEmoji.png"),
      },
      {
        id: "14",
        name: "Down",

        image: require("../../src/Assets/images/sadEmoji.png"),
      },
      {
        id: "15",
        name: "Confounded",

        image: require("../../src/Assets/images/confoundedEmoji.png"),
      },
    ],
  },
  {
    id: "1",
    name: "Listening To",
    placholder: "What are you listening to?",
    image: require("../../src/Assets/images/listeningEmoji.png"),
  },
  {
    id: "2",
    name: "Watching",
    placholder: "What are you watching?",
    image: require("../../src/Assets/images/watchingEmoji.png"),
  },
  {
    id: "3",
    name: "Playing",
    placholder: "What are you playing?",
    image: require("../../src/Assets/images/playingEmoji.png"),
  },
  {
    id: "4",
    name: "Eating",
    placholder: "What are you eating?",
    image: require("../../src/Assets/images/eatingEmoji.png"),
  },
  {
    id: "5",
    name: "Drinking",
    placholder: "What are you drinking?",
    image: require("../../src/Assets/images/juiceEmoji.png"),
  },
  {
    id: "6",
    name: "Traveling To",
    placholder: "where are you going",
    image: require("../../src/Assets/images/travelingEmoji.png"),
  },
  {
    id: "7",
    name: "Reading",
    placholder: "What are you reading?",
    image: require("../../src/Assets/images/booksEmoji.png"),
  },
  {
    id: "8",
    name: "Attending",
    placholder: "What are you attending?",
    image: require("../../src/Assets/images/calendarEmoji.png"),
  },
  {
    id: "9",
    name: "Celebrating",
    placholder: "What are you celebrating?",
    image: require("../../src/Assets/images/celebratingEmoji.png"),
  },
  {
    id: "10",
    name: "Looking For",
    placholder: "What are you looking for?",
    image: require("../../src/Assets/images/lookingForEmoji.png"),
  },
];

export const feelings = {
  Happy: require("../../src/Assets/images/happyEmoji.png"),

  love: require("../../src/Assets/images/loveEmoji.png"),

  satisfied: require("../../src/Assets/images/satisfiedEmoji.png"),

  strong: require("../../src/Assets/images/strongEmoji.png"),

  sad: require("../../src/Assets/images/sadEmoji2.png"),

  crazy: require("../../src/Assets/images/crazyEmoji.png"),

  tired: require("../../src/Assets/images/tiredEmoji.png"),

  sleepy: require("../../src/Assets/images/sleepyEmoji.png"),

  confused: require("../../src/Assets/images/confusedEmoji.png"),

  worried: require("../../src/Assets/images/worriedEmoji.png"),

  angry: require("../../src/Assets/images/angryEmoji.png"),

  annoyed: require("../../src/Assets/images/annoyedEmoji.png"),

  shocked: require("../../src/Assets/images/shockedEmoji.png"),

  down: require("../../src/Assets/images/sadEmoji.png"),

  confounded: require("../../src/Assets/images/confoundedEmoji.png"),
};

export const showImgFunc = (name, height = 15, width = 15) => {
  return name == "Happy" ||
    name == "Loved" ||
    name == "Satisfied" ||
    name == "Strong" ||
    name == "Sad" ||
    name == "Crazy" ||
    name == "Tired" ||
    name == "Sleepy" ||
    name == "Confused" ||
    name == "Worried" ||
    name == "Angry" ||
    name == "Annoyed" ||
    name == "Shocked" ||
    name == "Down" ||
    name == "Confounded" ? (
    <Image
      style={{ height: height, width: width }}
      source={
        name == "Happy"
          ? feelings.Happy
          : name == "Loved"
          ? feelings.love
          : name == "Satisfied"
          ? feelings.satisfied
          : name == "Strong"
          ? feelings.strong
          : name == "Sad"
          ? feelings.sad
          : name == "Crazy"
          ? feelings.crazy
          : name == "Tired"
          ? feelings.tired
          : name == "Sleepy"
          ? feelings.sleepy
          : name == "Confused"
          ? feelings.confused
          : name == "Worried"
          ? feelings.worried
          : name == "Angry"
          ? feelings.angry
          : name == "Annoyed"
          ? feelings.annoyed
          : name == "Shocked"
          ? feelings.shocked
          : name == "Down"
          ? feelings.down
          : name == "Confounded"
          ? feelings.confounded
          : ""
      }
    />
  ) : null;
};
