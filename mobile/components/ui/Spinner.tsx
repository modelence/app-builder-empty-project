import * as React from 'react';
import { Animated, Easing, View, type ViewStyle } from 'react-native';
import { Loader2 } from 'lucide-react-native';
import { palette } from './_shared/tokens';

export interface SpinnerProps {
  /** Glyph size in px. @default 16 */
  size?: number;
  /** Icon color. @default palette.gray900 */
  color?: string;
  style?: ViewStyle;
}

/**
 * Small inline spinner for use inside controls (e.g. a loading Button).
 * For full-screen loading use `components/LoadingSpinner` instead.
 *
 * React Native has no CSS animation, so the continuous rotation is driven by an
 * `Animated.Value` looped with the native driver.
 */
export function Spinner({ size = 16, color = palette.gray900, style }: SpinnerProps) {
  const spin = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={style}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Loader2 size={size} color={color} />
      </Animated.View>
    </View>
  );
}
