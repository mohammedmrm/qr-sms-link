import QrAsia from './qrAsia';
import QrZain from './qrZain';

const QRS = () => {
  return (
    <div className="flex justify-evenly gap-5 flex-wrap">
      <QrAsia />
      <QrZain />
    </div>
  );
};
export default QRS;
