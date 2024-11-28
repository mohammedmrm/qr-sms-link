//@ts-expect-error
import QRious from 'qrious';
import React, { useState } from 'react';

const SmsQrGenerator: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('222');
  const [phone, setPhone] = useState('07728362857');
  const [price, setPrice] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  // Generate QR code
  const generateQRCode = () => {
    if (!phoneNumber) return; // Don't generate if phone number is empty

    const qr = new QRious({
      value: `sms:${phoneNumber}?body=${encodeURIComponent(`${price},${phone}`)}`,
      size: 256, // size of the QR code
    });

    setQrCodeDataUrl(qr.toDataURL()); // Get the QR code data URL
  };

  // Download the QR code as an image
  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `donate-${price}-to-${phone}.png`;
    link.click();
  };

  return (
    <div className="p-5">
      <h2>SMS QR Code Generator</h2>
      <div className="sms-qr-generator flex">
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border p-2 m-2"
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone Donate to"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 m-2"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 m-2"
          />
        </div>
      </div>
      <button onClick={generateQRCode} className="bg-blue-500 text-white p-2 rounded">
        Generate QR Code
      </button>

      {qrCodeDataUrl && (
        <div>
          <img src={qrCodeDataUrl} alt="SMS QR Code" className="mt-4" />
          <p>
            تبرع ب{price} الى {phone}
          </p>
          <button onClick={downloadQRCode} className="bg-green-500 text-white p-2 mt-2 rounded">
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default SmsQrGenerator;
