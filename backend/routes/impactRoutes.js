const express = require('express');
const Pickup = require('../models/Pickup');
const User = require('../models/User');

const router = express.Router();
const supportedAreas = ['Rajpura', 'Banur'];
const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];

// Public, aggregate-only community impact. Rankings use completed pickups only.
router.get('/', async (req, res) => {
  try {
    const area = supportedAreas.includes(req.query.area) ? req.query.area : 'Rajpura';
    const allCompleted = await Pickup.find({ status: 'completed' })
      .select('user_id location quantityKg')
      .lean();
    const normalized = (value) => String(value || '').toLowerCase();
    const areaRows = allCompleted.filter((row) => normalized(row.location).includes(area.toLowerCase()));
    const userIds = [...new Set(areaRows.map((row) => String(row.user_id)))];
    const users = await User.find({ _id: { $in: userIds } }).select('name').lean();
    const safeNames = new Map(users.map((user) => [String(user._id), `${String(user.name || 'Community member').split(/\s+/)[0]} ${String(user.name || '').split(/\s+/).at(-1)?.[0] || ''}.`.trim()]));
    const totals = new Map();
    for (const row of areaRows) {
      const key = String(row.user_id);
      const current = totals.get(key) || { kg: 0, pickups: 0 };
      current.kg += Number(row.quantityKg) || 0;
      current.pickups += 1;
      totals.set(key, current);
    }
    const rankings = [...totals.entries()].map(([id, total]) => ({ name: safeNames.get(id) || 'Community member', ...total }))
      .sort((a, b) => b.kg - a.kg).slice(0, 10).map((entry, index) => ({ rank: index + 1, ...entry }));
    const byState = new Map();
    for (const row of allCompleted) {
      const place = normalized(row.location);
      const state = states.find((name) => place.includes(name.toLowerCase())) || (/rajpura|banur/.test(place) ? 'Punjab' : null);
      if (state) byState.set(state, (byState.get(state) || 0) + (Number(row.quantityKg) || 0));
    }
    res.json({ area, rankings, areaTotalKg: areaRows.reduce((sum, row) => sum + (Number(row.quantityKg) || 0), 0), completedPickups: areaRows.length, states: [...byState.entries()].map(([name, kg]) => ({ name, kg })) });
  } catch (error) {
    console.error('[impact]', error);
    res.status(500).json({ message: 'Unable to load community impact right now' });
  }
});

module.exports = router;
