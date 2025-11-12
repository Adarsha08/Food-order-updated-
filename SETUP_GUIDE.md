# Food Order Application - Full Setup Guide

## Project Structure
- `foodorder/` - React Frontend (Vite)
- `foodorder-backend/` - Node.js Express Backend

---

## Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local or MongoDB Atlas Cloud)
- **npm** or **yarn**

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd foodorder-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure MongoDB Connection
Edit `.env` file in the backend folder:

```env
MONGODB_URI=mongodb://localhost:27017/foodorder
PORT=5000
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/foodorder
PORT=5000
```

### 4. Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd foodorder
```

### 2. Install Dependencies (Already Done)
```bash
npm install
```

### 3. Start Frontend Dev Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## How It Works

### Order Flow:
1. **Add Items to Cart** - Users add food items with quantities
2. **View Cart** - Click the cart icon in navbar
3. **Checkout** - Click "Order" button to open checkout form
4. **Fill Details** - Enter name, email, phone, and delivery address
5. **Place Order** - Submit form to save order to MongoDB
6. **View Orders** - Click "Order History" to see all saved orders

### API Endpoints

**Base URL:** `http://localhost:5000/api/orders`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a new order |
| GET | `/` | Get all orders |
| GET | `/:id` | Get specific order by ID |
| PUT | `/:id` | Update order status |
| DELETE | `/:id` | Delete an order |

### Order Data Structure
```json
{
  "userDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St"
  },
  "items": [
    {
      "foodId": "1",
      "foodName": "Pizza",
      "quantity": 2,
      "price": 250,
      "totalPrice": 500
    }
  ],
  "totalAmount": 500,
  "status": "Pending" // Pending, Confirmed, or Delivered
}
```

---

## Features Implemented

✅ Add to Cart with quantity management
✅ Save orders to MongoDB
✅ View all orders in Order History
✅ Order status tracking (Pending, Confirmed, Delivered)
✅ User details capture (name, email, phone, address)
✅ Real-time order display
✅ Toast notifications for user feedback

---

## Important Notes

1. **CORS Enabled** - Frontend can communicate with backend
2. **MongoDB Connection** - Must be running before starting backend
3. **Environment Variables** - Update `.env` file with your MongoDB connection string
4. **Timestamps** - Orders automatically track creation date/time

---

## Running Both Servers Simultaneously

### Option 1: Two Terminal Windows
```bash
# Terminal 1 - Backend
cd foodorder-backend
npm run dev

# Terminal 2 - Frontend
cd foodorder
npm run dev
```

### Option 2: Using npm-run-all (Optional)
Install globally:
```bash
npm install -g npm-run-all
```

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check connection string in `.env` file
- For Atlas, whitelist your IP address

### CORS Error
- Backend is running with CORS enabled
- Frontend API URL points to `http://localhost:5000`

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Vite will prompt for alternate port

---

## Next Steps (Optional Enhancements)

- Add payment integration (Stripe/PayPal)
- User authentication & login
- Admin dashboard to manage orders
- Email notifications for orders
- Order tracking with real-time updates
- File upload for delivery proof

---

**Happy Coding! 🚀**
