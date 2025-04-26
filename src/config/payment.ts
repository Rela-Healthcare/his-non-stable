interface PaymentConfig {
  baseUrl: string;
  user: string;
  key: string;
  secret: string;
  merchantId: string;
  paymentLocation: string;
  returnUrl: string;
  responseUrl: string;
}

export const paymentConfig: PaymentConfig = {
  baseUrl:
    process.env.REACT_APP_MOMENT_PAY_BASE_URL ||
    'https://testing.momentpay.in/ma/v2/extended-iframe-payment/',
  user: process.env.REACT_APP_MOMENTPAY_USER || 'jrsuperspecialityadmin',
  key:
    process.env.REACT_APP_MOMENTPAY_KEY ||
    'ebSQrwGuVVbZwq6TCLTm25eO0AXWIjlYoytBjFvxYjLkUZeXa0',
  secret:
    process.env.REACT_APP_MOMENTPAY_SECRET ||
    'Mbs1dj8pZerMyv7cnhxIqSMKhievG5aWGOdyuGw1rFujoQGTHu',
  merchantId: process.env.REACT_APP_MOMENTPAY_MERCHANT_ID || '27',
  paymentLocation: 'Test Hospital',
  returnUrl:
    'https://www.relainstitute.in/his_payment/Forms/payment_result_live.aspx',
  responseUrl:
    'https://www.relainstitute.in/his_payment/Forms/payment_result_live.aspx',
};
