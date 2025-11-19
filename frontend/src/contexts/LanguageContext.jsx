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
        subAdmin: 'مسؤول فرعي',
        superAdmin: 'المسؤول الرئيسي',

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
        topSellingProductsTitle: 'أفضل المنتجات مبيعاً',
        newCustomersTitlePage: 'العملاء الجدد',
        recentReviewsTitle: 'المراجعات الأخيرة',
        dashboardAllProducts: 'لوحة التحكم - جميع المنتجات',
        editProduct: 'تعديل المنتج',
        productDetails: 'تفاصيل المنتج',
        productTitle: 'عنوان المنتج',
        productDescription: 'وصف المنتج',
        productImages: 'صور المنتج',
        document: 'مستند',
        replace: 'استبدال',
        seoMarketing: 'تحسين محركات البحث والتسويق',
        metaTitle: 'عنوان التعريف',
        metaDescription: 'وصف التعريف',
        productUrlSlug: 'رابط المنتج',
        pricingStock: 'التسعير والمخزون',
        discountPrice: 'سعر الخصم',
        stockQuantity: 'كمية المخزون',
        additionalInformation: 'معلومات إضافية',
        brand: 'العلامة التجارية',
        weight: 'الوزن',
        dimensions: 'الأبعاد',
        variantCombinations: 'تركيبات المتغيرات',
        variant: 'المتغير',
        skuCode: 'رمز SKU',
        image: 'صورة',
        saveChanges: 'حفظ التغييرات',
        condition: 'الحالة',
        confirmDelete: 'تأكيد الحذف',
        deleteProductConfirm: 'هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.',
        deleting: 'جاري الحذف...',
        delete: 'حذف',
        viewProduct: 'عرض المنتج',
        additionalDocuments: 'مستندات إضافية',
        watchVideo: 'مشاهدة الفيديو',
        regularPrice: 'السعر العادي',
        adminActions: 'إجراءات المسؤول',
        deleteProduct: 'حذف المنتج',
        performance: 'الأداء',
        totalViews: 'إجمالي المشاهدات',
        revenue: 'الإيرادات',
        conversionRate: 'معدل التحويل',
        totalSaved: 'إجمالي المحفوظات',
        totalShared: 'إجمالي المشاركات',
        youtubeReview: 'مراجعة يوتيوب',
        
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
        editOrder: 'تعديل الطلب',
        downloadInvoice: 'تحميل الفاتورة',
        cancelOrder: 'إلغاء الطلب',
        issueRefund: 'إصدار استرجاع',
        deleteOrder: 'حذف الطلب',
        orderActions: 'إجراءات الطلب',
        noOrdersFound: 'لم يتم العثور على طلبات',
        searchOrderPlaceholder: 'بحث رقم الطلب',
        filter: 'فلتر',
        
        // Order Details Page
        orderDetails: 'تفاصيل الطلب',
        orderDate: 'تاريخ الطلب',
        totalAmount: 'المبلغ الإجمالي',
        customerInformation: 'معلومات العميل',
        name: 'الاسم',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        shippingAddress: 'عنوان الشحن',
        orderItems: 'عناصر الطلب',
        qty: 'الكمية',
        unitPrice: 'سعر الوحدة',
        subtotal: 'المجموع الفرعي',
        shipping: 'الشحن',
        total: 'الإجمالي',
        paymentInformation: 'معلومات الدفع',
        deliveryInformation: 'معلومات التسليم',
        shippingMethod: 'طريقة الشحن',
        courier: 'شركة الشحن',
        trackingNumber: 'رقم التتبع',
        estDelivery: 'التسليم المتوقع',
        orderTimeline: 'الجدول الزمني للطلب',
        viewReceipt: 'عرض الإيصال',
        addTracking: 'إضافة تتبع',
        updateStatus: 'تحديث الحالة',
        printOrder: 'طباعة الطلب',
        // Order Statuses
        'status.Order Placed': 'تم تقديم الطلب',
        'status.Payment Confirmed': 'تم تأكيد الدفع',
        'status.Processing': 'قيد المعالجة',
        'status.Shipped': 'تم الشحن',
        'status.Delivered': 'تم التسليم',
        'status.Paid': 'مدفوع',
        'status.Pending': 'قيد الانتظار',
        // Order Item Names
        'orderItem.Wireless Bluetooth Headphones': 'سماعات لاسلكية بلوتوث',
        'orderItem.Protective Phone Case': 'غلاف هاتف واقي',
        'orderItem.Wireless Charging Pad': 'لوحة شحن لاسلكية',
        // Delivery Methods
        'delivery.Express Delivery': 'تسليم سريع',
        // Payment Methods
        'payment.VISA': 'فيزا',
        'paymentMethod.Online': 'عبر الإنترنت',
        'paymentMethod.COD': 'الدفع عند الاستلام',
        'paymentMethod.Wallet': 'المحفظة',
        'orderType.Subscription': 'اشتراك',
        'orderType.Order': 'طلب',

        // Analytics Submenu
        salesOverview: 'نظرة عامة على المبيعات',
        earningsReport: 'تقرير الأرباح',
        ordersReport: 'تقرير الطلبات',
        customReports: 'تقارير مخصصة',
        
        // Sales Overview Page
        analyticsReports: 'التحليلات والتقارير',
        trackSalesPerformance: 'تتبع أداء مبيعاتك ورؤى',
        totalSales: 'إجمالي المبيعات',
        refundedOrders: 'الطلبات المسترجعة',
        daily: 'يومي',
        weekly: 'أسبوعي',
        monthly: 'شهري',
        ordersBreakdown: 'تفصيل الطلبات',
        revenueByCategory: 'الإيرادات حسب الفئة',
        recentSales: 'المبيعات الأخيرة',
        insightsHighlights: 'الرؤى والنقاط البارزة',
        weeklyGrowth: 'النمو الأسبوعي',
        newCustomersIncreased: 'زاد العملاء الجدد بنسبة 10% مقارنة بالأسبوع الماضي.',
        topCategory: 'الفئة الأكثر مبيعاً',
        electronicsRemainsTop: 'الإلكترونيات تبقى الفئة الأكثر مبيعاً.',
        peakHours: 'ساعات الذروة',
        mostSalesOccur: 'معظم المبيعات تحدث بين الساعة 2 مساءً و 5 مساءً.',
        improvedRetention: 'تحسن الاحتفاظ بالعملاء بنسبة 5% هذا الشهر.',
        completionRate: 'معدل الإتمام',
        today: 'اليوم',
        excel: 'Excel',
        csv: 'CSV',
        pdf: 'PDF',
        yesterday: 'أمس',
        daysAgo: 'أيام مضت',
        electronics: 'إلكترونيات',
        fashion: 'أزياء',
        homeAppliances: 'الأجهزة المنزلية',
        
        // Earnings Report Page
        monitorRevenuePerformance: 'راقب أداء إيراداتك والرؤى المالية',
        last7Days: 'آخر 7 أيام',
        custom: 'مخصص',
        fromLastMonth: 'من الشهر الماضي',
        awaitingClearance: 'في انتظار التسوية',
        withdrawnAmount: 'المبلغ المسحوب',
        successfullyWithdrawn: 'تم السحب بنجاح',
        ofTotalEarnings: 'من إجمالي الأرباح',
        weeklyEarnings: 'الأرباح الأسبوعية',
        monthlyEarnings: 'الأرباح الشهرية',
        unitsSold: 'الوحدات المباعة',
        earningsByCategory: 'الأرباح حسب الفئة',
        home: 'المنزل',
        averageRevenuePerCustomer: 'متوسط الإيرادات لكل عميل',
        highestSpendingCustomer: 'أعلى عميل إنفاقاً',
        recentTransactions: 'المعاملات الأخيرة',
        
        // Orders Report Page
        deepInsightsOrderVolume: 'رؤى عميقة في حجم الطلبات والأداء ومعدلات التنفيذ',
        completedOrders: 'الطلبات المكتملة',
        pendingOrders: 'الطلبات المعلقة',
        cancelledOrders: 'الطلبات الملغاة',
        orderTrends: 'اتجاهات الطلبات',
        orderFulfillmentRate: 'معدل تنفيذ الطلب',
        fulfillmentRateThisMonth: 'معدل التنفيذ هذا الشهر',
        topCustomers: 'أفضل العملاء',
        totalSpend: 'إجمالي الإنفاق',
        lastOrder: 'آخر طلب',
        refundsReturns: 'الاسترجاعات والإرجاعات',
        totalRefundRequests: 'إجمالي طلبات الاسترجاع',
        approvedRefunds: 'الاسترجاعات المعتمدة',
        refundAmount: 'مبلغ الاسترجاع',
        approvalRate: 'معدل الموافقة',
        orderStatusBreakdown: 'تفصيل حالة الطلب',
        
        // Customer Insights Page
        understandCustomerBase: 'افهم قاعدة عملائك وسلوكياتهم',
        totalCustomers: 'إجمالي العملاء',
        returningCustomers: 'عملاء عائدون',
        retentionRate: 'معدل الاحتفاظ',
        newVsReturningCustomers: 'العملاء الجدد مقابل العائدين',
        customers: 'عملاء',
        geographicDistribution: 'التوزيع الجغرافي',
        recentActivity: 'النشاط الأخير',
        placedOrder: 'قام بطلب',
        newCustomerSignup: 'تسجيل عميل جديد',
        customerFeedback: 'تعليقات العملاء',
        totalReviews: 'إجمالي المراجعات',
        positive: 'إيجابي',
        neutral: 'محايد',
        negative: 'سلبي',
        loyaltyMetrics: 'مقاييس الولاء',
        averageCLV: 'متوسط قيمة عمر العميل',
        topSpender: 'أعلى منفق',
        
        // Custom Reports Page
        generatePersonalizedReports: 'قم بإنشاء تقارير مخصصة للمبيعات والمعاملات والعملاء.',
        createNewReport: 'إنشاء تقرير جديد',
        savedReports: 'التقارير المحفوظة',
        reportName: 'اسم التقرير',
        reportType: 'نوع التقرير',
        createdOn: 'تم الإنشاء في',
        lastRun: 'آخر تشغيل',
        edit: 'تعديل',
        reportBuilder: 'منشئ التقارير',
        selectReportType: 'اختر نوع التقرير',
        inventory: 'المخزون',
        refunds: 'الاسترجاعات',
        dateRange: 'نطاق التاريخ',
        lastMonth: 'الشهر الماضي',
        customRange: 'نطاق مخصص',
        filters: 'الفلاتر',
        allCategories: 'جميع الفئات',
        allPaymentMethods: 'جميع طرق الدفع',
        allRegions: 'جميع المناطق',
        metrics: 'المقاييس',
        discounts: 'الخصومات',
        customerGrowth: 'نمو العملاء',
        visualization: 'التصور',
        table: 'جدول',
        chart: 'مخطط',
        combined: 'مدمج',
        generateReport: 'إنشاء تقرير',
        smartInsights: 'رؤى ذكية',
        salesGrowth: 'نمو المبيعات',
        dataGrew: 'نمت البيانات في كراتشي بنسبة 10% الشهر الماضي مقارنة بلاهور.',
        customerLoyalty: 'ولاء العملاء',
        retainingCustomersGenerated: 'الاحتفاظ بالعملاء ولّد 60% من الإيرادات هذا الشهر.',
        peakHoursOrders: 'ساعات الذروة',
        mostOrdersOccur: 'معظم الطلبات تحدث بين الساعة 2-4 مساءً، في أيام الأسبوع.',
        topProduct: 'أفضل منتج',
        electronicsShowsHigher: 'فئة الإلكترونيات تظهر معدل تحويل أعلى بنسبة 52%.',
        reportPreview: 'معاينة التقرير',
        revenueK: 'الإيرادات (ك)',
        exportOptions: 'خيارات التصدير',
        schedule: 'جدولة',
        
        // Create Custom Report Page
        reportDetails: 'تفاصيل التقرير',
        description: 'الوصف',
        optional: 'اختياري',
        addNotesAboutReport: 'أضف ملاحظات حول هذا التقرير...',
        filtersConditions: 'الفلاتر والشروط',
        productCategory: 'المنتج / الفئة',
        orderStatus: 'حالة الطلب',
        regionCity: 'المنطقة / المدينة',
        metricsSelection: 'اختيار المقاييس',
        netProfit: 'صافي الربح',
        failedTrans: 'المعاملات الفاشلة',
        visualizationOptions: 'خيارات التصور',
        barChart: 'مخطط شريطي',
        lineChart: 'مخطط خطي',
        donutChart: 'مخطط دائري',
        combinedView: 'عرض مدمج',
        dailyRevenueRefunds: 'الإيرادات والاسترجاعات اليومية',
        sampleData: 'بيانات نموذجية',
        totalRefunds: 'إجمالي الاسترجاعات',
        netRevenue: 'صافي الإيرادات',
        runReportNow: 'تشغيل التقرير الآن',
        saveReport: 'حفظ التقرير',
        cancel: 'إلغاء',
        
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
        reviewDescribed: 'المنتج كما هو موضح، سأشتريه مرة أخرى.',
        
        // Sub Admin Dashboard
        assignedTasks: 'المهام المخصصة',
        pendingApprovals: 'الموافقات المعلقة',
        teamPerformance: 'أداء الفريق',
        recentTasks: 'المهام الأخيرة',
        teamActivity: 'نشاط الفريق',
        review: 'مراجعة',
        
        // Select Role Page
        welcomeToMazad: 'مرحباً بك في Street 10',
        selectRoleToContinue: 'يرجى اختيار دورك للمتابعة',
        changeRoleOrContinue: 'قم بتغيير دورك أو المتابعة إلى لوحة التحكم',
        currentRole: 'الدور الحالي',
        fullSystemAccess: 'وصول كامل إلى النظام والإدارة',
        limitedAccess: 'وصول محدود مع إدارة المهام',
        manageProductsOrders: 'إدارة المنتجات والطلبات والمبيعات',
        yourSelectionSaved: 'سيتم حفظ اختيارك للزيارات المستقبلية',
        continueToDashboard: 'المتابعة إلى لوحة التحكم',
        superAdminLabel: 'المسؤول الرئيسي',
        subAdminLabel: 'مسؤول فرعي',
        vendorDashboardLabel: 'لوحة تحكم البائع',
        current: '(الحالي)',
        
        // Sub Admin Users Page
        users: 'المستخدمون',
        subAdminUsers: 'المستخدمون - المسؤول الفرعي',
        addNew: 'إضافة جديد',
        assignRole: 'تعيين دور',
        assignRoleToUsers: 'تعيين دور للمستخدمين',
        selectUsers: 'اختر المستخدمين',
        selectRole: 'اختر الدور',
        assign: 'تعيين',
        roleAssignedSuccessfully: 'تم تعيين الدور بنجاح',
        roleAssignedToUsers: 'تم تعيين الدور {count} للمستخدمين',
        close: 'إغلاق',
        verified: 'متحقق',
        pendingStatus: 'قيد الانتظار',
        biddingWins: 'انتصارات المزايدة',
        interests: 'الاهتمامات',
        noUsersFound: 'لم يتم العثور على مستخدمين',
        showingResults: 'عرض {start} - {end} من {total}',
        previous: 'السابق',
        nextPage: 'التالي',
        marketingAdmin: 'مسؤول التسويق',
        marketingAdminDesc: 'يدير الحملات والمحتوى وتحليلات التسويق.',
        operationAdmin: 'مسؤول العمليات',
        operationAdminDesc: 'يتعامل مع المنتجات والطلبات والمهام التشغيلية.',
        financeAdmin: 'مسؤول المالية',
        financeAdminDesc: 'الوصول إلى التقارير المالية وإدارة الميزانية.',
        supportAdmin: 'مسؤول الدعم',
        supportAdminDesc: 'يدير دعم العملاء وحل التذاكر.',
        
        // Sub Admin Add User Page
        addNewUser: 'إضافة مستخدم جديد',
        basicInfo: 'المعلومات الأساسية',
        roleAssignment: 'تعيين الدور',
        permissionControl: 'التحكم في الصلاحيات',
        fullName: 'الاسم الكامل',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        step: 'الخطوة',
        of: 'من',
        submit: 'إرسال',
        userManagement: 'إدارة المستخدمين',
        orderManagement: 'إدارة الطلبات',
        supportTickets: 'تذاكر الدعم',
        selectAll: 'تحديد الكل',
        viewProducts: 'عرض المنتجات',
        editProducts: 'تعديل المنتجات',
        deleteProducts: 'حذف المنتجات',
        approveProducts: 'الموافقة على المنتجات',
        viewUsers: 'عرض المستخدمين',
        editUsers: 'تعديل المستخدمين',
        deleteUsers: 'حذف المستخدمين',
        manageRoles: 'إدارة الأدوار',
        updateOrderStatus: 'تحديث حالة الطلب',
        manageShipments: 'إدارة الشحنات',
        viewPaymentMethods: 'عرض طرق الدفع',
        viewTickets: 'عرض التذاكر',
        respondTickets: 'الرد على التذاكر',
        assignTickets: 'تعيين التذاكر',
        closeTickets: 'إغلاق التذاكر',
        granted: 'ممنوح',
        permissions: 'الصلاحيات',
        userCreatedSuccessfully: 'تم إنشاء المستخدم بنجاح',
        newUserHasBeenCreated: 'تم إنشاء مستخدم جديد بنجاح في النظام.',
        
        // Sub Admin User Detail Page
        backToUsers: 'العودة إلى المستخدمين',
        userDetails: 'تفاصيل المستخدم',
        emailLabel: 'البريد الإلكتروني',
        username: 'اسم المستخدم',
        statistics: 'الإحصاءات',
        roleAssignedSuccessfullySingle: 'تم تعيين الدور بنجاح',
        roleAssignedToUser: 'تم تعيين الدور للمستخدم بنجاح.',
        
        // Sidebar
        logout: 'تسجيل الخروج',
        hostsProviders: 'المضيفون والمزودون',
        bookings: 'الحجوزات',
        finance: 'المالية',
        marketing: 'التسويق',
        analyticsSubAdmin: 'التحليلات',
        settingsSubAdmin: 'الإعدادات',
        
        // Common labels
        ordersMade: 'الطلبات المقدمة',
        accountStatus: 'حالة الحساب',
        numberOfBiddingWins: 'عدد انتصارات المزايدة',
        searchByNameEmail: 'البحث بالاسم أو البريد الإلكتروني أو اسم المستخدم',
        selectUsersAndAssignRole: 'اختر المستخدمين وقم بتعيين دور لهم. يمكنك اختيار عدة مستخدمين في وقت واحد.',
        success: 'نجاح',
        roleAssignedToUsersCount: 'تم تعيين الدور لـ {count} مستخدم(ين) بنجاح.',
        usersCount: 'مستخدمين',
        
        // Common UI Elements
        publish: 'نشر',
        save: 'حفظ',
        add: 'إضافة',
        new: 'جديد',
        confirm: 'تأكيد',
        yes: 'نعم',
        no: 'لا',
        ok: 'موافق',
        error: 'خطأ',
        warning: 'تحذير',
        info: 'معلومات',
        clear: 'مسح',
        apply: 'تطبيق',
        reset: 'إعادة تعيين',
        update: 'تحديث',
        create: 'إنشاء',
        remove: 'إزالة',
        upload: 'رفع',
        download: 'تحميل',
        print: 'طباعة',
        import: 'استيراد',
        refresh: 'تحديث',
        select: 'اختر',
        deselectAll: 'إلغاء تحديد الكل',
        none: 'لا شيء',
        options: 'الخيارات',
        details: 'التفاصيل',
        more: 'المزيد',
        less: 'أقل',
        show: 'إظهار',
        hide: 'إخفاء',
        expand: 'توسيع',
        collapse: 'طي',
        required: 'مطلوب',
        placeholder: 'أدخل النص...',
        noData: 'لا توجد بيانات',
        noResults: 'لا توجد نتائج',
        notFound: 'غير موجود',
        unauthorized: 'غير مصرح',
        forbidden: 'ممنوع',
        serverError: 'خطأ في الخادم',
        networkError: 'خطأ في الشبكة',
        tryAgain: 'حاول مرة أخرى',
        goBack: 'العودة',
        goHome: 'الذهاب للصفحة الرئيسية',
        
        // Add/Edit Product Page
        addNewProduct: 'إضافة منتج جديد',
        enterProductTitle: 'أدخل عنوان المنتج',
        selectCategory: 'اختر الفئة',
        enterDescription: 'أدخل وصف المنتج',
        productPublished: 'تم نشر المنتج!',
        productSaved: 'تم حفظ المنتج!',
        selectCondition: 'اختر الحالة',
        enterPrice: 'أدخل السعر',
        enterDiscountPrice: 'أدخل سعر الخصم',
        enterStockQuantity: 'أدخل كمية المخزون',
        enterBrand: 'أدخل العلامة التجارية',
        enterWeight: 'أدخل الوزن',
        enterDimensions: 'أدخل الأبعاد',
        enterMetaTitle: 'أدخل عنوان التعريف',
        enterMetaDescription: 'أدخل وصف التعريف',
        enterSlug: 'أدخل رابط المنتج',
        uploadMedia: 'رفع الوسائط',
        dragDropImage: 'اسحب وأفلت للصورة',
        supportFormats: 'يدعم JPG, PNG, WEBP حتى 10MB لكل صورة. الحد الأقصى 10 صور.',
        addAnotherMedia: '+ إضافة وسائط أخرى',
        uploadDoc: 'رفع المستند',
        dragDropDocument: 'اسحب وأفلت للمستند',
        addAnotherDoc: '+ إضافة مستند وعنوان آخر',
        stockStatus: 'حالة المخزون',
        publishProduct: 'نشر المنتج',
        
        // Invoice Page
        invoice: 'فاتورة',
        invoiceNumber: 'رقم الفاتورة',
        invoiceDate: 'تاريخ الفاتورة',
        dueDate: 'تاريخ الاستحقاق',
        from: 'من',
        to: 'إلى',
        tax: 'الضريبة',
        discount: 'الخصم',
        thankYouShopping: 'شكراً لتسوقك معنا!',
        appreciateBusiness: 'نقدر عملك ونأمل أن تستمتع بشرائك.',
        termsConditions: 'الشروط والأحكام',
        paymentDue: 'الدفع مستحق خلال 30 يوماً. قد تترتب رسوم إضافية على المدفوعات المتأخرة. جميع المبيعات نهائية ما لم يُذكر خلاف ذلك.',
        supportContact: 'جهة اتصال الدعم',
        downloadPdf: 'تحميل PDF',
        printInvoice: 'طباعة الفاتورة',
        chargedOn: 'تم التحصيل في',
        endingIn: 'ينتهي بـ',
        paid: 'مدفوع',
        premiumElectronics: 'إلكترونيات وأجهزة متميزة',
        unitedStates: 'الولايات المتحدة',
        
        // Orders List Page
        allOrders: 'جميع الطلبات',
        orderCancelledSuccess: 'تم إلغاء الطلب بنجاح.',
        orderCancelledFailed: 'فشل إلغاء الطلب. يرجى المحاولة مرة أخرى.',
        refundProcessedSuccess: 'تم معالجة الاسترجاع بنجاح.',
        refundProcessedFailed: 'فشل معالجة الاسترجاع. يرجى المحاولة مرة أخرى.',
        orderDeletedSuccess: 'تم حذف الطلب بنجاح.',
        confirmCancelOrder: 'هل أنت متأكد أنك تريد إلغاء هذا الطلب؟',
        confirmRefundOrder: 'هل أنت متأكد أنك تريد استرجاع هذا الطلب؟',
        confirmDeleteOrder: 'هل أنت متأكد أنك تريد حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.',
        online: 'عبر الإنترنت',
        cod: 'الدفع عند الاستلام',
        wallet: 'المحفظة',
        
        // Tracking Page
        orderSummary: 'ملخص الطلب',
        trackingInformation: 'معلومات التتبع',
        deliveryCompany: 'شركة التوصيل',
        deliveryPerson: 'اسم الشخص المسؤول',
        contact: 'معلومات الاتصال',
        estimatedDate: 'التاريخ المتوقع',
        shippingNotes: 'ملاحظات الشحن',
        autoNotifyCustomer: 'إشعار العميل تلقائياً',
        selectDeliveryCompany: 'اختر شركة التوصيل',
        enterDeliveryPerson: 'أدخل اسم الشخص المسؤول',
        enterContact: 'أدخل معلومات الاتصال',
        enterEstimatedDate: 'أدخل التاريخ المتوقع',
        enterShippingNotes: 'أدخل ملاحظات الشحن (اختياري)',
        deliveryCompanyRequired: 'شركة التوصيل مطلوبة',
        deliveryPersonRequired: 'اسم الشخص المسؤول مطلوب',
        contactRequired: 'معلومات الاتصال مطلوبة',
        validPhoneNumber: 'يرجى إدخال رقم هاتف صحيح',
        validDate: 'يرجى إدخال تاريخ صحيح',
        trackingAddedSuccess: 'تم إضافة معلومات التتبع بنجاح!',
        trackingAddedFailed: 'فشل إضافة معلومات التتبع. يرجى المحاولة مرة أخرى.',
        submitTracking: 'إرسال معلومات التتبع',
        customerWillReceiveTracking: 'سيستلم العميل بريداً إلكترونياً ورسالة نصية مع معلومات التتبع',
        backToOrderDetails: 'العودة إلى تفاصيل الطلب',
        addTrackingInformation: 'إضافة معلومات التتبع',
        
        // Product Data Translations
        'product.apple-airpods-pro-2nd-generation.name': 'Apple AirPods Pro (الجيل الثاني)',
        'product.apple-airpods-pro-2nd-generation.category': 'إلكترونيات',
        'product.apple-airpods-pro-2nd-generation.description': 'استمتع بصوت من المستوى التالي مع Apple AirPods Pro (الجيل الثاني). يتميز بـ Spatial Audio المخصص، وعمر بطارية أطول، ورقاقة Apple H2 لتجربة استماع سحرية.',
        'product.apple-airpods-pro-2nd-generation.metaTitle': 'Apple AirPods Pro الجيل الثاني - سماعات لاسلكية متميزة',
        'product.apple-airpods-pro-2nd-generation.metaDescription': 'تسوق Apple AirPods Pro الجيل الثاني مع Spatial Audio المخصص، وإلغاء الضوضاء النشط، وما يصل إلى 6 ساعات من وقت الاستماع.',
        'product.apple-airpods-pro-2nd.name': 'Apple AirPods Pro (الجيل الثاني)',
        'product.premium-t-shirt.name': 'قميص متميز',
        'product.running-shoes.name': 'أحذية جري',
        'product.yoga-mat-pro.name': 'سجادة يوجا برو',
        'product.coffee-mug-set.name': 'مجموعة أكواب قهوة',
        'category.Electronics': 'إلكترونيات',
        'category.Clothing': 'ملابس',
        'category.Sports': 'رياضة',
        'category.Home & Garden': 'المنزل والحديقة',
        'category.Electronic': 'إلكترونيات',
        'condition.Excellent': 'ممتاز',
        'condition.Good': 'جيد',
        'condition.Fair': 'مقبول',
        'condition.Poor': 'ضعيف',
        'brand.Apple': 'Apple',
        
        // Chat Page
        messages: 'الرسائل',
        newMessage: 'رسالة جديدة',
        searchByNameOrderId: 'البحث بالاسم، رقم الطلب',
        support: 'الدعم',
        order: 'الطلب',
        typeMessage: 'اكتب رسالة...',
        quickReplies: 'ردود سريعة',
        attachFile: 'إرفاق ملف',
        send: 'إرسال',
        noConversationSelected: 'اختر محادثة لعرض الرسائل',
        trackingId: 'رقم التتبع',
        viewOrderDetails: 'عرض تفاصيل الطلب',
        country: 'الدولة',
        quickReply1: 'شكراً لك على طلبك!',
        quickReply2: 'تم شحن طلبك بنجاح.',
        quickReply3: 'كيف يمكنني مساعدتك اليوم؟',
        quickReply4: 'نحن هنا للمساعدة!',
        customerInfo: 'معلومات العميل',
        premiumCustomer: 'عميل مميز',
        viewFullOrder: 'عرض الطلب الكامل',
        trackShipment: 'تتبع الشحنة',
        reportIssue: 'الإبلاغ عن مشكلة',
        
        // Settings/Store Page
        storeSetting: 'إعدادات المتجر',
        customizeStorefront: 'تخصيص وإدارة معلومات متجرك',
        help: 'مساعدة',
        saving: 'جاري الحفظ...',
        storeBranding: 'هوية المتجر',
        uploadStoreLogoBanner: 'قم برفع شعار المتجر والبانر لعرض علامتك التجارية',
        storeLogo: 'شعار المتجر',
        storeBanner: 'بانر المتجر',
        clickToUpload: 'انقر للرفع أو اسحب وأفلت',
        pngJpgUpTo1MB: 'PNG، JPG حتى 1MB موصى به 200x200px',
        pngJpgUpTo1MBBanner: 'PNG، JPG حتى 1MB موصى به 1200x400px',
        storeInformation: 'معلومات المتجر',
        provideEssentialDetails: 'قدم التفاصيل الأساسية عن متجرك',
        storeName: 'اسم المتجر',
        storeNameRequired: 'اسم المتجر *',
        enterStoreName: 'أدخل اسم متجرك',
        contactEmail: 'البريد الإلكتروني للاتصال',
        contactEmailRequired: 'البريد الإلكتروني للاتصال *',
        contactPhone: 'هاتف الاتصال',
        storeDescription: 'وصف المتجر / نبذة',
        tellCustomersAboutStore: 'أخبر العملاء عن متجرك ومنتجاتك وما يميزك.',
        maximum500Characters: 'الحد الأقصى 500 حرف',
        storeAddress: 'عنوان المتجر',
        enterCompleteAddress: 'أدخل عنوان متجرك الكامل بما في ذلك الشارع والمدينة والولاية والرمز البريدي.',
        socialMediaLinks: 'روابط وسائل التواصل الاجتماعي',
        connectSocialMedia: 'اربط حساباتك على وسائل التواصل الاجتماعي (اختياري)',
        changesAutoSaved: 'يتم حفظ التغييرات تلقائياً كمسودة. انقر على "حفظ التغييرات" للنشر.',
        deleteMyStore: 'حذف متجري',
        
        // Settings/Policy Page
        manageYourPolicies: 'إدارة السياسات',
        defineAndUpdatePolicies: 'حدّث سياسات متجرك لإعلام العملاء بشأن الشحن والإرجاع والشروط المهمة الأخرى.',
        shippingPolicy: 'سياسة الشحن',
        defineShippingTerms: 'حدّد شروط الشحن وأوقات التسليم والرسوم',
        shippingTermsConditions: 'شروط وأحكام الشحن',
        standardDeliveryTime: 'وقت التسليم القياسي',
        freeShippingThreshold: 'حد الشحن المجاني',
        refundReturnPolicy: 'سياسة الإرجاع والاسترداد',
        setReturnConditions: 'حدّد شروط الإرجاع والاستبدال والاسترداد',
        returnRefundConditions: 'شروط الإرجاع والاسترداد',
        returnWindow: 'نافذة الإرجاع',
        refundProcessingTime: 'وقت معالجة الاسترداد',
        privacyOtherPolicies: 'سياسة الخصوصية والسياسات الأخرى',
        additionalPolicies: 'سياسات إضافية تشمل الخصوصية وشروط الخدمة والسياسات المخصصة',
        privacyPolicy: 'سياسة الخصوصية',
        termsOfService: 'شروط الخدمة',
        customPolicies: 'سياسات مخصصة',
        previewPolicies: 'معاينة السياسات',
        lastUpdated: 'آخر تحديث',
        savePolicies: 'حفظ السياسات',
        
        // Settings/Notifications Page
        dashboardNotifications: 'إشعارات لوحة التحكم',
        payouts: 'المدفوعات',
        systemUpdates: 'تحديثات النظام',
        markAllAsRead: 'وضع علامة مقروءة على الكل',
        clearAll: 'مسح الكل',
        noNotificationsFound: 'لم يتم العثور على إشعارات',
        newOrderReceived: 'تم استلام طلب جديد',
        withdrawalCompleted: 'اكتمل السحب',
        refundPolicyUpdated: 'تم تحديث سياسة الاسترداد',
        orderShipped: 'تم شحن الطلب',
        lowStockAlert: 'تنبيه انخفاض المخزون',
        new5StarReview: 'مراجعة جديدة بخمس نجوم',
        viewOrder: 'عرض الطلب',
        viewTransaction: 'عرض المعاملة',
        viewPolicy: 'عرض السياسة',
        trackPackage: 'تتبع الطرد',
        restockNow: 'إعادة التخزين الآن',
        viewReview: 'عرض المراجعة',
        loadMoreNotifications: 'تحميل المزيد من الإشعارات',
        newOrder: 'طلب جديد',
        payout: 'دفع',
        systemUpdate: 'تحديث النظام',
        orderUpdate: 'تحديث الطلب',
        stockAlert: 'تنبيه المخزون',
        orderDelivered: 'تم تسليم الطلب',
        paymentReceived: 'تم استلام الدفع',
        systemMaintenanceScheduled: 'جدولة صيانة النظام',
        orderOutForDelivery: 'الطلب #10415 جاهز للتسليم',
        productReviewPending: 'مراجعة المنتج معلقة',
        new4StarReview: 'مراجعة جديدة 4 نجوم',
        bulkOrderReceived: 'تم استلام طلب بالجملة',
        monthlyPayoutProcessed: 'تم معالجة الدفع الشهري',
        newFeatureAvailable: 'ميزة جديدة متاحة',
        orderReturned: 'تم إرجاع الطلب #10405',
        inventorySyncCompleted: 'اكتمال مزامنة المخزون',
        storeRatingImproved: 'تحسن تقييم المتجر',
        reviewRequest: 'طلب مراجعة',
        return: 'إرجاع',
        achievement: 'إنجاز',
        orderPlacedBy: 'تم تقديم الطلب #10425 من قبل سارة جونسون. المبلغ الإجمالي: 129.99 دولار',
        withdrawalProcessed: 'تم معالجة طلب السحب الخاص بك بقيمة 560.00 دولار بنجاح إلى حسابك المصرفي المنتهي بـ 4567.',
        refundPolicyUpdatedDesc: 'تم تحديث سياسة الاسترداد الخاصة بك بنجاح. ستدخل السياسة الجديدة حيز التنفيذ فورًا لجميع الطلبات الجديدة.',
        orderShippedDesc: 'تم شحن الطلب #10198 عبر FedEx. رقم التتبع: IZ999AA1234567890. التسليم المتوقع: 28 يناير 2025',
        lowStockDesc: 'المنتج "سماعات بلوتوث لاسلكية" ينفد من المخزون. بقي 3 وحدات فقط. يُرجى التفكير في إعادة التخزين قريبًا.',
        new5StarReviewDesc: 'ترك مايكل ديفيس مراجعة 5 نجوم لـ "حبوب القهوة المميزة": "جودة ممتازة وشحن سريع. أنصح بشدة!"',
        orderDeliveredDesc: 'تم تسليم الطلب #10420 بنجاح إلى جون سميث. أكد العميل الاستلام.',
        paymentReceivedDesc: 'تم استلام دفعة بقيمة 89.50 دولار للطلب #10418. ستكون الأموال متاحة خلال 2-3 أيام عمل.',
        systemMaintenanceDesc: 'ستحدث الصيانة المجدولة في 30 يناير 2025 من الساعة 2:00 صباحًا إلى 4:00 صباحًا بتوقيت شرق الولايات المتحدة. قد تكون بعض الميزات غير متاحة مؤقتًا.',
        orderOutForDeliveryDesc: 'الطلب #10415 جاهز للتسليم. من المتوقع أن يصل اليوم بين الساعة 10:00 صباحًا و 2:00 مساءً.',
        reviewPendingDesc: 'تم إكمال الطلب #10412. ذكّر العميل بترك مراجعة لتحسين تقييم متجرك.',
        new4StarReviewDesc: 'تركت إيميلي ويلسون مراجعة 4 نجوم لـ "مجموعة الشاي العضوي": "منتج رائع، توصيل سريع. سأطلب مرة أخرى!"',
        bulkOrderDesc: 'تم تقديم طلب بالجملة لـ 50 وحدة لـ "حبوب القهوة المميزة" من قبل شركة Corporate Client Inc.',
        monthlyPayoutDesc: 'تم معالجة الدفع الشهري الخاص بك بقيمة 2,450.00 دولار ونقله إلى حسابك المصرفي.',
        newFeatureDesc: 'لقد أضفنا ميزة لوحة تحليلات جديدة. تحقق منها للحصول على رؤى أفضل حول أداء مبيعاتك.',
        orderReturnedDesc: 'تم إرجاع الطلب #10405 من قبل العميل. السبب: العنصر غير كما هو موضح. سيتم معالجة الاسترداد خلال 5-7 أيام عمل.',
        inventorySyncDesc: 'تمت مزامنة المخزون الخاص بك بنجاح مع جميع قنوات البيع. جميع كميات المنتجات محدثة.',
        storeRatingDesc: 'تحسن تقييم متجرك إلى 4.8 نجوم! استمر في العمل الرائع مع خدمة عملاء ممتازة.',
        sendReminder: 'إرسال تذكير',
        exploreFeature: 'استكشاف الميزة',
        viewStatement: 'عرض البيان',
        processRefund: 'معالجة الاسترداد',
        viewInventory: 'عرض المخزون',
        viewRatings: 'عرض التقييمات',
        minutesAgo: 'دقائق مضت',
        dayAgo: 'يوم مضى',
        weekAgo: 'أسبوع مضى',
        weeksAgo: 'أسابيع مضت',
        monthAgo: 'شهر مضى',
        monthsAgo: 'أشهر مضت',
        twoMinutesAgo: 'منذ دقيقتين',
        oneDayAgo: 'منذ يوم واحد',
        fiveDaysAgo: 'منذ 5 أيام',
        oneWeekAgo: 'منذ أسبوع واحد',
        twoWeeksAgo: 'منذ أسبوعين',
        threeWeeksAgo: 'منذ 3 أسابيع',
        fourWeeksAgo: 'منذ 4 أسابيع',
        oneMonthAgo: 'منذ شهر واحد',
        twoMonthsAgo: 'منذ شهرين',
        
        // Settings/Profile Page
        profile: 'الملف الشخصي',
        personalInformation: 'المعلومات الشخصية',
        subVendors: 'البائعون الفرعيون',
        streetAddress: 'عنوان الشارع',
        city: 'المدينة',
        profilePicture: 'صورة الملف الشخصي',
        uploadProfilePicture: 'رفع صورة الملف الشخصي',
        idDocument: 'وثيقة الهوية',
        uploadIdDocument: 'رفع وثيقة الهوية',
        currentPassword: 'كلمة المرور الحالية',
        newPassword: 'كلمة المرور الجديدة',
        changePassword: 'تغيير كلمة المرور',
        addVendor: 'إضافة بائع',
        role: 'الدور',
        noVendorsFound: 'لم يتم العثور على بائعين',
        fullNameRequired: 'الاسم الكامل مطلوب',
        emailRequired: 'البريد الإلكتروني مطلوب',
        invalidEmailFormat: 'تنسيق البريد الإلكتروني غير صحيح',
        phoneRequired: 'رقم الهاتف مطلوب',
        currentPasswordRequired: 'كلمة المرور الحالية مطلوبة',
        newPasswordRequired: 'كلمة المرور الجديدة مطلوبة',
        passwordMinLength: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
        passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
        profileUpdatedSuccess: 'تم تحديث الملف الشخصي بنجاح!',
        passwordChangedSuccess: 'تم تغيير كلمة المرور بنجاح!',
        pleaseSelectValidImage: 'يرجى اختيار ملف صورة صحيح (JPG، PNG، أو GIF)',
        fileSizeMustBeLessThan1MB: 'يجب أن يكون حجم الملف أقل من 1MB',
        pleaseSelectValidFile: 'يرجى اختيار ملف صحيح (PDF، JPG، أو PNG)',
        fileSizeMustBeLessThan10MB: 'يجب أن يكون حجم الملف أقل من 10MB',
        updateProfileDetails: 'قم بتحديث تفاصيل ملفك الشخصي والمعلومات الشخصية',
        changeProfilePicture: 'تغيير صورة الملف الشخصي',
        uploadNew: 'رفع جديد',
        failedToSave: 'فشل حفظ التغييرات. يرجى المحاولة مرة أخرى.',
        confirmDeleteVendor: 'هل أنت متأكد أنك تريد حذف هذا البائع الفرعي؟',
        searchVendors: 'البحث عن البائعين...',
        page: 'صفحة',
        entries: 'إدخالات',
        noDataAvailable: 'لا توجد بيانات متاحة',
        showPassword: 'إظهار كلمة المرور',
        hidePassword: 'إخفاء كلمة المرور',
        addressInformation: 'معلومات العنوان',
        idVerification: 'التحقق من الهوية',
        documentUploaded: 'تم رفع الوثيقة',
        uploadedOn: 'تم الرفع في',
        phoneNumber: 'رقم الهاتف',
        emailAddress: 'عنوان البريد الإلكتروني',
        uploadIdDocumentDescription: 'قم برفع بطاقة الهوية الوطنية أو جواز السفر أو أي هوية حكومية صالحة.',
        chooseFile: 'اختر ملف',
        pendingVerification: 'في انتظار التحقق',
        downloadDocument: 'تحميل الوثيقة',
        updateYourPassword: 'تحديث كلمة المرور',
        enterCurrentPassword: 'أدخل كلمة المرور الحالية',
        enterNewPassword: 'أدخل كلمة المرور الجديدة',
        confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
        savePassword: 'حفظ كلمة المرور',
        settingsProfile: 'إعدادات الملف الشخصي',
        unableToLoadVendors: 'غير قادر على تحميل البائعين في الوقت الحالي.',
        manageSubVendors: 'إدارة البائعين الفرعيين',
        vendorInformation: 'معلومات البائع',
        settingsSavedSuccessfully: 'تم حفظ الإعدادات بنجاح!',
        retry: 'إعادة المحاولة',
        vendorPoliciesAndInformation: 'سياسات ومعلومات البائع',
        manageBusinessInfo: 'إدارة معلومات عملك، وسياسة الشحن، وسياسة الاسترداد، والشروط الأخرى، في مكان واحد.',
        lastSaved: 'آخر حفظ',
        businessInformation: 'معلومات العمل',
        businessEmail: 'البريد الإلكتروني للعمل',
        businessPhone: 'هاتف العمل (اختياري)',
        supportHours: 'ساعات الدعم',
        storeAddressOptional: 'عنوان المتجر (اختياري)',
        describeYourStore: 'اوصف متجرك وخدماتك وعروضك.'
      })
    } else {
      setTranslations({
        // Sidebar

        // Header
        
        // Dashboard Content

        // Customer Insights

        // Status
        
        // Items

        // Transactions

        // Earnings Overview

        // Products Page
        
        // Orders Page
        
        // Order Details Page
        // Order Statuses
        'status.Order Placed': 'Order Placed',
        'status.Payment Confirmed': 'Payment Confirmed',
        'status.Processing': 'Processing',
        'status.Shipped': 'Shipped',
        'status.Delivered': 'Delivered',
        'status.Paid': 'Paid',
        'status.Pending': 'Pending',
        // Order Item Names
        'orderItem.Wireless Bluetooth Headphones': 'Wireless Bluetooth Headphones',
        'orderItem.Protective Phone Case': 'Protective Phone Case',
        'orderItem.Wireless Charging Pad': 'Wireless Charging Pad',
        // Delivery Methods
        'delivery.Express Delivery': 'Express Delivery',
        // Payment Methods
        'payment.VISA': 'VISA',
        'paymentMethod.Online': 'Online',
        'paymentMethod.COD': 'COD',
        'paymentMethod.Wallet': 'Wallet',
        'orderType.Subscription': 'Subscription',
        'orderType.Order': 'Order',

        // Analytics Submenu
        
        // Sales Overview Page
        
        // Earnings Report Page
        
        // Orders Report Page
        
        // Customer Insights Page
        
        // Custom Reports Page
        
        // Create Custom Report Page
        
        // Months
        
        // Errors
        
        // Demo product names
        
        // Loading
        
        // Reviews
        
        // Sub Admin Dashboard
        
        // Select Role Page
        
        // Sub Admin Users Page
        
        // Sub Admin Add User Page
        
        // Sub Admin User Detail Page
        
        // Sidebar
        
        // Common labels
        
        // Common UI Elements
        
        // Add/Edit Product Page
        
        // Invoice Page
        
        // Orders List Page
        
        // Tracking Page
        
        // Product Data Translations (English - keep original)
        'product.apple-airpods-pro-2nd-generation.name': 'Apple AirPods Pro (2nd Generation)',
        'product.apple-airpods-pro-2nd-generation.category': 'Electronics',
        'product.apple-airpods-pro-2nd-generation.description': 'Experience next-level sound with the Apple AirPods Pro (2nd generation). Featuring personalized Spatial Audio, longer battery life, and the Apple H2 chip for a magical listening experience.',
        'product.apple-airpods-pro-2nd-generation.metaTitle': 'Apple AirPods Pro 2nd Gen - Premium Wireless Earbuds',
        'product.apple-airpods-pro-2nd-generation.metaDescription': 'Shop Apple AirPods Pro 2nd Generation with personalized Spatial Audio, Active Noise Cancellation, and up to 6 hours of listening time.',
        'product.apple-airpods-pro-2nd.name': 'Apple AirPods Pro (2nd)',
        'product.premium-t-shirt.name': 'Premium T-Shirt',
        'product.running-shoes.name': 'Running Shoes',
        'product.yoga-mat-pro.name': 'Yoga Mat Pro',
        'product.coffee-mug-set.name': 'Coffee Mug Set',
        'category.Electronics': 'Electronics',
        'category.Clothing': 'Clothing',
        'category.Sports': 'Sports',
        'category.Home & Garden': 'Home & Garden',
        'category.Electronic': 'Electronic',
        'condition.Excellent': 'Excellent',
        'condition.Good': 'Good',
        'condition.Fair': 'Fair',
        'condition.Poor': 'Poor',
        'brand.Apple': 'Apple',
        
        // Chat Page
        
        // Settings/Store Page
        
        // Settings/Policy Page
        
        // Settings/Notifications Page
        
        // Settings/Profile Page
      })
    }
  }, [language])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('dashboard_language', lang)
    // Update language attribute only (keep layout as LTR to preserve sidebar position)
    document.documentElement.lang = lang
    // Always keep direction as LTR to preserve layout/grids and sidebar position
    document.documentElement.dir = 'ltr'
  }

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('dashboard_language') || 'en'
    setLanguage(savedLang)
    // Always keep direction as LTR to preserve layout/grids and sidebar position
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = savedLang
  }, [])

  const t = (key) => translations[key] || key

  // Helper function to automatically translate product data
  // This function automatically translates product fields (name, category, description, etc.)
  // based on the current language. To add translations for new products:
  // 1. Add translations in the format: 'product.{slug}.{field}': 'Translation'
  // 2. For categories: 'category.{CategoryName}': 'Translation'
  // 3. For conditions: 'condition.{Condition}': 'Translation'
  // 4. For brands: 'brand.{BrandName}': 'Translation'
  // The function will automatically apply these translations when language is Arabic
  const translateProduct = (product) => {
    if (!product || language === 'en' || !translations || Object.keys(translations).length === 0) {
      return product
    }

    const translated = { ...product }
    
    // Translate product name based on slug or name
    if (product.slug) {
      const slugKey = `product.${product.slug}.name`
      if (translations[slugKey]) {
        translated.name = translations[slugKey]
      }
    }
    
    // Also try to translate by name if slug translation didn't work
    if (product.name && translated.name === product.name) {
      // Try different variations of the name
      const nameVariations = [
        product.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').replace(/nd/g, '2nd'),
        product.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
        product.name.toLowerCase().replace(/\s+/g, '-'),
        product.name.toLowerCase()
      ]
      
      for (const variation of nameVariations) {
        const nameKey = `product.${variation}.name`
        if (translations[nameKey]) {
          translated.name = translations[nameKey]
          break
        }
      }
    }

    // Translate category
    if (product.category) {
      const categoryKey = `category.${product.category}`
      if (translations[categoryKey]) {
        translated.category = translations[categoryKey]
      }
    }

    // Translate condition
    if (product.condition) {
      const conditionKey = `condition.${product.condition}`
      if (translations[conditionKey]) {
        translated.condition = translations[conditionKey]
      }
    }

    // Translate brand
    if (product.brand) {
      const brandKey = `brand.${product.brand}`
      if (translations[brandKey]) {
        translated.brand = translations[brandKey]
      }
    }

    // Translate description based on slug
    if (product.slug && product.description) {
      const descKey = `product.${product.slug}.description`
      if (translations[descKey]) {
        translated.description = translations[descKey]
      }
    }

    // Translate meta title
    if (product.slug && product.metaTitle) {
      const metaTitleKey = `product.${product.slug}.metaTitle`
      if (translations[metaTitleKey]) {
        translated.metaTitle = translations[metaTitleKey]
      }
    }

    // Translate meta description
    if (product.slug && product.metaDescription) {
      const metaDescKey = `product.${product.slug}.metaDescription`
      if (translations[metaDescKey]) {
        translated.metaDescription = translations[metaDescKey]
      }
    }

    return translated
  }

  // Helper function to automatically translate order data
  // This function automatically translates order fields (statuses, item names, delivery methods, etc.)
  // based on the current language. To add translations for new orders:
  // 1. Add translations in the format: 'status.{StatusName}': 'Translation'
  // 2. For order items: 'orderItem.{ItemName}': 'Translation'
  // 3. For delivery methods: 'delivery.{MethodName}': 'Translation'
  // 4. For payment methods: 'payment.{MethodName}': 'Translation'
  const translateOrder = (order) => {
    if (!order || language === 'en' || !translations || Object.keys(translations).length === 0) {
      return order
    }

    const translated = { ...order }
    
    // Translate payment status
    if (order.payment && order.payment.status) {
      const statusKey = `status.${order.payment.status}`
      if (translations[statusKey]) {
        translated.payment = { ...order.payment, status: translations[statusKey] }
      }
    }

    // Translate delivery method
    if (order.delivery && order.delivery.method) {
      const deliveryKey = `delivery.${order.delivery.method}`
      if (translations[deliveryKey]) {
        translated.delivery = { ...order.delivery, method: translations[deliveryKey] }
      }
    }

    // Translate payment method
    if (order.payment && order.payment.method) {
      const paymentKey = `payment.${order.payment.method}`
      if (translations[paymentKey]) {
        translated.payment = { ...order.payment, method: translations[paymentKey] }
      }
    }

    // Translate payment method from order data
    if (order.paymentMethod) {
      const paymentMethodKey = `paymentMethod.${order.paymentMethod}`
      if (translations[paymentMethodKey]) {
        translated.paymentMethod = translations[paymentMethodKey]
      }
    }

    // Translate order type
    if (order.type) {
      const orderTypeKey = `orderType.${order.type}`
      if (translations[orderTypeKey]) {
        translated.type = translations[orderTypeKey]
      }
    }

    // Translate order items
    if (order.items && Array.isArray(order.items)) {
      translated.items = order.items.map(item => {
        const translatedItem = { ...item }
        if (item.name) {
          const itemKey = `orderItem.${item.name}`
          if (translations[itemKey]) {
            translatedItem.name = translations[itemKey]
          }
        }
        return translatedItem
      })
    }

    // Translate timeline statuses
    if (order.timeline && Array.isArray(order.timeline)) {
      translated.timeline = order.timeline.map(step => {
        const translatedStep = { ...step }
        if (step.status) {
          const statusKey = `status.${step.status}`
          if (translations[statusKey]) {
            translatedStep.status = translations[statusKey]
          }
        }
        return translatedStep
      })
    }

    // Translate order status
    if (order.status) {
      const statusKey = `status.${order.status}`
      if (translations[statusKey]) {
        translated.status = translations[statusKey]
      }
    }

    return translated
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, translateProduct, translateOrder }}>
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

