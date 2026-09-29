import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';

export default function ProfileScreen() {
  const { userName, currentStreak, transactions, vibes, resetData } = useAppStore();

  const totalTransactions = transactions.length;
  const totalVibes = vibes.length;
  const memberSince = 'September 2026';

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your data and restart onboarding. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetData },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.memberSince}>Member since {memberSince}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalTransactions}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalVibes}</Text>
            <Text style={styles.statLabel}>Active Vibes</Text>
          </View>
        </View>

        {/* Settings Sections */}
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingsGroup}>
          <SettingRow icon="person-outline" label="Edit Profile" />
          <SettingRow icon="notifications-outline" label="Notifications" />
          <SettingRow icon="lock-closed-outline" label="Privacy & Security" />
          <SettingRow icon="card-outline" label="Subscription" />
        </View>

        <Text style={styles.sectionTitle}>Support</Text>

        <View style={styles.settingsGroup}>
          <SettingRow icon="help-circle-outline" label="Help & FAQ" />
          <SettingRow icon="mail-outline" label="Contact Us" />
          <SettingRow icon="star-outline" label="Rate Penny" />
          <SettingRow icon="share-outline" label="Tell a Friend" />
        </View>

        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.settingsGroup}>
          <SettingRow icon="document-text-outline" label="Terms of Service" />
          <SettingRow icon="shield-outline" label="Privacy Policy" />
          <SettingRow icon="information-circle-outline" label="Version 1.0.0" />
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingTitle}>Upgrade to Penny Plus</Text>
          <Text style={styles.pricingSubtitle}>
            Unlock unlimited Vibes, AI Coach, and more
          </Text>
          <View style={styles.pricingTiers}>
            <View style={styles.pricingTier}>
              <Text style={styles.pricingTierName}>Penny Plus</Text>
              <Text style={styles.pricingTierPrice}>$7.99/mo</Text>
            </View>
            <View style={styles.pricingTier}>
              <Text style={styles.pricingTierName}>Penny Pro</Text>
              <Text style={styles.pricingTierPrice}>$14.99/mo</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh-outline" size={20} color="#FF6B6B" />
          <Text style={styles.resetButtonText}>Reset All Data</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={22} color="#8080A0" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8080A0" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  memberSince: {
    fontSize: 14,
    color: '#8080A0',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8080A0',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
    marginTop: 8,
  },
  settingsGroup: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A4A',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: '#E0E0F0',
    fontWeight: '500',
  },
  pricingCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  pricingSubtitle: {
    fontSize: 14,
    color: '#8080A0',
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  pricingTiers: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 20,
  },
  pricingTier: {
    flex: 1,
    backgroundColor: '#0F0F1E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  pricingTierName: {
    fontSize: 14,
    color: '#8080A0',
    fontWeight: '600',
  },
  pricingTierPrice: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '800',
    marginTop: 4,
  },
  upgradeButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 15,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});
