import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { FormControl } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
    Children,
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Check, ChevronDown } from "lucide-react";

type SelectOptionState = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selected: string;
    setSelected: (select: string) => void
};

const initialState: SelectOptionState = {
    isOpen: false,
    setIsOpen: () => {},
    selected: "",
    setSelected: () => {},
};

type SelectOptionProps = {
    children: ReactNode;
};

const SelectOptionContext = createContext<SelectOptionState>(initialState);

const SelectOptionProvider = ({ children, ...props }: SelectOptionProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>("");

    const value = {
        isOpen: isOpen,
        setIsOpen: (isOpen: boolean) => {
            setIsOpen(isOpen);
        },
        selected: selected,
        setSelected: (select: string) => {
            setSelected(select)
        }
    };

    return (
        <SelectOptionContext.Provider value={value} {...props}>
            {children}
        </SelectOptionContext.Provider>
    );
};

const useSelectOption = () => {
    const context = useContext(SelectOptionContext);

    if (context === undefined) {
        console.error(
            "useSelectOption must be used within an SelectOptionProvider"
        );
        throw new Error(
            "useSelectOption must be used within an SelectOptionProvider"
        );
    }

    return context;
};

const SelectOptionRoot: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <SelectOptionProvider>{children}</SelectOptionProvider>;
};

const SelectOptionMain: React.FC<SelectOptionProps & { onChange: (value: string) => void }> = ({ children, onChange }) => {
    const { isOpen, selected, setIsOpen } = useSelectOption();

    useEffect(() => {
        onChange(selected)
    }, [selected])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            {children}
        </Popover>
    );
};

const SelectOption: React.FC<{ children: ReactNode, onChange: (value: string) =>void }> = ({ children, onChange}) => {
    return (
        <SelectOptionRoot>
            <SelectOptionMain children={children} onChange={onChange} />
        </SelectOptionRoot>
    );
};

const SelectOptionContent: React.FC<{ children: ReactNode, className?: string }> = ({
    children,
    className
}) => {
    return (
        <PopoverContent className={cn("p-1", className)} align="start">
            {children}
        </PopoverContent>
    );
};

const SelectOptionItem: React.FC<{
    value: string;
    onSelect?: (option: string) => void;
    children?: ReactNode;
    className?: string;
}> = ({ value, onSelect, children, className }) => {
    const { selected, setIsOpen, setSelected } = useSelectOption();

    const handleSelect = () => {
        onSelect && onSelect(value);
        setSelected(value)
        setIsOpen(false);
    };

    return (
        <div
            onClick={handleSelect}
            className={cn(
                "p-1.5 hover:bg-secondary transition cursor-pointer rounded flex items-center gap-1.5",
                className
            )}
        >
            <div className="size-4">
                {selected === value && <Check className="size-4" />}
            </div>
            {children ?? value}
        </div>
    );
};

const SelectOptionTrigger: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    return (
        <PopoverTrigger
            asChild
            className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
            {children}
        </PopoverTrigger>
    );
};

export {
    SelectOption,
    SelectOptionItem,
    SelectOptionTrigger,
    SelectOptionContent,
};
