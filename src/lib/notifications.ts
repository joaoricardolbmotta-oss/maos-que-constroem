/**
 * Browser Push Notifications
 * Fase 29: Push Notifications
 */

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Este navegador não suporta notificações');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/logo.png',
      badge: '/badge.png',
      ...options,
    });
  }
}

export async function subscribeToPushNotifications(campaignId: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications não suportadas');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const permission = await requestNotificationPermission();

    if (!permission) {
      throw new Error('Permissão negada');
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // Enviar subscription para backend
    await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign_id: campaignId,
        subscription: subscription.toJSON(),
      }),
    });

    return subscription;
  } catch (error) {
    console.error('Push subscription error:', error);
  }
}

export function notifyDonation(campaignTitle: string, amount: number) {
  sendNotification('Nova Doação Recebida! 🎉', {
    body: `${campaignTitle} recebeu uma doação de R$ ${amount.toFixed(2)}`,
    tag: 'donation',
    requireInteraction: false,
  });
}

export function notifyExpense(campaignTitle: string, amount: number) {
  sendNotification('Nova Despesa Registrada', {
    body: `${campaignTitle}: Despesa de R$ ${amount.toFixed(2)}`,
    tag: 'expense',
    requireInteraction: false,
  });
}

export function notifyMemberAdded(campaignTitle: string, memberEmail: string) {
  sendNotification('Novo Membro Adicionado', {
    body: `${memberEmail} foi adicionado a ${campaignTitle}`,
    tag: 'member',
    requireInteraction: false,
  });
}
