import React from "react";

const PasswordValidation = ({ password }) => {
  const requirements = [
    {
      label: "At least 8 characters",
      regex: /.{8,}/,
    },
    {
      label: "At least one uppercase letter",
      regex: /[A-Z]/,
    },
    {
      label: "At least one lowercase letter",
      regex: /[a-z]/,
    },
    {
      label: "At least one number",
      regex: /[0-9]/,
    },
    {
      label: "At least one special character (@$!%*?&)",
      regex: /[@$!%*?&]/,
    },
  ];

  return (
    <div className="password-validation">
      <h4 className="text-sm font-medium mb-2">Password Requirements:</h4>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center">
            <span
              className={`w-4 h-4 mr-2 ${
                req.regex.test(password) ? "text-green-500" : "text-red-500"
              }`}
            >
              {req.regex.test(password) ? "✓" : "✗"}
            </span>
            <span
              className={`text-sm ${
                req.regex.test(password) ? "text-green-500" : "text-red-500"
              }`}
            >
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordValidation;
