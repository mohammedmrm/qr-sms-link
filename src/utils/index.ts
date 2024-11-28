import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { md5 } from 'js-md5';

import * as fabric from 'fabric';
import { STROKE_WIDTH } from './constant';

export const formatDate = (date: Date | number, formatDate: string = 'PPp', locale: Locale = it) => {
  return format(date, formatDate, {
    locale: locale,
  });
};

export async function fakePromiseResolove<T>(data: T, delay: number = 1000): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}
export const getImgMeta = async (url: string) => {
  const img = new Image();
  img.src = url;
  await img.decode();
  return img;
};

export function drawRect<T>(options: {
  rect: Partial<fabric.RectProps>;
  text?: Partial<fabric.TextProps>;
  data: T & { box_id: number | string; title: string | number };
  factor?: number;
}): fabric.Group {
  const { rect, text, data, factor } = options;
  let rectPosition = {};
  let textPosition = {};
  if (factor) {
    rectPosition = {
      left: (rect.left || 0) * factor,
      top: (rect.top || 0) * factor,
      scaleX: factor,
      scaleY: factor,
      strokeWidth: STROKE_WIDTH * factor,
    };
    if (text)
      textPosition = {
        left: (text.left || 0) * factor,
        top: (text.top || 0) * factor,
        scaleX: factor,
        scaleY: factor,
      };
  }
  // Create rectangle
  const rectElement = new fabric.Rect({
    ...rect,
    stroke: hashColor(data.box_id),
    strokeUniform: true,
    fill: '#00000000',
    //strokeDashOffset: STROKE_WIDTH,
    ...rectPosition,
  });

  // Create text
  let textElement: fabric.FabricText = new fabric.FabricText(String(data.title));
  if (text) {
    textElement = new fabric.FabricText(String(data.title), {
      ...text,
      backgroundColor: hashColor(data.box_id),
      strokeUniform: true,
      fontSize: 20,
      ...textPosition,
    });
    textElement.top = textElement.top - textElement.getBoundingRect().height;
  }
  // Combine into a group
  const group = new fabric.Group(text ? [rectElement, textElement] : [rectElement], {
    transparentCorners: false,
    cornerColor: 'red',
    cornerStrokeColor: 'red',
    borderColor: 'white',
    cornerStyle: 'circle',
    cornerSize: 10,
    lockRotation: true,
  });
  group.set('data', data);
  return group;
}

export function hashColor(string: string | number, saturation = 30, lightness = 35) {
  let hash = 0;
  const str = md5(String(string));
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 6) - hash);
  }
  return `hsl(${hash % 360}, ${70 + (hash % saturation)}%, ${lightness}%)`;
}
