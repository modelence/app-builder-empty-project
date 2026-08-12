import * as React from 'react';
import type { Variant, Color } from './variants';
import type { ControlSize } from './sizes';

export interface ButtonGroupContextValue {
  size?: ControlSize;
  variant?: Variant;
  color?: Color;
}

/**
 * Lets ButtonGroup propagate a shared size/variant/color to child
 * Button / IconButton components. A child's own explicit prop always wins.
 */
export const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(null);

export function useButtonGroup(): ButtonGroupContextValue | null {
  return React.useContext(ButtonGroupContext);
}
