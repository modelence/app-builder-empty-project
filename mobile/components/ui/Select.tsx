import * as React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { SIZES, DEFAULT_SIZE, type ControlSize } from './_shared/sizes';
import { palette, radius, fontSize } from './_shared/tokens';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  /** Selected value (controlled). */
  value?: string | null;
  /** Default selected value (uncontrolled). */
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** @default "md" — shares heights with Button/Input so controls line up. */
  size?: ControlSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Optional custom rendering of an option row in the sheet. */
  renderItem?: (option: SelectOption) => React.ReactNode;
}

/**
 * Select mirroring the web `Select` API (`options` + `value` + `onValueChange`).
 * The web version opens a positioned popover; on mobile the native pattern is a
 * bottom sheet, so tapping the trigger presents the options in a Modal list.
 */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = '',
  size = DEFAULT_SIZE,
  disabled = false,
  style,
  renderItem,
}: SelectProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string | null | undefined>(defaultValue);
  const current = isControlled ? value : internal;
  const [open, setOpen] = React.useState(false);

  const sizing = SIZES[size];
  const selected = options.find((o) => o.value === current) ?? null;

  const choose = (option: SelectOption) => {
    if (option.disabled) return;
    if (!isControlled) setInternal(option.value);
    onValueChange?.(option.value);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          { height: sizing.container.height, borderRadius: radius.md },
          disabled && styles.disabled,
          style,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[styles.triggerText, sizing.text, !selected && styles.placeholder]}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={16} color={palette.gray500} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <FlatList
              data={options}
              keyExtractor={(o) => o.value}
              renderItem={({ item }) => {
                const isSelected = item.value === current;
                return (
                  <Pressable
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: isSelected, disabled: item.disabled }}
                    disabled={item.disabled}
                    onPress={() => choose(item)}
                    style={({ pressed }) => [
                      styles.item,
                      pressed && styles.itemPressed,
                      item.disabled && styles.disabled,
                    ]}
                  >
                    <View style={styles.itemIndicator}>
                      {isSelected ? <Check size={16} color={palette.gray900} /> : null}
                    </View>
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <Text style={styles.itemText}>{item.label}</Text>
                    )}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderColor: palette.gray300,
    backgroundColor: palette.white,
    paddingHorizontal: 12,
  },
  triggerText: { flex: 1, color: palette.gray900 },
  placeholder: { color: palette.gray500 },
  disabled: { opacity: 0.5 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '60%',
    backgroundColor: palette.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    columnGap: 8,
  },
  itemPressed: { backgroundColor: palette.gray100 },
  itemIndicator: { width: 20, alignItems: 'center' },
  itemText: { fontSize: fontSize.sm, color: palette.gray900 },
});
