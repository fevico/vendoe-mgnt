import { v4 as uuidv4 } from 'uuid';

export const generateOrderNumber = (): string => {
  const prefix = 'ORD';
  const uniqueId = uuidv4().split('-')[0]; // Use first 8 characters of UUID
  return `${prefix}-${uniqueId}`;
};