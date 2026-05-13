import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getAllVenues, createVenue, updateVenue, deleteVenue } from '../api/venuesApi';
import { VenueV1 } from '../api/swaggerTypes';

interface VenueFormState {
  name: string;
  description: string;
  mapUrl: string;
  latitude: string;
  longitude: string;
}

const toFormState = (v: VenueV1): VenueFormState => ({
  name: v.name ?? '',
  description: v.description ?? '',
  mapUrl: v.mapUrl ?? '',
  latitude: v.latitude != null ? String(v.latitude) : '',
  longitude: v.longitude != null ? String(v.longitude) : '',
});

const emptyForm = (): VenueFormState => ({
  name: '', description: '', mapUrl: '', latitude: '', longitude: '',
});

const AdminVenues: React.FC = () => {
  const [venues, setVenues] = useState<VenueV1[]>([]);
  const [listFilter, setListFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<VenueV1 | null>(null);
  const [form, setForm] = useState<VenueFormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredVenues = useMemo(() => {
    if (!listFilter.trim()) return venues;
    return venues.filter(v => (v.name ?? '').toLowerCase().includes(listFilter.toLowerCase()));
  }, [venues, listFilter]);

  const loadVenues = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllVenues();
      data.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
      setVenues(data);
    } catch (err) {
      console.error('Failed to load venues', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadVenues(); }, [loadVenues]);

  const openAdd = () => {
    setEditingVenue(null);
    setForm(emptyForm());
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEdit = (v: VenueV1) => {
    setEditingVenue(v);
    setForm(toFormState(v));
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleDelete = async (v: VenueV1) => {
    if (!window.confirm(`Delete venue "${v.name}"?`)) return;
    try {
      await deleteVenue(v.id!);
      await loadVenues();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const handleCoordPaste = (field: 'latitude' | 'longitude') =>
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData('text');
      const parts = pasted.split(',');
      if (parts.length === 2) {
        const lat = parts[0].trim();
        const lon = parts[1].trim();
        if (lat !== '' && lon !== '') {
          e.preventDefault();
          setForm(f => ({ ...f, latitude: lat, longitude: lon }));
          return;
        }
      }
    };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const latVal = form.latitude !== '' ? parseFloat(form.latitude) : undefined;
      const lngVal = form.longitude !== '' ? parseFloat(form.longitude) : undefined;
      const payload: VenueV1 = {
        ...(editingVenue ?? {}),
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        mapUrl: form.mapUrl.trim() || undefined,
        latitude: latVal,
        longitude: lngVal,
      };
      if (editingVenue?.id != null) {
        await updateVenue(payload);
      } else {
        await createVenue(payload);
      }
      setModalOpen(false);
      await loadVenues();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />
      <main>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-1">
            <Link to="/admin" className="text-sm text-villageGreen hover:underline">← Admin</Link>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-villageText">Venues</h1>
            <button
              onClick={openAdd}
              className="flex items-center gap-1 bg-villageGreen text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">add</span>
              Add venue
            </button>
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="mt-4">
                <input
                  type="text"
                  value={listFilter}
                  onChange={e => setListFilter(e.target.value)}
                  placeholder="Filter venues…"
                  aria-label="Filter venues"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <ul className="mt-3 divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg shadow-sm">
                {filteredVenues.map((v) => {
                  const hasCoords = v.latitude != null && v.longitude != null;
                  const hasMapUrl = !!v.mapUrl;
                  const hasDescription = !!v.description;

                  return (
                    <li key={v.id} className="flex items-center justify-between px-4 py-3 gap-3">
                      <span className="text-sm text-gray-800 flex-1 truncate">{v.name}</span>

                      {/* Optional-attribute indicators */}
                      <div className="flex items-center gap-1.5 shrink-0" aria-label="Venue attributes">
                        {/* Coordinates */}
                        <span
                          title={hasCoords ? `Coordinates: ${v.latitude}, ${v.longitude}` : 'No coordinates'}
                          className="relative inline-flex items-center justify-center"
                        >
                          <span className={`material-symbols-outlined text-[18px] leading-none transition ${hasCoords ? 'text-villageGreen' : 'text-gray-300'}`}>
                            pin_drop
                          </span>
                          {!hasCoords && (
                            <span className="absolute inset-0 pointer-events-none" aria-hidden="true">
                              <svg viewBox="0 0 18 18" className="w-full h-full">
                                <line x1="2" y1="2" x2="16" y2="16" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </span>
                          )}
                        </span>

                        {/* Maps URL */}
                        <span
                          title={hasMapUrl ? 'Maps URL set' : 'No Maps URL'}
                          className="relative inline-flex items-center justify-center"
                        >
                          <span className={`material-symbols-outlined text-[18px] leading-none transition ${hasMapUrl ? 'text-villageGreen' : 'text-gray-300'}`}>
                            map
                          </span>
                          {!hasMapUrl && (
                            <span className="absolute inset-0 pointer-events-none" aria-hidden="true">
                              <svg viewBox="0 0 18 18" className="w-full h-full">
                                <line x1="2" y1="2" x2="16" y2="16" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </span>
                          )}
                        </span>

                        {/* Description */}
                        <span
                          title={hasDescription ? 'Description set' : 'No description'}
                          className="relative inline-flex items-center justify-center"
                        >
                          <span className={`material-symbols-outlined text-[18px] leading-none transition ${hasDescription ? 'text-villageGreen' : 'text-gray-300'}`}>
                            notes
                          </span>
                          {!hasDescription && (
                            <span className="absolute inset-0 pointer-events-none" aria-hidden="true">
                              <svg viewBox="0 0 18 18" className="w-full h-full">
                                <line x1="2" y1="2" x2="16" y2="16" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => openEdit(v)}
                          className="text-gray-500 hover:text-villageGreen transition"
                          aria-label={`Edit ${v.name}`}
                        >
                          <span className="material-symbols-outlined text-[20px] leading-none">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(v)}
                          className="text-gray-400 hover:text-red-600 transition"
                          aria-label={`Delete ${v.name}`}
                        >
                          <span className="material-symbols-outlined text-[20px] leading-none">delete</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
                {filteredVenues.length === 0 && (
                  <li className="px-4 py-6 text-sm text-gray-500 text-center">No venues found.</li>
                )}
              </ul>
            </>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={editingVenue ? 'Edit Venue' : 'Add Venue'}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">{editingVenue ? 'Edit Venue' : 'Add Venue'}</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {errorMsg && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">{errorMsg}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="venue-name">Name</label>
                <input
                  id="venue-name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="What do we call this idyllic setting?"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="venue-description">Description</label>
                <textarea
                  id="venue-description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="What's it like, this magical place?"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="venue-mapurl">Google Maps URL</label>
                <input
                  id="venue-mapurl"
                  type="text"
                  value={form.mapUrl}
                  onChange={e => setForm(f => ({ ...f, mapUrl: e.target.value }))}
                  placeholder="A Google Maps URL please"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="venue-latitude">Latitude</label>
                  <input
                    id="venue-latitude"
                    type="text"
                    value={form.latitude}
                    onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                    onPaste={handleCoordPaste('latitude')}
                    placeholder="51.5074"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="venue-longitude">Longitude</label>
                  <input
                    id="venue-longitude"
                    type="text"
                    value={form.longitude}
                    onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                    onPaste={handleCoordPaste('longitude')}
                    placeholder="-0.1278"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                  />
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-md bg-villageGreen text-white font-medium hover:bg-green-800 transition disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVenues;
