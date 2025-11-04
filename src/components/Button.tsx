type Props = React.ComponentProps<"button"> & {
    isLoading?: boolean,
    title?: string,
    className?: string,
}


export function Button({ isLoading = false, title = "Enviar", className, ...rest }: Props) {
    return (
        <button
            className={`w-full h-12 bg-[#a102db] text-white font-semibold rounded-lg hover:bg-[#bb00ff]/60 transition ease-linear disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${className}`}
            disabled={isLoading}
            {...rest}
        >
            {isLoading ? <span className="w-6 h-6 border-2 border-t-transparent border-[#c558d5] rounded-full animate-spin"></span> : title}
        </button>
    )
}