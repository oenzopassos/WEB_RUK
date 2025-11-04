type Props = React.ComponentProps<"input"> & {
    legend?: string,
    classname?: string,
}

export function Input({ legend, type = "text", className, ...rest }: Props) {
    return (
        <fieldset className="flex w-full max-h-20 text-gray-400 focus-within:text-[#613dff]">
            {legend &&
                <legend className="uppercase text-xxs mb-2 text-inherit">
                    {legend}
                </legend>
            }

            <input type={type} className={`w-full h-12 rounded-lg border border-[##E5E5E5] px-4 text-sm bg-[#F2F2F2] outline-none focus:border-2 placeholder-gray-500 ${className}`} {...rest} />
        </fieldset>
    )
}