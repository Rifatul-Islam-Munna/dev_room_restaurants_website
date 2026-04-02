
import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

export const ORDER_STATUS = [
  "Pending",
  "Preparing",
  "Serving",
  "Completed",
  "Cancelled",
] as const;

export const PAYMENT_METHODS = [
  "Cash on Delivery",
  "Card",
  "Online",
] as const;

export const PAYMENT_STATUS = ["pending", "paid", "failed"] as const;

export const DELIVERY_TYPES = ["delivery", "takeout", "table"] as const;

const OrderItemSchema = new Schema(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    customer: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        index: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    delivery: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      area: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
        default: "Dhaka",
      },
      postalCode: {
        type: String,
        required: true,
        trim: true,
      },
      notes: {
        type: String,
        trim: true,
        default: "",
      },
      type: {
        type: String,
        enum: DELIVERY_TYPES,
        required: true,
        default: "delivery",
      },
      tableNumber: {
        type: String,
        trim: true,
        default: "",
      },
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (value: unknown[]) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Order must contain at least one item.",
      },
    },

    itemCount: {
      type: Number,
      required: true,
      min: 1,
    },

    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      taxRate: {
        type: Number,
        required: true,
        min: 0,
        default: 0.05,
      },
      taxAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      deliveryFee: {
        type: Number,
        required: true,
        min: 0,
        default: 50,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    status: {
      type: String,
      enum: ORDER_STATUS,
      required: true,
      default: "Pending",
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    estimatedDeliveryTime: {
      type: String,
      trim: true,
      default: "30-45 minutes",
    },

    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
      default: "Cash on Delivery",
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
      required: true,
      default: "paid",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    versionKey: false,
  },
);



export type OrderDocument = InferSchemaType<typeof OrderSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Order = models.Order || model("Order", OrderSchema);

export default Order;
