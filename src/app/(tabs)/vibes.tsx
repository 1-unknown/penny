import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';

const VIBE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD', '#FFB347', '#6C5CE7', '#FF8A80'];
const VIBE_EMOJIS = ['☕', '✈️', '👟', '🍜', '🎵', '💻', '🎮', '📚', '🏋️', '🎨', '🌱', '🎬', '🍕', '🛍️', '💰', '🎯'];

export default function VibesScreen() {
  const { vibes, addVibe, deleteVibe } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [newVibeName, setNewVibeName] = useState('');
  const [newVibeBudget, setNewVibeBudget] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('☕');
  const [selectedColor, setSelectedColor] = useState('#6C5CE7');
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly'>('monthly');

  const handleAddVibe = () => {
    if (!newVibeName.trim() || !newVibeBudget.trim()) {
      Alert.alert('Missing Info', 'Please enter a name and budget for your Vibe.');
      return;
    }
    const budget = parseFloat(newVibeBudget);
    if (isNaN(budget) || budget <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount.');
      return;
    }

    addVibe({
      name: newVibeName.trim(),
      emoji: selectedEmoji,
      budget,
      color: selectedColor,
      period: selectedPeriod,
    });

    setNewVibeName('');
    setNewVibeBudget('');
    setSelectedEmoji('☕');
    setSelectedColor('#6C5CE7');
    setSelectedPeriod('monthly');
    setShowModal(false);
  };

  const handleDeleteVibe = (id: string, name: string) => {
    Alert.alert(
      'Delete Vibe',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteVibe(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Vibes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {vibes.map((vibe) => {
          const percent = Math.min(Math.round((vibe.spent / vibe.budget) * 100), 100);
          const remaining = Math.max(vibe.budget - vibe.spent, 0);
          return (
            <View key={vibe.id} style={styles.vibeCard}>
              <View style={styles.vibeHeader}>
                <View style={styles.vibeLeft}>
                  <Text style={styles.vibeEmoji}>{vibe.emoji}</Text>
                  <View>
                    <Text style={styles.vibeName}>{vibe.name}</Text>
                    <Text style={styles.vibePeriod}>
                      {vibe.period === 'weekly' ? 'Weekly' : 'Monthly'} budget
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDeleteVibe(vibe.id, vibe.name)}>
                  <Ionicons name="trash-outline" size={20} color="#8080A0" />
                </TouchableOpacity>
              </View>

              <View style={styles.vibeProgressContainer}>
                <View style={styles.vibeProgressBg}>
                  <View
                    style={[
                      styles.vibeProgressFill,
                      { width: `${percent}%`, backgroundColor: vibe.color },
                    ]}
                  />
                </View>
                <Text style={styles.vibePercent}>{percent}%</Text>
              </View>

              <View style={styles.vibeStats}>
                <View>
                  <Text style={styles.vibeStatLabel}>Spent</Text>
                  <Text style={[styles.vibeStatValue, { color: vibe.color }]}>
                    ${vibe.spent.toFixed(2)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.vibeStatLabel}>Budget</Text>
                  <Text style={styles.vibeStatValue}>${vibe.budget.toFixed(2)}</Text>
                </View>
                <View>
                  <Text style={styles.vibeStatLabel}>Remaining</Text>
                  <Text style={[styles.vibeStatValue, { color: remaining > 0 ? '#4ECDC4' : '#FF6B6B' }]}>
                    ${remaining.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {vibes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyText}>No Vibes yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first Vibe to start budgeting
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Vibe Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Vibe</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#8080A0" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Coffee Fund"
              placeholderTextColor="#666"
              value={newVibeName}
              onChangeText={setNewVibeName}
            />

            <Text style={styles.label}>Budget Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50"
              placeholderTextColor="#666"
              value={newVibeBudget}
              onChangeText={setNewVibeBudget}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Period</Text>
            <View style={styles.periodTabs}>
              {(['weekly', 'monthly'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.periodTab,
                    selectedPeriod === p && styles.periodTabActive,
                  ]}
                  onPress={() => setSelectedPeriod(p)}
                >
                  <Text
                    style={[
                      styles.periodTabText,
                      selectedPeriod === p && styles.periodTabTextActive,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Emoji</Text>
            <View style={styles.emojiGrid}>
              {VIBE_EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiOption,
                    selectedEmoji === emoji && styles.emojiOptionActive,
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Color</Text>
            <View style={styles.colorGrid}>
              {VIBE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionActive,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleAddVibe}>
              <Text style={styles.createButtonText}>Create Vibe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  vibeCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  vibeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vibeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vibeEmoji: {
    fontSize: 32,
  },
  vibeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  vibePeriod: {
    fontSize: 12,
    color: '#8080A0',
    marginTop: 2,
  },
  vibeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  vibeProgressBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#2A2A4A',
    borderRadius: 5,
    overflow: 'hidden',
  },
  vibeProgressFill: {
    height: '100%',
    borderRadius: 5,
  },
  vibePercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E0E0F0',
    width: 40,
    textAlign: 'right',
  },
  vibeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vibeStatLabel: {
    fontSize: 12,
    color: '#8080A0',
    marginBottom: 4,
  },
  vibeStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    color: '#E0E0F0',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8080A0',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  label: {
    fontSize: 14,
    color: '#8080A0',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#0F0F1E',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  periodTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0F0F1E',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  periodTabActive: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  periodTabText: {
    fontSize: 14,
    color: '#8080A0',
    fontWeight: '600',
  },
  periodTabTextActive: {
    color: '#FFF',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0F0F1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiOptionActive: {
    borderColor: '#6C5CE7',
    backgroundColor: '#2A2A4A',
  },
  emojiText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionActive: {
    borderColor: '#FFF',
  },
  createButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
