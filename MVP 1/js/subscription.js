// ========================================
// Subscription Management System
// For Uganda: National ID + Airtel Money/Mobile Money + Airtel Mastercard
// ========================================

// Configuration for Uganda Mobile Money
var SubscriptionPlansUGX = {
    basic: {
        name: 'Basic',
        priceUGX: 99000,
        priceLabel: 'UGX 99,000/month',
        features: {
            leadsLimit: 100,
            appointmentsLimit: 50,
            reminders: true,
            reactivation: false,
            analytics: false,
            api: false,
            customBranding: false,
            multipleUsers: 1
        }
    },
    professional: {
        name: 'Professional',
        priceUGX: 199000,
        priceLabel: 'UGX 199,000/month',
        features: {
            leadsLimit: 500,
            appointmentsLimit: 200,
            reminders: true,
            reactivation: true,
            analytics: true,
            api: false,
            customBranding: false,
            multipleUsers: 3
        }
    },
    enterprise: {
        name: 'Enterprise',
        priceUGX: 499000,
        priceLabel: 'UGX 499,000/month',
        features: {
            leadsLimit: -1,
            appointmentsLimit: -1,
            reminders: true,
            reactivation: true,
            analytics: true,
            api: true,
            customBranding: true,
            multipleUsers: -1
        }
    }
};

// Payment Methods Available
var PaymentMethods = [
    { value: 'airtel_money', label: 'Airtel Money', icon: 'fa-mobile-alt' },
    { value: 'mtn_money', label: 'MTN Mobile Money', icon: 'fa-phone' },
    { value: 'airtel_card', label: 'Airtel Mastercard', icon: 'fa-credit-card' }
];

// Storage for transactions
var PaymentTransactions = [];
var UserSubscriptions = [];

// Current selected plan
var selectedPlan = null;
var selectedPaymentMethod = null;

// Initialize Subscription System
function initSubscription() {
    var upgradeBtn = document.getElementById('upgrade-plan-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', openSubscriptionModal);
    }
    
    var paymentMethods = document.querySelectorAll('.payment-method-option');
    paymentMethods.forEach(function(method) {
        method.addEventListener('click', function() {
            selectPaymentMethod(this.dataset.method);
        });
    });
    
    var payBtn = document.getElementById('initiate-payment-btn');
    if (payBtn) {
        payBtn.addEventListener('click', initiatePayment);
    }
    
    var verifyBtn = document.getElementById('verify-payment-btn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyPayment);
    }
    
    loadCurrentSubscription();
}

function openSubscriptionModal() {
    var modal = document.getElementById('subscription-modal');
    if (modal) {
        modal.classList.add('active');
        renderSubscriptionPlans();
    }
}

function renderSubscriptionPlans() {
    var container = document.getElementById('subscription-plans');
    if (!container) return;
    
    var currentPlan = localStorage.getItem('clinicflow_subscription') || 'basic';
    var html = '';
    var plans = ['basic', 'professional', 'enterprise'];
    
    plans.forEach(function(planKey) {
        var plan = SubscriptionPlansUGX[planKey];
        var isCurrent = planKey === currentPlan;
        var isPopular = planKey === 'professional';
        
        html += '<div class="subscription-plan ' + (isPopular ? 'popular' : '') + '">';
        if (isPopular) html += '<div class="plan-badge">Most Popular</div>';
        html += '<h3>' + plan.name + '</h3>';
        html += '<div class="plan-price"><span class="currency">UGX</span> <span class="amount">' + plan.priceUGX.toLocaleString() + '</span><span class="period">/month</span></div>';
        html += '<ul class="plan-features">';
        
        var features = [
            { key: 'leadsLimit', label: 'Up to ' + (plan.features.leadsLimit === -1 ? 'Unlimited' : plan.features.leadsLimit) + ' Leads' },
            { key: 'appointmentsLimit', label: 'Up to ' + (plan.features.appointmentsLimit === -1 ? 'Unlimited' : plan.features.appointmentsLimit) + ' Appointments' },
            { key: 'reminders', label: 'SMS/WhatsApp Reminders', available: plan.features.reminders },
            { key: 'reactivation', label: 'Patient Reactivation', available: plan.features.reactivation },
            { key: 'analytics', label: 'Analytics Dashboard', available: plan.features.analytics },
            { key: 'api', label: 'API Access', available: plan.features.api },
            { key: 'customBranding', label: 'Custom Branding', available: plan.features.customBranding },
            { key: 'multipleUsers', label: 'Multiple Users', available: plan.features.multipleUsers }
        ];
        
        features.forEach(function(feature) {
            var available = feature.available !== undefined ? feature.available : true;
            html += '<li class="' + (available ? '' : 'disabled') + '"><i class="fas fa-' + (available ? 'check' : 'times') + '"></i> ' + feature.label + '</li>';
        });
        
        html += '</ul>';
        html += '<button class="btn ' + (isCurrent ? 'btn-secondary' : 'btn-primary') + '" onclick="selectPlan(\'' + planKey + '\')" ' + (isCurrent ? 'disabled' : '') + '>' + (isCurrent ? 'Current Plan' : 'Select Plan') + '</button>';
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function selectPlan(planKey) {
    selectedPlan = planKey;
    var plan = SubscriptionPlansUGX[planKey];
    
    var paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
        paymentSection.style.display = 'block';
        var nameEl = document.getElementById('selected-plan-name');
        var priceEl = document.getElementById('selected-plan-price');
        if (nameEl) nameEl.textContent = plan.name;
        if (priceEl) priceEl.textContent = 'UGX ' + plan.priceUGX.toLocaleString();
    }
    
    showToast('info', 'Plan Selected', 'You selected ' + plan.name + ' plan. Please choose payment method.');
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    var options = document.querySelectorAll('.payment-method-option');
    options.forEach(function(opt) { opt.classList.remove('selected'); });
    
    var selected = document.querySelector('[data-method="' + method + '"]');
    if (selected) selected.classList.add('selected');
    
    var forms = document.querySelectorAll('.payment-form');
    forms.forEach(function(form) { form.style.display = 'none'; });
    
    var form = document.getElementById(method + '-form');
    if (form) form.style.display = 'block';
}

function initiatePayment() {
    if (!selectedPlan) {
        showToast('warning', 'Select Plan', 'Please select a subscription plan first.');
        return;
    }
    
    if (!selectedPaymentMethod) {
        showToast('warning', 'Select Payment', 'Please select a payment method.');
        return;
    }
    
    var phone = '';
    var nationalId = '';
    
    if (selectedPaymentMethod === 'airtel_money') {
        phone = document.getElementById('airtel-phone').value;
        nationalId = document.getElementById('airtel-national-id').value;
    } else if (selectedPaymentMethod === 'mtn_money') {
        phone = document.getElementById('mtn-phone').value;
        nationalId = document.getElementById('mtn-national-id').value;
    } else if (selectedPaymentMethod === 'airtel_card') {
        phone = document.getElementById('card-phone').value;
        nationalId = document.getElementById('card-national-id').value;
    }
    
    if (!phone || !nationalId) {
        showToast('warning', 'Missing Info', 'Please fill in Phone Number and National ID.');
        return;
    }
    
    var plan = SubscriptionPlansUGX[selectedPlan];
    showToast('info', 'Processing Payment', 'Initiating ' + plan.name + ' subscription payment...');
    
    if (selectedPaymentMethod === 'airtel_money' || selectedPaymentMethod === 'mtn_money') {
        simulateSTKPush(phone, nationalId, plan.priceUGX, selectedPaymentMethod);
    } else {
        simulateCardPayment(phone, nationalId, plan.priceUGX);
    }
}

function simulateSTKPush(phone, nationalId, amount, method) {
    var methodName = method === 'airtel_money' ? 'Airtel Money' : 'MTN Mobile Money';
    
    var verifyModal = document.getElementById('payment-verify-modal');
    if (verifyModal) {
        verifyModal.classList.add('active');
        var amountEl = document.getElementById('verify-amount');
        var phoneEl = document.getElementById('verify-phone');
        if (amountEl) amountEl.textContent = 'UGX ' + amount.toLocaleString();
        if (phoneEl) phoneEl.textContent = phone;
    }
    
    showToast('info', 'STK Push Sent', 'Please check your phone ' + phone + ' and enter your PIN.');
    
    setTimeout(function() {
        var transactionId = 'TXN' + Date.now();
        var ref = method === 'airtel_money' ? 'AF' : 'MF';
        ref += new Date().toISOString().slice(0,10).replace(/-/g,'') + Math.floor(Math.random() * 10000);
        
        var transaction = {
            id: transactionId,
            userId: parseInt(localStorage.getItem('clinicflow_user_id') || '1'),
            amount: amount,
            currency: 'UGX',
            method: method,
            status: 'successful',
            date: new Date().toISOString().split('T')[0],
            ref: ref,
            phoneNumber: phone,
            nationalId: nationalId
        };
        
        PaymentTransactions.push(transaction);
        
        var userEmail = localStorage.getItem('clinicflow_user');
        var user = typeof UserAccounts !== 'undefined' ? UserAccounts.find(function(u) { return u.email === userEmail; }) : null;
        
        if (user) user.subscription = selectedPlan;
        localStorage.setItem('clinicflow_subscription', selectedPlan);
        
        UserSubscriptions.push({
            id: UserSubscriptions.length + 1,
            userId: parseInt(localStorage.getItem('clinicflow_user_id') || '1'),
            plan: selectedPlan,
            paymentMethod: method,
            phoneNumber: phone,
            nationalId: nationalId,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
            active: true,
            autoRenew: true,
            transactionId: transactionId,
            paymentStatus: 'paid'
        });
        
        updateSubscriptionBanner();
        showToast('success', 'Payment Successful!', 'Your ' + methodName + ' payment of UGX ' + amount.toLocaleString() + ' was successful. Ref: ' + ref);
        
        var verifyModal = document.getElementById('payment-verify-modal');
        if (verifyModal) verifyModal.classList.remove('active');
        
        var subModal = document.getElementById('subscription-modal');
        if (subModal) subModal.classList.remove('active');
    }, 3000);
}

function simulateCardPayment(phone, nationalId, amount) {
    showToast('info', 'Card Payment', 'Redirecting to secure payment gateway...');
    
    setTimeout(function() {
        var transactionId = 'TXN' + Date.now();
        
        PaymentTransactions.push({
            id: transactionId,
            userId: parseInt(localStorage.getItem('clinicflow_user_id') || '1'),
            amount: amount,
            currency: 'UGX',
            method: 'airtel_card',
            status: 'successful',
            date: new Date().toISOString().split('T')[0],
            ref: 'CD' + Date.now(),
            phoneNumber: phone,
            nationalId: nationalId
        });
        
        var userEmail = localStorage.getItem('clinicflow_user');
        var user = typeof UserAccounts !== 'undefined' ? UserAccounts.find(function(u) { return u.email === userEmail; }) : null;
        
        if (user) user.subscription = selectedPlan;
        localStorage.setItem('clinicflow_subscription', selectedPlan);
        
        showToast('success', 'Payment Successful!', 'Your Airtel Mastercard payment of UGX ' + amount.toLocaleString() + ' was successful.');
        
        var subModal = document.getElementById('subscription-modal');
        if (subModal) subModal.classList.remove('active');
        
        updateSubscriptionBanner();
    }, 3000);
}

function verifyPayment() {
    var code = document.getElementById('payment-code');
    if (!code || !code.value) {
        showToast('warning', 'Enter Code', 'Please enter the M-PIN code you received.');
        return;
    }
    
    showToast('info', 'Verifying', 'Verifying payment...');
    
    setTimeout(function() {
        showToast('success', 'Verified!', 'Payment verified successfully!');
        var verifyModal = document.getElementById('payment-verify-modal');
        if (verifyModal) verifyModal.classList.remove('active');
    }, 2000);
}

function loadCurrentSubscription() {
    var currentPlan = localStorage.getItem('clinicflow_subscription') || 'basic';
    var banner = document.getElementById('subscription-banner');
    if (banner) {
        var planDisplay = document.getElementById('current-plan-display');
        if (planDisplay) planDisplay.textContent = SubscriptionPlansUGX[currentPlan] ? SubscriptionPlansUGX[currentPlan].name : 'Basic';
        banner.style.display = 'flex';
    }
}

function updateSubscriptionBanner() {
    var currentPlan = localStorage.getItem('clinicflow_subscription') || 'basic';
    var banner = document.getElementById('subscription-banner');
    if (banner) {
        var planDisplay = document.getElementById('current-plan-display');
        if (planDisplay) planDisplay.textContent = SubscriptionPlansUGX[currentPlan] ? SubscriptionPlansUGX[currentPlan].name : 'Basic';
        banner.style.display = 'flex';
    }
}

function renderPaymentHistory() {
    var container = document.getElementById('payment-history');
    if (!container) return;
    
    var userEmail = localStorage.getItem('clinicflow_user');
    var user = typeof UserAccounts !== 'undefined' ? UserAccounts.find(function(u) { return u.email === userEmail; }) : null;
    
    if (!user) {
        container.innerHTML = '<p>Please log in to view payment history.</p>';
        return;
    }
    
    var userTxns = PaymentTransactions.filter(function(t) { return t.userId === user.id; });
    
    if (userTxns.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-receipt"></i><p>No payment history yet.</p></div>';
        return;
    }
    
    var html = userTxns.map(function(txn) {
        var methodLabel = txn.method === 'airtel_money' ? 'Airtel Money' : txn.method === 'mtn_money' ? 'MTN Mobile Money' : 'Airtel Mastercard';
        return '<div class="payment-transaction"><div class="txn-info"><span class="txn-ref">' + txn.ref + '</span><span class="txn-date">' + txn.date + '</span><span class="txn-method">' + methodLabel + '</span></div><div class="txn-amount">UGX ' + txn.amount.toLocaleString() + '</div><span class="txn-status ' + txn.status + '">' + txn.status + '</span></div>';
    }).join('');
    
    container.innerHTML = html;
}

function showUssdCodes() {
    showToast('info', 'USSD Codes', 'Airtel Money: *185# | MTN Mobile Money: *150#');
}

function cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    showToast('info', 'Subscription Cancelled', 'Your subscription will expire at the end of the billing period.');
}

// Make functions global
window.selectPlan = selectPlan;
window.initiatePayment = initiatePayment;
window.verifyPayment = verifyPayment;
window.showUssdCodes = showUssdCodes;
window.openSubscriptionModal = openSubscriptionModal;
window.cancelSubscription = cancelSubscription;
