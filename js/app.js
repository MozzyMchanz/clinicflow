// ========================================
// ClinicFlow - Main Application
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Load sample data
    AppState.leads = SampleData.leads.slice();
    AppState.appointments = SampleData.appointments.slice();
    
    // Load custom services from localStorage
    loadCustomServices();
    
    // Initialize components
    initAuth();
    initNavigation();
    initDashboard();
    initLeads();
    initCalendar();
    initModals();
    initToast();
    initSubscription();
    initHelp();
    initServices();
    
    // Update UI
    updateDashboardStats();
    updateLeadsTable();
    updateActivityFeed();
    updateAppointmentsList();
    updateReactivationStats();
}

// ========================================
// Services Management
// ========================================

function initServices() {
    var addServiceBtn = document.getElementById('add-service-btn');
    var serviceInput = document.getElementById('new-service-input');
    
    if (addServiceBtn && serviceInput) {
        addServiceBtn.addEventListener('click', addService);
        serviceInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addService();
            }
        });
    }
    
    renderServices();
}

function loadCustomServices() {
    var savedServices = localStorage.getItem('clinicflow_services');
    if (savedServices) {
        AppState.customServices = JSON.parse(savedServices);
        updateTreatmentDropdown();
    } else {
        AppState.customServices = [...DefaultServices];
    }
}

function addService() {
    var serviceInput = document.getElementById('new-service-input');
    if (!serviceInput) return;
    
    var serviceName = serviceInput.value.trim();
    if (!serviceName) {
        showToast('warning', 'Enter Service', 'Please enter a service name.');
        return;
    }
    
    // Create service object
    var serviceValue = serviceName.toLowerCase().replace(/\s+/g, '-');
    var newService = {
        value: serviceValue,
        label: serviceName,
        avgValue: 0
    };
    
    // Add to custom services
    AppState.customServices.push(newService);
    
    // Save to localStorage
    localStorage.setItem('clinicflow_services', JSON.stringify(AppState.customServices));
    
    // Update treatment dropdown
    updateTreatmentDropdown();
    
    // Clear input and re-render
    serviceInput.value = '';
    renderServices();
    
    showToast('success', 'Service Added', serviceName + ' has been added to your services.');
}

function removeService(serviceValue) {
    if (!confirm('Are you sure you want to remove this service?')) {
        return;
    }
    
    AppState.customServices = AppState.customServices.filter(function(s) {
        return s.value !== serviceValue;
    });
    
    localStorage.setItem('clinicflow_services', JSON.stringify(AppState.customServices));
    updateTreatmentDropdown();
    renderServices();
    
    showToast('success', 'Service Removed', 'The service has been removed.');
}

function renderServices() {
    var servicesList = document.getElementById('services-list');
    if (!servicesList) return;
    
    if (AppState.customServices.length === 0) {
        servicesList.innerHTML = '<div class="services-empty"><i class="fas fa-hand-holding-medical"></i><p>No services added yet. Add your first service above.</p></div>';
        return;
    }
    
    var html = AppState.customServices.map(function(service) {
        return '<div class="service-item">' +
            '<div class="service-item-info">' +
                '<i class="fas fa-check-circle"></i>' +
                '<span>' + service.label + '</span>' +
            '</div>' +
            '<div class="service-item-actions">' +
                '<button class="icon-btn" onclick="removeService(\'' + service.value + '\')" title="Remove Service">' +
                    '<i class="fas fa-trash"></i>' +
                '</button>' +
            '</div>' +
        '</div>';
    }).join('');
    
    servicesList.innerHTML = html;
}

function updateTreatmentDropdown() {
    var treatmentSelect = document.querySelector('select[name="treatment"]');
    if (!treatmentSelect) return;
    
    // Clear existing options except the first one
    treatmentSelect.innerHTML = '<option value="">Select Treatment</option>';
    
    // Add custom services
    AppState.customServices.forEach(function(service) {
        var option = document.createElement('option');
        option.value = service.value;
        option.textContent = service.label;
        treatmentSelect.appendChild(option);
    });
    
    // Add "Other" option
    var otherOption = document.createElement('option');
    otherOption.value = 'other';
    otherOption.textContent = 'Other';
    treatmentSelect.appendChild(otherOption);
}

// Make functions globally available
window.removeService = removeService;

// ========================================
// Authentication
// ========================================

function initAuth() {
    var loginForm = document.getElementById('login-form');
    var loginOverlay = document.getElementById('login-overlay');
    
    if (!loginForm) return;
    
    // Check if already logged in
    if (localStorage.getItem('clinicflow_logged_in') === 'true') {
        loginOverlay.classList.add('hidden');
        return;
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;
        
        // Check against UserAccounts
        var user = UserAccounts.find(function(u) {
            return u.email === email && u.password === password && u.active;
        });
        
        if (user) {
            localStorage.setItem('clinicflow_logged_in', 'true');
            localStorage.setItem('clinicflow_user', email);
            localStorage.setItem('clinicflow_user_id', user.id);
            localStorage.setItem('clinicflow_clinic', user.clinicName);
            localStorage.setItem('clinicflow_subscription', user.subscription);
            
            loginOverlay.classList.add('hidden');
            
            var plan = SubscriptionPlans[user.subscription];
            showToast('success', 'Welcome!', 'Logged in as ' + user.clinicName + ' (' + plan.name + ' Plan)');
            
            applySubscriptionFeatures(user.subscription);
        } else {
            showToast('error', 'Login Failed', 'Invalid credentials. Check demo accounts below.');
        }
    });
}

function applySubscriptionFeatures(subscription) {
    var plan = SubscriptionPlans[subscription];
    
    if (!plan.features.reminders) {
        var remindersNav = document.querySelector('[data-page="reminders"]');
        if (remindersNav) remindersNav.style.display = 'none';
    }
    
    if (!plan.features.reactivation) {
        var reactivationNav = document.querySelector('[data-page="reactivation"]');
        if (reactivationNav) reactivationNav.style.display = 'none';
    }
    
    if (!plan.features.analytics) {
        var chartsSection = document.querySelector('.charts-row');
        if (chartsSection) chartsSection.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('clinicflow_logged_in');
    localStorage.removeItem('clinicflow_user');
    localStorage.removeItem('clinicflow_user_id');
    document.getElementById('login-overlay').classList.remove('hidden');
}

function togglePassword() {
    var passwordInput = document.getElementById('login-password');
    var eyeIcon = document.getElementById('eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// ========================================
// Navigation
// ========================================

function initNavigation() {
    var navItems = document.querySelectorAll('.nav-item');
    var pageContents = document.querySelectorAll('.page-content');
    var pageTitle = document.getElementById('page-title');
    var pageSubtitle = document.getElementById('page-subtitle');
    
    var pageTitles = {
        'dashboard': { title: 'Dashboard', subtitle: 'Real-time overview of your patient acquisition' },
        'leads': { title: 'Leads', subtitle: 'Manage and track all your patient leads' },
        'qualification': { title: 'Qualification', subtitle: 'Configure smart qualification flows' },
        'appointments': { title: 'Appointments', subtitle: 'View and manage appointments' },
        'reminders': { title: 'Reminders', subtitle: 'No-show reduction system configuration' },
        'reactivation': { title: 'Reactivation', subtitle: 'Patient re-engagement campaigns' },
        'settings': { title: 'Settings', subtitle: 'Configure your clinic preferences' },
        'help': { title: 'Help Center', subtitle: 'Find answers and support' }
    };
    
    navItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            var page = this.dataset.page;
            
            navItems.forEach(function(nav) { nav.classList.remove('active'); });
            this.classList.add('active');
            
            pageContents.forEach(function(content) { content.classList.remove('active'); });
            document.getElementById('page-' + page).classList.add('active');
            
            if (pageTitles[page]) {
                pageTitle.textContent = pageTitles[page].title;
                pageSubtitle.textContent = pageTitles[page].subtitle;
            }
        });
    });
}

// ========================================
// Dashboard
// ========================================

function initDashboard() {
    var quickAddLead = document.getElementById('quick-add-lead');
    if (quickAddLead) {
        quickAddLead.addEventListener('click', function() {
            document.getElementById('add-lead-modal').classList.add('active');
        });
    }
    
    var quickExport = document.getElementById('quick-export');
    if (quickExport) {
        quickExport.addEventListener('click', function() {
            exportReport();
        });
    }
    
    initCharts();
}

function updateDashboardStats() {
    var leads = AppState.leads;
    var appointments = AppState.appointments;
    
    var totalLeads = document.getElementById('total-leads');
    if (totalLeads) totalLeads.textContent = leads.length;
    
    var booked = leads.filter(function(l) { return l.status === 'booked' || l.status === 'completed'; }).length;
    var bookedEl = document.getElementById('booked-consultations');
    if (bookedEl) bookedEl.textContent = booked;
    
    var completed = appointments.filter(function(a) { return a.status === 'completed'; }).length;
    var total = appointments.length;
    var noShowRate = total > 0 ? Math.round(((total - completed) / total) * 100) : 0;
    var noShowEl = document.getElementById('noshow-rate');
    if (noShowEl) noShowEl.textContent = noShowRate + '%';
    
    var revenue = leads.reduce(function(sum, l) { return sum + (l.value || 0); }, 0);
    var revenueEl = document.getElementById('projected-revenue');
    if (revenueEl) revenueEl.textContent = '$' + revenue.toLocaleString();
    
    updateFunnel();
    
    var newLeads = leads.filter(function(l) { return l.status === 'new'; }).length;
    var badge = document.getElementById('leads-badge');
    if (badge) badge.textContent = newLeads;
}

function updateFunnel() {
    var leads = AppState.leads;
    var total = leads.length || 1;
    var qualified = leads.filter(function(l) { 
        return ['contacted', 'qualified', 'booked', 'completed'].includes(l.status); 
    }).length;
    var booked = leads.filter(function(l) { 
        return l.status === 'booked' || l.status === 'completed'; 
    }).length;
    var completed = leads.filter(function(l) { return l.status === 'completed'; }).length;
    
    var funnelStages = document.querySelectorAll('.funnel-bar');
    if (funnelStages.length >= 4) {
        funnelStages[0].querySelector('.funnel-value').textContent = total;
        funnelStages[1].querySelector('.funnel-value').textContent = qualified;
        funnelStages[2].querySelector('.funnel-value').textContent = booked;
        funnelStages[3].querySelector('.funnel-value').textContent = completed;
    }
}

function initCharts() {
    var ctx = document.getElementById('leads-source-chart');
    if (ctx && typeof Chart !== 'undefined') {
        var sourceCounts = {};
        LeadSources.forEach(function(s) { sourceCounts[s.value] = 0; });
        AppState.leads.forEach(function(l) {
            if (sourceCounts[l.source] !== undefined) {
                sourceCounts[l.source]++;
            }
        });
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: LeadSources.map(function(s) { return s.label; }),
                datasets: [{
                    data: LeadSources.map(function(s) { return sourceCounts[s.value]; }),
                    backgroundColor: LeadSources.map(function(s) { return s.color; }),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                cutout: '70%',
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
        
        var legendItems = document.querySelectorAll('.legend-item');
        legendItems.forEach(function(item, index) {
            var source = LeadSources[index];
            var count = sourceCounts[source.value];
            var total = AppState.leads.length || 1;
            var percentage = Math.round((count / total) * 100);
            item.querySelector('.legend-value').textContent = percentage + '%';
        });
    }
}

function exportReport() {
    showToast('success', 'Export Started', 'Your report is being generated...');
}

// ========================================
// Leads Management
// ========================================

function initLeads() {
    var addLeadBtn = document.getElementById('add-lead-btn');
    var modal = document.getElementById('add-lead-modal');
    var closeBtn = document.getElementById('close-lead-modal');
    var cancelBtn = document.getElementById('cancel-lead');
    var saveBtn = document.getElementById('save-lead');
    
    if (addLeadBtn) {
        addLeadBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveNewLead();
        });
    }
    
    var sourceFilter = document.getElementById('source-filter');
    var statusFilter = document.getElementById('status-filter');
    
    if (sourceFilter) sourceFilter.addEventListener('change', updateLeadsTable);
    if (statusFilter) statusFilter.addEventListener('change', updateLeadsTable);
}

function updateLeadsTable() {
    var tbody = document.getElementById('leads-table-body');
    if (!tbody) return;
    
    var sourceFilter = document.getElementById('source-filter');
    var statusFilter = document.getElementById('status-filter');
    
    var sourceVal = sourceFilter ? sourceFilter.value : '';
    var statusVal = statusFilter ? statusFilter.value : '';
    
    var filteredLeads = AppState.leads.slice();
    
    if (sourceVal) {
        filteredLeads = filteredLeads.filter(function(l) { return l.source === sourceVal; });
    }
    
    if (statusVal) {
        filteredLeads = filteredLeads.filter(function(l) { return l.status === statusVal; });
    }
    
    if (filteredLeads.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8"><div class="empty-state"><i class="fas fa-users"></i><p>No leads found</p></div></td></tr>';
        return;
    }
    
    var html = filteredLeads.map(function(lead) {
        var source = LeadSources.find(function(s) { return s.value === lead.source; });
        var status = LeadStatuses.find(function(s) { return s.value === lead.status; });
        
        return '<tr>' +
            '<td><input type="checkbox"></td>' +
            '<td><strong>' + lead.firstName + ' ' + lead.lastName + '</strong></td>' +
            '<td><div>' + lead.phone + '</div><small style="color: var(--text-muted)">' + (lead.email || '') + '</small></td>' +
            '<td><span class="source-badge"><i class="fas fa-' + getSourceIcon(lead.source) + '"></i> ' + (source ? source.label : lead.source) + '</span></td>' +
            '<td>' + getTreatmentLabel(lead.treatment) + '</td>' +
            '<td><span class="status-badge ' + lead.status + '">' + (status ? status.label : lead.status) + '</span></td>' +
            '<td>$' + (lead.value || 0) + '</td>' +
            '<td>' +
                '<div class="action-btns">' +
                    '<button class="icon-btn" title="Book Appointment" onclick="openBookingModal(' + lead.id + ')"><i class="fas fa-calendar-plus"></i></button>' +
                    '<button class="icon-btn" title="Edit"><i class="fas fa-edit"></i></button>' +
                    '<button class="icon-btn danger" title="Delete" onclick="deleteLead(' + lead.id + ')"><i class="fas fa-trash"></i></button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }).join('');
    
    tbody.innerHTML = html;
}

function getSourceIcon(source) {
    var icons = {
        'website': 'globe',
        'whatsapp': 'whatsapp',
        'facebook': 'facebook-f',
        'phone': 'phone',
        'referral': 'user-friends',
        'other': 'ellipsis-h'
    };
    return icons[source] || 'user';
}

function getTreatmentLabel(treatment) {
    var t = TreatmentOptions.find(function(opt) { return opt.value === treatment; });
    return t ? t.label : treatment;
}

function saveNewLead() {
    var form = document.getElementById('lead-form');
    var formData = new FormData(form);
    
    var newLead = {
        id: AppState.leads.length + 1,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        source: formData.get('source'),
        treatment: formData.get('treatment'),
        budget: formData.get('budget'),
        urgency: formData.get('urgency'),
        status: 'new',
        value: getTreatmentValue(formData.get('treatment')),
        createdAt: new Date()
    };
    
    AppState.leads.unshift(newLead);
    
    document.getElementById('add-lead-modal').classList.remove('active');
    form.reset();
    
    updateDashboardStats();
    updateLeadsTable();
    updateActivityFeed();
    
    showToast('success', 'Lead Added', newLead.firstName + ' ' + newLead.lastName + ' has been added successfully.');
}

function getTreatmentValue(treatment) {
    var t = TreatmentOptions.find(function(opt) { return opt.value === treatment; });
    return t ? t.avgValue : 0;
}

function deleteLead(id) {
    if (confirm('Are you sure you want to delete this lead?')) {
        AppState.leads = AppState.leads.filter(function(l) { return l.id !== id; });
        updateDashboardStats();
        updateLeadsTable();
        showToast('success', 'Lead Deleted', 'The lead has been removed.');
    }
}

// ========================================
// Calendar
// ========================================

var currentBookingLeadId = null;

function initCalendar() {
    generateCalendar();
    
    var prevWeek = document.getElementById('prev-week');
    var nextWeek = document.getElementById('next-week');
    
    if (prevWeek) {
        prevWeek.addEventListener('click', function() {
            showToast('info', 'Navigation', 'Previous week functionality');
        });
    }
    
    if (nextWeek) {
        nextWeek.addEventListener('click', function() {
            showToast('info', 'Navigation', 'Next week functionality');
        });
    }
}

function generateCalendar() {
    var calendarBody = document.getElementById('calendar-body');
    if (!calendarBody) return;
    
    var timeSlots = ['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    
    var html = '';
    
    timeSlots.forEach(function(time) {
        html += '<div class="time-slot-col">';
        html += '<div class="time-label">' + time + '</div>';
        
        days.forEach(function(day) {
            var hasAppointment = AppState.appointments.some(function(apt) {
                var aptTime = apt.time.split(':')[0];
                return aptTime === time.split(':')[0];
            });
            
            html += '<div class="day-slot">';
            if (hasAppointment) {
                var apt = AppState.appointments.find(function(apt) {
                    var aptTime = apt.time.split(':')[0];
                    return aptTime === time.split(':')[0];
                });
                if (apt) {
                    html += '<div class="appointment-item" style="margin: 2px; padding: 4px; font-size: 11px;"><strong>' + apt.patientName.split(' ')[0] + '</strong></div>';
                }
            }
            html += '</div>';
        });
        
        html += '</div>';
    });
    
    calendarBody.innerHTML = html;
}

function updateAppointmentsList() {
    var confirmedEl = document.getElementById('apt-confirmed');
    var pendingEl = document.getElementById('apt-pending');
    var cancelledEl = document.getElementById('apt-cancelled');
    
    var confirmed = AppState.appointments.filter(function(a) { return a.status === 'confirmed'; }).length;
    var pending = AppState.appointments.filter(function(a) { return a.status === 'pending'; }).length;
    var cancelled = AppState.appointments.filter(function(a) { return a.status === 'cancelled'; }).length;
    
    if (confirmedEl) confirmedEl.textContent = confirmed;
    if (pendingEl) pendingEl.textContent = pending;
    if (cancelledEl) cancelledEl.textContent = cancelled;
    
    var container = document.getElementById('today-appointments');
    if (!container) return;
    
    var upcomingApts = AppState.appointments.slice(0, 3);
    
    if (upcomingApts.length === 0) {
        container.innerHTML = '<div class="appointment-empty"><i class="fas fa-calendar-day"></i><p>No appointments today</p></div>';
        return;
    }
    
    var aptHtml = upcomingApts.map(function(apt) {
        return '<div class="appointment-item">' +
            '<span class="appointment-time">' + formatTime(apt.time) + '</span>' +
            '<div class="appointment-details"><h4>' + apt.patientName + '</h4><p>' + apt.treatment + '</p></div>' +
            '<span class="appointment-status ' + apt.status + '">' + apt.status + '</span>' +
        '</div>';
    }).join('');
    
    container.innerHTML = aptHtml;
}

// ========================================
// Activity Feed
// ========================================

function updateActivityFeed() {
    var container = document.getElementById('recent-activity');
    if (!container) return;
    
    var activities = SampleData.activities;
    
    var html = activities.map(function(activity) {
        return '<div class="activity-item">' +
            '<div class="activity-icon ' + activity.type + '">' +
                '<i class="fas fa-' + getActivityIcon(activity.type) + '"></i>' +
            '</div>' +
            '<div class="activity-details">' +
                '<h4>' + activity.title + '</h4>' +
                '<p>' + activity.description + '</p>' +
            '</div>' +
            '<span class="activity-time">' + activity.time + '</span>' +
        '</div>';
    }).join('');
    
    container.innerHTML = html;
}

function getActivityIcon(type) {
    var icons = {
        'new-lead': 'user-plus',
        'booked': 'calendar-check',
        'completed': 'check-circle',
        'cancelled': 'times-circle',
        'reminder': 'bell'
    };
    return icons[type] || 'info-circle';
}

// ========================================
// Reactivation
// ========================================

function updateReactivationStats() {
    var inactiveEl = document.getElementById('inactive-patients');
    var pendingEl = document.getElementById('pending-reactivation');
    var reactivatedEl = document.getElementById('reactivated-count');
    
    if (inactiveEl) inactiveEl.textContent = SampleData.inactivePatients;
    if (pendingEl) pendingEl.textContent = '8';
    if (reactivatedEl) reactivatedEl.textContent = SampleData.reactivatedThisMonth;
}

// ========================================
// Modals
// ========================================

function initModals() {
    var bookingModal = document.getElementById('booking-modal');
    if (bookingModal) {
        var closeBookingBtn = document.getElementById('close-booking-modal');
        var cancelBookingBtn = document.getElementById('cancel-booking');
        
        if (closeBookingBtn) {
            closeBookingBtn.addEventListener('click', function() {
                bookingModal.classList.remove('active');
            });
        }
        
        if (cancelBookingBtn) {
            cancelBookingBtn.addEventListener('click', function() {
                bookingModal.classList.remove('active');
            });
        }
        
        initCalendarPicker();
        
        var timeSlots = document.querySelectorAll('.time-slot');
        timeSlots.forEach(function(slot) {
            slot.addEventListener('click', function() {
                timeSlots.forEach(function(s) { s.classList.remove('selected'); });
                this.classList.add('selected');
            });
        });
        
        var confirmBookingBtn = document.getElementById('confirm-booking');
        if (confirmBookingBtn) {
            confirmBookingBtn.addEventListener('click', confirmAppointmentBooking);
        }
    }
    
    // Backup button
    var backupBtn = document.getElementById('backup-now-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', function() {
            var backupPath = document.getElementById('backup-path').value;
            var backupEmail = document.getElementById('backup-email').value;
            showToast('success', 'Backup Created', 'Backup saved to: ' + backupPath + '\nConfirmation sent to: ' + backupEmail);
        });
    }
    
    // Settings save
    var saveSettings = document.getElementById('save-settings');
    if (saveSettings) {
        saveSettings.addEventListener('click', function() {
            var clinicName = document.getElementById('clinic-name').value;
            AppState.settings.clinicName = clinicName;
            showToast('success', 'Settings Saved', 'Your settings have been updated successfully.');
        });
    }
}

function initCalendarPicker() {
    var calendarDates = document.getElementById('calendar-dates');
    if (!calendarDates) return;
    
    renderCalendar(new Date().getMonth(), new Date().getFullYear());
    
    // Month navigation
    var prevMonth = document.getElementById('prev-month');
    var nextMonth = document.getElementById('next-month');
    
    var currentMonth = new Date().getMonth();
    var currentYear = new Date().getFullYear();
    
    if (prevMonth) {
        prevMonth.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }
    
    if (nextMonth) {
        nextMonth.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }
}

function renderCalendar(month, year) {
    var calendarDates = document.getElementById('calendar-dates');
    var monthYearEl = document.getElementById('calendar-month-year');
    
    if (!calendarDates) return;
    
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (monthYearEl) {
        monthYearEl.textContent = monthNames[month] + ' ' + year;
    }
    
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    
    var html = '';
    var today = new Date();
    
    for (var i = 0; i < firstDay; i++) {
        html += '<div class="calendar-date disabled"></div>';
    }
    
    for (var day = 1; day <= daysInMonth; day++) {
        var isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        var isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        html += '<div class="calendar-date' + (isToday ? ' today' : '') + (isPast ? ' disabled' : '') + '" data-date="' + day + '">' + day + '</div>';
    }
    
    calendarDates.innerHTML = html;
    
    var dates = calendarDates.querySelectorAll('.calendar-date:not(.disabled)');
    dates.forEach(function(date) {
        date.addEventListener('click', function() {
            dates.forEach(function(d) { d.classList.remove('selected'); });
            this.classList.add('selected');
        });
    });
}

function openBookingModal(leadId) {
    currentBookingLeadId = leadId;
    var lead = AppState.leads.find(function(l) { return l.id === leadId; });
    
    if (lead) {
        document.getElementById('booking-patient-name').textContent = lead.firstName + ' ' + lead.lastName;
        document.getElementById('booking-treatment').textContent = getTreatmentLabel(lead.treatment);
    }
    
    document.getElementById('booking-modal').classList.add('active');
}

function confirmAppointmentBooking() {
    var selectedDate = document.querySelector('.calendar-date.selected');
    var selectedTime = document.querySelector('.time-slot.selected');
    
    if (!selectedDate) {
        showToast('warning', 'Select Date', 'Please select a date for the appointment.');
        return;
    }
    
    if (!selectedTime) {
        showToast('warning', 'Select Time', 'Please select a time for the appointment.');
        return;
    }
    
    if (currentBookingLeadId) {
        var lead = AppState.leads.find(function(l) { return l.id === currentBookingLeadId; });
        if (lead) {
            lead.status = 'booked';
        }
    }
    
    document.getElementById('booking-modal').classList.remove('active');
    
    updateDashboardStats();
    updateLeadsTable();
    
    showToast('success', 'Appointment Booked', 'The appointment has been scheduled successfully.');
}

// ========================================
// Help
// ========================================

function initHelp() {
    // FAQ accordion
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                var wasActive = item.classList.contains('active');
                faqItems.forEach(function(i) { i.classList.remove('active'); });
                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Help search
    var helpSearchInput = document.getElementById('help-search-input');
    if (helpSearchInput) {
        helpSearchInput.addEventListener('input', function() {
            var query = this.value.toLowerCase();
            var helpItems = document.querySelectorAll('.help-category ul li a');
            helpItems.forEach(function(item) {
                var text = item.textContent.toLowerCase();
                var parent = item.closest('li');
                if (text.includes(query) || query === '') {
                    parent.style.display = 'block';
                } else {
                    parent.style.display = 'none';
                }
            });
        });
    }
}

function showHelpArticle(articleId) {
    var articles = {
        'intro': 'Welcome to ClinicFlow! This comprehensive patient acquisition system helps you manage leads, bookings, and patient communications all in one place.',
        'setup': 'To set up: 1. Configure your business info in Settings. 2. Connect integrations (WhatsApp, Calendar, Email). 3. Set up your qualification questions.',
        'dashboard': 'The dashboard shows real-time metrics: Total Leads, Booked Consultations, No-Show Rate, and Projected Revenue.',
        'add-lead': 'Click "New Lead" or use the quick action to add patients. Fill in their contact info, treatment interest, budget, and urgency.',
        'qualify': 'Use the Qualification page to set up questions that help filter high-quality leads based on budget, urgency, and treatment needs.',
        'sources': 'Track where your leads come from: Website, WhatsApp, Facebook, Phone, or Referrals.',
        'book-apt': 'Click the calendar icon next to any lead to schedule an appointment. Select date and time from the picker.',
        'calendar': 'The calendar shows all appointments. Click on time slots to view or add appointments.',
        'reminders': 'Configure automatic reminders at 48h, 24h, and same-day to reduce no-shows.',
        'auto-msg': 'Set up automatic responses for new leads. Configure WhatsApp and email templates in Settings.',
        'reactivation': 'Re-engage patients who haven\'t visited in 90+ days using the campaign templates.',
        'integrations': 'Connect WhatsApp API, Google Calendar, Email service, and Twilio SMS in Settings > Integrations.'
    };
    
    var content = articles[articleId] || 'Article not found.';
    showToast('info', 'Help Article', content);
}

// ========================================
// Toast
// ========================================

function initToast() {
    var modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        var overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }
    });
}

function showToast(type, title, message) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    
    var icons = {
        'success': 'check-circle',
        'error': 'times-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = 
        '<div class="toast-icon"><i class="fas fa-' + icons[type] + '"></i></div>' +
        '<div class="toast-content">' +
            '<h4>' + title + '</h4>' +
            '<p>' + message + '</p>' +
        '</div>' +
        '<div class="toast-close"><i class="fas fa-times"></i></div>';
    
    container.appendChild(toast);
    
    var closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.remove();
    });
    
    setTimeout(function() {
        toast.remove();
    }, 5000);
}

// ========================================
// Subscription Management (Uganda Mobile Money)
// ========================================

// Current selected plan for payment
var selectedPlan = null;
var selectedPaymentMethod = null;

function initSubscription() {
    // Load subscription page if exists
    var upgradeBtn = document.getElementById('upgrade-plan-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', openSubscriptionModal);
    }
    
    // Payment method selection
    var paymentMethods = document.querySelectorAll('.payment-method-option');
    paymentMethods.forEach(function(method) {
        method.addEventListener('click', function() {
            selectPaymentMethod(this.dataset.method);
        });
    });
    
    // Initialize payment button
    var payBtn = document.getElementById('initiate-payment-btn');
    if (payBtn) {
        payBtn.addEventListener('click', initiatePayment);
    }
    
    // Verify payment button
    var verifyBtn = document.getElementById('verify-payment-btn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyPayment);
    }
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
        
        html += '<div class="subscription-plan ' + (isPopular ? 'popular' : '') + '">' +
            '<div class="plan-badge">' + (isPopular ? 'Most Popular' : '') + '</div>' +
            '<h3>' + plan.name + '</h3>' +
            '<div class="plan-price">' +
                '<span class="currency">UGX</span>' +
                '<span class="amount">' + plan.priceUGX.toLocaleString() + '</span>' +
                '<span class="period">/month</span>' +
            '</div>' +
            '<ul class="plan-features">';
        
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
            html += '<li class="' + (available ? '' : 'disabled') + '">' +
                '<i class="fas fa-' + (available ? 'check' : 'times') + '"></i> ' +
                feature.label +
            '</li>';
        });
        
        html += '</ul>' +
            '<button class="btn ' + (isCurrent ? 'btn-secondary' : 'btn-primary') + '" ' +
            'onclick="selectPlan(\'' + planKey + '\')" ' +
            (isCurrent ? 'disabled' : '') + '>' +
            (isCurrent ? 'Current Plan' : 'Select Plan') +
            '</button>' +
        '</div>';
    });
    
    container.innerHTML = html;
}

function selectPlan(planKey) {
    selectedPlan = planKey;
    var plan = SubscriptionPlansUGX[planKey];
    
    // Show payment section
    var paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
        paymentSection.style.display = 'block';
        document.getElementById('selected-plan-name').textContent = plan.name;
        document.getElementById('selected-plan-price').textContent = 'UGX ' + plan.priceUGX.toLocaleString();
    }
    
    showToast('info', 'Plan Selected', 'You selected ' + plan.name + ' plan. Please choose payment method.');
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Update UI
    var options = document.querySelectorAll('.payment-method-option');
    options.forEach(function(opt) {
        opt.classList.remove('selected');
    });
    
    var selected = document.querySelector('[data-method="' + method + '"]');
    if (selected) {
        selected.classList.add('selected');
    }
    
    // Show relevant form
    var forms = document.querySelectorAll('.payment-form');
    forms.forEach(function(form) {
        form.style.display = 'none';
    });
    
    var form = document.getElementById(method + '-form');
    if (form) {
        form.style.display = 'block';
    }
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
    
    // Get form values based on payment method
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
        showToast('warning', 'Missing Info', 'Please fill in all required fields.');
        return;
    }
    
    var plan = SubscriptionPlansUGX[selectedPlan];
    
    // Simulate payment initiation
    showToast('info', 'Processing Payment', 'Initiating ' + plan.name + ' subscription payment...');
    
    // Simulate STK push for mobile money
    if (selectedPaymentMethod === 'airtel_money' || selectedPaymentMethod === 'mtn_money') {
        simulateSTKPush(phone, plan.priceUGX, selectedPaymentMethod);
    } else {
        simulateCardPayment(phone, plan.priceUGX);
    }
}

function simulateSTKPush(phone, amount, method) {
    var methodName = method === 'airtel_money' ? 'Airtel Money' : 'MTN Mobile Money';
    
    // Show payment verification modal
    var verifyModal = document.getElementById('payment-verify-modal');
    if (verifyModal) {
        verifyModal.classList.add('active');
        document.getElementById('verify-amount').textContent = 'UGX ' + amount.toLocaleString();
        document.getElementById('verify-phone').textContent = phone;
    }
    
    // Simulate successful payment after delay
    setTimeout(function() {
        var transactionId = 'TXN' + Date.now();
        var ref = method === 'airtel_money' ? 'AF' : 'MF';
        ref += new Date().toISOString().slice(0,10).replace(/-/g,'') + Math.floor(Math.random() * 10000);
        
        // Save transaction
        PaymentTransactions.push({
            id: transactionId,
            userId: parseInt(localStorage.getItem('clinicflow_user_id') || '1'),
            amount: amount,
            currency: 'UGX',
            method: method,
            status: 'successful',
            date: new Date().toISOString().split('T')[0],
            ref: ref
        });
        
        // Update user subscription
        var userEmail = localStorage.getItem('clinicflow_user');
        var user = UserAccounts.find(function(u) { return u.email === userEmail; });
        if (user) {
            user.subscription = selectedPlan;
            localStorage.setItem('clinicflow_subscription', selectedPlan);
            
            UserSubscriptions.push({
                id: UserSubscriptions.length + 1,
                userId: user.id,
                plan: selectedPlan,
                paymentMethod: method,
                phoneNumber: phone,
                nationalId: document.getElementById(method + '-national-id').value,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
                active: true,
                autoRenew: true,
                transactionId: transactionId,
                paymentStatus: 'paid'
            });
        }
        
        showToast('success', 'Payment Successful!', 'Your ' + methodName + ' payment of UGX ' + amount.toLocaleString() + ' was successful. Ref: ' + ref);
        
        var verifyModal = document.getElementById('payment-verify-modal');
        if (verifyModal) verifyModal.classList.remove('active');
        
        var subModal = document.getElementById('subscription-modal');
        if (subModal) subModal.classList.remove('active');
        
    }, 3000);
}

function simulateCardPayment(phone, amount) {
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
            ref: 'CD' + Date.now()
        });
        
        var userEmail = localStorage.getItem('clinicflow_user');
        var user = UserAccounts.find(function(u) { return u.email === userEmail; });
        if (user) {
            user.subscription = selectedPlan;
            localStorage.setItem('clinicflow_subscription', selectedPlan);
        }
        
        showToast('success', 'Payment Successful!', 'Your card payment of UGX ' + amount.toLocaleString() + ' was successful.');
        
        var subModal = document.getElementById('subscription-modal');
        if (subModal) subModal.classList.remove('active');
        
    }, 3000);
}

function verifyPayment() {
    var code = document.getElementById('payment-code').value;
    
    if (!code) {
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

function renderPaymentHistory() {
    var container = document.getElementById('payment-history');
    if (!container) return;
    
    var userEmail = localStorage.getItem('clinicflow_user');
    var user = UserAccounts.find(function(u) { return u.email === userEmail; });
    
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
        var methodLabel = txn.method === 'airtel_money' ? 'Airtel Money' : 
                         txn.method === 'mtn_money' ? 'MTN Mobile Money' : 'Card';
        
        return '<div class="payment-transaction">' +
            '<div class="txn-info">' +
                '<span class="txn-ref">' + txn.ref + '</span>' +
                '<span class="txn-date">' + txn.date + '</span>' +
                '<span class="txn-method">' + methodLabel + '</span>' +
            '</div>' +
            '<div class="txn-amount">UGX ' + txn.amount.toLocaleString() + '</div>' +
            '<span class="txn-status ' + txn.status + '">' + txn.status + '</span>' +
        '</div>';
    }).join('');
    
    container.innerHTML = html;
}

function showUssdCodes() {
    var codes = 'Airtel: *185# | MTN: *150#';
    showToast('info', 'USSD Codes', codes);
}

// Make functions globally available
window.openBookingModal = openBookingModal;
window.deleteLead = deleteLead;
window.showToast = showToast;
window.togglePassword = togglePassword;
window.showHelpArticle = showHelpArticle;
window.logout = logout;
window.selectPlan = selectPlan;
window.initiatePayment = initiatePayment;
window.verifyPayment = verifyPayment;
window.showUssdCodes = showUssdCodes;
window.openSubscriptionModal = openSubscriptionModal;

