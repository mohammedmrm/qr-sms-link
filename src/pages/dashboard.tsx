import FabricCanvas from '@/components/common/fabricCanvas';
import Loading from '@/components/common/loading';
import LoadingOver from '@/components/common/loadingOver';
import { useFabricCanvas } from '@/contexts/canvas';
import { useMainContext } from '@/contexts/context';
import { useRefState } from '@/hooks/useRefState';
import Layout from '@/layout/Layout';
import { ocrService } from '@/services/resources';
import { BOX, Err, OCR_VALIDATION } from '@/types';
import { drawRect, getImgMeta, hashColor } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import * as fabric from 'fabric';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const Dashboard = () => {
  const [ocr, setOcr] = useState<OCR_VALIDATION>();
  const [loading, setLoading] = useState<boolean>();
  const [ImageLoading, setImageLoading] = useState<boolean>();
  const { errorHandler } = useMainContext();
  const [error, setErr] = useState<Err>();
  const { initialize, canvas } = useFabricCanvas();
  const [factor, setFactor] = useRefState(0);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const isMouseDown = useRef(false);
  let lastPosX = useRef<number>(0);
  let lastPosY = useRef<number>(0);

  const { reset, setValue, getValues, watch } = useForm<OCR_VALIDATION>({
    mode: 'onChange',
    resolver: zodResolver(OCR_VALIDATION),
  });

  useEffect(() => {
    setLoading(true);
    ocrService
      .getOcrToValidate()
      .then(setOcr)
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const loadImage = useCallback(
    (currentPageUrl: string | null) => {
      setErr(undefined);

      if (!currentPageUrl) return;

      if (!canvas) {
        console.error('Canvas not found');
        return;
      }
      setImageLoading(true);
      getImgMeta(currentPageUrl)
        .then((img) => {
          const imgHeight = img.naturalHeight;
          const imgWidth = img.naturalWidth;
          if (imgHeight === 0 || imgWidth === 0) {
            throw new Error('Invalid image dimensions');
          }

          const canvasWidth = canvas.width || 0;
          const canvasHeight = canvas.height || 0;

          const canvasAspect = canvasWidth / canvasHeight;
          const imgAspect = imgWidth / imgHeight;

          if (canvasAspect <= imgAspect) {
            setFactor(canvasWidth / imgWidth);
          } else {
            setFactor(canvasHeight / imgHeight);
          }
          canvas.backgroundImage = new fabric.FabricImage(img, {
            scaleX: factor.current,
            scaleY: factor.current,
            shadow: new fabric.Shadow({
              color: 'grey',
              blur: 80,
            }),
          });
          canvas.requestRenderAll();
        })
        .catch((e) => {
          console.error('Failed to fetch image metadata', e);
          setErr({
            messaggioErrore: "Impossibile caricare l'immagine",
            codiceErrore: 'GD00404',
          });
        })
        .finally(() => setImageLoading(false));
    },
    [canvas]
  );

  const onMouseDown = useCallback(
    (o: any) => {
      if (!canvas) return;
      lastPosX.current = o.e.clientX;
      lastPosY.current = o.e.clientY;
      isMouseDown.current = true;
    },
    [canvas]
  );

  const onMouseMove = useCallback(
    (o: any) => {
      if (!canvas) return;
      if (isMouseDown.current) {
        const deltaX = o.e.clientX - lastPosX.current;
        const deltaY = o.e.clientY - lastPosY.current;
        var vpt = canvas.viewportTransform;
        vpt![4] += deltaX;
        vpt![5] += deltaY;
        canvas.discardActiveObject();
        canvas.getObjects().forEach((o) => o.setCoords());
        canvas.renderAll();
      }
      lastPosX.current = o.e.clientX;
      lastPosY.current = o.e.clientY;
    },
    [canvas]
  );

  function onMouseUp(o: any) {
    isMouseDown.current = false;
  }

  const zoom = useCallback(
    (opt: fabric.TPointerEventInfo<WheelEvent>) => {
      if (!canvas) return;
      var delta = opt.e?.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.9996 ** delta;
      if (zoom > 25) zoom = 24;
      if (zoom < 0.05) zoom = 0.05;
      canvas.zoomToPoint(new fabric.Point({ x: opt.e.offsetX, y: opt.e.offsetY }), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    },
    [canvas]
  );

  const onSelectedBox = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      //@ts-expect-error
      const boxData = activeObject.data as BOX;
      const boxIndex = ocr?.boxes.findIndex((b) => b.box_id === boxData.box_id) ?? -1;

      // Scroll and focus the textarea
      const textarea = textareaRefs.current[boxIndex];
      if (textarea) {
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // use setTimeout to ensure all re-rendres finished then we apply the focus
        setTimeout(() => {
          textarea.focus();
        }, 0);
      }
    }
  };

  useEffect(() => {
    if (factor.current <= 0 || !ocr) return;
    ocr.boxes.forEach((v) => {
      const newg = drawRect<BOX>({
        rect: { ...v },
        data: { ...v, title: v.text || '' },
        factor: factor.current,
      });
      canvas?.add(newg);
    });

    canvas?.requestRenderAll();
  }, [factor.current, ocr, canvas]);

  useEffect(() => {
    if (ocr) {
      loadImage(ocr?.page_url);
      reset(ocr);
    }
  }, [ocr, canvas]);

  useEffect(() => {
    if (!canvas) return;
    canvas.on('mouse:down', (e) => onMouseDown(e));
    canvas.on('mouse:move', (e) => onMouseMove(e));
    canvas.on('mouse:up', (e) => onMouseUp(e));
    canvas.on('mouse:wheel', (e) => zoom(e));
    canvas.on('selection:created', onSelectedBox);
    canvas.on('selection:updated', onSelectedBox);
  }, [canvas]);

  const handleFocus = useCallback(
    (index: number) => () => {
      const box = ocr?.boxes[index];
      if (!canvas || !box) return;

      // @ts-expect-error
      const targetObject = canvas.getObjects().find((obj) => obj.data && obj.data.box_id === box.box_id);

      if (targetObject) {
        canvas.setActiveObject(targetObject);

        // Get the object's center point in canvas coordinates
        const objectCenter = targetObject.getCenterPoint();

        // Zoom level to focus (adjust as needed)
        const zoomLevel = 3;

        // Set zoom and calculate canvas viewport adjustment
        canvas.zoomToPoint(objectCenter, zoomLevel);

        // Calculate new viewport transform to center the object
        const canvasCenter = {
          x: canvas.width! / 2,
          y: canvas.height! / 2,
        };

        const viewportTransform = canvas.viewportTransform!;
        viewportTransform[4] = canvasCenter.x - objectCenter.x * zoomLevel;
        viewportTransform[5] = canvasCenter.y - objectCenter.y * zoomLevel;

        // Apply viewport transform
        canvas.setViewportTransform(viewportTransform);

        // Render all changes
        canvas.renderAll();
      }
    },
    [canvas, ocr]
  );

  const handleTextChange = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setValue(`boxes.${index}.text`, text);
    },
    []
  );

  const handleSubmit = () => {
    console.log(getValues());
  };

  if (loading) return <Loading />;
  return (
    <Layout>
      <div className="flex  h-screen overflow-y-auto">
        {ImageLoading ? <LoadingOver /> : <></>}
        <div className="bg-slate-100 border-2 rounded shadow w-2/3">
          <FabricCanvas error={error} onReady={initialize} />
        </div>
        <div className="flex flex-col justify-between w-1/3 ">
          <div className="grow h-full overflow-auto gap-5 px-5">
            {ocr?.boxes.map((box, index) => (
              <textarea
                key={box.box_id}
                ref={(el) => (textareaRefs.current[index] = el)}
                value={watch(`boxes.${index}.text`) || ''}
                onChange={handleTextChange(index)}
                onFocus={handleFocus(index)} // Add focus handler
                style={{ borderColor: hashColor(box.box_id) }}
                className="w-full border-4  rounded  p-3 bg-slate-100 focus:outline-none focus:shadow-2xl  focus:bg-white"
              />
            ))}
          </div>
          <div className="flex place-content-center p-4 ">
            <button
              onClick={handleSubmit}
              className="bg-orange-600 px-5 py-2 rounded shadow disabled:bg-slate-100 w-full text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
