import Records from './models';

export default async () => {
  await Records.deleteMany({})
}