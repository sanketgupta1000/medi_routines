import React, { useId } from 'react'

// a general select input component

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement>
{
    label?: string;
    options: { value: string; label: string }[];
    className?: string;
    ref: React.Ref<HTMLSelectElement>;
}

function SelectInput({
    label="",
    options,
    className="",
    ref,
    ...rest
}: SelectInputProps)
{

    const id = useId();

    return (        <div className="mb-4">

            {/* label if any */}
            {label &&
            
                <label
                    htmlFor={id}
                    className="block mb-1 text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            }

            {/* underlying select input */}
            <select
                id={id}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
                ref={ref}
                {...rest}
            >

                {/* please select option */}
                <option value="">Please select</option>

                {options.map((opt)=>
                
                    <option
                        key={opt.value}
                        value={opt.value}
                    >
                        {opt.label}
                    </option>

                )}

            </select>

        </div>

    );
}

export default SelectInput;
export type {SelectInputProps};