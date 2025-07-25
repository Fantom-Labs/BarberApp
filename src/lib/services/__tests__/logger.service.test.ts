/**
 * Testes para o serviço de logging
 */

import { logger, LogLevel, configureLogger } from '../logger.service';

describe('Logger Service', () => {
  // Espionar os métodos do console
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('Basic logging', () => {
    it('should log debug messages', () => {
      logger.debug('Test debug message');
      expect(console.debug).toHaveBeenCalled();
    });
    
    it('should log info messages', () => {
      logger.info('Test info message');
      expect(console.info).toHaveBeenCalled();
    });
    
    it('should log warning messages', () => {
      logger.warn('Test warning message');
      expect(console.warn).toHaveBeenCalled();
    });
    
    it('should log error messages', () => {
      logger.error('Test error message');
      expect(console.error).toHaveBeenCalled();
    });
    
    it('should log fatal messages', () => {
      logger.fatal('Test fatal message');
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('Configuration', () => {
    it('should respect minimum log level', () => {
      // Configurar para mostrar apenas erros e fatais
      configureLogger({ minLevel: LogLevel.ERROR });
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
    
    it('should disable console logging when configured', () => {
      configureLogger({ enableConsole: false });
      
      logger.info('This should not be logged');
      
      expect(console.info).not.toHaveBeenCalled();
    });
    
    it('should include context in log messages', () => {
      const context = { userId: '123', action: 'login' };
      logger.info('User action', context);
      
      // Verificar se o contexto foi incluído na mensagem
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining(JSON.stringify(context))
      );
    });
  });
  
  describe('Error handling', () => {
    it('should format error objects correctly', () => {
      const error = new Error('Test error');
      logger.error('An error occurred', error);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Test error')
      );
    });
    
    it('should handle non-Error objects as errors', () => {
      const customError = { code: 500, message: 'Custom error' };
      logger.error('Custom error occurred', customError);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Custom error')
      );
    });
  });
});
