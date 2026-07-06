import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { palette, radius, fontSize } from './_shared/tokens';

/**
 * Tooltip mirroring the web `Tooltip` family API (`TooltipProvider` / `Tooltip` /
 * `TooltipTrigger` / `TooltipContent`). Hover doesn't exist on touch devices, so
 * the mobile equivalent reveals the tip on long-press and hides it on release or
 * tap-away. The tip is positioned above the trigger.
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
  const ctx = React.useMemo(
    () => ({ visible, show: () => setVisible(true), hide: () => setVisible(false) }),
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

/** Wraps a single child; long-press shows the tip, release hides it. */
export function TooltipTrigger({ children }: TooltipTriggerProps) {
  const { show, hide } = useTooltip();
  return (
    <Pressable onLongPress={show} onPressOut={hide} delayLongPress={250}>
      {children}
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
    <View pointerEvents="none" style={styles.positioner}>
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
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 6,
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
