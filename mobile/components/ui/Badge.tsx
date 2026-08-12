import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { palette, radius, fontSize } from './_shared/tokens';
import type { Color } from './_shared/variants';

export type BadgeVariant = 'solid' | 'soft' | 'outline';

interface BadgeStyle {
  container: ViewStyle;
  text: TextStyle;
}

/** Static (non-interactive) variant×color styles for badges. */
const BADGE_STYLES: Record<BadgeVariant, Record<Color, BadgeStyle>> = {
  solid: {
    neutral: { container: { backgroundColor: palette.black }, text: { color: palette.white } },
    primary: { container: { backgroundColor: palette.blue600 }, text: { color: palette.white } },
    destructive: { container: { backgroundColor: palette.red600 }, text: { color: palette.white } },
  },
  soft: {
    neutral: { container: { backgroundColor: palette.gray100 }, text: { color: palette.gray800 } },
    primary: { container: { backgroundColor: palette.blue100 }, text: { color: palette.blue800 } },
    destructive: { container: { backgroundColor: palette.red100 }, text: { color: palette.red800 } },
  },
  outline: {
    neutral: {
      container: { borderWidth: 1, borderColor: palette.gray300 },
      text: { color: palette.gray900 },
    },
    primary: {
      container: { borderWidth: 1, borderColor: palette.blue300 },
      text: { color: palette.blue700 },
    },
    destructive: {
      container: { borderWidth: 1, borderColor: palette.red300 },
      text: { color: palette.red700 },
    },
  },
};

export interface BadgeProps {
  children?: React.ReactNode;
  /** @default "soft" */
  variant?: BadgeVariant;
  /** @default "neutral" */
  color?: Color;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({
  children,
  variant = 'soft',
  color = 'neutral',
  style,
  textStyle,
}: BadgeProps) {
  const b = BADGE_STYLES[variant][color];
  return (
    <View style={[styles.base, b.container, style]}>
      {typeof children === 'string' ? (
        <Text style={[styles.text, b.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  text: { fontSize: fontSize.xs, fontWeight: '500' },
});
