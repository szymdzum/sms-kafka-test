export const brandConfig = {
  'BQUK': {
    senderId: process.env.BQUK_SENDER_ID || 'B&Q',
    smsTemplate: 'Your B&Q order #{orderNumber} is ready to collect from store. Please bring your confirmation email and ID. Thank you.'
  },
  'TradePoint': {
    senderId: process.env.TRADEPOINT_SENDER_ID || 'TradePoint',
    smsTemplate: 'Your TradePoint order #{orderNumber} is ready to collect from store. Please bring your confirmation email and ID. Thank you - TradePoint'
  },
  'Screwfix': {
    senderId: process.env.SCREWFIX_SENDER_ID || 'Screwfix',
    smsTemplate: 'Your Screwfix order #{orderNumber} is now ready to collect. Please bring your confirmation email or app and ID. Thank you for shopping with Screwfix.'
  }
};