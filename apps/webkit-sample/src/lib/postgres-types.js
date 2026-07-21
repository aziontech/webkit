// PostgreSQL data-type catalog shared by the table-column editors (the Create
// Table drawer and the Add Column drawer). Each type carries a short description
// and a monospace glyph (`#` numeric, `{}` JSON, `T` text, `B` boolean, `@`
// date/time) for the searchable type picker.
export const POSTGRES_TYPES = [
  { value: "int2", label: "int2", description: "Signed two-byte integer", glyph: "#" },
  { value: "int4", label: "int4", description: "Signed four-byte integer", glyph: "#" },
  { value: "int8", label: "int8", description: "Signed eight-byte integer", glyph: "#" },
  { value: "float4", label: "float4", description: "Single precision floating-point number (4 bytes)", glyph: "#" },
  { value: "float8", label: "float8", description: "Double precision floating-point number (8 bytes)", glyph: "#" },
  { value: "numeric", label: "numeric", description: "Exact numeric of selectable precision", glyph: "#" },
  { value: "json", label: "json", description: "Textual JSON data", glyph: "{}" },
  { value: "jsonb", label: "jsonb", description: "Binary JSON data, decomposed", glyph: "{}" },
  { value: "text", label: "text", description: "Variable-length character string", glyph: "T" },
  { value: "varchar", label: "varchar", description: "Variable-length character string with limit", glyph: "T" },
  { value: "uuid", label: "uuid", description: "Universally unique identifier", glyph: "#" },
  { value: "bool", label: "bool", description: "Logical boolean (true/false)", glyph: "B" },
  { value: "date", label: "date", description: "Calendar date (year, month, day)", glyph: "@" },
  { value: "timestamp", label: "timestamp", description: "Date and time", glyph: "@" },
  { value: "timestamptz", label: "timestamptz", description: "Date and time, including time zone", glyph: "@" },
];

// Integer types — a primary-key integer column is treated as auto-incrementing
// (its value is generated on insert rather than typed).
export const INTEGER_TYPES = ["int2", "int4", "int8"];
export const isIntegerType = (value) => INTEGER_TYPES.includes(value);

export const typeLabel = (value) =>
  POSTGRES_TYPES.find((type) => type.value === value)?.label ?? value;

export const glyphOf = (value) =>
  POSTGRES_TYPES.find((type) => type.value === value)?.glyph ?? "#";

// Filter the catalog by a free-text query over label + description.
export const filterTypes = (query) => {
  const term = (query ?? "").trim().toLowerCase();
  if (!term) return POSTGRES_TYPES;
  return POSTGRES_TYPES.filter(
    (type) =>
      type.label.toLowerCase().includes(term) ||
      type.description.toLowerCase().includes(term),
  );
};
