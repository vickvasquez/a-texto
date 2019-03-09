import mongoose from 'mongoose';

const recordsSchema = mongoose.Schema({
  name: { type: String, required: true },
  file: { type: String, required: true },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

recordsSchema.statics.add = async function(data) {
  const response = await this.create(data);

  return response;
}

export default mongoose.model('Records', recordsSchema);