import mongoose from 'mongoose';

const recordsSchema = mongoose.Schema({
  name: { type: String, required: 'El nombre del archivo es obligatorio' },
  file: { type: String, required: 'Sucedió un error al subir la grabación' },
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