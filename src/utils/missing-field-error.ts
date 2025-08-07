interface FieldDefinition {
  field: string;
  label?: string;
  type: "string" | "number" | "boolean" | "object" | "array";
}

const missingFieldError = (
  fields: FieldDefinition[],
  body: Record<string, any>
): string | null => {
  const missingFields: string[] = [];

  for (const { field } of fields) {
    const value = body[field];
    if (value === undefined || value === null) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    const message = `[ ${missingFields.join(", ")} ] ${
      missingFields.length > 1 ? "fields are" : "field is"
    } required`;
    return `Validation error: ${message}`;
  }

  return null;
};

export { missingFieldError };
