import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryOrder } from '../types';
import { ScanDOModal } from '../components/ScanDOModal';

export const DeliveriesAndDOsView: React.FC = () => {
  const { deliveryOrders, updateDeliveryOrderStatus, currentUser } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDO, setSelectedDO] = useState<DeliveryOrder | null>(null);
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredDOs = deliveryOrders.filter((d) => {
    if (selectedStatus !== 'all' && d.status !== selectedStatus) return false;
    if (
      searchQuery &&
      !d.doNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.postcode.includes(searchQuery)
    ) {
      return false;
    }
    return true;
  });

  const handleShareWhatsApp = (doItem: DeliveryOrder) => {
    const text = `Salam / Hi ${doItem.customerName}, this is LOHAS Organic Wholesale Logistics update regarding Delivery Order ${doItem.doNumber}. Status: ${doItem.status.toUpperCase()}. Promised window: ${doItem.windowStart} - ${doItem.windowEnd}. Assigned Lorry: ${doItem.assignedLorry || 'Lorry 3 (WVC 8821)'}. Chilled temperature logged at 2-4°C.`;
    navigator.clipboard.writeText(text);
    setToastMsg(`WhatsApp update copied to clipboard for ${doItem.customerName}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#313035] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-[#e5e1e8] text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[#0fa42f]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
              MODULE M3 · DELIVERY MANIFEST
            </span>
            <span className="font-mono-data text-xs text-[#574238]">REAL-TIME FIRESTORE SYNC</span>
          </div>
          <h1 className="text-[32px] text-[#1c1b20] font-bold tracking-tight font-sans">
            Delivery Orders (DO) Job Board
          </h1>
          <p className="text-[13px] text-[#574238]">
            Full lifecycle tracking: from AI photo intake to driver check-in, geofenced proof of delivery, and client status notifications.
          </p>
        </div>

        <button
          onClick={() => setShowScanModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#ff7f35] hover:bg-[#9f4200] text-white text-xs font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">document_scanner</span>
          <span>+ Upload / Scan DO</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-2xl">
          {[
            { id: 'all', label: `All (${deliveryOrders.length})` },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'out_for_delivery', label: 'Out for Delivery' },
            { id: 'arrived', label: 'Arrived at Dock' },
            { id: 'delivered', label: 'Delivered (AI Pass)' },
            { id: 'draft', label: 'Draft' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === tab.id
                  ? 'bg-[#313035] text-white shadow-sm'
                  : 'bg-[#f6f2f9] text-[#574238] hover:bg-[#ebe7ed]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center bg-[#f6f2f9] rounded-full px-3.5 py-1.5 border border-[#e5e1e8] w-full sm:w-72">
          <span className="material-symbols-outlined text-[18px] text-[#574238] mr-2">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search DO#, client, or postcode..."
            className="bg-transparent text-xs text-[#1c1b20] focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Manifest Table */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#e5e1e8] flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[#1c1b20]">
            <thead>
              <tr className="bg-[#f6f2f9] text-[#574238] font-label-caps text-[10px] uppercase border-y border-[#e5e1e8]">
                <th className="py-2.5 px-4 font-semibold">DO Number</th>
                <th className="py-2.5 px-4 font-semibold">Customer / Outlet</th>
                <th className="py-2.5 px-4 font-semibold">Postcode & Area</th>
                <th className="py-2.5 px-4 font-semibold">Produce & Weight</th>
                <th className="py-2.5 px-4 font-semibold">Promised Window</th>
                <th className="py-2.5 px-4 font-semibold">Assigned Fleet</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ecf3]">
              {filteredDOs.map((item) => (
                <tr key={item.id} className="hover:bg-[#f6f2f9] transition-colors">
                  <td className="py-3 px-4 font-mono-data font-bold text-[#1c1b20]">
                    <div className="flex items-center gap-1.5">
                      <span>{item.doNumber}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#f0ecf3] text-[#574238]">
                        OCR {item.ocrConfidence}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#1c1b20]">{item.customerName}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-mono-data font-bold text-[#1c3ae7]">{item.postcode}</span>
                      <span className="text-[11px] text-[#574238] truncate max-w-xs">{item.state}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-xs">{item.itemsSummary}</span>
                      <span className="font-mono-data text-[11px] text-[#574238] font-semibold">{item.weightKg} kg</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono-data text-[12px] text-[#1c1b20]">
                    {item.windowStart} - {item.windowEnd}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {item.assignedLorry ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#1c1b20]">{item.assignedLorry}</span>
                        <span className="text-[10px] text-[#574238]">{item.driverName}</span>
                      </div>
                    ) : (
                      <span className="text-[#574238] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {item.status === 'delivered' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        DELIVERED
                      </span>
                    ) : item.status === 'arrived' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#1c3ae7] text-white font-bold">
                        ARRIVED AT DOCK
                      </span>
                    ) : item.status === 'out_for_delivery' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-semibold">
                        OUT FOR DELIVERY
                      </span>
                    ) : item.status === 'scheduled' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#f0ecf3] text-[#1c1b20] font-semibold">
                        SCHEDULED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#ebe7ed] text-[#574238] font-semibold">
                        DRAFT
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleShareWhatsApp(item)}
                        title="Copy WhatsApp Status to Client"
                        className="w-8 h-8 rounded-full bg-[#f0ecf3] hover:bg-[#0fa42f]/20 hover:text-[#0fa42f] text-[#574238] flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                      </button>
                      <button
                        onClick={() => setSelectedDO(item)}
                        className="px-3 py-1 rounded-full bg-[#f0ecf3] hover:bg-[#ebe7ed] text-[#1c1b20] text-xs font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DO Detail Drawer */}
      {selectedDO && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-[#e5e1e8]">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ecf3]">
                <div className="flex items-center gap-2">
                  <span className="font-mono-data text-lg font-bold text-[#1c1b20]">{selectedDO.doNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdbcb] text-[#341100]">
                    OCR {selectedDO.ocrConfidence}%
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDO(null)}
                  className="w-7 h-7 rounded-full bg-[#f0ecf3] flex items-center justify-center text-[#574238]"
                >
                  ✕
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#1c1b20]">{selectedDO.customerName}</h3>
                <p className="text-xs text-[#574238] mt-0.5">{selectedDO.addressText}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="font-mono-data font-bold text-[#1c3ae7]">{selectedDO.postcode}</span>
                  <span>·</span>
                  <span className="text-[#574238]">{selectedDO.phone}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] space-y-1 text-xs">
                <div className="font-label-caps text-[10px] text-[#574238]">PRODUCE CONSIGNMENT</div>
                <div className="font-semibold text-[#1c1b20]">{selectedDO.itemsSummary}</div>
                <div className="text-[#574238] flex justify-between pt-1">
                  <span>Gross Weight: {selectedDO.weightKg} kg</span>
                  <span>Window: {selectedDO.windowStart} - {selectedDO.windowEnd}</span>
                </div>
              </div>

              {/* Status Update Simulator */}
              <div className="space-y-2">
                <label className="font-label-caps text-[10px] text-[#574238] block uppercase">
                  Manual Status Override (Manager Action)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      updateDeliveryOrderStatus(selectedDO.id, 'out_for_delivery');
                      setSelectedDO({ ...selectedDO, status: 'out_for_delivery' });
                    }}
                    className="p-2 rounded-xl bg-[#f0ecf3] hover:bg-[#dfe0ff] text-xs font-semibold text-[#1c1b20]"
                  >
                    Set Out for Delivery
                  </button>
                  <button
                    onClick={() => {
                      updateDeliveryOrderStatus(selectedDO.id, 'delivered');
                      setSelectedDO({ ...selectedDO, status: 'delivered', deliveredAt: '14:25' });
                    }}
                    className="p-2 rounded-xl bg-[#dfe0ff] hover:bg-[#1c3ae7] hover:text-white text-xs font-bold text-[#000d60]"
                  >
                    Confirm Delivered (POD)
                  </button>
                </div>
              </div>

              {selectedDO.podPhotoUrl && (
                <div>
                  <div className="font-label-caps text-[10px] text-[#574238] mb-1">
                    CUSTOMER SIGNED PROOF OF DELIVERY
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-[#e5e1e8] h-44 bg-black">
                    <img src={selectedDO.podPhotoUrl} alt="Signed POD" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-mono-data text-[10px] text-[#0fa42f] mt-1 block">
                    ✓ Verified Customer Stamp & Receiver Signature (Geofence: 24m)
                  </span>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-[#f0ecf3] text-xs text-[#574238]">
                <strong>Dispatch Notes:</strong> {selectedDO.notes || 'Cold store receiving bay inspection required.'}
              </div>
            </div>

            <div className="pt-4 border-t border-[#f0ecf3] flex flex-col gap-2">
              <button
                onClick={() => handleShareWhatsApp(selectedDO)}
                className="w-full py-2.5 rounded-full bg-[#0fa42f] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>Send WhatsApp Tracking to Customer</span>
              </button>
              <button
                onClick={() => setSelectedDO(null)}
                className="w-full py-2 rounded-full border border-[#e5e1e8] text-xs font-semibold text-[#574238] hover:bg-[#f6f2f9]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      <ScanDOModal isOpen={showScanModal} onClose={() => setShowScanModal(false)} />
    </div>
  );
};
