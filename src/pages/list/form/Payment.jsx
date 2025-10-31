import { useState, useRef, useEffect, useCallback } from "react";
import ChevronDownIcon from "@/components/ChevronDownIcon";

const Payment = ({ options, selectedOption, onSelect, onDelete, onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);
    // 드롭다운 DOM 요소를 가리킬 ref
    const dropdownRef = useRef(null);

    const handleSelect = useCallback(
        (option) => {
            onSelect(option);
            setIsOpen(false);
        },
        [onSelect]
    );

    const handleDeleteClick = useCallback(
        (event, option) => {
            event.stopPropagation();
            onDelete(option);
        },
        [onDelete]
    );

    const handleAddClick = useCallback(
        (event) => {
            event.stopPropagation();
            onAdd();
        },
        [onAdd]
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="block text-xl text-black mb-1">결제수단</div>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-lg font-medium p-0 m-0 cursor-pointer focus:outline-none"
            >
                <span>
                    {selectedOption ? selectedOption.name : "선택하세요"}
                </span>
                <ChevronDownIcon />
            </button>

            {isOpen && (
                <ul className="absolute mt-10 w-full bg-white border border-t-0 border-black z-10 divide-y divide-black">
                    {options.map((option) => (
                        <li
                            key={option.id}
                            className="flex justify-between items-center px-3 py-4"
                        >
                            <span
                                onClick={() => handleSelect(option)}
                                className="text-xl text-gray-600 cursor-pointer"
                            >
                                {option.name}
                            </span>
                            <button
                                onMouseDown={(e) =>
                                    handleDeleteClick(e, option)
                                }
                                className="text-xl gray-600 cursor-pointer"
                            >
                                X
                            </button>
                        </li>
                    ))}
                    <li className="px-3 py-3">
                        <button
                            onMouseDown={handleAddClick}
                            className="cursor-pointer text-xl text-gray-600"
                        >
                            추가하기
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default Payment;
