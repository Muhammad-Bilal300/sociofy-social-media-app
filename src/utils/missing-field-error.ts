export const missingFieldError = (
  fields: string[],
  body: Record<string, any>
): string[] => {
  const requiredFields = fields.map((field) => ({
    field,
    label: field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
  }));

  let missingFields = [];

  for (let i = 0; i < requiredFields.length; i++) {
    const { field, label } = requiredFields[i];
    if (!body[field] && body[field] !== 0) {
      missingFields.push(label);
    }
  }

  return missingFields;
};
