export function isValidImageType(type) {
  return type === 'image/jpeg' || type === 'image/png';
}

export function isValidImageFile(file) {
  if (!file || typeof file !== 'object') return false;
  return isValidImageType(file.type);
}
