import mongoose from 'mongoose';

// Helper function to map Mongoose _id to a virtual id for frontend compatibility
const toJSONTransform = (doc, ret) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
};

const schemaOptions = {
  toJSON: {
    virtuals: true,
    transform: toJSONTransform
  },
  toObject: {
    virtuals: true,
    transform: toJSONTransform
  }
};

// 1. User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
}, schemaOptions);

// 2. Donor Schema
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  ailments: { type: String, default: 'None' }
}, schemaOptions);

// 3. Request Schema
const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  bloodType: { type: String, required: true },
  category: { type: String, required: true }, // 'Donor' or 'Receiver'
  ailments: { type: String, default: 'None' },
  units: { type: Number, default: 1 },
  status: { type: String, default: 'pending' }, // 'pending', 'approved', 'rejected'
  timestamp: { type: String, required: true },
  userId: { type: String, required: true }
}, schemaOptions);

export const User = mongoose.model('User', userSchema);
export const Donor = mongoose.model('Donor', donorSchema);
export const Request = mongoose.model('Request', requestSchema);
