import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { useEffect, useState } from 'react';
import { EventSubscription } from 'react-native';

import addListenerWithNativeCallback from './addListenerWithNativeCallback';
import * as Kernel from '../kernel/Kernel';

export function listenForForegroundEvent(
  listener: (event: any) => Promise<any>
): EventSubscription {
  return addListenerWithNativeCallback('ExponentKernel.requestToCloseDevMenu', listener);
}

const timeAtAppStartup = new Date();

export const useUserReviewCheck = () => {
  const [appOpenedCounter, setAppOpenedCounter] = useState<number>();
  const [shouldShowReviewSection, setShouldShowReviewSection] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('appOpenedCounter').then((c) => {
      const updatedCount = Number(c || 0) + 1;
      setAppOpenedCounter(updatedCount);
    });
  }, []);

  useEffect(() => {
    if (appOpenedCounter && appOpenedCounter > 10) {
      const listener = listenForForegroundEvent(async () => {
        /**
         * We should only prompt users to review the app if they seem to be
         * having a good experience, to check that we verify if the user has been
         * running the app for at least 10 minutes and has not experienced any
         * crashes in the last 5 minutes.
         */
        const timeNow = new Date();
        if (timeNow.getTime() - timeAtAppStartup.getTime() > 10 * 60 * 1000) {
          const lastCrash = await Kernel.getLastCrashDate();

          if (!lastCrash || timeNow.getTime() - new Date(lastCrash).getTime() > 5 * 60 * 1000) {
            const isStoreReviewAvailable = await StoreReview.isAvailableAsync();

            setShouldShowReviewSection(true);
            if (isStoreReviewAvailable) {
              await StoreReview.requestReview();
            }
          }
        }
      });

      return () => listener.remove;
    }

    return () => {};
  }, [appOpenedCounter]);

  function requestStoreReview() {
    setShouldShowReviewSection(false);
    StoreReview.requestReview();
  }

  return {
    shouldShowReviewSection,
    dismissReviewSection: () => {},
    requestStoreReview,
  };
};
