import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    preferredCategories: [
      {
        type: String,
      },
    ],
    preferredFoodIds: [
      {
        type: Number,
      },
    ],
    favoriteItems: [
      {
        foodId: Number,
        foodName: String,
        category: String,
        orderCount: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
