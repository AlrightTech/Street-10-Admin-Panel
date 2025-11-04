# 📊 Earnings Overview - Complete Navigation Guide

## 🎯 All 6 Pages in Hierarchy

### Page 1: Earnings Overview Dashboard
**URL:** `http://localhost:3000/transactions/earnings`
**What to see:**
- 📈 4 Summary Cards (Total Earnings, This Month, Pending Balance, Withdrawal)
- 📊 Earnings Trend Chart (scroll down to see)
- 💰 Revenue Breakdown Cards (scroll down to see)
- 🏆 Best Performing Products Table (scroll down to see)
- 🔽 Action Buttons at bottom: "Request Withdrawal" & "Download Report"

**How to scroll:** Use mouse wheel or scrollbar on the right side

---

### Page 2: Request New Withdrawal
**URL:** `http://localhost:3000/transactions/earnings/withdrawals/new`
**What to see:**
- 💳 3 Wallet Balance Cards at top (scroll down for more)
- 📝 Withdrawal Request Form
- 📋 Withdrawal History Table at bottom (scroll down to see)

**How to access:**
- From Page 1: Click green **"Request Withdrawal"** button
- Direct URL: Type `/transactions/earnings/withdrawals/new`

---

### Page 3: Withdrawal History (List)
**URL:** `http://localhost:3000/transactions/earnings/withdrawals`
**What to see:**
- 📊 4 Summary Cards (Total Withdrawn, Pending Amount, Success Rate, Avg Processing)
- 🔍 Filters Bar
- 📋 Withdrawal Requests Table (scroll down for pagination)
- ➕ "New Withdrawal" button (top right)

**How to access:**
- From Page 1: Navigate via URL
- From Page 2: Scroll down to "Withdrawal History" table and click "View" on any row

---

### Page 4: Withdrawal Details (Individual Withdrawal)
**URL:** `http://localhost:3000/transactions/earnings/withdrawals/[id]`

**Test IDs:**
- `WD-2024-001` = **Completed** withdrawal (full details)
- `WD-2024-0156` = **Pending** withdrawal (with cancel button)
- `WD-2024-004` = **Rejected** withdrawal

**Full URLs to test:**
```
http://localhost:3000/transactions/earnings/withdrawals/WD-2024-001
http://localhost:3000/transactions/earnings/withdrawals/WD-2024-0156
http://localhost:3000/transactions/earnings/withdrawals/WD-2024-004
```

**What to see (Completed):**
- ✅ Summary with green "Completed" badge
- 💵 Transaction Information
- ⏱️ Processing Timeline
- 📝 Admin Notes
- 🔽 Action buttons at bottom

**What to see (Pending):**
- ⏳ Yellow "Pending" badge
- 💳 Bank Account Details
- ⚠️ Processing Information (blue box)
- 📝 Vendor & Admin Notes
- ❌ Cancel Request button

**How to access:**
- From Page 3: Click **"View"** on any withdrawal row
- Direct URL: Replace `[id]` with withdrawal ID

---

### Page 5: Product Performance
**URL:** `http://localhost:3000/transactions/earnings/products/[id]`

**Test IDs:** `1`, `2`, or `3`

**Full URLs to test:**
```
http://localhost:3000/transactions/earnings/products/1
http://localhost:3000/transactions/earnings/products/2
http://localhost:3000/transactions/earnings/products/3
```

**What to see (scroll down for all sections):**
- 🎧 Product Card at top
- 📊 4 Key Metrics Cards
- 📈 Sales Trend Chart
- 🌍 Customer Insights (3 cards)
- 📋 Order Breakdown Table
- 📥 Export Button at bottom

**How to access:**
- From Page 1: Click **"View Details"** on any product in "Best Performing Products" table
- Direct URL: Replace `[id]` with product ID (1, 2, or 3)

---

## 🔄 Complete Navigation Flow

```
1. Start Here → Sidebar → "Transactions & Finance" → "Earnings Overview"
   ↓
   PAGE 1: Earnings Overview Dashboard
   ├─ Click "Request Withdrawal" button
   │   ↓
   │   PAGE 2: Request New Withdrawal
   │   └─ Scroll down to see Withdrawal History table
   │
   └─ Click "View Details" on product
       ↓
       PAGE 5: Product Performance
       └─ Click back arrow (←) to return

2. Direct Navigation to Withdrawal History:
   Sidebar → "Earnings Overview" → (or type URL)
   ↓
   Type: /transactions/earnings/withdrawals
   ↓
   PAGE 3: Withdrawal History
   ├─ Click "New Withdrawal" button → PAGE 2
   └─ Click "View" on any withdrawal
       ↓
       PAGE 4: Withdrawal Details
```

---

## 🖱️ How to Scroll (Important!)

1. **Main Content Area:** Scroll with mouse wheel or use scrollbar on RIGHT side
2. **Each Page has Multiple Sections:** Keep scrolling down to see all content
3. **Tables:** Scroll within table if content is wide

---

## 📋 Quick Test Checklist

- [ ] Page 1: See all 4 summary cards at top
- [ ] Page 1: Scroll down to see Earnings Trend Chart
- [ ] Page 1: Scroll more to see Revenue Breakdown
- [ ] Page 1: Scroll to bottom to see Best Performing Products table
- [ ] Page 1: Click "Request Withdrawal" → Goes to Page 2
- [ ] Page 2: Fill form or scroll down to see Withdrawal History
- [ ] Page 3: See withdrawal list and click "View" on any row
- [ ] Page 4: See withdrawal details (try different IDs for different statuses)
- [ ] Page 5: Click "View Details" on product → See product analytics

---

## 🚀 Quick Start Commands

1. Start server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open browser:
   ```
   http://localhost:3000
   ```

3. Navigate:
   - Click Sidebar → "Transactions & Finance" → "Earnings Overview"

4. Test all pages:
   - Use the URLs above or click buttons/links in the interface

---

## 💡 Tips

- **Can't see content?** Scroll down with mouse wheel
- **Content cut off?** Check if you're in full-screen mode (F11)
- **Sidebar blocking?** Click the arrow (←) to collapse it
- **Want to see all at once?** Zoom out (Ctrl + Scroll or Cmd + Scroll)

