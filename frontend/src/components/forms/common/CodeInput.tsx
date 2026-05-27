import { useRef } from 'react';

interface Props {
  code: string[];
  setCode: (v: string[]) => void;
}

const CodeInput = ({ code, setCode }: Props) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, i: number) => {
    const newCode = [...code];
    newCode[i] = val;
    setCode(newCode);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex justify-between space-x-2">
      {code.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          className="w-12 h-12 text-center text-black bg-white border border-gray-500 rounded-xl"
        />
      ))}
    </div>
  );
};

export default CodeInput;
