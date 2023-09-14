import { iconSize, XIcon, spacing, typography } from '@expo/styleguide-native';
import { Row, Text, useExpoTheme, View, Button } from 'expo-dev-client-components';
import { CommonSnackDataFragment } from 'graphql/types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { DevSession } from '../types/DevSession';
import { useUserReviewCheck } from '../utils/useUserReviewCheck';

type Props = {
  projects?: DevSession[];
  snacks?: CommonSnackDataFragment[];
};

export default function UserReviewSection({ snacks, projects }: Props) {
  const { shouldShowReviewSection, requestStoreReview, dismissReviewSection } =
    useUserReviewCheck();
  const theme = useExpoTheme();

  const onPressNeedsWork = () => {};

  if (!shouldShowReviewSection) {
    return null;
  }

  return (
    <View bg="default" rounded="large" border="default" overflow="hidden">
      <TouchableOpacity onPress={dismissReviewSection} style={styles.dismissButton}>
        <XIcon size={iconSize.regular} color={theme.icon.default} />
      </TouchableOpacity>
      <View padding="medium">
        <Text type="InterBold" size="small" style={{ marginBottom: spacing[2] }}>
          Enjoying Expo Go?
        </Text>
        <Text size="small" type="InterRegular" style={{ marginBottom: spacing[2] }}>
          Whether you love us or feel we could be doing better, let us know, your feedback will help
          us improve the app.
        </Text>
        <Row style={{ gap: 10 }}>
          <Button.FadeOnPressContainer
            flex="1"
            bg="secondary"
            onPress={onPressNeedsWork}
            padding="tiny">
            <Button.Text
              align="center"
              size="medium"
              color="secondary"
              type="InterSemiBold"
              style={typography.fontSizes[14]}>
              Not really
            </Button.Text>
          </Button.FadeOnPressContainer>
          <Button.FadeOnPressContainer
            flex="1"
            bg="primary"
            onPress={requestStoreReview}
            padding="tiny">
            <Button.Text
              align="center"
              size="medium"
              color="primary"
              type="InterSemiBold"
              style={typography.fontSizes[14]}>
              Love it!
            </Button.Text>
          </Button.FadeOnPressContainer>
        </Row>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
