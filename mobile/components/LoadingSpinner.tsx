import { StyleSheet, Text, View } from 'react-native';
import { Spinner } from './ui/Spinner';
import { palette, fontSize } from './ui/_shared/tokens';

interface LoadingSpinnerProps {
  /** Fill the whole screen and center. @default false */
  fullScreen?: boolean;
  message?: string;
}

/**
 * Screen-level loading state (centered container, optional full-screen + message).
 * For an inline spinner inside a control (e.g. a button), use `ui/Spinner` instead.
 */
export default function LoadingSpinner({ fullScreen = false, message }: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.inner}>
        <Spinner size={32} color={palette.violet500} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fullScreen: { backgroundColor: palette.gray100 },
  inner: { alignItems: 'center', rowGap: 16 },
  message: { color: palette.gray600, fontSize: fontSize.sm },
});
