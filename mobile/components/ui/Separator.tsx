import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { palette } from './_shared/tokens';

export interface SeparatorProps {
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

/** Thin divider line mirroring the web `Separator`. */
export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  return (
    <View
      accessibilityRole="none"
      style={[
        styles.base,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: palette.gray200 },
  horizontal: { height: StyleSheet.hairlineWidth, width: '100%' },
  vertical: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch' },
});
