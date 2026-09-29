import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';

export default function ChallengesScreen() {
  const { challenges, completeChallenge, currentStreak } = useAppStore();

  const activeChallenges = challenges.filter((c) => !c.completed);
  const completedChallenges = challenges.filter((c) => c.completed);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {currentStreak}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Active Challenges */}
        <Text style={styles.sectionTitle}>Active Challenges</Text>
        {activeChallenges.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyText}>All challenges completed!</Text>
            <Text style={styles.emptySubtext}>Check back soon for new ones</Text>
          </View>
        ) : (
          activeChallenges.map((challenge) => {
            const percent = Math.min(
              Math.round((challenge.progress / challenge.target) * 100),
              100
            );
            return (
              <View key={challenge.id} style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDesc}>{challenge.description}</Text>
                  </View>
                  <View style={styles.rewardBadge}>
                    <Text style={styles.rewardText}>{challenge.reward}</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percent}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {challenge.progress}/{challenge.target}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => completeChallenge(challenge.id)}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                  <Text style={styles.completeButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Completed</Text>
            {completedChallenges.map((challenge) => (
              <View key={challenge.id} style={[styles.challengeCard, styles.completedCard]}>
                <View style={styles.challengeHeader}>
                  <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
                  <View style={styles.challengeInfo}>
                    <Text style={[styles.challengeTitle, { color: '#8080A0' }]}>
                      {challenge.title}
                    </Text>
                    <Text style={styles.completedLabel}>Completed ✓</Text>
                  </View>
                  <View style={[styles.rewardBadge, { backgroundColor: '#2D5A3D' }]}>
                    <Text style={[styles.rewardText, { color: '#4ECDC4' }]}>
                      {challenge.reward}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
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
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  streakBadge: {
    backgroundColor: '#2A2A4A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFB347',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  challengeCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  completedCard: {
    opacity: 0.6,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  challengeDesc: {
    fontSize: 13,
    color: '#8080A0',
    marginTop: 2,
  },
  completedLabel: {
    fontSize: 13,
    color: '#4ECDC4',
    marginTop: 2,
    fontWeight: '600',
  },
  rewardBadge: {
    backgroundColor: '#2A2A4A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFB347',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#2A2A4A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C5CE7',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E0E0F0',
    width: 50,
    textAlign: 'right',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
});
