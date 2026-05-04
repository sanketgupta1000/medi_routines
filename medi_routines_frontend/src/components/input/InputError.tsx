import React from 'react';

function InputError({children}: {children: React.ReactNode})
{
    return(

        <span className='text-red-400'>
            {children}
        </span>

    );
}

export default InputError;