import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { format } from 'date-fns';

export default function HomeScreen() {
  const router = useRouter();
  const {
    userName,
    vibes,
    transactions,
    currentStreak,
    totalSaved,
    updateStreak,
  } = useAppStore();

  useEffect(() => {
    updateStreak();
  }, []);

  const recentTransactions = transactions.slice(0, 5);
  const totalBudget = vibes.reduce((sum, v) => sum + v.budget, 0);
  const totalSpent = vibes.reduce((sum, v) => sum + v.spent, 0);
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{today}</Text>
            <Text style={styles.greeting}>Hey, {userName} 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-transaction')}
          >
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak 🔥</Text>
          </View>
          <View style={styles.streakRight}>
            <Text style={styles.streakSubtext}>
              {currentStreak > 0
                ? "Keep it going! You're building habits."
                : 'Log any action to start your streak!'}
            </Text>
          </View>
        </View>

        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>This Month</Text>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>${totalSpent.toFixed(0)}</Text>
              <Text style={styles.overviewLabel}>Spent</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>${totalBudget.toFixed(0)}</Text>
              <Text style={styles.overviewLabel}>Budget</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>${totalSaved.toFixed(0)}</Text>
              <Text style={styles.overviewLabel}>Saved</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(percentUsed, 100)}%`,
                    backgroundColor: percentUsed > 90 ? '#FF6B6B' : '#6C5CE7',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{percentUsed}% used</Text>
          </View>
        </View>

        {/* Vibes Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Vibes</Text>
          <TouchableOpacity onPress={() => router.push('/vibes')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vibeScroll}
        >
          {vibes.map((vibe) => {
            const percent = Math.min(
              Math.round((vibe.spent / vibe.budget) * 100),
              100
            );
            return (
              <View key={vibe.id} style={styles.vibeCard}>
                <Text style={styles.vibeEmoji}>{vibe.emoji}</Text>
                <Text style={styles.vibeName}>{vibe.name}</Text>
                <View style={styles.vibeProgressBg}>
                  <View
                    style={[
                      styles.vibeProgressFill,
                      { width: `${percent}%`, backgroundColor: vibe.color },
                    ]}
                  />
                </View>
                <Text style={styles.vibeAmounts}>
                  ${vibe.spent.toFixed(0)} / ${vibe.budget.toFixed(0)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/transactions')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first one
            </Text>
          </View>
        ) : (
          <View style={styles.transactionList}>
            {recentTransactions.map((t) => (
              <View key={t.id} style={styles.transactionItem}>
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        t.type === 'income' ? '#2D5A3D' : '#5A2D2D',
                    },
                  ]}
                >
                  <Ionicons
                    name={t.type === 'income' ? 'arrow-down' : 'arrow-up'}
                    size={18}
                    color={t.type === 'income' ? '#4ECDC4' : '#FF6B6B'}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDesc}>{t.description}</Text>
                  <Text style={styles.transactionDate}>
                    {format(new Date(t.date), 'MMM d, h:mm a')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color: t.type === 'income' ? '#4ECDC4' : '#FF6B6B',
                    },
                  ]}
                >
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
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
    paddingBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#8080A0',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C5CE7',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  streakLeft: {
    marginRight: 20,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
  },
  streakLabel: {
    fontSize: 14,
    color: '#E0DFFF',
    fontWeight: '600',
  },
  streakRight: {
    flex: 1,
  },
  streakSubtext: {
    fontSize: 14,
    color: '#E0DFFF',
    lineHeight: 20,
  },
  overviewCard: {
    backgroundColor: '#1A1A2E',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 16,
    color: '#8080A0',
    fontWeight: '600',
    marginBottom: 16,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#8080A0',
    marginTop: 4,
  },
  overviewDivider: {
    width: 1,
    backgroundColor: '#2A2A4A',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#2A2A4A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#8080A0',
    marginTop: 8,
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  seeAll: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  vibeScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  vibeCard: {
    width: 140,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  vibeEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  vibeName: {
    fontSize: 13,
    color: '#E0E0F0',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  vibeProgressBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#2A2A4A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  vibeProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  vibeAmounts: {
    fontSize: 12,
    color: '#8080A0',
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
  transactionList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 15,
    color: '#E0E0F0',
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    color: '#8080A0',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
