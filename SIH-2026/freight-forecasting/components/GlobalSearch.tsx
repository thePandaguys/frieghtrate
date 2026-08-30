import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { searchItems } from '../constants/searchData';

export default function GlobalSearch({ placeholder = 'Search route, vessel, port...' }: { placeholder?: string }) {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchItems.slice(0, 8);

    return searchItems.filter((item) => {
      const haystack = `${item.label} ${item.type} ${item.keywords.join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const handleSelect = (path: string) => {
    setVisible(false);
    setQuery('');
    router.push(path as any);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setVisible(true)} style={styles.trigger}>
        <Text style={styles.icon}>⌕</Text>
        <Text style={styles.placeholder}>{placeholder}</Text>
      </Pressable>

      <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.panel} onPress={() => undefined}>
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder={placeholder}
              placeholderTextColor="#7B9AB1"
              style={styles.input}
            />

            <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
              {results.length === 0 ? (
                <Text style={styles.empty}>No matches found.</Text>
              ) : (
                results.map((item) => (
                  <Pressable key={`${item.label}-${item.path}`} onPress={() => handleSelect(item.path)} style={styles.result}>
                    <Text style={styles.resultLabel}>{item.label}</Text>
                    <Text style={styles.resultType}>{item.type}</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 260,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(14, 31, 40, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(120, 144, 170, 0.18)',
  },
  icon: { color: '#8AB0C8', fontSize: 18 },
  placeholder: {
    color: '#7EA1B8',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 12, 18, 0.76)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 520,
    maxHeight: 420,
    backgroundColor: 'rgba(7, 19, 29, 0.96)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(120, 144, 170, 0.2)',
    padding: 14,
  },
  input: {
    color: '#EAF7FF',
    backgroundColor: 'rgba(13, 34, 46, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 144, 170, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  list: { maxHeight: 320 },
  listContent: { gap: 8 },
  result: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(14, 31, 40, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(120, 144, 170, 0.12)',
  },
  resultLabel: { color: '#ECF9FF', fontSize: 13, fontWeight: '700' },
  resultType: { color: '#7EA4B9', fontSize: 10, textTransform: 'uppercase', fontWeight: '700' },
  empty: { color: '#A6CEDF', fontSize: 12, paddingVertical: 16 },
});
