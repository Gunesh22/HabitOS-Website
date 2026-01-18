// HabitOS Website - Payment & Download Integration

// ⚙️ CENTRAL CONFIG
// To change prices or trial period, edit: backend/config.js
// This will be fetched from the backend API on page load

const CONFIG = {
    RAZORPAY_KEY: 'rzp_live_S4eel0vxm9fxDk',

    BACKEND_URL: 'https://habitos-final.onrender.com',
    DOWNLOAD_URLS: {
        windows: 'https://github.com/Gunesh22/HabitOS-Final/releases/latest/download/HabitOS-Setup.zip',
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

        const response = await fetch(`${CONFIG.BACKEND_URL}/api/config`);
        const backendConfig = await response.json();



        // Update prices and trial period from backend
        CONFIG.PRICE_INR = backendConfig.PRICE_INR;
        CONFIG.PRICE_USD = backendConfig.PRICE_USD;
        CONFIG.TRIAL_DAYS = backendConfig.TRIAL_DAYS;

        // Update UI elements that show trial period
        const trialElements = document.querySelectorAll('.trial-days');

        trialElements.forEach(el => {

            el.textContent = `${CONFIG.TRIAL_DAYS} Days`;
        });

        // Update UI elements that show price
        const priceElements = document.querySelectorAll('.price-inr');

        priceElements.forEach(el => {

            el.textContent = `₹${CONFIG.PRICE_INR}`;
            el.style.visibility = 'visible'; // Show price after loading
        });

    } catch (error) {
        // Fail silently or show error UI

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

    loadConfig();
});

// Also try loading immediately in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Still loading, wait for DOMContentLoaded
} else {
    // Already loaded

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

            }
        }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
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
        // Error handling

        showNotification('Error connecting to server. Please contact support.', 'error');
    }
}

// Download App
function downloadApp(platform) {
    const url = CONFIG.DOWNLOAD_URLS[platform];

    // Show notification
    showNotification(`Preparing download for ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`, 'info');

    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = platform === 'windows' ? 'HabitOS-Setup.zip' :
        platform === 'mac' ? 'HabitOS.dmg' : 'HabitOS.AppImage';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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


    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for modals and animations



