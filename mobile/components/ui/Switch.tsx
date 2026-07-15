import * as React from 'react';
import { Animated, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { palette, radius } from './_shared/tokens';

export interface SwitchProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled initial state. @default false */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TRACK_WIDTH = 36;
const TRACK_HEIGHT = 20;
const THUMB_SIZE = 16;
const THUMB_OFFSET = 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_OFFSET * 2;

/**
 * Toggle switch mirroring the web `Switch` (h-5 w-9 track, black when on). The
 * thumb slide is animated with the native driver.
 */
export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  style,
}: SwitchProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const value = isControlled ? checked : internal;

  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const toggle = () => {
    const next = !value;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.gray200, palette.black],
  });
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_OFFSET, THUMB_OFFSET + THUMB_TRAVEL],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={toggle}
      style={style}
    >
      <Animated.View
        style={[styles.track, { backgroundColor: trackColor }, disabled && styles.disabled]}
      >
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radius.full,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.full,
    backgroundColor: palette.white,
    shadowColor: palette.black,
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  disabled: { opacity: 0.5 },
});
