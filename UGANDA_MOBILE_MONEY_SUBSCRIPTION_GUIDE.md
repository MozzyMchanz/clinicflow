# Uganda Mobile Money Subscription Guide
## How to Set Up Subscriptions with National ID, Airtel Mastercard & Phone Number

---

## Understanding Your Options in Uganda

In Uganda, you can set up mobile money subscriptions and payments **without** a traditional bank account or registered business using:

1. **Airtel Money** - Requires only National ID + Airtel SIM card
2. **MTN Mobile Money** - Requires National ID + MTN SIM card  
3. **Airtel Mastercard** - Can be used for online payments

---

## Step-by-Step Guide: Setting Up Mobile Money Subscription

### Option 1: Airtel Money (No Bank Account Required)

**Requirements:**
- ✅ Valid Ugandan National ID (NIRA)
- ✅ Airtel SIM card (registered in your name)
- ✅ Phone number

**Steps:**

1. **Register for Airtel Money**
   - Visit nearest Airtel shop or agent
   - Fill registration form with National ID details
   - Provide your phone number
   - Set up PIN (4-6 digits)
   
2. **Activate Mobile Money Account**
   - Dial *185* on your Airtel line
   - Select "Register" or "Activate"
   - Confirm with your National ID number
   - Create transaction PIN

3. **Fund Your Wallet**
   - Visit Airtel agent
   - Give cash to deposit to your mobile money number
   - Or receive money from others

4. **For Subscription Payments:**
   - Share your Airtel number with subscription provider
   - Provider initiates STK push payment
   - You approve with PIN
   - OR use USSD: *185* > "Send Money" > Enter recipient number > Amount > PIN

---

### Option 2: Airtel Mastercard (Virtual/Physical)

**Requirements:**
- ✅ National ID
- ✅ Airtel Money account (for funding)

**Steps:**

1. **Get Airtel Mastercard**
   - Visit Airtel Shop with National ID
   - Request Airtel Mastercard (free or small fee)
   - Receive physical card or virtual card details

2. **Activate Online**
   - Register on Airtel website/app
   - Set up online PIN
   - Link to Airtel Money wallet

3. **Use for Online Subscriptions**
   - Use card details at checkout
   - For OTP: Receive on phone via SMS
   - Confirm payment

---

### Option 3: For Business/Registered Entities

If you later register a business, you can upgrade to:

- **Airtel Business Account** - For higher transaction limits
- **Payment Gateway Integration** - Stripe, PayPal, Flutterwave
- **Bank Account** - For bulk payments

---

## Implementing in Your MVP

### Current MVP Status

The MVP has:
- ✅ Login system with demo accounts
- ✅ Subscription plans (Basic, Professional, Enterprise)
- ❌ No actual payment integration
- ❌ No mobile money/USSD support

### Recommended Implementation Steps

#### Step 1: Add Payment Selection UI

In `index.html` or create new subscription page:

```html
<!-- Payment Method Selection -->
<div class="payment-methods">
  <h3>Select Payment Method</h3>
  
  <div class="method-option" onclick="selectMethod('airtel')">
    <img src="airtel-logo.png" alt="Airtel Money">
    <span>Airtel Money</span>
  </div>
  
  <div class="method-option" onclick="selectMethod('card')">
    <img src="card-logo.png" alt="Card">
    <span>Debit/Credit Card</span>
  </div>
</div>

<!-- Airtel Payment Form -->
<div id="airtel-payment" class="payment-form" style="display:none;">
  <label>Enter Airtel Phone Number:</label>
  <input type="tel" id="airtel-number" placeholder="2567XX XXX XXX">
  <button onclick="initiateSTKPush()">Pay via Airtel</button>
</div>
```

#### Step 2: Integrate Payment Gateway

For Uganda, consider:

1. **Flutterwave** - Supports Airtel, MTN, Visa
2. **Paystack** - Now supports mobile money
3. **Jambopay** - Uganda-focused

Example Flutterwave integration:

```javascript
function initiateSTKPush() {
  const phone = document.getElementById('airtel-number').value;
  const amount = 79000; // UGX for Professional plan
  
  flutterwave.initiate({
    currency: 'UGX',
    amount: amount,
    customer: {
      phone: phone,
    },
    payment_options: 'mobilemoneyuganda',
    customizations: {
      title: 'ClinicFlow Subscription',
    },
    callback: function(response) {
      if(response.status === 'successful') {
        activateSubscription();
      }
    }
  });
}
```

#### Step 3: Store Subscription Data

In `js/data.js`:

```javascript
// Add user subscriptions
var Subscriptions = [
  { 
    id: 1, 
    userId: 1, 
    plan: 'professional', 
    paymentMethod: 'airtel',
    phoneNumber: '2567XX...',
    startDate: '2025-01-01',
    endDate: '2025-02-01',
    active: true,
    transactionId: 'TXN123456'
  }
];
```

---

## Uganda-Specific Payment Codes

### Airtel USSD Codes
- Check balance: *185* > 4 > PIN
- Send money: *185* > 1 > Number > Amount > PIN
- Withdraw: *185* > 2 > Agent number > Amount > PIN
- Buy airtime: *185* > 3 > Amount > PIN

### MTN USSD Codes
- Check balance: *124# > PIN
- Send money: *150* > 1 > Number > Amount > PIN

---

## Subscription Activation Flow (Recommended)

1. User selects plan (Basic/Professional/Enterprise)
2. User selects payment method (Airtel/MTN/Card)
3. If Airtel:
   - Enter phone number
   - System initiates STK push
   - User approves on phone
   - Webhook confirms payment
4. Activate subscription
5. Send confirmation SMS/WhatsApp

---

## Quick Start Without Code Modifications

If you want to start taking payments TODAY without modifying code:

1. **Use Airtel Self-Service Portal**
   - Set up payment link on Airtel
   - Share link with customers

2. **Manual Mobile Money**
   - Share Airtel number
   - Customer sends money manually
   - You activate subscription manually

3. **Use Payment Link Services**
   - Flutterwave Payment Links
   - Paystack Payment Links
   - Generate link, share via WhatsApp

---

## Contact Information for Setup

### Airtel Uganda
- Customer Care: 100 (from Airtel) or +256-800-100-100
- USSD: *185*

### MTN Uganda  
- Customer Care: 100 (from MTN) or +256-800-100-100
- USSS: *124#*

### Payment Gateway Support
- **Flutterwave**: support@flutterwave.com
- **Paystack**: support@paystack.com

---

## Summary

| Requirement | Status | Alternative |
|-------------|--------|-------------|
| Bank Account | ❌ Not needed | Airtel Money |
| Registered Business | ❌ Not needed | Individual account |
| National ID | ✅ Required | Must have |
| Phone Number | ✅ Required | Airtel SIM |
| Airtel Mastercard | ✅ Optional | Can add later |

**Bottom Line:** You CAN set up mobile money subscriptions in Uganda with just your National ID and Airtel phone number. No bank account or registered business is required!

---

*Document generated for MVP Subscription Management in Uganda*
*Last Updated: January 2025*

