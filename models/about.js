import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  content: String
});

export default mongoose.model('About', AboutSchema, 'about');

