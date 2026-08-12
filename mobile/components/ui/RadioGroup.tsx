import * as React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { palette, radius } from './_shared/tokens';

interface RadioGroupContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  children?: React.ReactNode;
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Radio group mirroring the web `RadioGroup` — coordinates selection via context. */
export function RadioGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled,
  style,
}: RadioGroupProps) {
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

  const ctx = React.useMemo(
    () => ({ value: current, setValue, disabled }),
    [current, setValue, disabled]
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <View accessibilityRole="radiogroup" style={[styles.group, style]}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps {
  /** The value this item represents within the group. */
  value: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function RadioGroupItem({ value, disabled, style }: RadioGroupItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error('RadioGroupItem must be used within a RadioGroup');
  }

  const selected = ctx.value === value;
  const isDisabled = disabled || ctx.disabled;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => ctx.setValue(value)}
      style={[
        styles.outer,
        selected && styles.outerSelected,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {selected ? <View style={styles.inner} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: { rowGap: 8 },
  outer: {
    height: 18,
    width: 18,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: palette.gray300,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerSelected: { borderColor: palette.black },
  inner: { height: 8, width: 8, borderRadius: radius.full, backgroundColor: palette.black },
  disabled: { opacity: 0.5 },
});
