import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ulVariants = {
  open: {
    opacity: 1,
    scale: 1,
    borderRadius: "0%",
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    opacity: 0,
    scale: 0,
    borderRadius: "50%",
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

interface TopProps {
  invNum: number;
}

function Top({ invNum }: TopProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const toggleControl = document.getElementById("toggle-control");

      if (target !== toggleControl && !target.classList.contains("ul-btn")) {
        setOpen(false);
      }
    });
  }, []);

  const handleFilter = (filter: string) => {
    setFilter(filter);
    setOpen(false);
  };

  return (
    <section className="flex justify-between mx-auto px-6 text-black">
      <div>
        <h1 className="text-2xl font-bold leading-5 tracking-tighter">
          Invoices
        </h1>
        <span className="text-sm text-gray-500">
          {invNum ? invNum : "No"} invoices
        </span>
      </div>

      <div className="relative flex gap-x-4">
        <div className="flex items-center px-2 font-bold rounded-2xl">
          <button
            id="toggle-control"
            className="flex items-center gap-x-2"
            onClick={() => setOpen(!open)}
          >
            Filter <img src="icon-arrow-down.svg" />
          </button>
          <motion.ul
            className="absolute top-10 origin-top right-20 w-24 p-1 text-md font-normal bg-white shadow-md"
            variants={ulVariants}
            animate={open ? "open" : "closed"}
          >
            <li>
              <button
                className="ul-btn w-full px-1 text-start rounded-md bg-orange-100 hover:bg-orange-200 text-orange-700"
                onClick={() => handleFilter("Pending")}
              >
                Pending
              </button>
            </li>
            <li>
              <button
                className="ul-btn w-full px-1 my-1 text-start rounded-md bg-green-100 hover:bg-green-200 text-green-700"
                onClick={() => handleFilter("Paid")}
              >
                Paid
              </button>
            </li>
            <li>
              <button
                className="ul-btn w-full px-1 text-start rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => handleFilter("Draft")}
              >
                Draft
              </button>
            </li>
          </motion.ul>
        </div>
        <button className="flex items-center gap-x-2 my-[2px] pl-1 pr-3 text-white text-sm font-bold bg-customPurple rounded-3xl">
          <img
            src="icon-plus.svg"
            className="p-[9px] m-0 bg-white rounded-full"
          />{" "}
          <span className="mt-px">New</span>
        </button>
      </div>
    </section>
  );
}

export default Top;