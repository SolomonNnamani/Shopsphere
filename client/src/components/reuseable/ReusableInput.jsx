import React from "react";

const ReusableInput = ({
  label,
  name,
  id,
  value,
  onChange,
  style,
  readOnly = false,
  error = "",
  type = "text",
  placeholder = "",
  className = "",
  classNameInput = "",
  classNameLabel = "",
  disabled=false,
  accept="",
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className={`text-sm md:text-base ${classNameLabel}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        accept={accept}
       style={style}
        className={`${classNameInput} ${error ? "!border-red-500 ring-red-300 border-dashed" : ""}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ReusableInput;
