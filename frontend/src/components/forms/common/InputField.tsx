import { FieldError } from 'react-hook-form';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

const InputField = ({ label, error, ...rest }: Props) => (
  <div>
    <label className="block mb-1 font-medium text-gray-300">{label}</label>
    <input
      {...rest}
      className="w-full px-4 py-3 text-black bg-white border border-gray-500 outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
    />
    {error && <p className="mt-1 text-sm text-red-400">{error.message}</p>}
  </div>
);

export default InputField;
