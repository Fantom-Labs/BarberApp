"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiRefreshCw } from 'react-icons/fi';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  className?: string;
}

export default function QRCodeScanner({ onScan, className = '' }: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  // Iniciar o scanner de QR code
  const startScanner = async () => {
    setError(null);
    setScanning(true);

    try {
      // Solicitar acesso à câmera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraPermission(true);
        
        // Iniciar o processo de detecção de QR code
        checkVideoFrame();
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
      setCameraPermission(false);
      setScanning(false);
    }
  };

  // Parar o scanner
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setScanning(false);
  };

  // Verificar frames do vídeo para detectar QR codes
  const checkVideoFrame = () => {
    if (!scanning) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Em um ambiente real, aqui usaríamos uma biblioteca como jsQR para detectar o QR code
        // Para esta demonstração, vamos simular a detecção após alguns segundos
        
        // Simulação de detecção de QR code após 3 segundos
        setTimeout(() => {
          if (scanning) {
            // Simular um número de WhatsApp detectado
            const mockWhatsAppData = "5511987654321";
            onScan(mockWhatsAppData);
            stopScanner();
          }
        }, 3000);
      }
    }
    
    // Continuar verificando frames
    if (scanning) {
      requestAnimationFrame(checkVideoFrame);
    }
  };

  // Limpar recursos quando o componente for desmontado
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-full max-w-sm aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {scanning ? (
          <>
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full opacity-0"
            />
            <div className="absolute inset-0 border-2 border-primary z-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary"></div>
            </div>
            <button
              onClick={stopScanner}
              className="absolute bottom-4 right-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md"
            >
              <FiRefreshCw className="h-6 w-6 text-primary" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {error ? (
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={startScanner}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <>
                <FiCamera className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                  Escaneie o QR code do WhatsApp do cliente para iniciar o atendimento
                </p>
                <button
                  onClick={startScanner}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors flex items-center"
                >
                  <FiCamera className="mr-2" /> Iniciar Scanner
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        <p>Posicione o QR code do WhatsApp do cliente dentro da área de escaneamento</p>
      </div>
    </div>
  );
}
