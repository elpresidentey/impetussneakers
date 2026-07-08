# Admin Dashboard - Visual Workflow Diagrams

## 🗺️ Navigation Flow

```
┌─────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD HOME                   │
│                    /admin                           │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌─────────┐    ┌──────────┐    ┌─────────┐
   │Dashboard│    │ Products │    │ Orders  │
   │  View   │    │   View   │    │  View   │
   └─────────┘    └──────────┘    └─────────┘
                        │
            ┌───────────┼───────────┐
            ▼                       ▼
    ┌──────────────┐        ┌──────────────┐
    │ Add Product  │        │ Edit Product │
    │  (4 Steps)   │        │  (4 Steps)   │
    └──────────────┘        └──────────────┘
```

---

## 📝 Product CRUD Workflow

### CREATE (Add Product)
```
START: Products View
    │
    ▼
Click "Add Product" Button
    │
    ▼
┌─────────────────────────────┐
│  STEP 1: Basic Information  │
├─────────────────────────────┤
│ • Product Name              │
│ • Description               │
│ • Price                     │
│                             │
│ [Next Step] →               │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  STEP 2: Product Images     │
├─────────────────────────────┤
│ • Image URL                 │
│ • Alt Text                  │
│ • 📸 Live Preview           │
│                             │
│ [Next Step] →               │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  STEP 3: Product Variants   │
├─────────────────────────────┤
│ • Sizes (7, 8, 9...)        │
│ • Colors (#000000...)       │
│ • Rating (★★★★☆)            │
│                             │
│ [Next Step] →               │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  STEP 4: Stock & Category   │
├─────────────────────────────┤
│ • Category                  │
│ • Stock Quantity            │
│ • In Stock Toggle           │
│                             │
│ [Add Product] →             │
└─────────────────────────────┘
    │
    ▼
✅ Product Created!
    │
    ▼
Return to Products View
    │
    ▼
🎉 See new product in grid
```

### READ (View Products)
```
START: Products View
    │
    ▼
┌─────────────────────────────┐
│   Product Grid Layout       │
├─────────────────────────────┤
│  🔍 Search Bar              │
│                             │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 📦  │ │ 📦  │ │ 📦  │   │
│  │Prod1│ │Prod2│ │Prod3│   │
│  │ $$$$ │ │ $$$$ │ │ $$$$ │   │
│  │[Edit]│ │[Edit]│ │[Edit]│   │
│  │[Del]│ │[Del]│ │[Del]│   │
│  └─────┘ └─────┘ └─────┘   │
│                             │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 📦  │ │ 📦  │ │ 📦  │   │
│  │More │ │More │ │More │   │
│  └─────┘ └─────┘ └─────┘   │
└─────────────────────────────┘
    │
    ├─ Type in Search → Filter Results
    ├─ Click Product → View Details
    ├─ Click Edit → Update Flow
    └─ Click Delete → Delete Flow
```

### UPDATE (Edit Product)
```
START: Products View
    │
    ▼
Click "Edit" on Product Card
    │
    ▼
┌─────────────────────────────┐
│  Edit Product Form          │
├─────────────────────────────┤
│ ✅ Pre-filled with data     │
│                             │
│ Same 4-step form as Create  │
│ (all fields editable)       │
│                             │
│ [Update Product] →          │
└─────────────────────────────┘
    │
    ▼
✅ Product Updated!
    │
    ▼
Return to Products View
    │
    ▼
🎉 See updated product
```

### DELETE (Remove Product)
```
START: Products View
    │
    ▼
Click "🗑️" (Delete) on Product Card
    │
    ▼
┌─────────────────────────────┐
│   Confirmation Dialog       │
├─────────────────────────────┤
│  ⚠️  Are you sure?          │
│                             │
│  This cannot be undone!     │
│                             │
│  [Cancel]  [Confirm Delete] │
└─────────────────────────────┘
    │
    ├─ Cancel → Return to Products View
    │
    ▼
  Confirm
    │
    ▼
API Call: DELETE /api/products/[id]
    │
    ▼
✅ Product Deleted!
    │
    ▼
Product removed from grid
    │
    ▼
🎉 Stats updated
```

---

## 🛒 Order Management Workflow

```
START: Orders View
    │
    ▼
┌─────────────────────────────────────────┐
│          Orders Table                   │
├─────────────────────────────────────────┤
│  Filter: [All Status ▼]                 │
│                                         │
│  Order ID | Customer | Amount | Status  │
│  ─────────┼──────────┼────────┼─────── │
│  #12345   | John Doe | ₦50K   | [▼]    │
│  #12346   | Jane S.  | ₦75K   | [▼]    │
│  #12347   | Bob M.   | ₦30K   | [▼]    │
└─────────────────────────────────────────┘
    │
    ├─ Select Filter → Show matching orders
    │
    └─ Change Status Dropdown
           │
           ▼
       API Update
           │
           ▼
       ✅ Status Updated!
           │
           ▼
       🎉 Notification shown
```

---

## 📊 Dashboard View Layout

```
┌────────────────────────────────────────────────────┐
│                  HEADER                            │
│  🏠 Home | 📊 Dashboard | 📦 Products | 🛒 Orders │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│              STATISTICS CARDS                      │
├────────┬────────┬────────┬─────────────────────────┤
│ 🛒     │ 💵     │ 📦     │ 👥                      │
│ Orders │ Revenue│Products│ Users                   │
│  125   │ ₦2.5M │  450   │  1,200                  │
└────────┴────────┴────────┴─────────────────────────┘
┌────────────────────────────────────────────────────┐
│            QUICK ACTIONS                           │
├────────┬────────┬────────────────────────────────┤
│ ➕ Add │📦 View │🛒 View                         │
│Product │Products│Orders                          │
└────────┴────────┴────────────────────────────────┘
┌────────────────────┬──────────────────────────────┐
│  RECENT ORDERS     │  RECENT PRODUCTS             │
├────────────────────┼──────────────────────────────┤
│ • Order #12345     │ • Air Jordan 11 (₦320K)      │
│   ₦50,000          │   ✅ In Stock                 │
├────────────────────┼──────────────────────────────┤
│ • Order #12346     │ • Nike Air Max (₦185K)       │
│   ₦75,000          │   ✅ In Stock                 │
├────────────────────┼──────────────────────────────┤
│ • Order #12347     │ • Adidas Samba (₦95K)        │
│   ₦30,000          │   ❌ Out of Stock             │
└────────────────────┴──────────────────────────────┘
```

---

## 🔄 State Flow Diagram

```
┌────────────────────────────────────────┐
│         Application State              │
└────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ View    │ │ Data    │ │ UI      │
│ Mode    │ │ State   │ │ State   │
└─────────┘ └─────────┘ └─────────┘
     │            │            │
     │            │            │
     ▼            ▼            ▼
• dashboard  • products   • loading
• products   • orders     • notification
• orders     • stats      • isSubmitting
• add-product • editingProduct • searchQuery
• edit-product • formStep  • statusFilter
```

---

## 💾 Data Flow

### Creating a Product
```
USER INPUT
    ↓
Form Component
    ↓
Validation
    ↓
handleProductSubmit()
    ↓
Transform Data
    ↓
POST /api/products
    ↓
Supabase Database
    ↓
Response
    ↓
Update Local State
    ↓
Show Notification
    ↓
Navigate to Products View
    ↓
Product Appears in Grid
```

### Loading Dashboard
```
User Navigates to /admin
    ↓
useEffect() Trigger
    ↓
fetchStats()
    ↓
┌──────────────┬─────────────┐
│              │             │
▼              ▼             ▼
GET            GET           GET
/api/orders    /api/products /api/users
│              │             │
▼              ▼             ▼
Calculate      Count         Count
Revenue        Products      Users
│              │             │
└──────────────┴─────────────┘
               │
               ▼
      setStats() Update
               │
               ▼
      Dashboard Renders
               │
               ▼
      Show Stats Cards
```

---

## 🎯 User Journey Map

### Admin Adding First Product

```
1. Login
   └─> Navigate to /admin

2. See Dashboard
   └─> Notice "0 Products"
   └─> See "Add Product" quick action

3. Click "Add Product"
   └─> Redirected to form
   └─> See Step 1 of 4

4. Fill Basic Info
   └─> Enter name, description, price
   └─> Click "Next Step"

5. Add Images
   └─> Enter image URL
   └─> See preview appear
   └─> Enter alt text
   └─> Click "Next Step"

6. Set Variants
   └─> Enter sizes
   └─> See size tags appear
   └─> Enter colors
   └─> See color swatches
   └─> Click "Next Step"

7. Configure Stock
   └─> Select category
   └─> Enter stock quantity
   └─> Check "In Stock"
   └─> Click "Add Product"

8. Success!
   └─> See success notification
   └─> Return to products view
   └─> See product in grid
   └─> Dashboard shows "1 Product"
```

---

## 🔔 Notification Flow

```
Action Triggered
    │
    ├─ Success?
    │   │
    │   ├─ Yes →  showNotification('success', message)
    │   │              │
    │   │              ▼
    │   │          ┌───────────────────┐
    │   │          │ ✅ Success Toast  │
    │   │          │ Green background  │
    │   │          │ Checkmark icon    │
    │   │          └───────────────────┘
    │   │              │
    │   │              ▼
    │   │          Slide in from right
    │   │              │
    │   │              ▼
    │   │          Show for 5 seconds
    │   │              │
    │   │              ▼
    │   │          Auto dismiss
    │   │
    │   └─ No →   showNotification('error', message)
    │                  │
    │                  ▼
    │              ┌───────────────────┐
    │              │ ❌ Error Toast    │
    │              │ Red background    │
    │              │ Alert icon        │
    │              └───────────────────┘
    │                  │
    │                  ▼
    │              Slide in from right
    │                  │
    │                  ▼
    │              Show for 5 seconds
    │                  │
    │                  ▼
    │              Auto dismiss or
    │              manual close
    │
    └─ End
```

---

## 🔐 Authentication Flow

```
User Visits /admin
    │
    ▼
Check if logged in
    │
    ├─ No → Redirect to /auth/login
    │
    └─ Yes
        │
        ▼
    Check if admin
        │
        ├─ No → Redirect to /
        │
        └─ Yes
            │
            ▼
        Show Admin Dashboard
```

---

## 📱 Responsive Layout Changes

### Desktop (> 1024px)
```
┌──────────────────────────────────┐
│           Header                 │
├──────────────────────────────────┤
│                                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │ 📦 │ │ 📦 │ │ 📦 │ │ 📦 │    │ 4 columns
│  └────┘ └────┘ └────┘ └────┘    │
│                                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │ 📦 │ │ 📦 │ │ 📦 │ │ 📦 │    │
│  └────┘ └────┘ └────┘ └────┘    │
│                                  │
└──────────────────────────────────┘
```

### Tablet (640px - 1024px)
```
┌──────────────────────────────┐
│         Header               │
├──────────────────────────────┤
│                              │
│  ┌────────┐ ┌────────┐       │
│  │  📦    │ │  📦    │       │ 2 columns
│  └────────┘ └────────┘       │
│                              │
│  ┌────────┐ ┌────────┐       │
│  │  📦    │ │  📦    │       │
│  └────────┘ └────────┘       │
│                              │
└──────────────────────────────┘
```

### Mobile (< 640px)
```
┌──────────────┐
│   Header     │
├──────────────┤
│              │
│  ┌────────┐  │
│  │  📦    │  │ 1 column
│  │        │  │
│  └────────┘  │
│              │
│  ┌────────┐  │
│  │  📦    │  │
│  │        │  │
│  └────────┘  │
│              │
└──────────────┘
```

---

## 🎨 Component Hierarchy

```
AdminPage
├── Header
│   ├── HomeButton
│   ├── Title
│   └── Navigation
│       ├── DashboardTab
│       ├── ProductsTab
│       └── OrdersTab
│
├── NotificationToast
│   ├── Icon (Success/Error)
│   ├── Message
│   └── CloseButton
│
└── ViewRouter
    ├── DashboardView
    │   ├── StatsGrid
    │   │   ├── OrdersCard
    │   │   ├── RevenueCard
    │   │   ├── ProductsCard
    │   │   └── UsersCard
    │   ├── QuickActions
    │   │   ├── AddProductButton
    │   │   ├── ViewProductsButton
    │   │   └── ViewOrdersButton
    │   └── RecentActivity
    │       ├── RecentOrders
    │       └── RecentProducts
    │
    ├── ProductsView
    │   ├── Header
    │   │   ├── SearchBar
    │   │   └── AddProductButton
    │   └── ProductGrid
    │       └── ProductCard[]
    │           ├── ProductImage
    │           ├── ProductInfo
    │           ├── EditButton
    │           └── DeleteButton
    │
    ├── AddEditProductView
    │   ├── BackButton
    │   └── AdminProductForm
    │       ├── ProgressSteps
    │       ├── FormSteps
    │       │   ├── Step1: BasicInfo
    │       │   ├── Step2: Images
    │       │   ├── Step3: Variants
    │       │   └── Step4: Stock
    │       ├── Navigation
    │       │   ├── PreviousButton
    │       │   └── Next/SubmitButton
    │       └── PreviewSidebar (optional)
    │
    └── OrdersView
        ├── Header
        │   ├── Title
        │   └── StatusFilter
        └── OrdersTable
            └── OrderRow[]
                ├── OrderID
                ├── Customer
                ├── Amount
                ├── Date
                └── StatusDropdown
```

---

This visual guide provides a clear understanding of how the admin dashboard flows, how data moves through the system, and how users interact with each feature! 🎯
