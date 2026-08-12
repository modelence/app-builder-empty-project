import * as React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { palette, radius, fontSize } from './_shared/tokens';

/**
 * DropdownMenu mirroring the web `DropdownMenu` family. Web anchors a popover to
 * the trigger; on mobile the native equivalent is an action sheet, so the content
 * is presented in a bottom Modal. Items close the menu on press.
 */

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu(): DropdownMenuContextValue {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error('DropdownMenu subcomponents must be used within <DropdownMenu>');
  return ctx;
}

export interface DropdownMenuProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropdownMenu({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: DropdownMenuProps) {
  const isControlled = open !== undefined;
  const [internal, setInternal] = React.useState(defaultOpen);
  const value = isControlled ? open : internal;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const ctx = React.useMemo(() => ({ open: value, setOpen }), [value, setOpen]);
  return <DropdownMenuContext.Provider value={ctx}>{children}</DropdownMenuContext.Provider>;
}

export function DropdownMenuTrigger({ children }: { children: React.ReactElement }) {
  const { setOpen } = useDropdownMenu();
  return React.cloneElement(children as React.ReactElement<{ onPress?: () => void }>, {
    onPress: () => setOpen(true),
  });
}

export interface DropdownMenuContentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function DropdownMenuContent({ children, style }: DropdownMenuContentProps) {
  const { open, setOpen } = useDropdownMenu();
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
        <Pressable style={[styles.popup, style]} onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** Grouping wrapper (no anchor semantics on mobile — purely visual). */
export function DropdownMenuGroup({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={style}>{children}</View>;
}

export interface DropdownMenuItemProps {
  children?: React.ReactNode;
  /** Leading icon element. */
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** Applies destructive coloring to the label. */
  destructive?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function DropdownMenuItem({
  children,
  icon,
  onPress,
  disabled,
  destructive,
  style,
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        onPress?.();
        setOpen(false);
      }}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <View style={styles.itemIcon}>{icon}</View> : null}
      {typeof children === 'string' ? (
        <Text style={[styles.itemText, destructive && styles.itemTextDestructive]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function DropdownMenuSeparator({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.separator, style]} />;
}

export function DropdownMenuLabel({ children, style }: { children?: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

/** Alias kept for API parity with the web `DropdownMenuGroupLabel`. */
export const DropdownMenuGroupLabel = DropdownMenuLabel;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  popup: {
    backgroundColor: palette.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    columnGap: 12,
  },
  itemPressed: { backgroundColor: palette.gray100 },
  itemIcon: { width: 20, alignItems: 'center' },
  itemText: { fontSize: fontSize.sm, color: palette.gray900 },
  itemTextDestructive: { color: palette.red600 },
  disabled: { opacity: 0.5 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: palette.gray200, marginVertical: 4 },
  label: { paddingHorizontal: 16, paddingVertical: 8, fontSize: fontSize.xs, fontWeight: '500', color: palette.gray500 },
});
