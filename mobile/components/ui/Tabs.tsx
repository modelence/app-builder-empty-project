import * as React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { palette, radius, fontSize } from './_shared/tokens';

interface TabsContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs subcomponents must be used within <Tabs>');
  return ctx;
}

export interface TabsProps {
  children?: React.ReactNode;
  /** Controlled active tab value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** Tabs root mirroring the web `Tabs` (`TabsList` / `TabsTab` / `TabsPanel`). */
export function Tabs({ children, value, defaultValue, onValueChange, style }: TabsProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const current = isControlled ? value : internal;

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const ctx = React.useMemo(() => ({ value: current, setValue }), [current, setValue]);

  return (
    <TabsContext.Provider value={ctx}>
      <View style={style}>{children}</View>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TabsList({ children, style }: TabsListProps) {
  return (
    <View accessibilityRole="tablist" style={[styles.list, style]}>
      {children}
    </View>
  );
}

export interface TabsTabProps {
  /** The value this tab activates. */
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function TabsTab({ value, children, disabled, style }: TabsTabProps) {
  const ctx = useTabs();
  const active = ctx.value === value;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={() => ctx.setValue(value)}
      style={[styles.tab, active && styles.tabActive, disabled && styles.disabled, style]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.tabText, active && styles.tabTextActive]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface TabsPanelProps {
  /** Panel is rendered only when this matches the active tab value. */
  value: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TabsPanel({ value, children, style }: TabsPanelProps) {
  const ctx = useTabs();
  if (ctx.value !== value) return null;
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.lg,
    backgroundColor: palette.gray100,
    padding: 4,
    columnGap: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabActive: {
    backgroundColor: palette.white,
    shadowColor: palette.black,
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tabText: { fontSize: fontSize.sm, fontWeight: '500', color: palette.gray600 },
  tabTextActive: { color: palette.gray900 },
  disabled: { opacity: 0.5 },
  panel: { marginTop: 8 },
});
