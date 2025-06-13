
let transactions = [];
let transactionIdCounter = 1;
let currentDiscount = 0;
let appliedPromoCode = '';

const paymentMethodColors = {
    'transfer': 'bg-blue-100 text-blue-800',
    'ewallet': 'bg-purple-100 text-purple-800',
    'credit': 'bg-orange-100 text-orange-800',
    'cash': 'bg-green-100 text-green-800'
};

const paymentMethodNames = {
    'transfer': 'Transfer Bank',
    'ewallet': 'E-Wallet',
    'credit': 'Kartu Kredit',
    'cash': 'Bayar Tunai'
};

// ===== MENDAPATKAN ELEMEN DOM =====
const paymentForm = document.getElementById('paymentForm');
const productSelect = document.getElementById('productSelect');
const quantity = document.getElementById('quantity');
const promoCode = document.getElementById('promoCode');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoMessage = document.getElementById('promoMessage');
const subtotalEl = document.getElementById('subtotal');
const discountEl = document.getElementById('discount');
const discountRow = document.getElementById('discountRow');
const totalAmountEl = document.getElementById('totalAmount');
const transactionList = document.getElementById('transactionList');
const emptyState = document.getElementById('emptyState');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const totalTransactionsEl = document.getElementById('totalTransactions');
const totalRevenueEl = document.getElementById('totalRevenue');
const avgTransactionEl = document.getElementById('avgTransaction');
const paymentModal = document.getElementById('paymentModal');
const paymentDetails = document.getElementById('paymentDetails');
const closeModalBtn = document.getElementById('closeModalBtn');

// ===== DATA PROMO KODE =====
const promoCodes = {
    "DISKON10": {
        type: "percentage",
        discount: 10,
        description: "Potongan 10% untuk semua produk"
    },
    "HEMAT50K": {
        type: "fixed",
        discount: 50000,
        description: "Diskon tetap sebesar Rp 50.000"
    },
    "STUDENT20": {
        type: "percentage",
        discount: 20,
        description: "Diskon 20% khusus pelajar"
    }
};

// ===== FUNGSI UTILITAS =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function getCurrentTime() {
    return new Date().toLocaleString('id-ID', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

function generateTransactionId() {
    return 'TRX' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// ===== FUNGSI KALKULASI =====
function calculateSubtotal() {
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.price) return 0;
    const price = parseInt(selectedOption.dataset.price);
    const qty = parseInt(quantity.value) || 1;
    return price * qty;
}

function calculateDiscount(subtotal, promoData) {
    if (!promoData) return 0;
    return promoData.type === 'percentage'
        ? Math.round(subtotal * promoData.discount / 100)
        : Math.min(promoData.discount, subtotal);
}

function updateTotal() {
    const subtotal = calculateSubtotal();
    const promoData = appliedPromoCode ? promoCodes[appliedPromoCode] : null;
    const discount = calculateDiscount(subtotal, promoData);
    const total = subtotal - discount;

    subtotalEl.textContent = formatCurrency(subtotal);

    if (discount > 0) {
        discountEl.textContent = '-' + formatCurrency(discount);
        discountRow.classList.remove('hidden');
    } else {
        discountRow
