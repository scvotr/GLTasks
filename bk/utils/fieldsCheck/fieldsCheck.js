const notDistributedU = (data) => {
  const areAllThreeEqualOne = data.department_id === 1 && data.subdepartment_id === 1 && data.position_id === 1;
  return areAllThreeEqualOne
}

const emptyProfileU = (data) => {
  const areAnyFieldsEmpty = !(
    data.last_name &&
    data.first_name &&
    data.middle_name &&
    data.internal_phone &&
    data.external_phone &&
    data.office_number
  );

  return areAnyFieldsEmpty
}

module.exports = {
  notDistributedU,
  emptyProfileU,
}