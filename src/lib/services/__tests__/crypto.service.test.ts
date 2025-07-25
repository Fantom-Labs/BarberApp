/**
 * Testes para o serviço de criptografia
 */

import { hashPassword, verifyPassword, generateToken } from '../crypto.service';

describe('Crypto Service', () => {
  describe('hashPassword', () => {
    it('should generate a hash for a password', async () => {
      const password = 'test-password';
      const hash = await hashPassword(password);
      
      // O hash deve ser uma string
      expect(typeof hash).toBe('string');
      
      // O hash não deve ser igual à senha original
      expect(hash).not.toBe(password);
      
      // O hash deve começar com $2a$ ou $2b$ (formato bcrypt)
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
    });
    
    it('should generate different hashes for the same password', async () => {
      const password = 'test-password';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      // Os hashes devem ser diferentes devido ao salt aleatório
      expect(hash1).not.toBe(hash2);
    });
  });
  
  describe('verifyPassword', () => {
    it('should verify a correct password against its hash', async () => {
      const password = 'test-password';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });
    
    it('should reject an incorrect password', async () => {
      const password = 'test-password';
      const wrongPassword = 'wrong-password';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });
  
  describe('generateToken', () => {
    it('should generate a token of the specified length', () => {
      const length = 32;
      const token = generateToken(length);
      
      expect(token.length).toBe(length);
    });
    
    it('should generate a token with default length if not specified', () => {
      const token = generateToken();
      
      // O comprimento padrão é 32
      expect(token.length).toBe(32);
    });
    
    it('should generate different tokens on each call', () => {
      const token1 = generateToken();
      const token2 = generateToken();
      
      expect(token1).not.toBe(token2);
    });
    
    it('should only contain alphanumeric characters', () => {
      const token = generateToken();
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      
      expect(alphanumericRegex.test(token)).toBe(true);
    });
  });
});
