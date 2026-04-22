import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentApi, doctorApi } from '../api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, docRes] = await Promise.allSettled([
          appointmentApi.getMine(),
          doctorApi.getAll(),
        ]);
        if (apptRes.status === 'fulfilled') setAppointments(apptRes.value.data.data || []);
        if (docRes.status === 'fulfilled') setDoctors(docRes.value.data.data || []);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const pending   = appointments.filter(a => a.status === 'pending').length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const completed = appointments.filter(a => a.status === 'completed').length;

  const upcoming = appointments
    .filter(a => ['pending','confirmed'].includes(a.status))
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header animate-fade">
          <h1>
            Good day, <span className="text-gradient">{user?.email?.split('@')[0]}</span> 👋
          </h1>
          <p>Here's an overview of your healthcare activity.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { icon: '📅', value: appointments.length, label: 'Total Appointments', delay: 'stagger-1' },
            { icon: '⏳', value: pending,   label: 'Pending',   delay: 'stagger-2' },
            { icon: '✅', value: confirmed, label: 'Confirmed', delay: 'stagger-3' },
            { icon: '👨‍⚕️', value: doctors.length, label: 'Doctors Available', delay: 'stagger-4' },
          ].map((s, i) => (
            <div key={i} className={`stat-card animate-fade ${s.delay}`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Upcoming Appointments */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Appointments</h2>
              <Link to="/appointments" className="text-sm" style={{ color: 'var(--color-primary-light)' }}>
                View all →
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="card empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No upcoming appointments</h3>
                <p>Book your first appointment now</p>
                <Link to="/book" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>
                  Book Now
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {upcoming.map((appt, i) => (
                  <div key={appt._id} className={`appointment-card animate-fade stagger-${i + 1}`}>
                    <div className="appointment-header">
                      <div>
                        <div className="appointment-doctor">Dr. {appt.doctorName}</div>
                        <div className="appointment-spec">{appt.specialization}</div>
                      </div>
                      <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                    </div>
                    <div className="appointment-details">
                      <span className="appointment-detail">
                        <span className="appointment-detail-icon">📅</span>
                        {new Date(appt.appointmentDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </span>
                      <span className="appointment-detail">
                        <span className="appointment-detail-icon">🕐</span>
                        {appt.timeSlot}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/book',         icon: '📝', title: 'Book Appointment',    desc: 'Schedule with a doctor' },
                { to: '/doctors',      icon: '👨‍⚕️', title: 'Browse Doctors',     desc: 'Find the right specialist' },
                { to: '/appointments', icon: '📋', title: 'My Appointments',     desc: 'View and manage bookings' },
              ].map((action, i) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`card animate-fade stagger-${i + 1}`}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}
                >
                  <div className="stat-icon" style={{ fontSize: '1.25rem' }}>{action.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{action.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{action.desc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
