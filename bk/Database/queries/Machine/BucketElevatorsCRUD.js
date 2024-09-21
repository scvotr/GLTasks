'use strict'

const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createBucketElevatorQ = async data => {
  console.log('createBucketElevatorQ: ', data)
  const {
    device_id,
    height,
    belt_brand_id,
    belt_installation_date,
    belt_length,
    bucket_brand_id,
    bucket_installation_date,
    bucket_quantity,
    gearbox_brand_id,
    gearbox_installation_date,
    driveBelts_brand_id,
    driveBelts_quantity,
    driveBelts_installation_date,
  } = data
  try {
    const command = `
    INSERT INTO bucketElevators (
      device_id,
      height,
      belt_brand_id,
      belt_installation_date,
      belt_length,
      bucket_brand_id,
      bucket_installation_date,
      bucket_quantity,
      gearbox_brand_id,
      gearbox_installation_date,
      driveBelt_brand_id,
      driveBelt_quantity,
      driveBelt_installation_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
    await executeDatabaseQueryAsync(command, [
      device_id,
      height,
      belt_brand_id,
      belt_installation_date,
      belt_length,
      bucket_brand_id,
      bucket_installation_date,
      bucket_quantity,
      gearbox_brand_id,
      gearbox_installation_date,
      driveBelts_brand_id,
      driveBelts_quantity,
      driveBelts_installation_date,
    ])
  } catch (error) {
    console.error('Error createBucketElevatorQ:', error)
    throw new Error('Ошибка запроса к базе данных')
  }
}
const readAllBeltBrandsQ = async () => {
  try {
    const command = `SELECT * FROM beltBrands`
    const rows = await executeDatabaseQueryAsync(command, [])
    return rows
  } catch (error) {
    console.error('Error readAllBeltBrandsQ:', error)
    throw new Error('Ошибка запроса к базе данных')
  }
}
const readAllBucketBrandsQ = async () => {
  try {
    const command = `SELECT * FROM bucketBrands`
    const rows = await executeDatabaseQueryAsync(command, [])
    return rows
  } catch (error) {
    console.error('Error readAllBucketBrandsQ:', error)
    throw new Error('Ошибка запроса к базе данных')
  }
}
const readAllDriveBeltsBrandsQ = async () => {
  try {
    const command = `SELECT * FROM driveBelts`
    const rows = await executeDatabaseQueryAsync(command, [])
    return rows
  } catch (error) {
    console.error('Error readAllDriveBeltsBrandsQ:', error)
    throw new Error('Ошибка запроса к базе данных')
  }
}
const readAllGearboxBrandsQ = async () => {
  try {
    const command = `SELECT * FROM gearboxBrands`
    const rows = await executeDatabaseQueryAsync(command, [])
    return rows
  } catch (error) {
    console.error('Error readAllGearboxBrandsQ:', error)
    throw new Error('Ошибка запроса к базе данных')
  }
}


const readAllBeltReplacementHistoryQ = async () => {
  try {
    const command = `SELECT * FROM belt_replacement_history`
    const rows = await executeDatabaseQueryAsync(command, [])
    return rows
  } catch (error) {
    console.error('Error readAllBeltReplacementHistoryQ:', error)
    throw new Error('Ошибка запроса к базе данных')
  }
}
const readAllBucketReplacementHistoryQ = async () => {
  try {
    const command = `SELECT * FROM update_belt_last_replacement`
    const rows = await executeDatabaseQueryAsync(command, [])
    return rows
  } catch (error) {
    console.error('Error readAllBucketReplacementHistoryQ:', error)
    throw new Error('Ошибка запроса к базе данных')
  }
}
const readAllGearboxReplacementHistoryQ = async () => {
  try {
    const command = `SELECT * FROM bucket_replacement_history`
    const rows = await executeDatabaseQueryAsync(command, [])
    return rows
  } catch (error) {
    console.error('Error readAllGearboxReplacementHistoryQ:', error)
    throw new Error('Ошибка запроса к базе данных')
  }
}

// "/admin/machines/bucketElevators/update": BucketElevatorsController.updateBucketElevator,
// "/admin/machines/bucketElevators/delete": BucketElevatorsController.deleteBucketElevator,
// "/admin/machines/bucketElevators/readOnce": BucketElevatorsController.readOnceBucketElevator,

module.exports = {
  createBucketElevatorQ,
  readAllBeltBrandsQ,
  readAllBucketBrandsQ,
  readAllGearboxBrandsQ,
  readAllDriveBeltsBrandsQ,
  readAllBeltReplacementHistoryQ,
  readAllBucketReplacementHistoryQ,
  readAllGearboxReplacementHistoryQ,
}
