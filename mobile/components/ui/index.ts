/**
 * Mobile UI component library — React Native equivalents of the web components in
 * `src/client/components/ui`. Same design tokens (colors/sizes/variants) and a
 * parallel prop API, built on RN primitives instead of Tailwind + Base UI.
 */

// Shared tokens & types
export * from './_shared/tokens';
export * from './_shared/sizes';
export * from './_shared/variants';
export { ButtonGroupContext, useButtonGroup } from './_shared/buttonGroup';

// Controls
export { Button } from './Button';
export type { ButtonProps } from './Button';
export { IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';
export { ButtonGroup } from './ButtonGroup';
export type { ButtonGroupProps } from './ButtonGroup';
export { Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

// Text inputs
export { Input } from './Input';
export type { InputProps } from './Input';
export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';
export { Label } from './Label';
export type { LabelProps } from './Label';

// Display
export {
  Card,
  CardHeader,
  CardAction,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';
export { Avatar, AvatarImage, AvatarFallback } from './Avatar';
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps } from './Avatar';
export { Separator } from './Separator';
export type { SeparatorProps } from './Separator';

// Toggles
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';
export { Switch } from './Switch';
export type { SwitchProps } from './Switch';
export { RadioGroup, RadioGroupItem } from './RadioGroup';
export type { RadioGroupProps, RadioGroupItemProps } from './RadioGroup';

// Select
export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

// Tabs
export { Tabs, TabsList, TabsTab, TabsPanel } from './Tabs';
export type { TabsProps, TabsListProps, TabsTabProps, TabsPanelProps } from './Tabs';

// Overlays
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from './Dialog';
export type { DialogProps, DialogContentProps } from './Dialog';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroupLabel,
} from './DropdownMenu';
export type { DropdownMenuProps, DropdownMenuContentProps, DropdownMenuItemProps } from './DropdownMenu';
export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './Tooltip';
export type { TooltipProps, TooltipTriggerProps, TooltipContentProps } from './Tooltip';
