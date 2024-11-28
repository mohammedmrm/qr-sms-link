import * as fabric from 'fabric';
import { useCallback, useState } from 'react';

export const useFabricCanvas = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const initialize = useCallback((canvasInstance: fabric.Canvas) => {
    setCanvas(canvasInstance);
  }, []);

  const clearCanvas = () => {
    canvas?.clear();
  };

  return {
    canvas,
    initialize,
    clearCanvas,
  };
};
