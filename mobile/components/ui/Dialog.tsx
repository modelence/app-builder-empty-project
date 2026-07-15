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
import { X } from 'lucide-react-native';
import { palette, radius, fontSize } from './_shared/tokens';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog(): DialogContextValue {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error('Dialog subcomponents must be used within <Dialog>');
  return ctx;
}

export interface DialogProps {
  children?: React.ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Dialog mirroring the web `Dialog` family. The web renders a portal + backdrop;
 * on mobile this uses a native `Modal`. Provide a `DialogTrigger` (or drive it via
 * the controlled `open` prop) and a `DialogContent`.
 */
export function Dialog({ children, open, defaultOpen = false, onOpenChange }: DialogProps) {
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

  return <DialogContext.Provider value={ctx}>{children}</DialogContext.Provider>;
}

export interface DialogTriggerProps {
  children: React.ReactElement;
}

/** Wraps a single pressable child and opens the dialog on press. */
export function DialogTrigger({ children }: DialogTriggerProps) {
  const { setOpen } = useDialog();
  return React.cloneElement(children as React.ReactElement<{ onPress?: () => void }>, {
    onPress: () => setOpen(true),
  });
}

export interface DialogCloseProps {
  children: React.ReactElement;
}

/** Wraps a single pressable child and closes the dialog on press. */
export function DialogClose({ children }: DialogCloseProps) {
  const { setOpen } = useDialog();
  return React.cloneElement(children as React.ReactElement<{ onPress?: () => void }>, {
    onPress: () => setOpen(false),
  });
}

export interface DialogContentProps {
  children?: React.ReactNode;
  /** Show the top-right close button. @default true */
  showClose?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function DialogContent({ children, showClose = true, style }: DialogContentProps) {
  const { open, setOpen } = useDialog();

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
        <Pressable style={[styles.popup, style]} onPress={(e) => e.stopPropagation()}>
          {children}
          {showClose && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={() => setOpen(false)}
              style={styles.closeButton}
            >
              <X size={16} color={palette.gray500} />
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DialogTitle({ style, ...props }: { style?: StyleProp<TextStyle>; children?: React.ReactNode }) {
  return <Text style={[styles.title, style]} {...props} />;
}

export function DialogDescription({ style, ...props }: { style?: StyleProp<TextStyle>; children?: React.ReactNode }) {
  return <Text style={[styles.description, style]} {...props} />;
}

export function DialogHeader({ style, children }: { style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function DialogFooter({ style, children }: { style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  popup: {
    width: '100%',
    maxWidth: 512,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.gray200,
    backgroundColor: palette.white,
    padding: 24,
    rowGap: 16,
    shadowColor: palette.black,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  title: { fontSize: fontSize.lg, fontWeight: '600', color: palette.gray900 },
  description: { fontSize: fontSize.sm, color: palette.gray600 },
  header: { rowGap: 6 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', columnGap: 8 },
});
