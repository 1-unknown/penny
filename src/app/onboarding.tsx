import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');

const VIBE_PRESETS = [
  { name: 'Coffee & Vibes', emoji: '☕', color: '#FF6B6B' },
  { name: 'Japan Trip', emoji: '✈️', color: '#4ECDC4' },
  { name: 'Sneaker Fund', emoji: '👟', color: '#45B7D1' },
  { name: 'Food & Fun', emoji: '🍜', color: '#96CEB4' },
  { name: 'Concert Fund', emoji: '🎵', color: '#DDA0DD' },
  { name: 'Tech Upgrades', emoji: '💻', color: '#FFB347' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const { onboardingComplete } = useAppStore();

  const handleComplete = () => {
    if (name.trim()) {
      onboardingComplete(name.trim());
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <View style={styles.stepContainer}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>💰</Text>
                <Text style={styles.logoText}>Penny</Text>
              </View>
              <Text style={styles.tagline}>Your Money, Your Vibe</Text>
              <Text style={styles.description}>
                The budgeting app that doesn&apos;t feel like one. Track spending,
                save for what matters, and build money habits that actually
                stick.
              </Text>

              <View style={styles.featuresList}>
                <FeatureRow icon="🎮" text="Gamified budgeting with streaks" />
                <FeatureRow icon="👥" text="Social circles with friends" />
                <FeatureRow icon="🤖" text="AI money coach" />
                <FeatureRow icon="📊" text="Beautiful visual insights" />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setStep(1)}
              >
                <Text style={styles.primaryButtonText}>Let&apos;s Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(0)}
              >
                <Ionicons name="arrow-back" size={24} color="#6C5CE7" />
              </TouchableOpacity>

              <Text style={styles.stepTitle}>What should we call you?</Text>
              <Text style={styles.stepSubtitle}>
                This is how Penny will greet you!
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Your first name"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={() => name.trim() && setStep(2)}
              />

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  !name.trim() && styles.disabledButton,
                ]}
                onPress={() => name.trim() && setStep(2)}
                disabled={!name.trim()}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(1)}
              >
                <Ionicons name="arrow-back" size={24} color="#6C5CE7" />
              </TouchableOpacity>

              <Text style={styles.stepTitle}>Welcome, {name}! 🎉</Text>
              <Text style={styles.stepSubtitle}>
                We&apos;ve set up starter Vibes for you. You can customize these
                later.
              </Text>

              <View style={styles.vibePreview}>
                {VIBE_PRESETS.slice(0, 4).map((vibe, i) => (
                  <View key={i} style={[styles.vibeCard, { borderColor: vibe.color }]}>
                    <Text style={styles.vibeEmoji}>{vibe.emoji}</Text>
                    <Text style={styles.vibeName}>{vibe.name}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleComplete}
              >
                <Text style={styles.primaryButtonText}>Start My Journey</Text>
                <Ionicons name="checkmark" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#6C5CE7',
  },
  tagline: {
    fontSize: 18,
    color: '#A0A0C0',
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    color: '#C0C0D0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  featuresList: {
    width: '100%',
    marginBottom: 48,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#E0E0F0',
    fontWeight: '500',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#A0A0C0',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#2A2A4A',
  },
  vibePreview: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  vibeCard: {
    width: (width - 72) / 2,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  vibeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  vibeName: {
    fontSize: 14,
    color: '#E0E0F0',
    fontWeight: '600',
    textAlign: 'center',
  },
});
