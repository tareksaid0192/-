import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, FontFamily } from '@/constants/theme';
import { Behavior } from '@/constants/behaviors';

interface BehaviorCardProps {
  behavior: Behavior;
  onPress: () => void;
}

const ICON_MAP: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  headphones: 'headphones',
  list: 'list-alt',
  psychology: 'psychology',
  favorite: 'favorite',
};

export function BehaviorCard({ behavior, onPress }: BehaviorCardProps) {
  const iconName = ICON_MAP[behavior.iconName] || 'article';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.title}>{behavior.title}</Text>
          <Text style={styles.subtitle}>{behavior.subtitle}</Text>
        </View>
        <View style={[styles.iconCircle, { backgroundColor: behavior.color + '20' }]}>
          <MaterialIcons name={iconName} size={28} color={behavior.color} />
        </View>
      </View>
      <View style={styles.arrow}>
        <MaterialIcons name="chevron-left" size={22} color={Colors.textLight} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.card,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  arrow: {
    marginLeft: -4,
  },
});
