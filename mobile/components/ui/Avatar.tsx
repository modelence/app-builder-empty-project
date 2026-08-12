import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { palette, radius, fontSize } from './_shared/tokens';

/**
 * Avatar mirroring the web `Avatar` / `AvatarImage` / `AvatarFallback` trio.
 *
 * Base UI swaps to the fallback automatically when the image fails to load; here
 * `AvatarImage` reports load failure up to `Avatar` via context so `AvatarFallback`
 * renders in its place. Compose them the same way as on web:
 *
 *   <Avatar>
 *     <AvatarImage source={{ uri }} />
 *     <AvatarFallback>AB</AvatarFallback>
 *   </Avatar>
 */

interface AvatarContextValue {
  imageFailed: boolean;
  setImageFailed: (v: boolean) => void;
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

export interface AvatarProps {
  children?: React.ReactNode;
  /** Diameter in px. @default 36 */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ children, size = 36, style }: AvatarProps) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const value = React.useMemo(() => ({ imageFailed, setImageFailed }), [imageFailed]);

  return (
    <AvatarContext.Provider value={value}>
      <View style={[styles.root, { width: size, height: size }, style]}>{children}</View>
    </AvatarContext.Provider>
  );
}

export interface AvatarImageProps {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
}

export function AvatarImage({ source, style }: AvatarImageProps) {
  const ctx = React.useContext(AvatarContext);
  if (ctx?.imageFailed) return null;

  return (
    <Image
      source={source}
      onError={() => ctx?.setImageFailed(true)}
      style={[imageStyles.image, style]}
    />
  );
}

export interface AvatarFallbackProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AvatarFallback({ children, style }: AvatarFallbackProps) {
  // Rendered behind AvatarImage (absolute fill). While the image loads it covers
  // the fallback; if the image errors it unmounts and this shows through — the
  // same visual result as the web `AvatarFallback`. With no AvatarImage sibling,
  // the fallback is simply always visible.
  return (
    <View style={[styles.fallback, style]} pointerEvents="none">
      {typeof children === 'string' ? <Text style={styles.fallbackText}>{children}</Text> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.full,
    overflow: 'hidden',
    backgroundColor: palette.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: { fontSize: fontSize.sm, fontWeight: '500', color: palette.gray600 },
});

const imageStyles = StyleSheet.create<{ image: ImageStyle }>({
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
});
