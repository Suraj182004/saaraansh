# Stripe Integration Guide

This guide will help you set up Stripe for processing payments in your PDF Summarizer application.

## 1. Create a Stripe Account

If you don't already have one, create a Stripe account at [stripe.com](https://stripe.com).

## 2. Set Up Products and Prices

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Products > Add Product
3. Create two subscription products:
   
   **Basic Plan:**
   - Name: Basic
   - Description: 50 PDF summaries per month
   - Price: $9/month (recurring)
   - After creation, copy the Price ID (starts with `price_`)

   **Pro Plan:**
   - Name: Pro
   - Description: Unlimited PDF summaries
   - Price: $19/month (recurring)
   - After creation, copy the Price ID (starts with `price_`)

## 3. Set Up Webhook Endpoint

1. In the Stripe Dashboard, go to Developers > Webhooks
2. Click "Add Endpoint"
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add Endpoint"
6. Copy the "Signing Secret" (starts with `whsec_`)

## 4. Configure Environment Variables

Add the following variables to your `.env` file:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Replace the placeholders with your actual values.

## 5. Testing the Integration

1. Use Stripe's test mode to simulate payments
2. Test cards to use:
   - Success: `4242 4242 4242 4242`
   - Requires Authentication: `4000 0025 0000 3155`
   - Decline: `4000 0000 0000 0002`
3. Webhook Testing:
   - Use the Stripe CLI for local webhook testing
   - Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## 6. Going Live

1. Switch from test mode to live mode in the Stripe Dashboard
2. Update your environment variables with the live credentials
3. Perform a test transaction with a real card to ensure everything works

## Troubleshooting

- **Webhook Issues**: Check the Stripe Dashboard > Developers > Webhooks > Recent Events to see if webhooks are being sent and their delivery status.
- **Payment Failures**: Check the Stripe Dashboard > Payments for error messages.
- **Subscription Problems**: Check the customer's subscription details in the Stripe Dashboard.

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhook Guide](https://stripe.com/docs/webhooks) 