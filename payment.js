// HabitOS Website - Payment & Download Integration

// ⚙️ CENTRAL CONFIG
// To change prices or trial period, edit: backend/config.js
// This will be fetched from the backend API on page load

const CONFIG = {
    RAZORPAY_KEY: 'rzp_live_S4eel0vxm9fxDk',
    GUMROAD_URL: 'https://guneshg.gumroad.com/l/madcgz',
    BACKEND_URL: 'https://habitos-final.onrender.com',
    DOWNLOAD_URLS: {
        windows: 'https://github.com/Gunesh22/HabitOS-Final/releases/latest/download/HabitOS-Setup.exe',
        mac: 'https://github.com/Gunesh22/HabitOS-Final/releases/latest/download/HabitOS.dmg',
        linux: 'https://github.com/Gunesh22/HabitOS-Final/releases/latest/download/HabitOS.AppImage'
    },
    // These MUST be loaded from backend - no defaults!
    PRICE_INR: null,
    PRICE_USD: null,
    TRIAL_DAYS: null
};

// Load config from backend on page load
async function loadConfig() {
    try {
        console.log('Fetching config from:', `${CONFIG.BACKEND_URL}/api/config`);
        const response = await fetch(`${CONFIG.BACKEND_URL}/api/config`);
        const backendConfig = await response.json();

        console.log('Config loaded from backend:', backendConfig);

        // Update prices and trial period from backend
        CONFIG.PRICE_INR = backendConfig.PRICE_INR;
        CONFIG.PRICE_USD = backendConfig.PRICE_USD;
        CONFIG.TRIAL_DAYS = backendConfig.TRIAL_DAYS;

        // Update UI elements that show trial period
        const trialElements = document.querySelectorAll('.trial-days');
        console.log('Found trial elements:', trialElements.length);
        trialElements.forEach(el => {
            console.log('Updating trial element from', el.textContent, 'to', `${CONFIG.TRIAL_DAYS} Days`);
            el.textContent = `${CONFIG.TRIAL_DAYS} Days`;
        });

        // Update UI elements that show price
        const priceElements = document.querySelectorAll('.price-inr');
        console.log('Found price elements:', priceElements.length);
        priceElements.forEach(el => {
            console.log('Updating price element from', el.textContent, 'to', `₹${CONFIG.PRICE_INR}`);
            el.textContent = `₹${CONFIG.PRICE_INR}`;
            el.style.visibility = 'visible'; // Show price after loading
        });

    } catch (error) {
        console.error('Failed to load config from backend:', error);
        // Show error state
        const priceElements = document.querySelectorAll('.price-inr');
        priceElements.forEach(el => {
            el.textContent = 'Error';
            el.style.visibility = 'visible';
        });
    }
}

// Load config when page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, loading config...');
    loadConfig();
});

// Also try loading immediately in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Still loading, wait for DOMContentLoaded
} else {
    // Already loaded
    console.log('DOM already loaded, loading config immediately...');
    loadConfig();
}

// Razorpay Payment Integration
function payWithRazorpay() {
    const options = {
        key: CONFIG.RAZORPAY_KEY,
        amount: CONFIG.PRICE_INR * 100, // Convert to paise (₹850 = 85000 paise)
        currency: 'INR',
        name: 'HabitOS',
        description: 'Lifetime Access to HabitOS',
        image: 'assets/logo.png',
        handler: function (response) {
            // Payment successful
            console.log('Payment successful:', response);

            // Show success message
            showNotification('Payment successful! Generating your license key...', 'success');

            // Generate license key
            generateLicense(response.razorpay_payment_id, 'razorpay');
        },
        prefill: {
            name: '',
            email: '',
            contact: ''
        },
        notes: {
            product: 'HabitOS Lifetime License'
        },
        theme: {
            color: '#00ffcc'
        },
        modal: {
            ondismiss: function () {
                console.log('Payment cancelled');
            }
        }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
}

// Gumroad Payment Integration
function payWithGumroad() {
    window.open(CONFIG.GUMROAD_URL, '_blank');
    showNotification('Opening Gumroad payment page...', 'info');
}

// Generate License Key
async function generateLicense(paymentId, provider) {
    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/api/license/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'customer@example.com', // This should come from a form
                productId: 'habitos-lifetime',
                paymentId: paymentId,
                paymentProvider: provider,
                amount: provider === 'razorpay' ? 999 : 29,
                currency: provider === 'razorpay' ? 'INR' : 'USD',
                maxDevices: 3
            }),
        });

        const data = await response.json();

        if (data.success) {
            showLicenseModal(data.licenseKey);
        } else {
            showNotification('Error generating license. Please contact support.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error connecting to server. Please contact support.', 'error');
    }
}

// Download App
function downloadApp(platform) {
    const url = CONFIG.DOWNLOAD_URLS[platform];

    // Show notification
    showNotification(`Preparing download for ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`, 'info');

    // Production - actual download
    window.location.href = url;

    // Show trial info after download starts
    setTimeout(() => {
        showTrialInfo();
    }, 2000);
}

// Show License Modal
function showLicenseModal(licenseKey) {
    const modal = document.createElement('div');
    modal.className = 'license-modal';
    modal.innerHTML = `
        <div class="license-modal-content">
            <h2>🎉 Payment Successful!</h2>
            <p>Your license key has been generated:</p>
            <div class="license-key-box">
                <code>${licenseKey}</code>
                <button onclick="copyLicenseKey('${licenseKey}')" class="btn btn-secondary">Copy</button>
            </div>
            <p>This key has also been sent to your email.</p>
            <p><strong>Next Steps:</strong></p>
            <ol style="text-align: left; margin: 20px auto; max-width: 400px;">
                <li>Download HabitOS for your platform</li>
                <li>Install and open the app</li>
                <li>Enter your license key when prompted</li>
                <li>Enjoy lifetime access!</li>
            </ol>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button onclick="downloadApp('windows')" class="btn btn-primary">Download Now</button>
                <button onclick="closeLicenseModal()" class="btn btn-secondary">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Copy License Key
function copyLicenseKey(key) {
    navigator.clipboard.writeText(key).then(() => {
        showNotification('License key copied to clipboard!', 'success');
    });
}

// Close License Modal
function closeLicenseModal() {
    const modal = document.querySelector('.license-modal');
    if (modal) {
        modal.remove();
    }
}

// Show Trial Info
function showTrialInfo() {
    const modal = document.createElement('div');
    modal.className = 'license-modal';
    modal.innerHTML = `
        <div class="license-modal-content">
            <h2>✨ 10-Day Free Trial</h2>
            <p>You're all set! Your download should start automatically.</p>
            <p><strong>What's included in your trial:</strong></p>
            <ul style="text-align: left; margin: 20px auto; max-width: 400px;">
                <li>✅ All features unlocked</li>
                <li>✅ No credit card required</li>
                <li>✅ Full access for 10 days</li>
                <li>✅ Local data storage</li>
            </ul>
            <p>After the trial, you can purchase a lifetime license for ₹999 or $29.</p>
            <button onclick="closeLicenseModal()" class="btn btn-primary">Got it!</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#00ffcc' : type === 'error' ? '#ff4444' : '#4444ff'};
        color: ${type === 'success' ? '#000' : '#fff'};
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for modals and animations
const style = document.createElement('style');
style.textContent = `
    .license-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    }
    
    .license-modal-content {
        background: #1a1a2e;
        padding: 40px;
        border-radius: 20px;
        max-width: 600px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 255, 204, 0.2);
    }
    
    .license-modal-content h2 {
        color: #00ffcc;
        margin-bottom: 20px;
    }
    
    .license-key-box {
        background: rgba(0, 0, 0, 0.3);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }
    
    .license-key-box code {
        font-size: 1.2rem;
        color: #00ffcc;
        font-family: 'Courier New', monospace;
        flex: 1;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('HabitOS Website loaded successfully!');
console.log('Payment integration: Razorpay + Gumroad');
console.log('Download ready for: Windows, macOS, Linux');
