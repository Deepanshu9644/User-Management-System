const { Op, Sequelize } = require('sequelize');
const User = require('../models/User');

const SORTABLE_FIELDS = new Set(['id', 'name', 'email', 'company', 'createdAt', 'updatedAt']);

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function normalizeAddress(address) {
  if (!address) return address;

  const next = { ...address };
  next.geo = { ...(address.geo || {}) };

  if (next.geo.lat !== undefined) next.geo.lat = Number(next.geo.lat);
  if (next.geo.lng !== undefined) next.geo.lng = Number(next.geo.lng);

  return next;
}

exports.getUsers = asyncHandler(async (req, res) => {
  const { search, sort, page, limit } = req.query;

  const where = {};
  if (search) {
    const pattern = `%${search}%`;

    // Search across a few text fields + address.city (JSONB)
    where[Op.or] = [
      { name: { [Op.iLike]: pattern } },
      { email: { [Op.iLike]: pattern } },
      { phone: { [Op.iLike]: pattern } },
      { company: { [Op.iLike]: pattern } },
      Sequelize.where(Sequelize.literal(`"User"."address"->>'city'`), { [Op.iLike]: pattern })
    ];
  }

  let order = [['createdAt', 'DESC']];
  if (sort) {
    let field = sort;
    let direction = 'ASC';

    if (sort.startsWith('-')) {
      field = sort.slice(1);
      direction = 'DESC';
    }

    if (SORTABLE_FIELDS.has(field)) {
      order = [[field, direction]];
    }
  }

  const pagingEnabled = page !== undefined || limit !== undefined;
  const pageNum = Math.max(1, Number(page || 1));
  const limitNum = Math.max(1, Math.min(100, Number(limit || 10)));
  const offset = (pageNum - 1) * limitNum;

  if (pagingEnabled) {
    const { rows, count } = await User.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset
    });

    return res.json({
      success: true,
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum }
    });
  }

  const users = await User.findAll({ where, order });

  return res.json({ success: true, data: users });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: []
    });
  }

  return res.json({ success: true, data: user });
});

exports.createUser = asyncHandler(async (req, res) => {
  const payload = { ...req.body, address: normalizeAddress(req.body.address) };
  const user = await User.create(payload);

  return res.status(201).json({ success: true, data: user });
});

exports.updateUserPut = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found', errors: [] });
  }

  const payload = { ...req.body, address: normalizeAddress(req.body.address) };

  user.set(payload);
  await user.save();

  return res.json({ success: true, data: user });
});

exports.updateUserPatch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found', errors: [] });
  }

  const payload = { ...req.body };
  if (payload.address) payload.address = normalizeAddress(payload.address);

  user.set(payload);
  await user.save();

  return res.json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found', errors: [] });
  }

  await user.destroy();

  return res.json({ success: true, message: 'User deleted' });
});
