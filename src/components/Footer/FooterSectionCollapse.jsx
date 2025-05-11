import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

const FooterSectionCollapse = ({ title, items }) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            {/* Header: chỉ cho mobile (<sm) có toggle */}
            <div
                className="flex justify-between items-center sm:block cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <h4 className="sm:text-base font-bold my-2 text-secondaryText-tw text-sm">{title}</h4>
                {/* Mũi tên chỉ hiện ở mobile */}
                <ChevronDown
                    className={`w-5 h-5 text-secondaryText-tw sm:hidden transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                />
            </div>

            {/* Nội dung list */}
            <ul
                className={`space-y-2 sm:block ${open ? "block" : "hidden"} sm:!block transition-all duration-300 `}            >
                {items.map((item, index) => (
                    <li
                        key={index}
                        className="text-sm text-secondaryText-tw hover:text-primary-tw cursor-pointer transition-colors flex items-center gap-1"
                    >
                        <ArrowRight className="w-3 h-3 text-secondaryText-tw" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FooterSectionCollapse;
