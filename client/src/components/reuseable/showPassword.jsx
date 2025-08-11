import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder = "**********",
  className='',
  style,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
        <label htmlFor={name}  className="headerLight text-sm" >{label} </label>
        <input
        type= { showPassword ? 'text' : 'password'}
        id={name}
        name={name}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={onChange}
        className={className}
        style={style}

        />
        <span
        className="absolute right-4 top-15 text-gray-600 cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <FiEye /> : <FiEyeOff />}
      </span>

      {error && (
        <span className="forErrors text-red-500 ">
          {error}
        </span>
      )}

     
    </div>
  );
};

export default PasswordInput;
