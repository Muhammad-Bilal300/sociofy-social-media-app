const typeMismatchError = (
  fields: any,
  body: Record<string, any>
): string | null => {
  const typeErrors: string[] = [];

  for (const { field, type } of fields) {
    const value = body[field];
    const actualType = Array.isArray(value) ? "array" : typeof value;

    if (actualType !== type) {
      typeErrors.push(`${field} must be of type '${type}'`);
    }
  }

  if (typeErrors.length > 0) {
    return `Validation error: ${typeErrors.join(", ")}`;
  }

  return null;
};

export { typeMismatchError };
