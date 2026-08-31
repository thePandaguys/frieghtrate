import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Breadcrumb({ current }: { current: string }) {
  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => router.push('/(main)/dashboard')}>
        <Text style={styles.link}>Dashboard</Text>
      </Pressable>
      <Text style={styles.separator}> &gt; </Text>
      <Text style={styles.current}>{current}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  link: {
    color: '#39D8E8',
    fontSize: 12,
    fontWeight: '700',
  },
  separator: {
    color: '#7EA4B9',
    marginHorizontal: 6,
    fontSize: 12,
  },
  current: {
    color: '#D8EDF9',
    fontSize: 12,
    fontWeight: '600',
  },
});
