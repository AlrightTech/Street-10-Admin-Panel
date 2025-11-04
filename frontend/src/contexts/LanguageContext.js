'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [translations, setTranslations] = useState({})

  useEffect(() => {
    // Load translations based on language
    if (language === 'ar') {
      setTranslations({
        // Sidebar
        dashboard: 'لوحة التحكم',
        productManagement: 'إدارة المنتجات',
        orders: 'الطلبات',
        transactions: 'المعاملات والمالية',
        transactionHistory: 'سجل المعاملات',
        earningsOverview: 'نظرة عامة على الأرباح',
        analytics: 'التحليلات والتقارير',
        chat: 'الدردشة',
        storeBuilder: 'إعدادات المتجر',
        storeSettings: 'إعدادات المتجر',
        policySettings: 'سياسات المتجر',
        settings: 'الإعدادات',
        welcomeBack: 'مرحباً بعودتك',
        vendor: 'بائع',

        // Header
        search: 'بحث',
        notifications: 'الإشعارات',
        loading: 'جاري تحميل بيانات لوحة التحكم...',
        
        // Dashboard Content
        uncompletedOrders: 'الطلبات غير المكتملة',
        totalOrders: 'إجمالي الطلبات هذا الأسبوع',
        totalRevenue: 'إجمالي الإيرادات',
        pendingPayouts: 'المدفوعات المعلقة',
        recentOrders: 'الطلبات الأخيرة',
        orderId: 'رقم الطلب',
        customer: 'العميل',
        amount: 'المبلغ',
        status: 'الحالة',
        salesPerformance: 'أداء المبيعات',
        ordersStatusBreakdown: 'تفصيل حالة الطلبات',
        bestSellingProducts: 'المنتجات الأكثر مبيعاً',
        productInsights: 'رؤى المنتج',
        lowStock: 'المخزون المنخفض',
        outOfStock: 'نفد المخزون',
        quickAddProduct: 'إضافة منتج سريع',
        customerInsights: 'رؤى العملاء',
        newCustomers: 'العملاء الجدد',
        thisWeek: 'هذا الأسبوع',
        returningRate: 'معدل الإرجاع',
        customerRetention: 'استبقاء العملاء',
        topSellingProducts: 'المنتجات الأكثر مبيعاً',
        sales: 'المبيعات',
        newCustomersTitle: 'العملاء الجدد',
        recentReviews: 'المراجعات الأخيرة',
        viewAll: 'عرض الكل',

        // Customer Insights
        topCustomer: 'أفضل عميل',

        // Status
        completed: 'مكتمل',
        processing: 'قيد المعالجة',
        shipped: 'تم الشحن',
        cancelled: 'ملغي',
        pending: 'قيد الانتظار',
        failed: 'فشل',
        
        // Items
        items: 'عنصر',
        orders: 'الطلبات',

        // Transactions
        transactionType: 'نوع المعاملة',
        earning: 'ربح',
        refund: 'استرداد',
        withdrawal: 'سحب',
        allStatus: 'جميع الحالات',
        searchTransactionId: 'معرف المعاملة أو معرف الطلب',
        applyFilters: 'تطبيق الفلاتر',
        clearFilters: 'مسح الفلاتر',
        totalEarnings: 'إجمالي الأرباح',
        totalTransactions: 'إجمالي المعاملات',
        thisMonth: 'هذا الشهر',
        transactionId: 'معرف المعاملة',
        orderId: 'معرف الطلب',
        type: 'النوع',
        paymentMethod: 'طريقة الدفع',
        date: 'التاريخ',
        action: 'الإجراء',
        view: 'عرض',
        back: 'رجوع',
        next: 'التالي',
        transactionDetails: 'تفاصيل المعاملة',
        transactionSummary: 'ملخص المعاملة',
        linkedOrderId: 'معرف الطلب المرتبط',
        dateTime: 'التاريخ والوقت',
        processingInformation: 'معلومات المعالجة',
        currentStatus: 'الحالة الحالية',
        estimatedSettlement: 'التسوية المتوقعة',
        processingGateway: 'بوابة المعالجة',
        failureReason: 'سبب الفشل',
        adminRemarks: 'ملاحظات المسؤول',
        orderReferenceInfo: 'معلومات الطلب والمرجع',
        productsPurchased: 'المنتجات المشتراة',
        customerName: 'اسم العميل',
        customerEmail: 'بريد العميل',
        paymentBreakdown: 'تفصيل الدفع',
        grossAmount: 'المبلغ الإجمالي',
        platformCommission: 'عمولة المنصة',
        paymentProcessingFee: 'رسوم معالجة الدفع',
        deductions: 'الخصومات',
        netAmountPending: 'صافي المبلغ (معلق)',
        netAmountReceived: 'صافي المبلغ المستلم',
        transactionReference: 'مرجع المعاملة',
        statusTimeline: 'الجدول الزمني للحالة',
        notesRemarks: 'ملاحظات وتعليقات',
        needHelp: 'تحتاج مساعدة؟',
        supportMessage: 'فريق الدعم لدينا هنا لمساعدتك في حل هذه المشكلة وإكمال معاملتك.',
        contactSupport: 'اتصل بالدعم',
        exportTransaction: 'تصدير المعاملة',
        downloadReceipt: 'تحميل الإيصال',
        downloadFailedReport: 'تحميل تقرير الفشل',
        retryTransaction: 'إعادة المحاولة',

        // Earnings Overview
        dailyEarnings: 'الأرباح اليومية',
        earningsTrend: 'اتجاه الأرباح',
        pendingBalance: 'الرصيد المعلق',
        withdrawal: 'السحب',
        ordersRevenue: 'إيرادات الطلبات',
        refundsDeducted: 'المبالغ المسترجعة',
        viewOrders: 'عرض الطلبات',
        viewRefunds: 'عرض الاسترجاعات',
        platformFees: 'رسوم المنصة',
        netEarnings: 'صافي الأرباح',
        afterDeductions: 'بعد الخصومات',
        bestPerformingProducts: 'أفضل المنتجات أداءً',
        viewDetails: 'عرض التفاصيل',
        requestWithdrawal: 'طلب السحب',
        downloadReport: 'تحميل التقرير',
        requestNewWithdrawal: 'طلب سحب جديد',
        currentWalletBalance: 'رصيد المحفظة الحالي',
        totalWithdrawn: 'إجمالي المسحوب',
        withdrawalAmount: 'مبلغ السحب',
        selectMethod: 'اختر الطريقة',
        accountDetails: 'تفاصيل الحساب',
        accountDetailsPlaceholder: 'أدخل تفاصيل الحساب (IBAN، البريد الإلكتروني، رقم الهاتف المحمول إلخ)',
        notesOptional: 'ملاحظات (اختياري)',
        notesPlaceholder: 'أضف أي ملاحظات أو تعليمات إضافية.',
        submitWithdrawalRequest: 'إرسال طلب السحب',
        downloadStatement: 'تحميل الكشف',
        newWithdrawal: 'سحب جديد',
        pendingAmount: 'المبلغ المعلق',
        successRate: 'معدل النجاح',
        avgProcessing: 'متوسط المعالجة',
        withdrawalRequests: 'طلبات السحب',
        requestAmount: 'مبلغ الطلب',
        referenceId: 'رقم المرجع',
        export: 'تصدير',
        withdrawalSummary: 'ملخص السحب',
        withdrawalId: 'رقم السحب',
        totalAmountRequested: 'إجمالي المبلغ المطلوب',
        processingFees: 'رسوم المعالجة',
        requestDate: 'تاريخ الطلب',
        completedDate: 'تاريخ الإكمال',
        netAmountTransferred: 'صافي المبلغ المحول',
        transactionInformation: 'معلومات المعاملة',
        bankName: 'اسم البنك',
        accountHolder: 'صاحب الحساب',
        processingTimeline: 'الجدول الزمني للمعالجة',
        adminNotesRemarks: 'ملاحظات وتعليقات المسؤول',
        requestInformation: 'معلومات الطلب',
        requestedAmount: 'المبلغ المطلوب',
        availableBalance: 'الرصيد المتاح',
        requestDateTime: 'تاريخ ووقت الطلب',
        bankAccountDetails: 'تفاصيل الحساب البنكي',
        accountHolderName: 'اسم صاحب الحساب',
        routingNumber: 'رقم التوجيه',
        processingInformationPending: 'تم إرسال طلب السحب الخاص بك وهو في انتظار موافقة المسؤول. قد تستغرق المعالجة من 3 إلى 5 أيام عمل.',
        notes: 'ملاحظات',
        vendorNote: 'ملاحظة البائع',
        adminNote: 'ملاحظة المسؤول',
        cancelRequest: 'إلغاء الطلب',
        withdrawalRejected: 'تم رفض السحب',
        rejectionReason: 'سبب الرفض',
        exportDetails: 'تصدير التفاصيل',
        productPerformance: 'أداء المنتج',
        productId: 'رقم المنتج',
        totalUnitsSold: 'إجمالي الوحدات المباعة',
        averageOrderValue: 'متوسط قيمة الطلب',
        refundRate: 'معدل الاسترجاع',
        salesTrend: 'اتجاه المبيعات',
        topCustomerLocations: 'أفضل مواقع العملاء',
        repeatPurchaseRate: 'معدل الشراء المتكرر',
        ofCustomersBoughtAgain: 'من العملاء اشتروا مرة أخرى',
        customerRating: 'تقييم العملاء',
        basedOnReviews: 'بناءً على {count} مراجعة',
        orderBreakdown: 'تفصيل الطلب',
        datePurchased: 'تاريخ الشراء',
        quantity: 'الكمية',
        exportProductReport: 'تصدير تقرير المنتج',
        delivered: 'تم التسليم',
        returned: 'تم الإرجاع',
        rejected: 'مرفوض',
        category: 'الفئة',
        product: 'المنتج',
        method: 'الطريقة',
        actions: 'الإجراءات',
        search: 'بحث',
        estimatedCompletion: 'التوقيت المتوقع للإكمال',

        // Products Page
        allProducts: 'جميع المنتجات',
        addProduct: 'إضافة منتج',
        searchProduct: 'بحث عن منتج',
        searchTransactionProducts: 'بحث عن معاملة',
        price: 'السعر',
        stock: 'المخزون',
        active: 'نشط',
        inactive: 'غير نشط',
        all: 'الكل',
        sku: 'رقم المادة',
        sold: 'مباع',
        productInsights: 'رؤى المنتج',
        topSellingProductsTitle: 'أفضل المنتجات مبيعاً',
        newCustomersTitlePage: 'العملاء الجدد',
        recentReviewsTitle: 'المراجعات الأخيرة',
        dashboardAllProducts: 'لوحة التحكم - جميع المنتجات',
        
        // Orders Page
        dashboardOrders: 'لوحة التحكم - الطلبات',
        orderNumber: 'رقم الطلب',
        placedOn: 'تم الطلب في',
        itemsCount: 'العناصر',
        viewDetailsBtn: 'عرض التفاصيل',
        pageOf: 'صفحة {current} من {total}',
        subscription: 'اشتراك',
        orderType: 'طلب',
        refunded: 'تم الاسترجاع',

        // Analytics Submenu
        salesOverview: 'نظرة عامة على المبيعات',
        earningsReport: 'تقرير الأرباح',
        ordersReport: 'تقرير الطلبات',
        customReports: 'تقارير مخصصة',
        
        // Months
        jan: 'يناير',
        feb: 'فبراير',
        mar: 'مارس',
        apr: 'أبريل',
        may: 'مايو',
        jun: 'يونيو',
        jul: 'يوليو',
        aug: 'أغسطس',
        sep: 'سبتمبر',
        oct: 'أكتوبر',
        nov: 'نوفمبر',
        dec: 'ديسمبر',
        
        // Errors
        failedToLoad: 'فشل تحميل بيانات لوحة التحكم',
        
        // Demo product names (notification messages already have translations)
        wirelessHeadphones: 'سماعات لاسلكية',
        phoneCase: 'غلاف الهاتف',
        smartWatch: 'ساعة ذكية',
        
        // Loading
        loadingChart: 'جاري تحميل المخطط...',
        
        // Reviews
        reviewGreatQuality: 'جودة عالية وتوصيل سريع!',
        reviewDescribed: 'المنتج كما هو موضح، سأشتريه مرة أخرى.'
      })
    } else {
      setTranslations({
        // Sidebar
        dashboard: 'Dashboard',
        productManagement: 'Product Management',
        orders: 'Orders',
        transactions: 'Transactions & Finance',
        transactionHistory: 'Transaction History',
        earningsOverview: 'Earnings Overview',
        analytics: 'Analytics & Reports',
        chat: 'Chat',
        storeBuilder: 'Store Setting',
        storeSettings: 'Store Settings',
        policySettings: 'Policy Settings',
        settings: 'Settings',
        welcomeBack: 'Welcome Back',
        vendor: 'Vendor',

        // Header
        search: 'Search',
        notifications: 'Notifications',
        loading: 'Loading dashboard data...',
        
        // Dashboard Content
        uncompletedOrders: 'Uncompleted Orders',
        totalOrders: 'Total Orders This Week',
        totalRevenue: 'Total Revenue',
        pendingPayouts: 'Pending Payouts',
        recentOrders: 'Recent Orders',
        orderId: 'Order ID',
        customer: 'Customer',
        amount: 'Amount',
        status: 'Status',
        salesPerformance: 'Sales Performance',
        ordersStatusBreakdown: 'Orders Status Breakdown',
        bestSellingProducts: 'Best-Selling Products',
        productInsights: 'Product Insights',
        lowStock: 'Low Stock',
        outOfStock: 'Out of Stock',
        quickAddProduct: 'Quick Add Product',
        customerInsights: 'Customer Insights',
        newCustomers: 'New Customers',
        thisWeek: 'this week',
        returningRate: 'Returning Rate',
        customerRetention: 'customer retention',
        topSellingProducts: 'Top Selling Products',
        sales: 'Sales',
        newCustomersTitle: 'New Customers',
        recentReviews: 'Recent Reviews',
        viewAll: 'View All',

        // Customer Insights
        topCustomer: 'Top Customer',

        // Status
        completed: 'Completed',
        processing: 'Processing',
        shipped: 'Shipped',
        cancelled: 'Cancelled',
        pending: 'Pending',
        failed: 'Failed',
        
        // Items
        items: 'items',
        orders: 'Orders',

        // Transactions
        transactionType: 'Transaction Type',
        earning: 'Earning',
        refund: 'Refund',
        withdrawal: 'Withdrawal',
        allStatus: 'All Status',
        searchTransactionId: 'Transaction ID or Order ID',
        applyFilters: 'Apply Filters',
        clearFilters: 'Clear Filters',
        totalEarnings: 'Total Earnings',
        totalTransactions: 'Total Transactions',
        thisMonth: 'This Month',
        transactionId: 'Transaction ID',
        orderId: 'Order ID',
        type: 'Type',
        paymentMethod: 'Payment Method',
        date: 'Date',
        action: 'Action',
        view: 'View',
        back: 'Back',
        next: 'Next',
        transactionDetails: 'Transaction Details',
        transactionSummary: 'Transaction Summary',
        linkedOrderId: 'Linked Order ID',
        dateTime: 'Date & Time',
        processingInformation: 'Processing Information',
        currentStatus: 'Current Status',
        estimatedSettlement: 'Estimated Settlement',
        processingGateway: 'Processing Gateway',
        failureReason: 'Failure Reason',
        adminRemarks: 'Admin Remarks',
        orderReferenceInfo: 'Order & Reference Information',
        productsPurchased: 'Products Purchased',
        customerName: 'Customer Name',
        customerEmail: 'Customer Email',
        paymentBreakdown: 'Payment Breakdown',
        grossAmount: 'Gross Amount',
        platformCommission: 'Platform Commission',
        paymentProcessingFee: 'Payment Processing fee',
        deductions: 'Deductions',
        netAmountPending: 'Net Amount (Pending)',
        netAmountReceived: 'Net Amount Received',
        transactionReference: 'Transaction Reference',
        statusTimeline: 'Status Timeline',
        notesRemarks: 'Notes & Remarks',
        needHelp: 'Need Help?',
        supportMessage: 'Our support team is here to help you resolve this issue and complete your transaction.',
        contactSupport: 'Contact Support',
        exportTransaction: 'Export Transaction',
        downloadReceipt: 'Download Receipt',
        downloadFailedReport: 'Download Failed Report',
        retryTransaction: 'Retry Transaction',

        // Earnings Overview
        dailyEarnings: 'Daily Earnings',
        earningsTrend: 'Earnings Trend',
        pendingBalance: 'Pending Balance',
        withdrawal: 'Withdrawal',
        ordersRevenue: 'Orders Revenue',
        refundsDeducted: 'Refunds Deducted',
        viewOrders: 'View Orders',
        viewRefunds: 'View Refunds',
        platformFees: 'Platform Fees',
        netEarnings: 'Net Earnings',
        afterDeductions: 'After deductions',
        bestPerformingProducts: 'Best Performing Products',
        viewDetails: 'View Details',
        requestWithdrawal: 'Request Withdrawal',
        downloadReport: 'Download Report',
        requestNewWithdrawal: 'Request New Withdrawal',
        currentWalletBalance: 'Current Wallet Balance',
        totalWithdrawn: 'Total Withdrawn',
        withdrawalAmount: 'Withdrawal Amount',
        selectMethod: 'Select Method',
        accountDetails: 'Account Details',
        accountDetailsPlaceholder: 'Enter account details (IBAN, Email, Mobile number etc.)',
        notesOptional: 'Notes (Optional)',
        notesPlaceholder: 'Add any additional notes or instructions.',
        submitWithdrawalRequest: 'Submit Withdrawal Request',
        downloadStatement: 'Download Statement',
        newWithdrawal: 'New Withdrawal',
        pendingAmount: 'Pending Amount',
        successRate: 'Success Rate',
        avgProcessing: 'Avg Processing',
        withdrawalRequests: 'Withdrawal Requests',
        requestAmount: 'Request Amount',
        referenceId: 'Reference ID',
        export: 'Export',
        withdrawalSummary: 'Withdrawal Summary',
        withdrawalId: 'Withdrawal ID',
        totalAmountRequested: 'Total Amount Requested',
        processingFees: 'Processing Fees',
        requestDate: 'Request Date',
        completedDate: 'Completed Date',
        netAmountTransferred: 'Net Amount Transferred',
        transactionInformation: 'Transaction Information',
        bankName: 'Bank Name',
        accountHolder: 'Account Holder',
        processingTimeline: 'Processing Timeline',
        adminNotesRemarks: 'Admin Notes & Remarks',
        requestInformation: 'Request Information',
        requestedAmount: 'Requested Amount',
        availableBalance: 'Available Balance',
        requestDateTime: 'Request Date & Time',
        bankAccountDetails: 'Bank Account Details',
        accountHolderName: 'Account Holder Name',
        routingNumber: 'Routing Number',
        processingInformationPending: 'Your withdrawal request has been submitted and is awaiting admin approval. Processing may take 3-5 business days.',
        notes: 'Notes',
        vendorNote: 'Vendor Note',
        adminNote: 'Admin Note',
        cancelRequest: 'Cancel Request',
        withdrawalRejected: 'Withdrawal Rejected',
        rejectionReason: 'Rejection Reason',
        exportDetails: 'Export Details',
        productPerformance: 'Product Performance',
        productId: 'Product ID',
        totalUnitsSold: 'Total Units Sold',
        averageOrderValue: 'Average Order Value',
        refundRate: 'Refund Rate',
        salesTrend: 'Sales Trend',
        topCustomerLocations: 'Top Customer Locations',
        repeatPurchaseRate: 'Repeat Purchase Rate',
        ofCustomersBoughtAgain: 'of customers bought again',
        customerRating: 'Customer Rating',
        basedOnReviews: 'Based on {count} reviews',
        orderBreakdown: 'Order Breakdown',
        datePurchased: 'Date Purchased',
        quantity: 'Quantity',
        exportProductReport: 'Export Product Report',
        delivered: 'Delivered',
        returned: 'Returned',
        rejected: 'Rejected',
        category: 'Category',
        product: 'Product',
        method: 'Method',
        actions: 'Actions',
        search: 'Search',
        estimatedCompletion: 'Estimated Completion',

        // Products Page
        allProducts: 'All Products',
        addProduct: 'Add Product',
        searchProduct: 'Search Product',
        searchTransactionProducts: 'Search Transaction',
        price: 'Price',
        stock: 'Stock',
        active: 'Active',
        inactive: 'Inactive',
        all: 'All',
        sku: 'SKU',
        sold: 'sold',
        productInsights: 'Product Insights',
        topSellingProductsTitle: 'Top Selling Products',
        newCustomersTitlePage: 'New Customers',
        recentReviewsTitle: 'Recent Reviews',
        dashboardAllProducts: 'Dashboard - All Products',
        
        // Orders Page
        dashboardOrders: 'Dashboard - Orders',
        orderNumber: 'Order #',
        placedOn: 'Placed on',
        itemsCount: 'Items',
        viewDetailsBtn: 'View Details',
        pageOf: 'Page {current} of {total}',
        subscription: 'Subscription',
        orderType: 'Order',
        refunded: 'Refunded',

        // Analytics Submenu
        salesOverview: 'Sales Overview',
        earningsReport: 'Earnings Report',
        ordersReport: 'Orders Report',
        customReports: 'Custom Reports',
        
        // Months
        jan: 'Jan',
        feb: 'Feb',
        mar: 'Mar',
        apr: 'Apr',
        may: 'May',
        jun: 'Jun',
        jul: 'Jul',
        aug: 'Aug',
        sep: 'Sep',
        oct: 'Oct',
        nov: 'Nov',
        dec: 'Dec',
        
        // Errors
        failedToLoad: 'Failed to load dashboard data',
        
        // Demo product names
        wirelessHeadphones: 'Wireless Headphones',
        phoneCase: 'Phone Case',
        smartWatch: 'Smart Watch',
        
        // Loading
        loadingChart: 'Loading chart...',
        
        // Reviews
        reviewGreatQuality: 'Great quality and fast delivery!',
        reviewDescribed: 'Product as described, will buy again.'
      })
    }
  }, [language])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('dashboard_language', lang)
    // Update language attribute only (keep layout as LTR)
    document.documentElement.lang = lang
    // Always keep direction as LTR to preserve layout/grids
    document.documentElement.dir = 'ltr'
  }

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('dashboard_language') || 'en'
    setLanguage(savedLang)
    // Always keep direction as LTR to preserve layout/grids
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = savedLang
  }, [])

  const t = (key) => translations[key] || key

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

