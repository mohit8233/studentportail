export const getArray = (payload, keys = []) => {
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.students)) return payload.students;
  if (Array.isArray(payload?.teachers)) return payload.teachers;
  if (Array.isArray(payload?.courses)) return payload.courses;
  if (Array.isArray(payload?.users)) return payload.users;

  return [];
};

export const getTotal = (payload, list) => {
  if (typeof payload?.total === "number") return payload.total;
  if (typeof payload?.count === "number") return payload.count;
  return Array.isArray(list) ? list.length : 0;
};
