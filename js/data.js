// ========================================
// ClinicFlow - Sample Data
// ========================================

// Lead Sources
var LeadSources = [
    { value: 'website', label: 'Website', color: '#4F46E5' },
    { value: 'whatsapp', label: 'WhatsApp', color: '#10B981' },
    { value: 'facebook', label: 'Facebook', color: '#F59E0B' },
    { value: 'phone', label: 'Phone', color: '#EF4444' }
];

// Lead Statuses
var LeadStatuses = [
    { value: 'new', label: 'New', color: '#4F46E5' },
    { value: 'contacted', label: 'Contacted', color: '#3B82F6' },
    { value: 'qualified', label: 'Qualified', color: '#10B981' },
    { value: 'booked', label: 'Booked', color: '#F59E0B' },
    { value: 'completed', label: 'Completed', color: '#10B981' },
    { value: 'lost', label: 'Lost', color: '#EF4444' }
];

// Subscription Plans with Feature Access
var SubscriptionPlans = {
    basic: {
        name: 'Basic',
        price: '$29/month',
        features: {
            leads: true,
            leadsLimit: 100,
            appointments: true,
            appointmentsLimit: 50,
            reminders: false,
            reactivation: false,
            analytics: false,
            api: false,
            customBranding: false,
            multipleUsers: false
        }
    },
    professional: {
        name: 'Professional',
        price: '$79/month',
        features: {
            leads: true,
            leadsLimit: 500,
            appointments: true,
            appointmentsLimit: 200,
            reminders: true,
            reactivation: true,
            analytics: true,
            api: false,
            customBranding: false,
            multipleUsers: false
        }
    },
    enterprise: {
        name: 'Enterprise',
        price: '$199/month',
        features: {
            leads: true,
            leadsLimit: -1,
            appointments: true,
            appointmentsLimit: -1,
            reminders: true,
            reactivation: true,
            analytics: true,
            api: true,
            customBranding: true,
            multipleUsers: true
        }
    }
};

// User Accounts with Subscriptions
var UserAccounts = [
    { id: 1, email: 'admin@smiledental.com', password: 'admin123', clinicName: 'Smile Dental Clinic', subscription: 'enterprise', active: true },
    { id: 2, email: 'drjohnson@brightsmile.com', password: 'demo123', clinicName: 'Bright Smile Dental', subscription: 'professional', active: true },
    { id: 3, email: 'dentalcare@familyfirst.com', password: 'demo123', clinicName: 'Family First Dental', subscription: 'basic', active: true },
    { id: 4, email: 'info@perfectteeth.com', password: 'demo123', clinicName: 'Perfect Teeth Center', subscription: 'professional', active: true },
    { id: 5, email: 'admin@dentalexpress.com', password: 'demo123', clinicName: 'Dental Express', subscription: 'basic', active: true },
    { id: 6, email: 'smile@whitestudio.com', password: 'demo123', clinicName: 'White Studio Dental', subscription: 'enterprise', active: true },
    { id: 7, email: 'care@gentledental.com', password: 'demo123', clinicName: 'Gentle Dental Care', subscription: 'professional', active: true },
    { id: 8, email: 'team@oralsurgery.com', password: 'demo123', clinicName: 'Oral Surgery Specialists', subscription: 'enterprise', active: true },
    { id: 9, email: 'kids@dentalkids.com', password: 'demo123', clinicName: 'Kids Dental World', subscription: 'basic', active: true },
    { id: 10, email: 'emergency@dental24seven.com', password: 'demo123', clinicName: 'Dental 24/7 Emergency', subscription: 'professional', active: true }
];

// Default Services
var DefaultServices = [
    { value: 'checkup', label: 'General Checkup', avgValue: 150 },
    { value: 'cleaning', label: 'Teeth Cleaning', avgValue: 200 },
    { value: 'whitening', label: 'Teeth Whitening', avgValue: 500 },
    { value: 'braces', label: 'Braces/Invisalign', avgValue: 5000 },
    { value: 'implants', label: 'Dental Implants', avgValue: 3000 },
    { value: 'rootcanal', label: 'Root Canal', avgValue: 1200 },
    { value: 'extraction', label: 'Tooth Extraction', avgValue: 300 }
];

// Treatment Options
var TreatmentOptions = [...DefaultServices];

// Application State
var AppState = {
    leads: [],
    appointments: [],
    customServices: [],
    settings: {
        clinicName: 'Smile Dental Clinic',
        autoResponse: true,
        reminder48h: true,
        reminder24h: true,
        reminderSameDay: true
    }
};

// Sample Leads Data
var SampleData = {
    leads: [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Smith',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@email.com',
            source: 'website',
            treatment: 'whitening',
            budget: '500-1000',
            urgency: 'this-month',
            status: 'qualified',
            value: 500,
            createdAt: new Date('2025-01-15')
        },
        {
            id: 2,
            firstName: 'Sarah',
            lastName: 'Johnson',
            phone: '+1 (555) 234-5678',
            email: 'sarah.j@email.com',
            source: 'whatsapp',
            treatment: 'braces',
            budget: '2000-5000',
            urgency: 'immediate',
            status: 'booked',
            value: 5000,
            createdAt: new Date('2025-01-14')
        },
        {
            id: 3,
            firstName: 'Michael',
            lastName: 'Brown',
            phone: '+1 (555) 345-6789',
            email: 'mbrown@email.com',
            source: 'facebook',
            treatment: 'implants',
            budget: '2000-5000',
            urgency: 'this-quarter',
            status: 'new',
            value: 3000,
            createdAt: new Date('2025-01-16')
        },
        {
            id: 4,
            firstName: 'Emily',
            lastName: 'Davis',
            phone: '+1 (555) 456-7890',
            email: 'emily.d@email.com',
            source: 'phone',
            treatment: 'cleaning',
            budget: '0-500',
            urgency: 'flexible',
            status: 'completed',
            value: 200,
            createdAt: new Date('2025-01-10')
        },
        {
            id: 5,
            firstName: 'David',
            lastName: 'Wilson',
            phone: '+1 (555) 567-8901',
            email: 'dwilson@email.com',
            source: 'website',
            treatment: 'rootcanal',
            budget: '1000-2000',
            urgency: 'this-month',
            status: 'contacted',
            value: 1200,
            createdAt: new Date('2025-01-13')
        },
        {
            id: 6,
            firstName: 'Lisa',
            lastName: 'Martinez',
            phone: '+1 (555) 678-9012',
            email: 'lisa.m@email.com',
            source: 'referral',
            treatment: 'whitening',
            budget: '500-1000',
            urgency: 'this-month',
            status: 'qualified',
            value: 500,
            createdAt: new Date('2025-01-12')
        },
        {
            id: 7,
            firstName: 'Robert',
            lastName: 'Taylor',
            phone: '+1 (555) 789-0123',
            email: 'rtaylor@email.com',
            source: 'whatsapp',
            treatment: 'extraction',
            budget: '0-500',
            urgency: 'immediate',
            status: 'booked',
            value: 300,
            createdAt: new Date('2025-01-11')
        },
        {
            id: 8,
            firstName: 'Jennifer',
            lastName: 'Anderson',
            phone: '+1 (555) 890-1234',
            email: 'janderson@email.com',
            source: 'facebook',
            treatment: 'checkup',
            budget: '0-500',
            urgency: 'flexible',
            status: 'new',
            value: 150,
            createdAt: new Date('2025-01-16')
        }
    ],
    appointments: [
        {
            id: 1,
            patientName: 'Sarah Johnson',
            treatment: 'Braces Consultation',
            date: '2025-01-20',
            time: '10:00',
            status: 'confirmed'
        },
        {
            id: 2,
            patientName: 'Robert Taylor',
            treatment: 'Tooth Extraction',
            date: '2025-01-21',
            time: '14:30',
            status: 'pending'
        },
        {
            id: 3,
            patientName: 'Emily Davis',
            treatment: 'Teeth Cleaning',
            date: '2025-01-17',
            time: '11:00',
            status: 'completed'
        },
        {
            id: 4,
            patientName: 'John Smith',
            treatment: 'Teeth Whitening',
            date: '2025-01-22',
            time: '09:30',
            status: 'confirmed'
        }
    ],
    activities: [
        {
            type: 'new-lead',
            title: 'New Lead Added',
            description: 'Michael Brown from Facebook',
            time: '2 min ago'
        },
        {
            type: 'booked',
            title: 'Appointment Booked',
            description: 'Sarah Johnson - Braces Consultation',
            time: '15 min ago'
        },
        {
            type: 'completed',
            title: 'Appointment Completed',
            description: 'Emily Davis - Teeth Cleaning',
            time: '1 hour ago'
        },
        {
            type: 'new-lead',
            title: 'New Lead Added',
            description: 'Jennifer Anderson from Facebook',
            time: '3 hours ago'
        }
    ],
    inactivePatients: 47,
    reactivatedThisMonth: 12
};

// ========================================
// Payment Configuration (Uganda Mobile Money)
// ========================================

// Payment Methods Available
var PaymentMethods = [
    { value: 'airtel_money', label: 'Airtel Money', icon: 'fa-mobile-alt', color: '#E31837' },
    { value: 'mtn_money', label: 'MTN Mobile Money', icon: '#FFB81C', color: '#FFB81C' },
    { value: 'airtel_card', label: 'Airtel Mastercard', icon: 'fa-credit-card', color: '#1A1F71' },
    { value: 'visa', label: 'Visa/Mastercard', icon: 'fa-credit-card', color: '#1A1F71' }
];

// Subscription Plans with Uganda Shillings (UGX)
var SubscriptionPlansUGX = {
    basic: {
        name: 'Basic',
        priceUSD: 29,
        priceUGX: 107000,
        priceLabel: 'UGX 107,000/month',
        features: {
            leads: true,
            leadsLimit: 100,
            appointments: true,
            appointmentsLimit: 50,
            reminders: false,
            reactivation: false,
            analytics: false,
            api: false,
            customBranding: false,
            multipleUsers: false
        }
    },
    professional: {
        name: 'Professional',
        priceUSD: 79,
        priceUGX: 290000,
        priceLabel: 'UGX 290,000/month',
        features: {
            leads: true,
            leadsLimit: 500,
            appointments: true,
            appointmentsLimit: 200,
            reminders: true,
            reactivation: true,
            analytics: true,
            api: false,
            customBranding: false,
            multipleUsers: false
        }
    },
    enterprise: {
        name: 'Enterprise',
        priceUSD: 199,
        priceUGX: 730000,
        priceLabel: 'UGX 730,000/month',
        features: {
            leads: true,
            leadsLimit: -1,
            appointments: true,
            appointmentsLimit: -1,
            reminders: true,
            reactivation: true,
            analytics: true,
            api: true,
            customBranding: true,
            multipleUsers: true
        }
    }
};

// User Subscriptions with Payment Info
var UserSubscriptions = [
    { 
        id: 1, 
        userId: 1, 
        plan: 'enterprise', 
        paymentMethod: 'airtel_money',
        phoneNumber: '256701234567',
        nationalId: 'CM890123456789',
        startDate: '2025-01-01',
        endDate: '2025-02-01',
        active: true,
        autoRenew: true,
        transactionId: 'TXN001',
        paymentStatus: 'paid'
    },
    { 
        id: 2, 
        userId: 2, 
        plan: 'professional', 
        paymentMethod: 'airtel_money',
        phoneNumber: '256702345678',
        nationalId: 'CM890234567890',
        startDate: '2025-01-01',
        endDate: '2025-02-01',
        active: true,
        autoRenew: true,
        transactionId: 'TXN002',
        paymentStatus: 'paid'
    },
    { 
        id: 3, 
        userId: 3, 
        plan: 'basic', 
        paymentMethod: 'mtn_money',
        phoneNumber: '256703456789',
        nationalId: 'CM890345678901',
        startDate: '2025-01-01',
        endDate: '2025-02-01',
        active: true,
        autoRenew: false,
        transactionId: 'TXN003',
        paymentStatus: 'paid'
    }
];

// Payment Transactions
var PaymentTransactions = [
    { id: 'TXN001', userId: 1, amount: 730000, currency: 'UGX', method: 'airtel_money', status: 'successful', date: '2025-01-01', ref: 'AF20250101001' },
    { id: 'TXN002', userId: 2, amount: 290000, currency: 'UGX', method: 'airtel_money', status: 'successful', date: '2025-01-01', ref: 'AF20250101002' },
    { id: 'TXN003', userId: 3, amount: 107000, currency: 'UGX', method: 'mtn_money', status: 'successful', date: '2025-01-01', ref: 'MF20250101001' }
];

// Helper Functions
function formatTime(time) {
    var parts = time.split(':');
    var hours = parseInt(parts[0]);
    var minutes = parts[1];
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + ':' + minutes + ' ' + ampm;
}

function formatDate(date) {
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function getRelativeTime(date) {
    var now = new Date();
    var diff = now - new Date(date);
    var minutes = Math.floor(diff / 60000);
    var hours = Math.floor(diff / 3600000);
    var days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return minutes + ' min ago';
    if (hours < 24) return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
    return days + ' day' + (days > 1 ? 's' : '') + ' ago';
}

