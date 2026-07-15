import * as React from 'react';
import { StyleSheet, Text, View, type ViewProps, type TextProps } from 'react-native';
import { palette, radius, fontSize } from './_shared/tokens';

/**
 * Card and its slots, mirroring the web `Card` family. Because React Native has no
 * absolute-position-within-flow the way the web `CardAction` uses, `CardAction`
 * here is a row that you place inside `CardHeader` (typically right-aligned).
 */

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.header, style]} {...props} />;
}

export function CardAction({ style, ...props }: ViewProps) {
  return <View style={[styles.action, style]} {...props} />;
}

export function CardTitle({ style, ...props }: TextProps) {
  return <Text style={[styles.title, style]} {...props} />;
}

export function CardDescription({ style, ...props }: TextProps) {
  return <Text style={[styles.description, style]} {...props} />;
}

export function CardContent({ style, ...props }: ViewProps) {
  return <View style={[styles.content, style]} {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.footer, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.gray200,
    backgroundColor: palette.white,
    // Subtle shadow to match the web `shadow-sm`.
    shadowColor: palette.black,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  header: { padding: 24, rowGap: 6 },
  action: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  title: { fontSize: fontSize.lg, fontWeight: '600', color: palette.gray900 },
  description: { fontSize: fontSize.sm, color: palette.gray600 },
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
