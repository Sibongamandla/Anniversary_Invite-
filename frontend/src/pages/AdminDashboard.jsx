import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/mockApi';
import GlassCard from '../components/GlassCard';
import GuestTable from '../components/GuestTable';
import InviteModal from '../components/InviteModal';
import MetricCard from '../components/MetricCard';
import BulkMessage from '../components/BulkMessage';
import { LogOut, Plus, Upload, Loader, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchGuests = async () => {
        try {
            const response = await api.get('/guests/');
            setGuests(response.data);
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    const handleInvite = async (guestData) => {
        try {
            await api.post('/guests/', guestData);
            fetchGuests();
        } catch (err) {
            alert("Failed to create invite");
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            await api.post('/guests/upload-csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            fetchGuests();
            alert("Guests uploaded successfully!");
        } catch (err) {
            alert("Failed to upload CSV");
        } finally {
            setLoading(false);
        }
    };

    // Metrics Calculation
    const metrics = {
        totalInvited: guests.length,
        attendingGuests: guests.filter(g => g.rsvp_status === 'attending').length,
        declined: guests.filter(g => g.rsvp_status === 'declined').length,
        pending: guests.filter(g => g.rsvp_status === 'pending').length,
        plusOnes: guests.reduce((sum, g) => sum + (g.plus_one_count || 0), 0),
        get totalHeads() { return this.attendingGuests + (guests.filter(g => g.rsvp_status === 'attending').reduce((sum, g) => sum + (g.plus_one_count || 0), 0)) }
    };

    if (loading && guests.length === 0) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-champagne" size={48} /></div>;

    return (
        <div className="min-h-screen p-4 md:p-8 pt-24 bg-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-serif text-charcoal">Admin Dashboard</h1>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-charcoal transition-colors">
                    <LogOut size={20} />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <MetricCard title="Total Heads" value={metrics.totalHeads} icon={Users} color="text-blue-600" />
                <MetricCard title="Invites" value={metrics.attendingGuests} icon={CheckCircle} color="text-green-600" />
                <MetricCard title="Declined" value={metrics.declined} icon={XCircle} color="text-red-600" />
                <MetricCard title="Pending" value={metrics.pending} icon={Clock} color="text-yellow-600" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Guest List - Takes up 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <GlassCard className="h-full">
                        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
                            <h2 className="text-xl font-bold text-charcoal">Guest List</h2>
                            <div className="flex gap-4">
                                <label className="glass-btn cursor-pointer flex items-center gap-2 text-sm px-4">
                                    <Upload size={16} />
                                    <span className="hidden md:inline">Bulk CSV</span>
                                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                                </label>
                                <button onClick={() => setShowModal(true)} className="glass-btn flex items-center gap-2 text-sm px-4">
                                    <Plus size={16} />
                                    Quick Invite
                                </button>
                            </div>
                        </div>

                        <GuestTable guests={guests} />
                    </GlassCard>
                </div>

                {/* Side Panel - Bulk Message & Future Widgets */}
                <div className="lg:col-span-1 space-y-8">
                    <BulkMessage />

                    {/* Optional: Recent Activity or Questions Widget could go here */}
                    <GlassCard>
                        <h3 className="text-lg font-bold mb-4 text-charcoal">Recent Questions</h3>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                            {guests.filter(g => g.notes).length > 0 ? (
                                guests.filter(g => g.notes).map(g => (
                                    <div key={g.id} className="border-b border-charcoal border-opacity-10 pb-2">
                                        <p className="text-xs text-gold font-bold mb-1">{g.name}</p>
                                        <p className="text-sm italic text-gray-600">"{g.notes}"</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-sm">No notes left by guests yet.</p>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>

            <InviteModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onInvite={handleInvite}
            />
        </div>
    );
};

export default AdminDashboard;
