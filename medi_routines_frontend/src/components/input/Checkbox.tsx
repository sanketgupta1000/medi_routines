import React, { useId } from 'react';

// will create a general checkbox
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement>
{
    label?: string;
    className?: string;
    ref: React.Ref<HTMLInputElement>
};

function Checkbox({
    label="",
    className="",
    ref,
    ...rest
}: CheckboxProps)
{
    const id = useId();

    return (        <div className="flex items-center gap-2">
            
                        <input
                            type="checkbox"
                            id={id}
                            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
                            ref={ref}
                            {...rest}
                        />

            {/* label if any */}
            {label &&
            
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                    {label}
                </label>

            }

        </div>

    );
}

export default Checkbox;
export type {CheckboxProps};