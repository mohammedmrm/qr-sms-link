import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import LoadingOver from './common/loadingOver';

const QrZain: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('21112');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState(5000);
  const [textBelow, setTextBelow] = useState(`تبرع بـ ${price} دينار الى ${phone}`);
  const [SMSUrl, setSMSUrl] = useState();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const smsString = `${phoneNumber}?&body=${encodeURIComponent(`${phone} ${price}`)}`;
  // Function to shorten the SMS URL using smolurl.com API
  const shortenUrl = async (url: string) => {
    setLoading(true);
    const apiUrl = 'https://smolurl.com/api/links';
    const body = {
      url: `sms://${url}`, // This format mimics the SMS URL structure you're requesting
    };
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        setSMSUrl(data.data.short_url);
        toast.success('Short URL copied');
        return data.data.short_url;
      } else {
        console.error('Error shortening the URL:', data);
        toast.error('Short URL error');

        return url; // If error occurs, return original SMS URL
      }
    } catch (error) {
      console.error('Error shortening the URL:', error);
      toast.error('Short URL error2');

      return url; // If fetch fails, return original SMS URL
    } finally {
      setLoading(false);
    }
  };

  // Generate the SMS string for QR Code

  // Update textBelow when price or phone changes
  useEffect(() => {
    setTextBelow(`تبرع بـ ${price} دينار الى ${phone}`);
  }, [price, phone]);

  // Create an offscreen canvas and add QR code + text
  const generateCanvasWithText = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const qrCodeCanvas = canvasRef.current as HTMLCanvasElement;
    const qrSize = qrCodeCanvas.width;

    // Dimensions for the text and QR code
    const padding = 20;
    const fontSize = 20;
    const textPadding = 10;
    const textHeight = fontSize + textPadding * 2;

    canvas.width = qrSize + padding * 2;
    canvas.height = qrSize + textHeight + padding * 2;

    // Draw background color for the image
    context.fillStyle = '#fff'; // Background color
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR code
    context.drawImage(qrCodeCanvas, padding, padding, qrSize, qrSize);

    // Draw text below the QR code
    context.fillStyle = 'black';
    context.font = `${fontSize}px 'Cairo', sans-serif`; // Use Cairo font
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const textX = canvas.width / 2;
    const textY = qrSize + padding + textPadding + fontSize / 2;

    // Draw the text background (optional for visibility)
    context.fillStyle = 'white';
    context.fillRect(padding, qrSize + padding, canvas.width - padding * 2, textHeight);

    // Draw the text itself
    context.fillStyle = 'black';
    context.fillText(textBelow, textX, textY);

    return canvas;
  };

  // Download the QR code with text as image
  const downloadQRCodeWithText = () => {
    const canvas = generateCanvasWithText();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `donate-${price}-to-${phone}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {loading && <LoadingOver />}
      <h1 className="text-xl font-bold flex place-content-center gap-2 place-items-center">
        SMS link & QR
        <img src={import.meta.env.BASE_URL + '/img/zain.png'} className="h-10" />
      </h1>
      <input
        type="text"
        placeholder="Enter phone number"
        readOnly
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border rounded p-2 w-full"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      />
      <input
        placeholder={'تبرع لـ ' + ' رقم الهاتف '}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border rounded p-2 w-full"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      />
      <input
        placeholder="المبلغ"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border rounded p-2 w-full"
      />
      <input
        type="text"
        placeholder="Text below QR code"
        value={textBelow}
        onChange={(e) => setTextBelow(e.target.value)}
        className="border rounded p-2 w-full"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      />
      {/* QR Code Preview with Appended Text */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <QRCodeCanvas value={smsString} size={256} marginSize={5} ref={canvasRef} />
      </div>
      <p className="text-sm text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
        {textBelow}
      </p>
      <button
        onClick={downloadQRCodeWithText}
        className="bg-blue-500 text-white py-2 px-4 rounded"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        Download QR Code with Text
      </button>
      <div className="flex flex-col items-center space-y-2 mt-4">
        {SMSUrl && (
          <>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
              SMS Link:
            </p>

            <a
              type="text"
              href={SMSUrl}
              className="text-blue-500 underline rounded p-2 w-full text-center"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {SMSUrl}
            </a>
          </>
        )}
        <button
          onClick={() => shortenUrl(smsString)}
          className="bg-green-500 text-white py-2 px-4 rounded"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          Get link
        </button>
      </div>
      <hr className="w-full border-b-2" />
    </div>
  );
};

export default QrZain;
