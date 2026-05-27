import crypto from 'crypto';
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function createSignature(message: string): string {
  try {
    const secret = '8gBm/:&EnhH.1/q';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(message, 'utf8');
    const base64Format = hmac.digest('base64');
    return base64Format;
  } catch (error) {
    console.error('Error generating signature:', error);
    throw error;
  }
}
