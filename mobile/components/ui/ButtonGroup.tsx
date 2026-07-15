import * as React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { ButtonGroupContext } from './_shared/buttonGroup';
import type { Variant, Color } from './_shared/variants';
import type { ControlSize } from './_shared/sizes';
import { palette, radius } from './_shared/tokens';

export interface ButtonGroupProps {
  children?: React.ReactNode;
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Shared size applied to child Button/IconButton (each child can override). */
  size?: ControlSize;
  /** Shared variant applied to children (each child can override). */
  variant?: Variant;
  /** Shared color applied to children (each child can override). */
  color?: Color;
  style?: StyleProp<ViewStyle>;
}

/**
 * Joins controls into a connected segmented unit. Web collapses radii/borders via
 * CSS; on mobile we render a rounded, clipped container with thin dividers between
 * children so they read as one control. Propagates size/variant/color to child
 * Button/IconButton via context (a child's own explicit prop always wins).
 */
export function ButtonGroup({
  children,
  orientation = 'horizontal',
  size,
  variant,
  color,
  style,
}: ButtonGroupProps) {
  const contextValue = React.useMemo(
    () => ({ size, variant, color }),
    [size, variant, color]
  );

  const items = React.Children.toArray(children).filter(Boolean);
  const isHorizontal = orientation === 'horizontal';

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <View
        accessibilityRole="toolbar"
        style={[
          styles.container,
          isHorizontal ? styles.row : styles.col,
          style,
        ]}
      >
        {items.map((child, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <View style={isHorizontal ? styles.dividerV : styles.dividerH} />
            )}
            {child}
          </React.Fragment>
        ))}
      </View>
    </ButtonGroupContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: palette.gray300,
    borderRadius: radius.md,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  col: { flexDirection: 'column', alignItems: 'stretch' },
  dividerV: { width: StyleSheet.hairlineWidth, backgroundColor: palette.gray300 },
  dividerH: { height: StyleSheet.hairlineWidth, backgroundColor: palette.gray300 },
});
