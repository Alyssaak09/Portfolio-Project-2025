import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  skills: [String]
});

export default mongoose.model('Project', ProjectSchema, 'projects');

