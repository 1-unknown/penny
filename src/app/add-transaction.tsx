import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/useAppStore';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { vibes, addTransaction } = useAppStore();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVibeId, setSelectedVibeId] = useState(vibes[0]?.id || '');

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description.');
      return;
    }
    if (!selectedVibeId) {
      Alert.alert('No Vibe Selected', 'Please select a Vibe for this transaction.');
      return;
    }

    addTransaction({
      amount: parsedAmount,
      description: description.trim(),
      category: 'general',
      vibeId: selectedVibeId,
      date: new Date().toISOString(),
      type,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && styles.typeButtonActive,
            ]}
            onPress={() => setType('expense')}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={type === 'expense' ? '#FFF' : '#8080A0'}
            />
            <Text
              style={[
                styles.typeButtonText,
                type === 'expense' && styles.typeButtonTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && styles.typeButtonActive,
            ]}
            onPress={() => setType('income')}
          >
            <Ionicons
              name="arrow-down"
              size={20}
              color={type === 'income' ? '#FFF' : '#8080A0'}
            />
            <Text
              style={[
                styles.typeButtonText,
                type === 'income' && styles.typeButtonTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="#444"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What was this for?"
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Vibe Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vibe</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vibeSelector}
          >
            {vibes.map((vibe) => (
              <TouchableOpacity
                key={vibe.id}
                style={[
                  styles.vibeOption,
                  selectedVibeId === vibe.id && styles.vibeOptionActive,
                  { borderColor: vibe.color },
                ]}
                onPress={() => setSelectedVibeId(vibe.id)}
              >
                <Text style={styles.vibeOptionEmoji}>{vibe.emoji}</Text>
                <Text
                  style={[
                    styles.vibeOptionName,
                    selectedVibeId === vibe.id && styles.vibeOptionNameActive,
                  ]}
                >
                  {vibe.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quick Amounts</Text>
          <View style={styles.quickAmounts}>
            {[5, 10, 20, 50, 100].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={styles.quickAmountButton}
                onPress={() => setAmount(amt.toString())}
              >
                <Text style={styles.quickAmountText}>${amt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#6C5CE7',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8080A0',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: '300',
    color: '#6C5CE7',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFF',
    minWidth: 150,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#8080A0',
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  vibeSelector: {
    gap: 10,
    paddingVertical: 4,
  },
  vibeOption: {
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 12,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vibeOptionActive: {
    backgroundColor: '#2A2A4A',
  },
  vibeOptionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  vibeOptionName: {
    fontSize: 11,
    color: '#8080A0',
    fontWeight: '600',
    textAlign: 'center',
  },
  vibeOptionNameActive: {
    color: '#FFF',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E0E0F0',
  },
});
