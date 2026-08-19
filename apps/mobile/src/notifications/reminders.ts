import { Platform } from 'react-native';
import type { ReminderPrefs } from '../state/appStore';
import { splitTime } from '../state/appStore';

const CHANNEL_ID = 'swa-reminders';
const MORNING_ID = 'swa-morning-reflection';
const EVENING_ID = 'swa-evening-reflection';

type NotificationsModule = typeof import('expo-notifications');

let notifications: NotificationsModule | null | undefined;

function loadNotifications(): NotificationsModule | null {
  if (notifications !== undefined) return notifications;
  try {
    // Optional at runtime so web / Expo Go without the native module still load.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    notifications = require('expo-notifications') as NotificationsModule;
    return notifications;
  } catch {
    notifications = null;
    return null;
  }
}

export function configureNotificationHandler(): void {
  const Notifications = loadNotifications();
  if (!Notifications) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function ensureAndroidChannel(Notifications: NotificationsModule): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Daily reflections',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 180, 120, 180],
    lightColor: '#F6C453',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

export async function requestReminderPermission(): Promise<boolean> {
  const Notifications = loadNotifications();
  if (!Notifications) return false;
  if (Platform.OS === 'web') return false;

  await ensureAndroidChannel(Notifications);
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const asked = await Notifications.requestPermissionsAsync();
  return Boolean(
    asked.granted || asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL,
  );
}

function dailyTrigger(Notifications: NotificationsModule, hour: number, minute: number): object {
  const dailyType = (Notifications as { SchedulableTriggerInputTypes?: { DAILY?: string } })
    .SchedulableTriggerInputTypes?.DAILY;
  if (dailyType) {
    return { type: dailyType, hour, minute, channelId: CHANNEL_ID };
  }
  return { hour, minute, repeats: true, channelId: CHANNEL_ID };
}

export async function syncReflectionReminders(prefs: ReminderPrefs): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications || Platform.OS === 'web') return;

  await ensureAndroidChannel(Notifications);
  await Notifications.cancelScheduledNotificationAsync(MORNING_ID).catch(() => undefined);
  await Notifications.cancelScheduledNotificationAsync(EVENING_ID).catch(() => undefined);

  const schedule = async (
    id: string,
    enabled: boolean,
    time: string,
    title: string,
    body: string,
    part: 'morning' | 'evening',
  ) => {
    if (!enabled) return;
    const { hour, minute } = splitTime(time);
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title,
        body,
        sound: true,
        data: { part, source: 'swa-reminder' },
      },
      trigger: dailyTrigger(Notifications, hour, minute) as never,
    });
  };

  await schedule(
    MORNING_ID,
    prefs.morning.enabled,
    prefs.morning.time,
    'Morning arrival',
    'A quiet minute to notice how you are entering today.',
    'morning',
  );
  await schedule(
    EVENING_ID,
    prefs.evening.enabled,
    prefs.evening.time,
    'Evening look-back',
    'What did you notice today? One small reflection is enough.',
    'evening',
  );
}

export function subscribeToReminderTaps(
  onOpen: (part: 'morning' | 'evening') => void,
): () => void {
  const Notifications = loadNotifications();
  if (!Notifications) return () => undefined;

  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const part = response.notification.request.content.data?.part;
    if (part === 'morning' || part === 'evening') {
      onOpen(part);
    }
  });
  return () => sub.remove();
}
