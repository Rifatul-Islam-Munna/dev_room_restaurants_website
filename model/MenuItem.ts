
import mongoose, { Document, Model, Schema } from "mongoose";



export interface IMenuItem extends Document {
  name: string;
  subtitle: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  chefsPick: boolean;
  available: boolean;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, "Subtitle is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    chefsPick: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }   
);


MenuItemSchema.index({ category: 1, available: 1 });
MenuItemSchema.index({ chefsPick: 1 });

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;