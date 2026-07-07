import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RightIcon } from '../icons';

interface Props {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  last?: boolean;
}

export default function MenuItem({ icon, label, onPress, last }: Props) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconWrap}>{icon}</View>
      <View style={[styles.menuContent, !last && styles.menuBorder]}>
        <Text style={styles.menuLabel}>{label}</Text>

        <RightIcon size={20} color="#a1a1aa" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconWrap: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 6,
    marginVertical: 4,
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuLabel: { fontSize: 16, color: '#111111' },
});
