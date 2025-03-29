const Account = require('./accounts-model')
const db = require('../../data/db-config')


exports.checkAccountPayload = (req, res, next) => {
  try {
    if (!req.body.name || !req.body.budget) {
      throw {
        status: 400,
        message: 'name and budget are required',
      }
    }
    if (typeof req.body.name !== 'string') {
      throw {
        status: 400,
        message: 'name must be a string',
      }
    }
    if (typeof req.body.name !== 'string' || req.body.name.trim().length < 3 || req.body.name.trim().length > 100) {
      throw {
        status: 400,
        message: 'name must be a string between 3 and 100 characters',
      }
    }
    if (typeof req.body.budget !== 'number' || isNaN(req.body.budget)) {
      throw {
        status: 400,
        message: 'budget must be a number',
      }
    }
    if (typeof req.body.budget !== 'number' || req.body.budget < 0 || req.body.budget > 1000000) {
      throw {
        status: 400,
        message: 'budget of account is too large or too small',
      }
    }
    next()
  } catch (err) {
    next(err)
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const existing = await db('accounts')
    .where({ name: req.body.name.trim() })
    .first()

    if (existing) {
      next ({
        status: 400,
        message: 'that name is taken',
      })
    } else {
        next()
      }
    } catch (err) {
    next(err)
  }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Account.getById(req.params.id)
    if (!account) {
      next({
        status: 404,
        message: 'account not found',
      })
    } else {
      req.account = account
      next()
    }
  } catch(err) {
    next(err)
  }
}
