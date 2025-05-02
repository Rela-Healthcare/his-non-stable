interface PaymentConfig {
  baseUrl: string;
  user: string;
  key: string;
  secret: string;
  merchantId: number;
  paymentLocation: string;
  callbackUrl: string;
  redirectUrl: string;
}

export const paymentConfig: PaymentConfig = {
  baseUrl:
    process.env.REACT_APP_MOMENT_PAY_BASE_URL ||
    'https://testing.momentpay.in/ma/v2/extended-iframe-payment',
  user: process.env.REACT_APP_MOMENTPAY_USER || 'jrsuperspecialityadmin',
  key:
    process.env.REACT_APP_MOMENTPAY_KEY ||
    'ebSQrwGuVVbZwq6TCLTm25eO0AXWIjlYoytBjFvxYjLkUZeXa0',
  secret:
    process.env.REACT_APP_MOMENTPAY_SECRET ||
    'Mbs1dj8pZerMyv7cnhxIqSMKhievG5aWGOdyuGw1rFujoQGTHu',
  merchantId: Number(process.env.REACT_APP_MOMENTPAY_MERCHANT_ID) || 8,
  paymentLocation: 'Test Hospital',
  callbackUrl: 'http://192.168.36.26:3000/payment-result',
  redirectUrl: 'http://192.168.36.26:3000/payment-result',
};
