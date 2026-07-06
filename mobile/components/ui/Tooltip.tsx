import * as React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { palette, radius, fontSize } from './_shared/tokens';

/**
 * Tooltip mirroring the web `Tooltip` family API (`TooltipProvider` / `Tooltip` /
 * `TooltipTrigger` / `TooltipContent`).
 *
 * The reveal gesture is platform-appropriate:
 * - Native (touch): tap the trigger to toggle the tip; long-press also shows it.
 *   Touch devices have no hover, so a discoverable tap is the reliable trigger.
 * - Web (react-native-web): hovering shows/hides the tip, and a tap toggles it —
 *   so it works with both a desktop pointer and touch.
 *
 * The trigger does NOT nest its child inside another Pressable's gesture — when
 * the child is itself pressable (e.g. a Button) that would let the child swallow
 * the touch and the tooltip would never open. The child is wrapped in a
 * `pointerEvents="none"` view so the trigger's Pressable owns the gesture.
 *
 * `TooltipProvider` is a no-op passthrough kept for drop-in API compatibility.
 */

export function TooltipProvider({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

interface TooltipContextValue {
  visible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltip(): TooltipContextValue {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error('Tooltip subcomponents must be used within <Tooltip>');
  return ctx;
}

export interface TooltipProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Tooltip({ children, style }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const ctx = React.useMemo<TooltipContextValue>(
    () => ({
      visible,
      show: () => setVisible(true),
      hide: () => setVisible(false),
      toggle: () => setVisible((v) => !v),
    }),
    [visible]
  );

  return (
    <TooltipContext.Provider value={ctx}>
      <View style={[styles.anchor, style]}>{children}</View>
    </TooltipContext.Provider>
  );
}

export interface TooltipTriggerProps {
  children: React.ReactElement;
}

/** Wraps a single child; tap toggles the tip (long-press also shows it, and on
 * web hover reveals it). */
export function TooltipTrigger({ children }: TooltipTriggerProps) {
  const { show, hide, toggle } = useTooltip();

  // react-native-web forwards these to DOM mouse events; they're ignored on native.
  const hoverProps =
    Platform.OS === 'web'
      ? ({ onMouseEnter: show, onMouseLeave: hide } as unknown as Record<string, unknown>)
      : {};

  return (
    <Pressable
      onPress={toggle}
      onLongPress={show}
      delayLongPress={250}
      accessibilityRole="button"
      accessibilityHint="Shows a tooltip"
      {...hoverProps}
    >
      {/* The child cannot receive the press itself, so a pressable child (Button)
          doesn't intercept and block the toggle. */}
      <View pointerEvents="none">{children}</View>
    </Pressable>
  );
}

export interface TooltipContentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TooltipContent({ children, style }: TooltipContentProps) {
  const { visible } = useTooltip();
  if (!visible) return null;

  return (
    <View style={styles.positioner} pointerEvents="none">
      <View style={[styles.popup, style]}>
        {typeof children === 'string' ? <Text style={styles.text}>{children}</Text> : children}
        <View style={styles.arrow} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { position: 'relative', alignSelf: 'flex-start' },
  positioner: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    alignItems: 'center',
    marginBottom: 6,
    // Paint the tip above sibling content on both web and native.
    zIndex: 50,
  },
  popup: {
    borderRadius: radius.md,
    backgroundColor: palette.gray900,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: palette.black,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  text: { color: palette.white, fontSize: fontSize.xs },
  arrow: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: palette.gray900,
  },
});
