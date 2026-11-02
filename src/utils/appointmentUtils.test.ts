import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTimeSlots,
  isSlotAvailable,
  filterDoctors,
  calculatePlatformMetrics,
  Doctor,
  Appointment
} from './appointmentUtils';

test('generateTimeSlots generates 30m slots excluding break time', () => {
  const slots = generateTimeSlots('09:00', '12:00', 30, '10:30', '11:00');
  // 09:00, 09:30, 10:00. 10:30 is break. 11:00, 11:30.
  assert.deepEqual(slots, ['09:00', '09:30', '10:00', '11:00', '11:30']);
});

test('isSlotAvailable detects double-booking and permits non-conflicting slots', () => {
  const appointments: Appointment[] = [
    {
      id: 'apt-1',
      doctorId: 'doc-1',
      patientId: 'pat-1',
      date: '2026-11-10',
      time: '10:00',
      durationMinutes: 30,
      type: 'online',
      status: 'confirmed',
      consultationFee: 50,
    },
    {
      id: 'apt-2',
      doctorId: 'doc-1',
      patientId: 'pat-2',
      date: '2026-11-10',
      time: '11:00',
      durationMinutes: 30,
      type: 'in-person',
      status: 'cancelled', // Cancelled should free up the slot
      consultationFee: 60,
    }
  ];

  // Conflicting slot with doc-1 at 10:00
  assert.equal(isSlotAvailable('doc-1', '2026-11-10', '10:00', appointments), false);

  // Available slot with doc-1 at 10:30
  assert.equal(isSlotAvailable('doc-1', '2026-11-10', '10:30', appointments), true);

  // Slot that was cancelled should be available
  assert.equal(isSlotAvailable('doc-1', '2026-11-10', '11:00', appointments), true);

  // Slot for a different doctor at the same time is available
  assert.equal(isSlotAvailable('doc-2', '2026-11-10', '10:00', appointments), true);

  // Rescheduling check: excluding own appointment id allows keeping slot
  assert.equal(isSlotAvailable('doc-1', '2026-11-10', '10:00', appointments, 'apt-1'), true);
});

test('filterDoctors correctly filters by specialization, fee, rating, and query', () => {
  const mockDoctors: Doctor[] = [
    {
      id: 'd1',
      name: 'Dr. Sarah Mitchell',
      specialization: 'Cardiology',
      hospital: 'Metro Heart Institute',
      location: 'New York',
      rating: 4.9,
      reviewsCount: 120,
      experienceYears: 14,
      consultationFee: 120,
      languages: ['English', 'Spanish'],
      isVerified: true,
      status: 'active',
      consultationTypes: ['online', 'in-person'],
    },
    {
      id: 'd2',
      name: 'Dr. David Chen',
      specialization: 'Dermatology',
      hospital: 'Apex Skin Clinic',
      location: 'Boston',
      rating: 4.6,
      reviewsCount: 85,
      experienceYears: 8,
      consultationFee: 80,
      languages: ['English', 'Mandarin'],
      isVerified: true,
      status: 'active',
      consultationTypes: ['online'],
    },
    {
      id: 'd3',
      name: 'Dr. Pending Guy',
      specialization: 'Cardiology',
      hospital: 'General Clinic',
      location: 'New York',
      rating: 4.0,
      reviewsCount: 0,
      experienceYears: 3,
      consultationFee: 40,
      languages: ['English'],
      isVerified: false,
      status: 'pending',
      consultationTypes: ['online'],
    }
  ];

  // Filtering by search query
  const queryResult = filterDoctors(mockDoctors, { searchQuery: 'Sarah' });
  assert.equal(queryResult.length, 1);
  assert.equal(queryResult[0].name, 'Dr. Sarah Mitchell');

  // Filtering by max fee
  const feeResult = filterDoctors(mockDoctors, { maxFee: 90 });
  assert.equal(feeResult.length, 1);
  assert.equal(feeResult[0].id, 'd2');

  // Pending doctors excluded from public discovery
  const cardioResult = filterDoctors(mockDoctors, { specialization: 'Cardiology' });
  assert.equal(cardioResult.length, 1);
  assert.equal(cardioResult[0].id, 'd1');
});

test('calculatePlatformMetrics computes accurate totals and financial breakdown', () => {
  const mockAppointments: Appointment[] = [
    { id: '1', patientId: 'p1', doctorId: 'd1', date: '2026-11-01', time: '09:00', durationMinutes: 30, type: 'online', status: 'completed', consultationFee: 100 },
    { id: '2', patientId: 'p2', doctorId: 'd1', date: '2026-11-01', time: '10:00', durationMinutes: 30, type: 'in-person', status: 'confirmed', consultationFee: 150 },
    { id: '3', patientId: 'p3', doctorId: 'd2', date: '2026-11-01', time: '11:00', durationMinutes: 30, type: 'online', status: 'pending', consultationFee: 80 },
    { id: '4', patientId: 'p4', doctorId: 'd2', date: '2026-11-01', time: '12:00', durationMinutes: 30, type: 'online', status: 'cancelled', consultationFee: 80 },
  ];

  const stats = calculatePlatformMetrics(mockAppointments);
  assert.equal(stats.total, 4);
  assert.equal(stats.completed, 1);
  assert.equal(stats.confirmed, 1);
  assert.equal(stats.pending, 1);
  assert.equal(stats.cancelled, 1);
  assert.equal(stats.totalRevenue, 250); // 100 + 150
  assert.equal(stats.platformEarnings, 38); // 15% of 250 = 37.5 rounded to 38
  assert.equal(stats.cancellationRate, 25); // 1 / 4 = 25%
});
