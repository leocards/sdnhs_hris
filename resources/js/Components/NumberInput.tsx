import { forwardRef } from "react";
import { Input, InputProps } from "./ui/input";

interface NumberInputProps extends InputProps {
    isAmount?: boolean | null
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({ isAmount, ...props}, ref) => {
        const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
            const { value } = e.currentTarget;
            e.currentTarget.value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');//value.replace(/[^0-9.]/g, '');
        };

        const onBlur = (e: React.FormEvent<HTMLInputElement>) => {
            if(isAmount) {
                const { value } = e.currentTarget;
                e.currentTarget.value = (value && Number(value).toLocaleString())??"";
            }
        }

        const onFocus = (e: React.FormEvent<HTMLInputElement>) => {
            if(isAmount) {
                const { value } = e.currentTarget;
                e.currentTarget.value = value.split(',').join('')??"";
            }
        }

        return <Input {...props} ref={ref} onInput={handleInput} onBlur={onBlur} onFocus={onFocus}/>;
    }
);

export default NumberInput