import { forwardRef, useEffect, useRef } from "react";
import { Input, InputProps } from "./ui/input";

interface NumberInputProps extends InputProps {
    isAmount?: boolean | null;
    max?: number
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ isAmount, ...props}, ref) => {
        const inputRef = useRef<HTMLInputElement | null>(null);

        const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
            const { value } = e.currentTarget;
            // Sanitize the input to allow only numbers and a single dot
            let sanitizedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

            // Truncate the value to the maximum length
            if(props?.max)
                if (sanitizedValue.length > props?.max) {
                    sanitizedValue = sanitizedValue.substring(0, props?.max);
                }

            e.currentTarget.value = sanitizedValue;
        };

        const onValue = (value: any) => {
            let val = value?.replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");

            if (isAmount) {
                return val ? Number(val).toLocaleString() : "";
            } else {
                return value;
            }
        };

        useEffect(() => {
            if (isAmount) {
                let value = props.value;
                value = Number(value).toLocaleString();

                if (inputRef.current) inputRef.current.value = value;
            }
        }, [props.value]);

        return (
            <Input
                {...props}
                ref={(ref) => {
                    ref = ref;
                    inputRef.current = ref;
                }}
                onInput={handleInput}
                value={onValue(props.value)}
            />
        );
    }
);

export default NumberInput;
