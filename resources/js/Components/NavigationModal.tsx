import { PropsWithChildren } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

export type ModalProps = {
    show: boolean;
    closeable?: boolean;
    onClose: CallableFunction;
}

export default function NavigationModal({
    children,
    show = false,
    closeable = true,
    onClose = () => {},
}: PropsWithChildren<{
    center?: boolean;
    dialogStyle?: string;
} & ModalProps>) {
    const close = () => {
        if (closeable) {
            onClose(false);
        }
    };

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                data-state={show?'open':'close'}
                className="fixed inline-flex inset-0 outline-none sm:px-0 z-50 transform transition-all max-h-screen bg-black/75 overflow-hidden"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="-translate-x-[110%]"
                    enterTo="-translate-x-0"
                    leave="ease-in duration-200"
                    leaveFrom="-translate-x-100"
                    leaveTo="-translate-x-[110%]"
                >
                    <DialogPanel
                        className={`p-2`}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
