import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export async function setupPushNotifications(userId: string): Promise<void> {
  if (!('Notification' in window) || !('serviceWorker' in navigator) || !VAPID_PUBLIC_KEY) return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    const subscription = existing ?? await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as Uint8Array<ArrayBuffer>,
    });

    const { endpoint, keys } = subscription.toJSON() as {
      endpoint: string;
      keys?: { p256dh: string; auth: string };
    };

    await supabase.from('push_subscriptions').upsert(
      { user_id: userId, endpoint, p256dh: keys?.p256dh, auth: keys?.auth },
      { onConflict: 'endpoint' }
    );
  } catch (err) {
    console.error('Push subscription failed:', err);
  }
}
