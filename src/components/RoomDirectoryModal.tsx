import React, { useState } from 'react';
import { ROOM_DATABASE, RoomDetail } from '../data/campusData';
import { Search, X, MapPin, Building, Navigation, Layers } from 'lucide-react';

interface RoomDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRoom: (room: RoomDetail) => void;
}

export const RoomDirectoryModal: React.FC<RoomDirectoryModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRoom,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');

  if (!isOpen) return null;

  const roomsList = Object.values(ROOM_DATABASE);
  const buildings = Array.from(new Set(roomsList.map((r) => r.building)));

  const filteredRooms = roomsList.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBuilding = selectedBuilding === 'all' || room.building === selectedBuilding;

    return matchesSearch && matchesBuilding;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-semibold text-white text-base">Campus Room & Hall Directory</h3>
              <p className="text-xs text-slate-400">Search classrooms, laboratories, and faculty offices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by room (e.g. 205, 101), department, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedBuilding('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedBuilding === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Buildings
            </button>
            {buildings.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBuilding(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedBuilding === b
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid / List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {filteredRooms.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching room found. Try searching for &quot;205&quot;, &quot;101&quot;, or &quot;CSE&quot;.
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room.roomNumber}
                className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                      Room {room.roomNumber}
                    </span>
                    <h4 className="font-semibold text-white text-xs">{room.name}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-500" />
                      {room.building}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-500" />
                      {room.floor}
                    </span>
                    <span>·</span>
                    <span className="text-slate-300">{room.department}</span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed">{room.description}</p>
                </div>

                <button
                  onClick={() => {
                    onNavigateToRoom(room);
                    onClose();
                  }}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredRooms.length} campus rooms</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
