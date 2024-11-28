import { Err } from '@/types';
import * as fabric from 'fabric';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

interface FabricCanvasProps {
  onReady?: (canvas: fabric.Canvas) => void; // Callback to provide canvas instance
  className?: string; // Additional styles for the canvas container
  error?: Err | null;
}

const FabricCanvas: React.FC<FabricCanvasProps> = ({ onReady, className, error }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Memoize the callback passed to `onReady` to prevent unnecessary re-renders
  const memoizedOnReady = useCallback(
    (ref: HTMLCanvasElement) => {
      const canvas = new fabric.Canvas(ref);
      const parentElement = canvas.wrapperEl?.parentElement;
      if (parentElement) {
        canvas.width = parentElement.clientWidth;
        canvas.height = parentElement.clientHeight;
      }
      onReady?.(canvas);
      return canvas;
    },
    [onReady]
  );

  // Calculate dynamic styles for the error container once
  const errorClassName = useMemo(() => className || 'w-full h-full p-2', [className]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = memoizedOnReady(canvasRef.current);
      return () => {
        canvas?.dispose();
      };
    }
  }, [memoizedOnReady]);

  if (error) {
    return <div className={errorClassName}>{error.messaggioErrore || error.codiceErrore}</div>;
  }

  return <canvas ref={canvasRef} />;
};

export default FabricCanvas;
