import {useEffect, useState} from 'react';
import {Keyboard, KeyboardEvent} from 'react-native';

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setVisible] = useState(false);

  function onKeyboardDidShow(e) {
    // Remove type here if not using TypeScript
    setKeyboardHeight(e.endCoordinates.height);
    setVisible(true);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
    setVisible(false);
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {keyboardHeight, keyboardVisible};
};
