export enum UserRole {
  'ADMIN' = 'ADMIN', // Can read and write for all PCs in database
  'READ_ALL' = 'READ_ALL', // Can read for all PCs in database, no writes
  'USER' = 'USER', // Can read and write for PCs with matching uid
  'USER_READ_ALL' = 'USER_READ_ALL' // Can read and write for PCs with matching uid, AND read all PCs in database
}