import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryOrder } from '../types';

interface ScanDOModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScanDOModal: React.FC<ScanDOModalProps> = ({ isOpen, onClose }) => {
  const { addDeliveryOrder, deliveryOrders } = useApp();
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [doNumber, setDoNumber] = useState('DO-9045');
  const [customerName, setCustomerName] = useState('Jaya Grocer · Main Place USJ');
  const [addressText, setAddressText] = useState('GF-01, Main Place Mall, Jalan USJ 21/10');
  const [postcode, setPostcode] = useState('47630');
  const [state, setState] = useState('Subang Jaya, Selangor');
  const [phone, setPhone] = useState('+60 3-8081 7722');
  const [itemsSummary, setItemsSummary] = useState('12 ctns Organic Baby Spinach & Chard');
  const [weightKg, setWeightKg] = useState<number>(65);
  const [windowStart, setWindowStart] = useState('10:00 AM');
  const [windowEnd, setWindowEnd] = useState('12:00 PM');
  const [ocrConfidence, setOcrConfidence] = useState(99.4);
  const [notes, setNotes] = useState('Cold store receiving bay basement 2. Keep 2-4°C.');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateGeminiOCR = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setDoNumber(`DO-90${Math.floor(45 + Math.random() * 50)}`);
      setCustomerName('Village Grocer · Subang Parade');
      setAddressText('LG-18, Subang Parade, Jalan SS16/1');
      setPostcode('47500');
      setState('Subang Jaya, Selangor');
      setPhone('+60 3-5634 9911');
      setItemsSummary('10 cartons Organic Carrots & 5 boxes Fresh Kale');
      setWeightKg(55);
      setOcrConfidence(99.1);
      setNotes('Verify temperature stamp on delivery invoice.');
      setIsProcessing(false);
    }, 700);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check duplicate DO
    const isDup = deliveryOrders.some((d) => d.doNumber.toLowerCase() === doNumber.trim().toLowerCase());
    if (isDup) {
      setDuplicateWarning(`Warning: Delivery Order ${doNumber} already exists in the system.`);
      return;
    }

    // 5-digit Malaysian postcode check
    if (!/^\d{5}$/.test(postcode.trim())) {
      alert('Please enter a valid 5-digit Malaysian postcode (e.g. 47500, 50480).');
      return;
    }

    await addDeliveryOrder({
      doNumber: doNumber.trim(),
      doDate: new Date().toISOString().split('T')[0],
      customerName,
      addressText,
      postcode: postcode.trim(),
      state,
      phone,
      items: [{ product: itemsSummary, qty: 1, unit: 'order' }],
      itemsSummary,
      weightKg,
      promisedDate: new Date().toISOString().split('T')[0],
      windowStart,
      windowEnd,
      status: 'scheduled',
      ocrConfidence,
      notes,
      priority: 'normal',
      lat: 3.0825,
      lng: 101.5862,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-3xl p-6 shadow-2xl border border-[#e5e1e8] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ecf3]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff7f35] text-[24px]">document_scanner</span>
            <div>
              <h2 className="text-lg font-bold text-[#1c1b20]">Upload / Scan Delivery Order (DO)</h2>
              <p className="text-xs text-[#574238]">
                Gemini Vision OCR extraction & 5-digit Malaysian postcode auto-geocoding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0ecf3] flex items-center justify-center text-[#574238] hover:bg-[#ebe7ed]"
          >
            ✕
          </button>
        </div>

        {duplicateWarning && (
          <div className="mt-3 p-3 bg-[#ffdad6] text-[#93000a] text-xs font-semibold rounded-2xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>{duplicateWarning}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Photo & Scanner Column */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="relative rounded-2xl overflow-hidden bg-[#f0ecf3] h-64 border border-[#e5e1e8] flex items-center justify-center">
              <img src={photoUrl} alt="DO Document" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-mono-data text-[10px]">
                OCR Confidence: {ocrConfidence}%
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSimulateGeminiOCR}
                disabled={isProcessing}
                className="flex-1 py-2 px-3 rounded-full bg-[#1c3ae7] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95"
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>{isProcessing ? 'Analyzing Document...' : 'Re-Run Gemini Vision'}</span>
              </button>
              <label className="py-2 px-3 rounded-full bg-[#f0ecf3] text-[#1c1b20] text-xs font-semibold cursor-pointer hover:bg-[#ebe7ed] flex items-center gap-1 border border-[#e5e1e8]">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                <span>Snap New</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPhotoUrl(url);
                      handleSimulateGeminiOCR();
                    }
                  }}
                />
              </label>
            </div>
            <p className="text-[11px] text-[#574238]">
              * Live camera capture supported on mobile browsers. Upload scans directly from SQL Accounting or warehouse receipt printer.
            </p>
          </div>

          {/* Form Fields Column */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label-caps text-[10px] text-[#574238] block mb-1">
                  DO NUMBER
                </label>
                <input
                  type="text"
                  required
                  value={doNumber}
                  onChange={(e) => {
                    setDoNumber(e.target.value);
                    setDuplicateWarning(null);
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-xs font-bold text-[#1c1b20]"
                />
              </div>
              <div>
                <label className="font-label-caps text-[10px] text-[#574238] block mb-1">
                  POSTCODE (5-DIGIT MY)
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-xs font-bold text-[#1c3ae7]"
                />
              </div>
            </div>

            <div>
              <label className="font-label-caps text-[10px] text-[#574238] block mb-1">
                CLIENT / SUPERMARKET OUTLET
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
              />
            </div>

            <div>
              <label className="font-label-caps text-[10px] text-[#574238] block mb-1">
                DELIVERY ADDRESS & STATE
              </label>
              <input
                type="text"
                required
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs text-[#1c1b20]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label-caps text-[10px] text-[#574238] block mb-1">
                  PRODUCE SUMMARY
                </label>
                <input
                  type="text"
                  value={itemsSummary}
                  onChange={(e) => setItemsSummary(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs text-[#1c1b20]"
                />
              </div>
              <div>
                <label className="font-label-caps text-[10px] text-[#574238] block mb-1">
                  WEIGHT (KG)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-xs text-[#1c1b20]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label-caps text-[10px] text-[#574238] block mb-1">
                  PROMISED WINDOW START
                </label>
                <input
                  type="text"
                  value={windowStart}
                  onChange={(e) => setWindowStart(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-xs text-[#1c1b20]"
                />
              </div>
              <div>
                <label className="font-label-caps text-[10px] text-[#574238] block mb-1">
                  PROMISED WINDOW END
                </label>
                <input
                  type="text"
                  value={windowEnd}
                  onChange={(e) => setWindowEnd(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-xs text-[#1c1b20]"
                />
              </div>
            </div>

            <div>
              <label className="font-label-caps text-[10px] text-[#574238] block mb-1">
                DISPATCH REMARKS / COLD CHAIN NOTES
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs text-[#1c1b20]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-[#e5e1e8] text-xs font-semibold text-[#574238] hover:bg-[#f6f2f9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#ff7f35] text-white text-xs font-bold shadow-md hover:opacity-95"
              >
                Save & Stage to Dispatch Pool
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
