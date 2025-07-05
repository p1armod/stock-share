import { forwardRef } from 'react';
import type { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className,error, ...props }, ref) => {
  return (
    
    <div className="flex flex-col gap-2">
    {label && <label htmlFor={label}>{label}</label>}
    <input
      ref={ref}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        className || ''
      }`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{(error as FieldError).message}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;