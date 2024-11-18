import { forwardRef, useEffect, useRef } from "react";
import { Input, InputProps } from "./ui/input";

interface NumberInputProps extends InputProps {
    isAmount?: boolean | null;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ isAmount, ...props }, ref) => {
        const inputRef = useRef<HTMLInputElement | null>(null);

        const onValue = (value: any) => {
            if (isAmount) {
                let val = value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");
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
                value={onValue(props.value)}
            />
        );
    }
);

export default NumberInput;
