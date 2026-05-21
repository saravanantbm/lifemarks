import mixpanel from 'mixpanel-browser';

const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;

export function initAnalytics() {
  if (!TOKEN) return;
  mixpanel.init(TOKEN, {
    persistence: 'localStorage',
    ignore_dnt: false,
  });
}

export function identifyUser(userId: string, props: { name: string; email?: string }) {
  if (!TOKEN) return;
  mixpanel.identify(userId);
  mixpanel.people.set({ $name: props.name, $email: props.email });
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!TOKEN) return;
  try { mixpanel.track(event, properties); } catch {}
}

export function resetAnalytics() {
  if (!TOKEN) return;
  try { mixpanel.reset(); } catch {}
}
